import { useRef } from 'react'
import { gsap, ScrollTrigger, SplitText, useGSAP } from '../../lib/gsap'
import styles from './SectionHeading.module.css'

export default function SectionHeading({ id, number, kicker, title, children, className = '' }) {
  const root = useRef(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', (context) => {
        const label = root.current.querySelector(`.${styles.kicker}`)
        const heading = root.current.querySelector('h2')
        const lead = root.current.querySelector(`.${styles.lead}`)
        gsap.set([label, heading, lead].filter(Boolean), { autoAlpha: 0 })

        // split only when it's about to be seen, and put the DOM back afterwards
        ScrollTrigger.create({
          trigger: root.current,
          start: 'top 88%',
          once: true,
          onEnter: context.add(() => {
            const chars = SplitText.create(label, { type: 'chars' })
            const lines = SplitText.create(heading, { type: 'lines', mask: 'lines' })
            gsap.set([label, heading], { autoAlpha: 1 })

            // the label gets typed out, the heading slides up
            gsap.from(chars.chars, {
              autoAlpha: 0,
              duration: 0.01,
              stagger: 0.03,
              onComplete: () => chars.revert(),
            })
            gsap.from(lines.lines, {
              yPercent: 110,
              duration: 1,
              ease: 'expo.out',
              stagger: 0.08,
              delay: 0.15,
              onComplete: () => lines.revert(),
            })
            if (lead) {
              gsap.fromTo(
                lead,
                { y: 16, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out', delay: 0.35 },
              )
            }
          }),
        })
      })
    },
    { scope: root },
  )

  return (
    <header ref={root} className={`${styles.heading} ${className}`}>
      <p className={styles.kicker}>
        {number} / {kicker}
      </p>
      <h2 id={id}>{title}</h2>
      {children && <p className={styles.lead}>{children}</p>}
    </header>
  )
}
