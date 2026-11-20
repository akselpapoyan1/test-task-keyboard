// Lenis lives in useSmoothScroll. Everything else scrolls through here,
// so the page still works with native scrolling when Lenis is off (reduced motion).
let lenis = null

const HEADER_OFFSET = 72

export function setLenis(instance) {
  lenis = instance
}

export function scrollToTarget(target, options = {}) {
  if (lenis) {
    lenis.scrollTo(target, { offset: -HEADER_OFFSET, ...options })
    return
  }
  if (typeof target === 'number') {
    window.scrollTo(0, target)
    return
  }
  const el = typeof target === 'string' ? document.querySelector(target) : target
  el?.scrollIntoView()
}

// Scrolls to a section and moves focus into it, so keyboard users land where they clicked.
// Sections have tabIndex={-1} for this.
export function goTo(hash) {
  const target = document.querySelector(hash)
  if (!target) return
  scrollToTarget(target)
  target.focus({ preventScroll: true })
}

export function onAnchorClick(event) {
  // without Lenis the browser's own anchor jump is fine
  if (!lenis) return
  event.preventDefault()
  goTo(event.currentTarget.hash)
}

export function lockScroll(locked) {
  if (lenis) {
    if (locked) lenis.stop()
    else lenis.start()
  }
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}
