import styles from './KeycapToggle.module.css'

// A small keycap with a status LED, like Caps Lock. Used for sound and backlight.
// On narrow screens the icon stands in for the label, which stays for screen readers.
export default function KeycapToggle({ label, icon, pressed, onToggle, ref }) {
  return (
    <button
      ref={ref}
      type="button"
      className={styles.toggle}
      aria-pressed={pressed}
      onClick={onToggle}
    >
      <span className={styles.led} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
      <span className={styles.icon} aria-hidden="true">
        {icon}
      </span>
    </button>
  )
}
