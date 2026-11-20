import { useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { formatPrice } from '../../lib/format'
import Button from '../../components/Button/Button'
import Barcode from './Barcode'
import styles from './ShippingLabel.module.css'

export default function ShippingLabel({ reservation, onStartOver }) {
  const root = useRef(null)

  useGSAP(
    () => {
      root.current.querySelector('h3').focus()
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from(`.${styles.label}`, {
          y: 40,
          rotate: -4,
          autoAlpha: 0,
          duration: 0.8,
          ease: 'back.out(1.6)',
        })
        gsap.from(root.current.querySelectorAll(`.${styles.barcode} rect`), {
          scaleY: 0,
          transformOrigin: '50% 100%',
          duration: 0.4,
          ease: 'power2.out',
          stagger: 0.008,
          delay: 0.5,
        })
      })
    },
    { scope: root },
  )

  return (
    <div ref={root} className={styles.wrap}>
      <article className={styles.label} aria-labelledby="label-title">
        <header className={styles.top}>
          <span className={styles.brand}>⇥ indent</span>
          <span className={styles.batch}>Batch 02</span>
        </header>

        <h3 id="label-title" tabIndex={-1}>
          Reserved. <span>{reservation.number}</span>
        </h3>

        <dl className={styles.fields}>
          <div>
            <dt>From</dt>
            <dd>Indent Keyboards, Unit 4, 75 Keycap Lane</dd>
          </div>
          <div>
            <dt>To</dt>
            <dd>
              {reservation.name}, {reservation.country}
            </dd>
          </div>
          <div>
            <dt>Contents</dt>
            <dd>
              {reservation.summary.title}. {reservation.summary.detail}
            </dd>
          </div>
          <div>
            <dt>Due on shipping</dt>
            <dd>{formatPrice(reservation.price)}</dd>
          </div>
        </dl>

        <Barcode value={reservation.number} className={styles.barcode} />
        <p className={styles.number}>{reservation.number}</p>
      </article>

      <p className={styles.note}>
        We’ll write to {reservation.email} when your keyboard ships. This is a demo, so nothing was
        sent anywhere and nobody will charge you.
      </p>
      <Button variant="quiet" onClick={onStartOver}>
        Reserve another one
      </Button>
    </div>
  )
}
