import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { gsap, ScrollTrigger, useGSAP } from '../../lib/gsap'
import { goTo, lockScroll, onAnchorClick } from '../../lib/scroll'
import { sound } from '../../lib/sound'
import { setTheme, useTheme } from '../../hooks/useTheme'
import { useSound } from '../../hooks/useSound'
import KeycapToggle from '../../components/KeycapToggle/KeycapToggle'
import styles from './Header.module.css'

const links = [
  { href: '#sound', label: 'Sound' },
  { href: '#inside', label: 'Inside' },
  { href: '#build', label: 'Build' },
  { href: '#try', label: 'Try it' },
  { href: '#specs', label: 'Specs' },
]

export default function Header() {
  const header = useRef(null)
  const bar = useRef(null)
  const panel = useRef(null)
  const menuButton = useRef(null)
  const backlight = useRef(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const theme = useTheme()
  const soundOn = useSound()

  useGSAP(
    () => {
      // moves the bar rather than <header>, a transform there would trap the fixed menu inside it
      const slide = gsap.quickTo(bar.current, 'yPercent', { duration: 0.45, ease: 'power3.out' })
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate(self) {
          const y = self.scroll()
          header.current.dataset.scrolled = y > 40
          slide(self.direction === 1 && y > 500 ? -100 : 0)
        },
      })
    },
    { scope: header },
  )

  useGSAP(
    () => {
      if (!menuOpen) return
      gsap.from(panel.current, { clipPath: 'inset(0 0 100% 0)', duration: 0.6, ease: 'expo.out' })
      // opacity, not autoAlpha: the first link gets focus straight away
      gsap.from(panel.current.querySelectorAll('li'), {
        y: 30,
        opacity: 0,
        duration: 0.5,
        ease: 'expo.out',
        stagger: 0.04,
        delay: 0.08,
      })
    },
    { dependencies: [menuOpen], scope: header },
  )

  useEffect(() => {
    if (!menuOpen) return

    const outside = [document.querySelector('main'), document.querySelector('footer')]
    const desktop = matchMedia('(min-width: 1100px)')
    const close = () => setMenuOpen(false)
    const onKeyDown = (event) => event.key === 'Escape' && close()
    const button = menuButton.current

    lockScroll(true)
    outside.forEach((el) => (el.inert = true))
    panel.current.querySelector('a').focus()
    document.addEventListener('keydown', onKeyDown)
    desktop.addEventListener('change', close)

    return () => {
      lockScroll(false)
      outside.forEach((el) => (el.inert = false))
      document.removeEventListener('keydown', onKeyDown)
      desktop.removeEventListener('change', close)
      button.focus()
    }
  }, [menuOpen])

  function onMenuLink(event) {
    event.preventDefault()
    const { hash } = event.currentTarget
    setMenuOpen(false)
    requestAnimationFrame(() => goTo(hash))
  }

  // Backlight is the dark theme. The new theme spreads out from the key.
  function toggleBacklight() {
    const next = theme === 'dark' ? 'light' : 'dark'
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !document.startViewTransition) {
      setTheme(next)
      return
    }
    const box = backlight.current.getBoundingClientRect()
    const x = box.left + box.width / 2
    const y = box.top + box.height / 2
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    document
      .startViewTransition(() => flushSync(() => setTheme(next)))
      .ready.then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          {
            duration: 650,
            easing: 'cubic-bezier(0.65, 0, 0.35, 1)',
            pseudoElement: '::view-transition-new(root)',
          },
        )
      })
  }

  return (
    <header ref={header} className={styles.header}>
      <div ref={bar} className={styles.bar}>
        <a href="#top" className={styles.logo} onClick={onAnchorClick}>
          <span className={styles.mark} aria-hidden="true">
            ⇥
          </span>
          indent
        </a>

        <nav aria-label="Main" className={styles.nav}>
          <ul>
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={onAnchorClick}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <KeycapToggle
            label="Sound"
            icon="♪"
            pressed={soundOn}
            onToggle={() => sound.set(!soundOn)}
          />
          <KeycapToggle
            ref={backlight}
            label="Backlight"
            icon="◐"
            pressed={theme === 'dark'}
            onToggle={toggleBacklight}
          />
          <a href="#reserve" className={styles.cta} onClick={onAnchorClick}>
            Reserve
          </a>
          <button
            ref={menuButton}
            type="button"
            className={styles.menuButton}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      <div id="mobile-menu" ref={panel} className={styles.panel} hidden={!menuOpen}>
        <nav aria-label="Mobile">
          <ul>
            {[...links, { href: '#reserve', label: 'Reserve yours' }].map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={onMenuLink}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className={styles.panelNote}>Batch 02 · 400 keyboards</p>
      </div>
    </header>
  )
}
