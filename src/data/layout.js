// A 75% ANSI layout: 84 keys, six rows, every row adds up to 16 units.
// `code` matches KeyboardEvent.code, so real key presses can find their keycap.
const key = (code, label, w = 1, kind = 'alpha', shift) => ({ code, label, w, kind, shift })

const letters = (chars) => [...chars].map((c) => key(`Key${c}`, c))
const fRow = Array.from({ length: 12 }, (_, i) => key(`F${i + 1}`, `F${i + 1}`, 1, 'mod'))
const digits = [...'1234567890'].map((d, i) => key(`Digit${d}`, d, 1, 'alpha', '!@#$%^&*()'[i]))

export const rows = [
  [
    key('Escape', 'Esc', 1, 'accent'),
    ...fRow,
    key('PrintScreen', 'PrtSc', 1, 'mod'),
    key('Pause', 'Pause', 1, 'mod'),
    key('Delete', 'Del', 1, 'mod'),
  ],
  [
    key('Backquote', '`', 1, 'alpha', '~'),
    ...digits,
    key('Minus', '-', 1, 'alpha', '_'),
    key('Equal', '=', 1, 'alpha', '+'),
    key('Backspace', 'Backspace', 2, 'mod'),
    key('Home', 'Home', 1, 'mod'),
  ],
  [
    // the house key: our logo sits on Tab
    key('Tab', '⇥', 1.5, 'accent'),
    ...letters('QWERTYUIOP'),
    key('BracketLeft', '[', 1, 'alpha', '{'),
    key('BracketRight', ']', 1, 'alpha', '}'),
    key('Backslash', '\\', 1.5, 'alpha', '|'),
    key('PageUp', 'PgUp', 1, 'mod'),
  ],
  [
    key('CapsLock', 'Caps', 1.75, 'mod'),
    ...letters('ASDFGHJKL'),
    key('Semicolon', ';', 1, 'alpha', ':'),
    key('Quote', "'", 1, 'alpha', '"'),
    key('Enter', 'Enter', 2.25, 'accent'),
    key('PageDown', 'PgDn', 1, 'mod'),
  ],
  [
    key('ShiftLeft', 'Shift', 2.25, 'mod'),
    ...letters('ZXCVBNM'),
    key('Comma', ',', 1, 'alpha', '<'),
    key('Period', '.', 1, 'alpha', '>'),
    key('Slash', '/', 1, 'alpha', '?'),
    key('ShiftRight', 'Shift', 1.75, 'mod'),
    key('ArrowUp', '↑', 1, 'mod'),
    key('End', 'End', 1, 'mod'),
  ],
  [
    key('ControlLeft', 'Ctrl', 1.25, 'mod'),
    key('MetaLeft', 'Super', 1.25, 'mod'),
    key('AltLeft', 'Alt', 1.25, 'mod'),
    key('Space', '', 6.25),
    key('AltRight', 'Alt', 1, 'mod'),
    key('Fn', 'Fn', 1, 'mod'),
    key('ControlRight', 'Ctrl', 1, 'mod'),
    key('ArrowLeft', '←', 1, 'mod'),
    key('ArrowDown', '↓', 1, 'mod'),
    key('ArrowRight', '→', 1, 'mod'),
  ],
]

export const allKeys = rows.flat()

// where every key sits, in units from the top left, for drawings that don't need real elements
export const keyRects = rows.flatMap((row, y) => {
  let x = 0
  return row.map((k) => {
    const rect = { code: k.code, kind: k.kind, x, y, w: k.w }
    x += k.w
    return rect
  })
})

// keys long enough to need stabilisers sound different, deeper and a little rattly
export const isBigKey = (code) => (allKeys.find((k) => k.code === code)?.w ?? 1) >= 2

// the other direction: which keycap did a typed character come from (for touch keyboards)
const byChar = new Map()
for (const k of allKeys) {
  if (k.code.startsWith('Key')) {
    byChar.set(k.label.toLowerCase(), k.code)
    byChar.set(k.label, k.code)
  } else if (k.label.length === 1) {
    byChar.set(k.label, k.code)
  }
  if (k.shift) byChar.set(k.shift, k.code)
}
byChar.set(' ', 'Space')
byChar.set('\n', 'Enter')

export const codeForChar = (char) => byChar.get(char) ?? null
