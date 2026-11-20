import { useRef, useState } from 'react'
import { errorFor, validateForm } from '../../lib/validation'
import { buildPrice, describeBuild, reservationNumber } from '../../lib/build'
import { formatPrice } from '../../lib/format'
import { onAnchorClick } from '../../lib/scroll'
import { useBuild } from '../../hooks/useBuild'
import SectionHeading from '../../components/SectionHeading/SectionHeading'
import Button from '../../components/Button/Button'
import ShippingLabel from './ShippingLabel'
import styles from './Reserve.module.css'

const fieldId = (name) => `reserve-${name}`

function Field({ label, name, error, children }) {
  return (
    <div className={styles.field} data-invalid={Boolean(error)}>
      <label htmlFor={fieldId(name)}>{label}</label>
      {children}
      {error && (
        <p id={`${fieldId(name)}-error`} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  )
}

export default function Reserve() {
  const [build] = useBuild()
  const [errors, setErrors] = useState({})
  const [reservation, setReservation] = useState(null)
  const form = useRef(null)
  const summary = describeBuild(build)
  const price = buildPrice(build)

  function recheck(event) {
    const { name } = event.target
    if (!errors[name]) return
    setErrors({ ...errors, [name]: errorFor(event.target) })
  }

  function handleSubmit(event) {
    event.preventDefault()
    const found = validateForm(form.current)
    setErrors(found)
    const firstInvalid = Object.keys(found)[0]
    if (firstInvalid) {
      form.current.elements[firstInvalid].focus()
      return
    }

    const data = new FormData(form.current)
    setReservation({
      number: reservationNumber(),
      name: data.get('name').trim(),
      email: data.get('email').trim(),
      country: data.get('country').trim(),
      summary,
      price,
    })
  }

  const describedBy = (name) => (errors[name] ? `${fieldId(name)}-error` : undefined)

  const input = (name, props) => (
    <input
      id={fieldId(name)}
      name={name}
      required
      aria-invalid={Boolean(errors[name])}
      aria-describedby={describedBy(name)}
      onChange={recheck}
      {...props}
    />
  )

  return (
    <section id="reserve" className={styles.section} aria-labelledby="reserve-title" tabIndex={-1}>
      <div className={`container ${styles.grid}`}>
        <div>
          <SectionHeading
            id="reserve-title"
            number="07"
            kicker="Reserve"
            title={
              <>
                Hold one from <em>batch 02</em>.
              </>
            }
          >
            Four hundred keyboards, built and tested by the three of us. You pay when yours ships,
            about eight weeks after reservations close.
          </SectionHeading>

          <div className={styles.summary}>
            <p className={styles.summaryLabel}>Your build</p>
            <p className={styles.summaryTitle}>{summary.title}</p>
            <p className={styles.summaryDetail}>{summary.detail}</p>
            <p className={styles.summaryPrice}>{formatPrice(price)}</p>
            <a href="#build" className={styles.change} onClick={onAnchorClick}>
              Change it
            </a>
          </div>
        </div>

        {reservation ? (
          <ShippingLabel reservation={reservation} onStartOver={() => setReservation(null)} />
        ) : (
          <form ref={form} className={styles.form} noValidate onSubmit={handleSubmit}>
            <Field label="Name" name="name" error={errors.name}>
              {input('name', { autoComplete: 'name' })}
            </Field>
            <Field label="Email" name="email" error={errors.email}>
              {input('email', { type: 'email', autoComplete: 'email' })}
            </Field>
            <Field label="Country" name="country" error={errors.country}>
              {input('country', { autoComplete: 'country-name' })}
            </Field>
            <div className={styles.submit}>
              <Button type="submit">Reserve for {formatPrice(price)}</Button>
              <p>Demo only, nothing leaves your browser.</p>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
