import { faq } from '../../data/content'
import SectionHeading from '../../components/SectionHeading/SectionHeading'
import Accordion from '../../components/Accordion/Accordion'
import styles from './Faq.module.css'

export default function Faq() {
  return (
    <section id="faq" className={styles.section} aria-labelledby="faq-title" tabIndex={-1}>
      <div className={`container ${styles.grid}`}>
        <SectionHeading
          id="faq-title"
          number="06"
          kicker="Questions"
          title={
            <>
              Asked <em>often</em>.
            </>
          }
        >
          The rest we answer by email, usually the same day.
        </SectionHeading>

        <div>
          {faq.map(({ q, a }) => (
            <Accordion key={q} question={q}>
              <p>{a}</p>
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  )
}
