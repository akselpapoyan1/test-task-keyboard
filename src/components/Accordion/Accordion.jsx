import { useId, useState } from 'react'
import styles from './Accordion.module.css'

export default function Accordion({ question, children, headingLevel: Heading = 'h3' }) {
  const [open, setOpen] = useState(false)
  const id = useId()

  return (
    <div className={styles.item} data-open={open}>
      <Heading className={styles.question}>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen(!open)}
        >
          {question}
          <span className={styles.icon} aria-hidden="true" />
        </button>
      </Heading>
      <div id={id} className={styles.panel}>
        <div className={styles.inner}>
          <div className={styles.answer}>{children}</div>
        </div>
      </div>
    </div>
  )
}
