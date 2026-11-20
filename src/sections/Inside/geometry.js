import { keyRects } from '../../data/layout'

// Everything in the exploded view is measured in one unit: 10 per key, plus a 3-unit rim.
// SVG uses it through the viewBox and CSS through --su, so the two always line up.
export const U = 10
export const RIM = 3
export const W = 16 * U + 2 * RIM
export const H = 6 * U + 2 * RIM
export const WALL = 12

// the PCB and the plate sit inside the case walls
export const INNER = { x: RIM, y: RIM, w: W - 2 * RIM, h: H - 2 * RIM }

// how high each part sits, assembled in its case and pulled apart
export const DEPTH = {
  case: { rest: 0, lift: 0 },
  pcb: { rest: 2.8, lift: 22 },
  gasket: { rest: 4.4, lift: 36 },
  plate: { rest: 5.4, lift: 51 },
  switches: { rest: 5.5, lift: 68 },
  caps: { rest: 10, lift: 92 },
}

export const KINDS = ['alpha', 'mod', 'accent']

const rr = (x, y, w, h, r) =>
  `M${x + r} ${y}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${h - 2 * r}` +
  `a${r} ${r} 0 0 1 ${-r} ${r}h${2 * r - w}a${r} ${r} 0 0 1 ${-r} ${-r}v${2 * r - h}` +
  `a${r} ${r} 0 0 1 ${r} ${-r}Z`
const square = (cx, cy, size) => `M${cx - size / 2} ${cy - size / 2}h${size}v${size}h${-size}Z`
const circle = (cx, cy, r) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`

const keys = keyRects.map((k) => ({
  ...k,
  left: RIM + k.x * U,
  top: RIM + k.y * U,
  width: k.w * U,
  cx: RIM + (k.x + k.w / 2) * U,
  cy: RIM + (k.y + 0.5) * U,
}))

// long keys get two stabilisers next to the switch, the space bar's sit much further out
const stabilisers = (k) => {
  if (k.w < 2) return []
  const offset = k.w >= 6 ? 26 : 6.2
  return [k.cx - offset, k.cx + offset]
}

// A keycap in five slices, each a little smaller and set further back than the one below.
// Stacked, they make the sloped skirt of a sculpted cap. Insets are [sides, back, front].
const CAP_HEIGHT = 5
const BOTTOM = [0.5, 0.5, 0.5]
const TOP = [1.5, 1, 2.2]

export const capSlices = [0, 0.25, 0.5, 0.75, 1].map((t) => {
  const [side, back, front] = BOTTOM.map((b, i) => b + (TOP[i] - b) * t)
  const byKind = Object.fromEntries(
    KINDS.map((kind) => [
      kind,
      keys
        .filter((k) => k.kind === kind)
        .map((k) => rr(k.left + side, k.top + back, k.width - 2 * side, U - back - front, 1.1))
        .join(''),
    ]),
  )
  // the skirt gets darker towards the bottom, where less light gets in between the keys
  return { z: CAP_HEIGHT * t, top: t === 1, shade: `${66 + 34 * t}%`, byKind }
})

// a lighter lip along the back of every top, where the light catches it
export const capLips = keys
  .map((k) => rr(k.left + 1.9, k.top + 1.25, k.width - 3.8, 0.7, 0.35))
  .join('')

// Switches the same way: two slices of bottom housing, two of top housing, the stem twice.
// [path, height, shade]
export const switchSlices = [
  ['housingBase', 0, 42],
  ['housingBase', 1, 58],
  ['housingTop', 2, 66],
  ['housingTop', 3, 100],
  ['stems', 3.6, 60],
  ['stems', 4.2, 100],
]

// flex cuts: short slots between columns, so the board gives a little under your fingers
const flexCuts = [1, 2, 3, 4]
  .flatMap((row) => {
    const edges = keys.filter((k) => k.y === row).map((k) => k.x)
    return [4, 8, 12].map((target) => {
      const x = edges.reduce((best, e) =>
        Math.abs(e - target) < Math.abs(best - target) ? e : best,
      )
      return rr(RIM + x * U - 0.4, RIM + row * U + 1.5, 0.8, U - 3, 0.4)
    })
  })
  .join('')

const inner = (r) => rr(INNER.x, INNER.y, INNER.w, INNER.h, r)

export const paths = {
  housingBase: keys
    .map(
      (k) =>
        square(k.cx, k.cy, 7.4) +
        stabilisers(k)
          .map((x) => rr(x - 1.4, k.cy - 2.2, 2.8, 4.4, 0.5))
          .join(''),
    )
    .join(''),
  housingTop: keys.map((k) => square(k.cx, k.cy, 6.4)).join(''),
  stems: keys.map((k) => `M${k.cx - 1.5} ${k.cy}h3M${k.cx} ${k.cy - 1.5}v3`).join(''),
  // the outline plus every cut-out, drawn evenodd so the holes are actually holes
  plate:
    inner(0.6) +
    keys
      .map(
        (k) =>
          square(k.cx, k.cy, 7) +
          stabilisers(k)
            .map((x) => rr(x - 1.6, k.cy - 2.6, 3.2, 5.2, 0.4))
            .join(''),
      )
      .join(''),
  board: inner(0.6) + flexCuts,
  // one trace per row, in the gap above the next one
  traces: [1, 2, 3, 4, 5, 6]
    .map((row) => `M${RIM + 1} ${RIM + row * U - 0.9}H${W - RIM - 1}`)
    .join(''),
  // MX pins sit at (-3.81, -2.54) and (2.54, -5.08) mm from the centre, roughly this in units
  pins: keys
    .map((k) => circle(k.cx - 2, k.cy - 1.33, 0.75) + circle(k.cx + 1.33, k.cy - 2.67, 0.75))
    .join(''),
  holes: keys.map((k) => circle(k.cx, k.cy, 1)).join(''),
  rim: rr(0, 0, W, H, 0.6) + rr(RIM, RIM, W - 2 * RIM, H - 2 * RIM, 0.5),
}

export const gasketStrips = [
  { x: 10, y: 4, w: W - 20, h: 2.4 },
  { x: 10, y: H - 6.4, w: W - 20, h: 2.4 },
]

// the controller sits under the space bar, the USB-C port hangs over the back edge
export const chip = { x: 52, y: 54.5, w: 6, h: 6, t: 1 }
export const usb = { x: 78, y: 1.5, w: 10, h: 3, t: 1.5 }
