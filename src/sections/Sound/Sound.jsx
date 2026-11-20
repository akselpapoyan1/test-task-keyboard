import { switches } from '../../data/products'
import { useBuild } from '../../hooks/useBuild'
import SectionHeading from '../../components/SectionHeading/SectionHeading'
import SwitchCard from './SwitchCard'
import styles from './Sound.module.css'

export default function Sound() {
  const [build, dispatch] = useBuild()

  return (
    <section id="sound" className={styles.section} aria-labelledby="sound-title" tabIndex={-1}>
      <div className="container">
        <SectionHeading
          id="sound-title"
          number="01"
          kicker="Sound"
          title={
            <>
              Three switches. Pick a <em>voice</em>.
            </>
          }
        >
          Same keyboard, three very different sounds. Hold the keys down to hear them and to see
          where the force goes. Headphones help.
        </SectionHeading>

        <ul className={styles.grid}>
          {switches.map((sw) => (
            <li key={sw.id}>
              <SwitchCard
                sw={sw}
                chosen={build.switchId === sw.id}
                onChoose={() => dispatch({ type: 'switch', id: sw.id })}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
