import { useEffect, useRef, useState } from 'react'
import { fetchQuotes, plainPunctuation } from '../../lib/quotes'
import { accuracy, compare, recommendSwitch, wordsPerMinute } from '../../lib/typing'
import { fromPhysicalKey, tapKey } from '../../lib/keys'
import { sound } from '../../lib/sound'
import { codeForChar } from '../../data/layout'
import { pangrams } from '../../data/content'
import { switches } from '../../data/products'
import { useBuild } from '../../hooks/useBuild'
import SectionHeading from '../../components/SectionHeading/SectionHeading'
import Keyboard from '../../components/Keyboard/Keyboard'
import Button from '../../components/Button/Button'
import styles from './TryIt.module.css'

const blankRun = { start: 0, end: 0, keystrokes: 0, mistakes: 0 }

// a wrong character shows what was really typed, so a keyboard on another layout is obvious
const typo = (char) => (/\s/.test(char) ? '·' : char)

// The field is invisible, so its caret has to stay at the end. Moved by a click, an arrow key
// or a browser extension, it would put letters somewhere nobody can see them.
function keepCaretAtEnd(event) {
  const field = event.currentTarget
  const end = field.value.length
  if (field.selectionStart !== end || field.selectionEnd !== end) field.setSelectionRange(end, end)
}

export default function TryIt() {
  const root = useRef(null)
  const result = useRef(null)
  const [build, dispatch] = useBuild()
  const [wanted, setWanted] = useState(false)
  const [batch, setBatch] = useState(0)
  const [source, setSource] = useState({ status: 'idle', quotes: [], index: 0 })
  const [typed, setTyped] = useState('')
  const [run, setRun] = useState(blankRun)
  const [now, setNow] = useState(0)

  const quote = source.quotes[source.index]
  const running = Boolean(run.start && !run.end)
  const finished = Boolean(run.end)

  // no point asking for quotes until someone is about to see them
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setWanted(true)
        observer.disconnect()
      },
      { rootMargin: '600px 0px' },
    )
    observer.observe(root.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!wanted) return
    const controller = new AbortController()
    fetchQuotes({ signal: controller.signal })
      .then((quotes) => setSource({ status: 'online', quotes, index: 0 }))
      .catch((error) => {
        if (error.name === 'AbortError') return
        const index = Math.floor(Math.random() * pangrams.length)
        setSource({ status: 'offline', quotes: pangrams, index })
      })
    return () => controller.abort()
  }, [wanted, batch])

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setNow(performance.now()), 200)
    return () => clearInterval(id)
  }, [running])

  useEffect(() => {
    if (finished) result.current?.focus()
  }, [finished])

  function onChange(event) {
    if (!quote || finished) return
    const value = plainPunctuation(event.target.value).slice(0, quote.text.length)
    const t = performance.now()
    let { keystrokes, mistakes } = run

    if (value.length > typed.length) {
      keystrokes += value.length - typed.length
      for (let i = typed.length; i < value.length; i++) {
        if (value[i] !== quote.text[i]) mistakes++
      }
      // phone keyboards: light up the key from the text, real keys do it themselves
      const code = codeForChar(value.at(-1))
      if (code && !fromPhysicalKey()) {
        tapKey(code)
        sound.play(build.switchId, { big: code === 'Space' })
      }
    }

    setTyped(value)
    setNow(t)
    setRun({
      start: run.start || t,
      end: value.length === quote.text.length ? t : 0,
      keystrokes,
      mistakes,
    })
  }

  function restart() {
    setTyped('')
    setRun(blankRun)
  }

  function nextQuote() {
    restart()
    if (source.index + 1 < source.quotes.length) {
      setSource({ ...source, index: source.index + 1 })
    } else {
      setBatch((n) => n + 1)
    }
  }

  const { states, correct } = quote ? compare(quote.text, typed) : { states: [], correct: 0 }
  const elapsed = run.start ? (run.end || now) - run.start : 0
  const wpm = wordsPerMinute(correct, elapsed)
  const acc = accuracy(run.keystrokes, run.mistakes)
  const pick = finished ? recommendSwitch(wpm) : null
  const picked = pick && switches.find((s) => s.id === pick.id)

  return (
    <section
      id="try"
      ref={root}
      className={styles.section}
      aria-labelledby="try-title"
      tabIndex={-1}
    >
      <div className="container">
        <SectionHeading
          id="try-title"
          number="04"
          kicker="Try it"
          title={
            <>
              How fast do you <em>type</em>?
            </>
          }
        >
          A random quote, and your words per minute on whatever keyboard you’re using right now.
          Imagine it on this one.
        </SectionHeading>

        <div className={styles.test}>
          <div className={styles.paper} data-finished={finished}>
            {quote ? (
              <>
                <p className={styles.quote} aria-hidden="true">
                  {[...quote.text].map((char, i) => (
                    <span
                      key={i}
                      data-state={states[i]}
                      data-current={i === typed.length || undefined}
                    >
                      {states[i] === 'wrong' ? typo(typed[i]) : char}
                    </span>
                  ))}
                </p>
                <p className={styles.author}>
                  {quote.author}
                  {source.status === 'offline' &&
                    ' · the quotes service is away, so here’s a pangram'}
                </p>
                <label htmlFor="type-field" className="visually-hidden">
                  Type this quote: {quote.text}
                </label>
                {/* writing assistants like Grammarly fight a hidden field like this and lose letters */}
                <textarea
                  id="type-field"
                  className={styles.field}
                  value={typed}
                  onChange={onChange}
                  onSelect={keepCaretAtEnd}
                  onPaste={(event) => event.preventDefault()}
                  disabled={finished}
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  data-gramm="false"
                  data-gramm_editor="false"
                  data-enable-grammarly="false"
                  data-lt-active="false"
                />
              </>
            ) : (
              <p className={styles.waiting}>Finding a good quote…</p>
            )}
          </div>

          <dl className={styles.stats} aria-hidden="true">
            <div>
              <dt>wpm</dt>
              <dd>{wpm}</dd>
            </div>
            <div>
              <dt>accuracy</dt>
              <dd>{acc}%</dd>
            </div>
            <div>
              <dt>time</dt>
              <dd>{(elapsed / 1000).toFixed(1)}s</dd>
            </div>
          </dl>

          <div ref={result} className={styles.result} tabIndex={-1} aria-live="polite">
            {finished && (
              <>
                <p className={styles.score}>
                  {wpm} words per minute at {acc}% accuracy.
                </p>
                <p>{pick.line}</p>
                {build.switchId === pick.id ? (
                  <p className={styles.muted}>{picked.name} is already in your build.</p>
                ) : (
                  <Button variant="dark" onClick={() => dispatch({ type: 'switch', id: pick.id })}>
                    Put {picked.name} in my build
                  </Button>
                )}
              </>
            )}
          </div>

          <div className={styles.controls}>
            <Button variant="quiet" onClick={nextQuote} disabled={!quote}>
              New quote
            </Button>
            <Button variant="quiet" onClick={restart} disabled={!run.start}>
              Start over
            </Button>
          </div>

          {/* mounted when the section gets close, the slot keeps its space until then */}
          <div className={styles.keyboard}>{wanted && <Keyboard />}</div>
        </div>
      </div>
    </section>
  )
}
