import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { inTheBox, specs } from '../../data/content'
import SectionHeading from '../../components/SectionHeading/SectionHeading'
import styles from './Specs.module.css'

// Drawing scale: 1 mm = 1.7 units. Top view up top, side profile underneath.
const S = 1.7
const LEFT = 40
const TOP = 46
const WIDTH = 317 * S
const DEPTH = 132 * S
const SIDE_Y = 390

export default function Specs() {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const trigger = { trigger: root.current.querySelector('svg'), start: 'top 75%' }
        gsap.from(root.current.querySelectorAll(`.${styles.line}`), {
          drawSVG: 0,
          duration: 1.2,
          ease: 'power2.inOut',
          stagger: 0.06,
          scrollTrigger: trigger,
        })
        gsap.from(root.current.querySelectorAll(`.${styles.label}`), {
          autoAlpha: 0,
          duration: 0.4,
          stagger: 0.08,
          delay: 0.8,
          scrollTrigger: trigger,
        })
      })
    },
    { scope: root },
  )

  const keyRows = [1, 2, 3, 4, 5].map((r) => TOP + 18 + ((DEPTH - 36) / 6) * r)
  // side profile, seen from the left: 132 mm deep, 19 mm at the front, 34 mm at the back
  const base = SIDE_Y
  const frontTop = base - 19 * S
  const backTop = base - 34 * S
  const angle = (6.5 * Math.PI) / 180

  return (
    <section
      id="specs"
      ref={root}
      className={styles.section}
      aria-labelledby="specs-title"
      tabIndex={-1}
    >
      <div className="container">
        <SectionHeading
          id="specs-title"
          number="05"
          kicker="Specs"
          title={
            <>
              The <em>numbers</em>.
            </>
          }
        >
          For everyone who scrolled straight down here. We see you.
        </SectionHeading>

        <div className={styles.layout}>
          <figure className={styles.drawing}>
            <svg
              viewBox="0 0 640 430"
              role="img"
              aria-label="Technical drawing: 317 by 132 millimetres, 19 millimetres high at the front, typing angle 6.5 degrees"
            >
              {/* top view */}
              <rect x={LEFT} y={TOP} width={WIDTH} height={DEPTH} rx="16" className={styles.line} />
              <rect
                x={LEFT + 12}
                y={TOP + 12}
                width={WIDTH - 24}
                height={DEPTH - 24}
                rx="6"
                className={`${styles.line} ${styles.faint}`}
              />
              {keyRows.map((y) => (
                <line
                  key={y}
                  x1={LEFT + 12}
                  x2={LEFT + WIDTH - 12}
                  y1={y}
                  y2={y}
                  className={`${styles.line} ${styles.faint}`}
                />
              ))}

              {/* width */}
              <path
                d={`M${LEFT} ${TOP - 22}h${WIDTH}`}
                className={`${styles.line} ${styles.dim}`}
              />
              <path
                d={`M${LEFT} ${TOP - 28}v12M${LEFT + WIDTH} ${TOP - 28}v12`}
                className={`${styles.line} ${styles.dim}`}
              />
              <text x={LEFT + WIDTH / 2} y={TOP - 30} className={styles.label} textAnchor="middle">
                317 mm
              </text>

              {/* depth */}
              <path
                d={`M${LEFT + WIDTH + 22} ${TOP}v${DEPTH}`}
                className={`${styles.line} ${styles.dim}`}
              />
              <path
                d={`M${LEFT + WIDTH + 16} ${TOP}h12M${LEFT + WIDTH + 16} ${TOP + DEPTH}h12`}
                className={`${styles.line} ${styles.dim}`}
              />
              <text
                x={LEFT + WIDTH + 34}
                y={TOP + DEPTH / 2}
                className={styles.label}
                textAnchor="middle"
                transform={`rotate(90 ${LEFT + WIDTH + 34} ${TOP + DEPTH / 2})`}
              >
                132 mm
              </text>

              {/* side profile, front on the left */}
              <path
                d={`M${LEFT} ${base}H${LEFT + DEPTH}V${backTop}L${LEFT} ${frontTop}Z`}
                className={styles.line}
              />
              <path
                d={`M${LEFT - 18} ${base}V${frontTop}`}
                className={`${styles.line} ${styles.dim}`}
              />
              <text
                x={LEFT - 24}
                y={(base + frontTop) / 2}
                className={styles.label}
                textAnchor="middle"
                transform={`rotate(-90 ${LEFT - 24} ${(base + frontTop) / 2})`}
              >
                19 mm
              </text>
              <path
                d={`M${LEFT + DEPTH + 18} ${base}V${backTop}`}
                className={`${styles.line} ${styles.dim}`}
              />
              <text x={LEFT + DEPTH + 26} y={(base + backTop) / 2 + 4} className={styles.label}>
                34 mm
              </text>
              {/* the typing angle, measured off a level line at the front edge */}
              <path
                d={`M${LEFT} ${frontTop}h86`}
                className={`${styles.line} ${styles.dim}`}
                strokeDasharray="3 3"
              />
              <path
                d={`M${LEFT + 70} ${frontTop}A70 70 0 0 0 ${LEFT + 70 * Math.cos(angle)} ${frontTop - 70 * Math.sin(angle)}`}
                className={`${styles.line} ${styles.dim}`}
              />
              <text x={LEFT + 94} y={frontTop + 4} className={styles.label}>
                6.5°
              </text>
            </svg>
            <figcaption>Top view and side profile, to scale</figcaption>
          </figure>

          <div className={styles.info}>
            <dl className={styles.specs}>
              {specs.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <h3 className={styles.boxTitle}>In the box</h3>
            <ul className={styles.box}>
              {inTheBox.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
