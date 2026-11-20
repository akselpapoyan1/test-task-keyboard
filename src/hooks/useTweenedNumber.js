import { useEffect, useRef, useState } from 'react'
import { gsap } from '../lib/gsap'

// Counts smoothly from the previous value to the new one, like an odometer.
export function useTweenedNumber(value, { step = 1, duration = 0.6 } = {}) {
  const [shown, setShown] = useState(value)
  const proxy = useRef({ n: value })

  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const tween = gsap.to(proxy.current, {
      n: value,
      duration: reduce ? 0 : duration,
      ease: 'power3.out',
      onUpdate: () => setShown(Math.round(proxy.current.n / step) * step),
    })
    return () => tween.kill()
  }, [value, step, duration])

  return shown
}
