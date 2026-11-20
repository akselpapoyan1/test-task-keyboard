import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { sound } from '../../lib/sound'
import styles from './Sound.module.css'

// chart area: 0-4.2 mm across, 0-90 g up
const W = 260
const H = 150
const toX = (mm) => 34 + (mm / 4.2) * 214
const toY = (g) => 126 - (g / 90) * 110

// Catmull-Rom through the measured points, so the bump reads as a bump and not a zigzag
function smoothPath(points) {
  let d = `M${points[0][0]},${points[0][1]}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? p2
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6]
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6]
    d += ` C${c1} ${c2} ${p2}`
  }
  return d
}

export default function SwitchCard({ sw, chosen, onChoose }) {
  const root = useRef(null)
  const path = useRef(null)
  const dot = useRef(null)
  const travel = useRef({ value: 0 })
  const held = useRef(false)
  const d = smoothPath(sw.curve.map(([mm, g]) => [toX(mm), toY(g)]))

  // the dot rides the curve as the key goes down
  const placeDot = () => {
    const length = path.current.getTotalLength()
    const point = path.current.getPointAtLength(travel.current.value * length)
    dot.current.setAttribute('cx', point.x)
    dot.current.setAttribute('cy', point.y)
  }

  useGSAP(
    () => {
      placeDot()
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(path.current, {
          drawSVG: 0,
          duration: 1.4,
          ease: 'power2.inOut',
          scrollTrigger: { trigger: root.current, start: 'top 75%' },
        })
      })
    },
    { scope: root },
  )

  function press() {
    if (held.current) return
    held.current = true
    root.current.dataset.pressed = true
    sound.play(sw.id, { force: true })
    gsap.to(travel.current, {
      value: 1,
      duration: 0.2,
      ease: 'power2.in',
      onUpdate: placeDot,
      overwrite: true,
    })
  }

  function release() {
    if (!held.current) return
    held.current = false
    root.current.dataset.pressed = false
    sound.play(sw.id, { up: true, force: true })
    gsap.to(travel.current, {
      value: 0,
      duration: 0.3,
      ease: 'power2.out',
      onUpdate: placeDot,
      overwrite: true,
    })
  }

  // Space and Enter press the key too; stopping propagation keeps the page-wide
  // key sounds from playing on top of this one
  function onKeyDown(event) {
    if (event.key !== ' ' && event.key !== 'Enter') return
    event.preventDefault()
    event.stopPropagation()
    if (!event.repeat) press()
  }

  function onKeyUp(event) {
    if (event.key !== ' ' && event.key !== 'Enter') return
    event.stopPropagation()
    release()
  }

  return (
    <article ref={root} className={styles.card} data-chosen={chosen} style={{ '--stem': sw.stem }}>
      <div className={styles.head}>
        <h3>{sw.name}</h3>
        <p className={styles.type}>
          <span className={styles.stem} aria-hidden="true" />
          {sw.type}
        </p>
      </div>
      <p className={styles.text}>{sw.text}</p>

      <div className={styles.test}>
        <button
          type="button"
          className={styles.tester}
          aria-label={`Press and hold to hear ${sw.name}`}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId)
            press()
          }}
          onPointerUp={release}
          onPointerCancel={release}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onBlur={release}
        >
          <span className={styles.testerCap}>Hold</span>
        </button>

        <figure className={styles.chart}>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            role="img"
            aria-label={`${sw.name} force curve: ${sw.specs.map((s) => s.join(' ')).join(', ')}`}
          >
            {[0, 1, 2, 3, 4].map((mm) => (
              <g key={mm}>
                <line x1={toX(mm)} x2={toX(mm)} y1={toY(0)} y2={toY(90)} className={styles.rule} />
                <text x={toX(mm)} y={H - 6} className={styles.tick} textAnchor="middle">
                  {mm}
                </text>
              </g>
            ))}
            {[30, 60, 90].map((g) => (
              <g key={g}>
                <line x1={toX(0)} x2={toX(4.2)} y1={toY(g)} y2={toY(g)} className={styles.rule} />
                <text x={toX(0) - 6} y={toY(g) + 3} className={styles.tick} textAnchor="end">
                  {g}
                </text>
              </g>
            ))}
            <line
              x1={toX(sw.actuation)}
              x2={toX(sw.actuation)}
              y1={toY(0)}
              y2={toY(90)}
              className={styles.actuation}
            />
            <text x={toX(sw.actuation) + 4} y={toY(84)} className={styles.tick} textAnchor="start">
              fires
            </text>
            <path ref={path} d={d} className={styles.curve} />
            <circle ref={dot} r={4.5} className={styles.dot} />
          </svg>
          <figcaption>Force in grams over travel in millimetres</figcaption>
        </figure>
      </div>

      <dl className={styles.specs}>
        {sw.specs.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      <button type="button" className={styles.choose} aria-pressed={chosen} onClick={onChoose}>
        Use {sw.name} in my build
      </button>
    </article>
  )
}
