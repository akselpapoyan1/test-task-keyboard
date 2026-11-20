import { memo } from 'react'
import { layers } from '../../data/content'
import {
  capLips,
  capSlices,
  chip,
  DEPTH,
  gasketStrips,
  H,
  INNER,
  KINDS,
  paths,
  RIM,
  switchSlices,
  usb,
  W,
  WALL,
} from './geometry'
import styles from './Exploded.module.css'

// a flat SVG layer floating z units above its part
function Plane({ z = 0, className, style, children }) {
  return (
    <svg
      className={className ? `${styles.plane} ${className}` : styles.plane}
      viewBox={`0 0 ${W} ${H}`}
      style={{ '--z': z, ...style }}
    >
      {children}
    </svg>
  )
}

// A solid block: its top at z and the two sides you can see from here hanging t below it.
// `surface` is drawn on top, in the same units as everything else.
function Block({ x = 0, y = 0, w = W, h = H, z = 0, t, className, surface }) {
  return (
    <div
      className={`${styles.block} ${className}`}
      style={{ '--x': x, '--y': y, '--w': w, '--h': h, '--z': z, '--t': t }}
    >
      {surface && (
        <svg className={styles.plane} viewBox={`${x} ${y} ${w} ${h}`}>
          {surface}
        </svg>
      )}
      <span className={styles.front} />
      <span className={styles.left} />
    </div>
  )
}

const parts = {
  case: () => (
    <>
      <span className={styles.shadow} />
      <span className={styles.floor} />
      <Block
        z={WALL}
        t={WALL}
        className={styles.shell}
        surface={<path d={paths.rim} fillRule="evenodd" />}
      />
      {/* the back and right walls, seen from the inside over the rim */}
      <Block x={RIM} w={W - 2 * RIM} h={RIM} z={WALL} t={WALL} className={styles.wall} />
      <Block
        x={W - RIM}
        y={RIM}
        w={RIM}
        h={H - 2 * RIM}
        z={WALL}
        t={WALL}
        className={styles.wall}
      />
    </>
  ),
  pcb: () => (
    <>
      <Block
        {...INNER}
        t={0.8}
        className={styles.pcb}
        surface={
          <>
            <path d={paths.board} fillRule="evenodd" className={styles.board} />
            <path d={paths.traces} className={styles.trace} />
            <path d={paths.holes} className={styles.hole} />
            <path d={paths.pins} className={styles.pin} />
          </>
        }
      />
      <Block {...chip} z={chip.t} className={styles.chip} />
      <Block {...usb} z={usb.t} className={styles.usb} />
    </>
  ),
  gasket: () =>
    gasketStrips.map((strip) => <Block key={strip.y} {...strip} t={1.4} className={styles.foam} />),
  plate: () => (
    <Block
      {...INNER}
      t={0.9}
      className={styles.plate}
      surface={<path d={paths.plate} fillRule="evenodd" />}
    />
  ),
  switches: () =>
    switchSlices.map(([part, z, shade]) => (
      <Plane key={z} z={z} style={{ '--shade': `${shade}%` }}>
        <path d={paths[part]} className={styles[part]} />
      </Plane>
    )),
  caps: () =>
    capSlices.map((slice) => (
      <Plane
        key={slice.z}
        z={slice.z}
        className={slice.top ? styles.capTop : undefined}
        style={{ '--shade': slice.shade }}
      >
        {KINDS.map((kind) => (
          <path key={kind} d={slice.byKind[kind]} className={styles.cap} data-kind={kind} />
        ))}
        {slice.top && <path d={capLips} className={styles.lip} />}
      </Plane>
    )),
}

// The keyboard taken apart in plain CSS 3D: SVG for the flat faces, CSS boxes for the sides.
// It's drawn apart to begin with, so it still makes sense if the animation never runs.
function Exploded() {
  return (
    <div className={styles.orbit} data-orbit>
      <div className={styles.stack} data-stack>
        {[...layers].reverse().map((layer) => (
          <div
            key={layer.id}
            className={styles.layer}
            data-layer={layer.id}
            style={{ '--z': DEPTH[layer.id].lift }}
          >
            {parts[layer.id]()}
            <span className={styles.tag} data-tag>
              {layers.indexOf(layer) + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default memo(Exploded)
