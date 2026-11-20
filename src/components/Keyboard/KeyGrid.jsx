import { rows } from '../../data/layout'
import styles from './Keyboard.module.css'

// Lays out the 84 keys and lets the caller decide what each one looks like.
// --x/--y is the key's position in units, used for the colour wave and the press ripple.
export default function KeyGrid({ renderKey, register }) {
  return rows.map((row, y) => {
    let x = 0
    return (
      <div key={y} className={styles.row}>
        {row.map((key) => {
          const style = { '--w': key.w, '--x': x, '--y': y }
          x += key.w
          return (
            <span
              key={key.code}
              ref={register ? (el) => register(key.code, el) : undefined}
              className={styles.key}
              data-code={key.code}
              data-kind={key.kind}
              style={style}
            >
              {renderKey(key)}
            </span>
          )
        })}
      </div>
    )
  })
}
