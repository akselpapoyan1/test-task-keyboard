import { barsFor } from '../../lib/barcode'

export default function Barcode({ value, className }) {
  const { bars, width } = barsFor(value)
  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} 40`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {bars.map((bar) => (
        <rect key={bar.x} x={bar.x} width={bar.width} height="40" />
      ))}
    </svg>
  )
}
