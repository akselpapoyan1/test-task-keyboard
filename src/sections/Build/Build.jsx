import { useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { goTo } from '../../lib/scroll'
import { formatPrice } from '../../lib/format'
import { buildPrice, describeBuild } from '../../lib/build'
import { colorways, extras, switches } from '../../data/products'
import { useBuild } from '../../hooks/useBuild'
import { useTweenedNumber } from '../../hooks/useTweenedNumber'
import SectionHeading from '../../components/SectionHeading/SectionHeading'
import Keyboard from '../../components/Keyboard/Keyboard'
import Button from '../../components/Button/Button'
import styles from './Build.module.css'

export default function Build() {
  const [build, dispatch] = useBuild()
  const preview = useRef(null)
  const price = buildPrice(build)
  const shownPrice = useTweenedNumber(price)
  const summary = describeBuild(build)

  // the colour washes across the keys (CSS does that), and the keys hop as it passes
  function pickColorway(id) {
    dispatch({ type: 'colorway', id })
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const keys = preview.current.querySelectorAll('[data-code]')
    const delay = (i, el) =>
      (Number(el.style.getPropertyValue('--x')) + Number(el.style.getPropertyValue('--y')) * 1.6) *
      0.022
    gsap.fromTo(
      keys,
      { y: 0 },
      {
        y: -5,
        duration: 0.16,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1,
        stagger: delay,
        overwrite: true,
      },
    )
  }

  return (
    <section id="build" className={styles.section} aria-labelledby="build-title" tabIndex={-1}>
      <div className="container">
        <SectionHeading
          id="build-title"
          number="03"
          kicker="Build"
          title={
            <>
              Make it <em>yours</em>.
            </>
          }
        >
          Pick a colourway, a switch and whatever else you want on your desk. Your build is saved in
          this browser, so take your time.
        </SectionHeading>

        <div className={styles.layout}>
          <div ref={preview} className={styles.preview}>
            <Keyboard />
            <p className={styles.caption}>
              <strong>{summary.title}</strong>
              <span>{summary.detail}</span>
            </p>
          </div>

          <form
            className={styles.options}
            aria-label="Configure your keyboard"
            onSubmit={(event) => {
              event.preventDefault()
              goTo('#reserve')
            }}
          >
            <fieldset className={styles.group}>
              <legend>Colourway</legend>
              <div className={styles.swatches}>
                {colorways.map((c) => (
                  <label key={c.id} className={styles.swatch} data-colorway={c.id}>
                    <input
                      type="radio"
                      name="colorway"
                      value={c.id}
                      checked={build.colorway === c.id}
                      onChange={() => pickColorway(c.id)}
                    />
                    <span className={styles.chips} aria-hidden="true">
                      <i />
                      <i />
                      <i />
                    </span>
                    <span className={styles.name}>{c.name}</span>
                    <span className={styles.note}>{c.note}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className={styles.group}>
              <legend>Switches</legend>
              <div className={styles.choices}>
                {switches.map((s) => (
                  <label key={s.id} className={styles.choice} style={{ '--stem': s.stem }}>
                    <input
                      type="radio"
                      name="switch"
                      value={s.id}
                      checked={build.switchId === s.id}
                      onChange={() => dispatch({ type: 'switch', id: s.id })}
                    />
                    <span className={styles.stem} aria-hidden="true" />
                    <span>{s.name}</span>
                    <span className={styles.muted}>{s.type}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className={styles.group}>
              <legend>Extras</legend>
              <div className={styles.extras}>
                {extras.map((extra) => (
                  <label key={extra.id} className={styles.extra}>
                    <input
                      type="checkbox"
                      checked={build.extras.includes(extra.id)}
                      onChange={() => dispatch({ type: 'extra', id: extra.id })}
                    />
                    <span>{extra.name}</span>
                    <span className={styles.muted}>+{formatPrice(extra.price)}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className={styles.total}>
              <span>Total</span>
              <span aria-hidden="true">{formatPrice(shownPrice)}</span>
              <span className="visually-hidden" aria-live="polite">
                {formatPrice(price)}
              </span>
            </div>

            <Button type="submit">Reserve this build</Button>
            <p className={styles.small}>Nothing to pay now. You’re charged when batch 02 ships.</p>
          </form>
        </div>
      </div>
    </section>
  )
}
