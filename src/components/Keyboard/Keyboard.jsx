import { memo, useEffect, useRef } from 'react'
import { onKey, pressKey } from '../../lib/keys'
import { sound } from '../../lib/sound'
import { buildStore } from '../../lib/buildStore'
import { isBigKey } from '../../data/layout'
import KeyGrid from './KeyGrid'
import styles from './Keyboard.module.css'

function Legend({ k }) {
  if (k.code === 'Space') return null
  if (k.shift) {
    return (
      <span className={styles.legend}>
        <span>{k.shift}</span>
        <span>{k.label}</span>
      </span>
    )
  }
  return <span className={styles.legend}>{k.label}</span>
}

const renderCap = (k) => (
  <span className={styles.cap}>
    <Legend k={k} />
  </span>
)

// The whole keyboard is drawn with CSS. It's decorative for screen readers:
// the typing it shows always comes from a real text field somewhere else.
function Keyboard({ playable = false, className = '' }) {
  const keys = useRef(new Map())

  const register = (code, el) => {
    if (el) keys.current.set(code, el)
    else keys.current.delete(code)
  }

  useEffect(
    () =>
      onKey((code, down) => {
        const el = keys.current.get(code)
        if (el) el.dataset.down = down
      }),
    [],
  )

  function onPointerDown(event) {
    const el = event.target.closest('[data-code]')
    if (!el) return
    const { code } = el.dataset
    const big = isBigKey(code)
    const switchId = buildStore.getSnapshot().switchId

    pressKey(code, true)
    sound.play(switchId, { big })

    const release = () => {
      pressKey(code, false)
      sound.play(switchId, { up: true, big })
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
    }
    window.addEventListener('pointerup', release)
    window.addEventListener('pointercancel', release)
  }

  return (
    // oxlint-disable-next-line jsx-a11y/no-static-element-interactions -- mouse extra, the keyboard itself is aria-hidden
    <div
      className={`${styles.board} ${className}`}
      aria-hidden="true"
      onPointerDown={playable ? onPointerDown : undefined}
      data-playable={playable}
    >
      <div className={styles.case}>
        <div className={styles.plate}>
          <KeyGrid renderKey={renderCap} register={register} />
        </div>
      </div>
    </div>
  )
}

export default memo(Keyboard)
