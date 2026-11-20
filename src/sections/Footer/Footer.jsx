import { scrollToTarget } from '../../lib/scroll'
import { tapKey } from '../../lib/keys'
import styles from './Footer.module.css'

export default function Footer() {
  // the Home key does what Home does
  function goHome() {
    tapKey('Home')
    scrollToTarget(0, { duration: 1.4 })
    document.getElementById('top').focus({ preventScroll: true })
  }

  return (
    <footer className={styles.footer}>
      <div className="container">
        <p className={styles.wordmark} aria-hidden="true">
          <span>⇥</span>indent
        </p>

        <div className={styles.columns}>
          <div>
            <h2>Batch 02</h2>
            <p>
              400 keyboards, built and tested by three people in one small workshop. Reservations
              close when they’re gone.
            </p>
          </div>
          <div>
            <h2>About the sounds</h2>
            <p>
              Nothing on this page is a recording. Every click is put together in your browser by
              the Web Audio API, a few milliseconds of noise and a falling tone.
            </p>
          </div>
          <div>
            <h2>Back up</h2>
            <button type="button" className={styles.home} onClick={goHome}>
              Home
            </button>
          </div>
        </div>

        <p className={styles.small}>
          A concept project: the keyboard doesn’t exist, though we wish it did. Quotes come from
          DummyJSON.
        </p>
      </div>
    </footer>
  )
}
