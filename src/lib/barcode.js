// Not a real symbology, just bars that come from the reservation number,
// so every label gets its own pattern and the same number always looks the same.
export function barsFor(value) {
  const bars = []
  let x = 0
  for (const char of value) {
    const code = char.charCodeAt(0)
    for (let bit = 0; bit < 4; bit++) {
      const width = 1 + ((code >> bit) & 1) + ((code >> (bit + 3)) & 1)
      if (bit % 2 === 0) bars.push({ x, width })
      x += width + 1
    }
  }
  return { bars, width: x }
}
