import { useEffect, useRef, useState } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { onAnchorClick } from '../../lib/scroll'
import { fromPhysicalKey, tapKey } from '../../lib/keys'
import { sound } from '../../lib/sound'
import { buildStore } from '../../lib/buildStore'
import { codeForChar } from '../../data/layout'
import { useSound } from '../../hooks/useSound'
import Keyboard from '../../components/Keyboard/Keyboard'
import keyboard from '../../components/Keyboard/Keyboard.module.css'
import Button from '../../components/Button/Button'
import styles from './Hero.module.css'

const MAX_LENGTH = 48

// What the keyboard types by itself on load. The typo is on purpose.
function introSteps() {
  const steps = [...'hello. go on, type somethign'].map((char) => ({ char }))
  steps.push({ back: true }, { back: true }, { char: 'n' }, { char: 'g' })
  return steps
}

export default function Hero() {
  const root = useRef(null)
  const tilt = useRef(null)
  const input = useRef(null)
  const intro = useRef(null)
  const inView = useRef(true)
  // the field belongs to the intro until the visitor types something
  const untouched = useRef(true)
  const [text, setText] = useState('')
  const soundOn = useSound()

  const play = (code) => sound.play(buildStore.getSnapshot().switchId, { big: code === 'Space' })

  function takeOver() {
    if (!untouched.current) return
    untouched.current = false
    intro.current?.kill()
    intro.current = null
    setText('')
  }

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // row by row rather than key by key: six tweens instead of eighty-four
        const rows = root.current.querySelectorAll(`.${keyboard.row}`)
        gsap.from(tilt.current, { y: 80, rotateX: 48, duration: 1.4, ease: 'expo.out' })
        gsap.from(rows, {
          y: -18,
          autoAlpha: 0,
          duration: 0.6,
          ease: 'back.out(2.2)',
          stagger: 0.07,
          delay: 0.2,
        })

        // types like a person: uneven rhythm, a pause before fixing the typo
        const tl = gsap.timeline({ delay: 1.5, onComplete: () => (intro.current = null) })
        let t = 0
        let previous = null
        for (const step of introSteps()) {
          if (step.back) {
            // a beat to notice the typo before fixing it
            t += previous?.back ? 0.12 : 0.45
            tl.call(
              () => {
                tapKey('Backspace')
                play('Backspace')
                setText((current) => current.slice(0, -1))
              },
              null,
              t,
            )
          } else {
            const code = codeForChar(step.char)
            t += 0.05 + Math.random() * 0.07 + (step.char === ' ' ? 0.05 : 0)
            tl.call(
              () => {
                tapKey(code)
                play(code)
                setText((current) => current + step.char)
              },
              null,
              t,
            )
          }
          previous = step
        }
        intro.current = tl
      })

      // a little parallax, as if you were leaning over the desk
      mm.add(
        '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
        () => {
          const rotateX = gsap.quickTo(tilt.current, 'rotateX', { duration: 0.8, ease: 'power3' })
          const rotateY = gsap.quickTo(tilt.current, 'rotateY', { duration: 0.8, ease: 'power3' })
          const onMove = (event) => {
            const box = root.current.getBoundingClientRect()
            rotateY(((event.clientX - box.left) / box.width - 0.5) * 8)
            rotateX(18 - ((event.clientY - box.top) / box.height - 0.5) * 6)
          }
          root.current.addEventListener('pointermove', onMove)
          return () => root.current?.removeEventListener('pointermove', onMove)
        },
      )
    },
    { scope: root },
  )

  // "type anywhere": while the hero is on screen and nothing else has focus,
  // typing goes into the field instead of scrolling the page with the space bar
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => (inView.current = entry.isIntersecting))
    observer.observe(root.current)

    const onKeyDown = (event) => {
      const idle = !document.activeElement || document.activeElement === document.body
      const printable = event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey
      if (!idle || !inView.current || !(printable || event.key === 'Backspace')) return
      event.preventDefault()
      takeOver()
      input.current.focus({ preventScroll: true })
      setText((current) =>
        event.key === 'Backspace'
          ? current.slice(0, -1)
          : (current + event.key).slice(0, MAX_LENGTH),
      )
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      observer.disconnect()
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  function onChange(event) {
    const next = event.target.value.slice(0, MAX_LENGTH)
    // phone keyboards don't send real key events, so light up the key from the text instead
    if (!fromPhysicalKey() && next.length === text.length + 1) {
      const code = codeForChar(next.at(-1))
      if (code) {
        tapKey(code)
        play(code)
      }
    }
    setText(next)
  }

  return (
    <section id="top" ref={root} className={styles.hero} aria-labelledby="hero-title" tabIndex={-1}>
      <div className="container">
        <div className={styles.intro}>
          <div>
            <p className={styles.kicker}>Indent 75 · Batch 02 is open</p>
            <h1 id="hero-title" className={styles.title}>
              A keyboard you’ll want to <em>hear</em>.
            </h1>
          </div>
          <div className={styles.side}>
            <p className={styles.lead}>
              A 75% mechanical keyboard in a gasket-mounted aluminium case, with three switches we
              tuned by ear. Go on, type something. Your keyboard works on this one.
            </p>
            <div className={styles.actions}>
              <Button href="#build" onClick={onAnchorClick}>
                Build yours, from $189
              </Button>
              <Button href="#sound" variant="quiet" onClick={onAnchorClick}>
                Hear the switches
              </Button>
            </div>
          </div>
        </div>

        <div className={styles.stage}>
          <div className={styles.console}>
            <span className={styles.prompt} aria-hidden="true">
              ›
            </span>
            <label htmlFor="hero-type" className="visually-hidden">
              Type something
            </label>
            <input
              ref={input}
              id="hero-type"
              className={styles.screen}
              value={text}
              onChange={onChange}
              onFocus={takeOver}
              onKeyDown={(event) => event.key === 'Enter' && setText('')}
              placeholder="type something…"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            <button type="button" className={styles.sound} onClick={() => sound.set(!soundOn)}>
              {soundOn ? 'Sound on' : 'Turn the sound on'}
            </button>
          </div>

          <div className={styles.desk}>
            <div ref={tilt} className={styles.tilt}>
              <Keyboard playable />
            </div>
          </div>
          <p className={styles.hint}>Your own keyboard works here, or click the keys.</p>
        </div>
      </div>
    </section>
  )
}
