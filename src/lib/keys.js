// A tiny event bus for key presses. Real key presses, clicks on keycaps and the
// hero's typing intro all go through here, and every on-screen keyboard listens.
const listeners = new Set()
let lastPhysical = 0

export function onKey(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function pressKey(code, down) {
  listeners.forEach((listener) => listener(code, down))
}

// a full tap, for things that only know a key happened (touch keyboards, the intro)
export function tapKey(code, hold = 90) {
  pressKey(code, true)
  setTimeout(() => pressKey(code, false), hold)
}

// Text fields also get input from phone keyboards, which send no usable key events.
// This tells them whether a real key press already took care of the animation.
export const markPhysical = () => {
  lastPhysical = performance.now()
}
export const fromPhysicalKey = () => performance.now() - lastPhysical < 80
