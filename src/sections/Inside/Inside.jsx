import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { layers } from '../../data/content'
import { switches } from '../../data/products'
import { useBuild } from '../../hooks/useBuild'
import SectionHeading from '../../components/SectionHeading/SectionHeading'
import Exploded from './Exploded'
import { DEPTH } from './geometry'
import styles from './Inside.module.css'

export default function Inside() {
  const root = useRef(null)
  const [build] = useBuild()
  const stem = switches.find((s) => s.id === build.switchId).stem

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(
        {
          wide: '(min-width: 1024px)',
          tall: '(min-height: 760px)',
          motion: '(prefers-reduced-motion: no-preference)',
          mouse: '(hover: hover) and (pointer: fine)',
        },
        ({ conditions }) => {
          // without motion the drawing stays as the CSS has it, already apart
          if (!conditions.motion) return
          // pinned, the whole section has to fit on screen. Short laptop screens scroll past it
          const pinned = conditions.wide && conditions.tall

          const section = root.current
          const orbit = section.querySelector('[data-orbit]')
          const stack = section.querySelector('[data-stack]')
          const planes = gsap.utils.toArray('[data-layer]', section)
          const tags = gsap.utils.toArray('[data-tag]', section)
          const items = gsap.utils.toArray(`.${styles.item}`, section)

          const tl = gsap.timeline({
            defaults: { ease: 'power2.inOut' },
            scrollTrigger: pinned
              ? {
                  trigger: section,
                  start: 'top top',
                  end: '+=1700',
                  pin: section.querySelector(`.${styles.pin}`),
                  scrub: 0.8,
                }
              : {
                  // from the moment the whole board is on screen (it sits at the bottom of the
                  // orbit, under the room it floats up into) until the scene is in the middle
                  trigger: orbit,
                  start: 'bottom bottom',
                  endTrigger: section.querySelector(`.${styles.scene}`),
                  end: 'center center',
                  scrub: 0.8,
                },
          })

          tl.fromTo(
            stack,
            { '--tilt': 30, '--spin': -16 },
            { '--tilt': 56, '--spin': -32, duration: 0.3 },
            0,
          )
          planes.forEach((plane) => {
            const { rest, lift } = DEPTH[plane.dataset.layer]
            tl.fromTo(plane, { '--z': rest }, { '--z': lift, duration: 0.7 }, 0.15)
          })
          // the numbers would sit in one pile until the parts have come apart
          tl.fromTo(tags, { opacity: 0 }, { opacity: 1, duration: 0.15, stagger: 0.04 }, 0.45)
          // pinned, the list lights up one part at a time as the layers come apart.
          // otherwise the list scrolls past on its own, so it just stays readable
          if (pinned) {
            items.forEach((item, i) => {
              tl.fromTo(item, { '--on': 0 }, { '--on': 1, duration: 0.12 }, 0.2 + i * 0.1)
            })
          }

          // with a mouse the board leans a few degrees towards the pointer, enough to show its sides
          if (!conditions.wide || !conditions.mouse) return
          const leanX = gsap.quickTo(orbit, 'rotationX', { duration: 0.9, ease: 'power3' })
          const leanY = gsap.quickTo(orbit, 'rotationY', { duration: 0.9, ease: 'power3' })
          const lean = (e) => {
            leanY((e.clientX / window.innerWidth - 0.5) * 12)
            leanX((0.5 - e.clientY / window.innerHeight) * 8)
          }
          const straighten = () => {
            leanX(0)
            leanY(0)
          }
          section.addEventListener('pointermove', lean)
          section.addEventListener('pointerleave', straighten)
          return () => {
            section.removeEventListener('pointermove', lean)
            section.removeEventListener('pointerleave', straighten)
          }
        },
      )
    },
    { scope: root },
  )

  return (
    <section
      id="inside"
      ref={root}
      className={styles.section}
      aria-labelledby="inside-title"
      tabIndex={-1}
      style={{ '--stem': stem }}
    >
      <div className={styles.pin}>
        <div className={`container ${styles.grid}`}>
          <div>
            <SectionHeading
              id="inside-title"
              number="02"
              kicker="Inside"
              title={
                <>
                  Six layers, <em>tuned</em>.
                </>
              }
            />
            <ol className={styles.list}>
              {layers.map((layer, i) => (
                <li key={layer.id} className={styles.item}>
                  <span className={styles.number}>{i + 1}</span>
                  <div>
                    <h3>{layer.name}</h3>
                    <p>{layer.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className={styles.scene} aria-hidden="true">
            <Exploded />
          </div>
        </div>
      </div>
    </section>
  )
}
