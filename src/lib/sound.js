// Switch sounds made from scratch with the Web Audio API: filtered noise for the
// clack, a short falling sine for the thock. No audio files to download.
let ctx = null
let master = null
let noise = null
let enabled = false
const listeners = new Set()

function setup() {
  ctx = new AudioContext()
  master = ctx.createGain()
  master.gain.value = 0.55
  // fast typing stacks up voices, the compressor keeps that from clipping
  const compressor = ctx.createDynamicsCompressor()
  master.connect(compressor).connect(ctx.destination)

  noise = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate)
  const data = noise.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
}

function envelope(t, peak, decay) {
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(peak, t + 0.002)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + decay)
  return gain
}

function burst(t, { type = 'bandpass', freq, q = 1, gain, decay }) {
  const source = ctx.createBufferSource()
  source.buffer = noise
  const filter = ctx.createBiquadFilter()
  filter.type = type
  filter.frequency.value = freq
  filter.Q.value = q
  source
    .connect(filter)
    .connect(envelope(t, gain, decay))
    .connect(master)
  // start somewhere random in the noise so no two keys sound exactly alike
  source.start(t, Math.random() * 0.2)
  source.stop(t + decay + 0.02)
}

function thump(t, { from, to, gain, decay }) {
  const osc = ctx.createOscillator()
  osc.frequency.setValueAtTime(from, t)
  osc.frequency.exponentialRampToValueAtTime(to, t + decay)
  osc.connect(envelope(t, gain, decay)).connect(master)
  osc.start(t)
  osc.stop(t + decay + 0.02)
}

const voices = {
  moss: {
    down(t, p, big) {
      thump(t, { from: 170 * p, to: 70 * p, gain: 0.5, decay: big ? 0.09 : 0.06 })
      burst(t, { freq: 430 * p, q: 1.4, gain: 0.45, decay: big ? 0.07 : 0.045 })
    },
    up(t, p) {
      burst(t, { freq: 950 * p, q: 1.2, gain: 0.1, decay: 0.025 })
    },
  },
  pebble: {
    down(t, p, big) {
      // the bump comes first, then the bottom-out
      burst(t, { type: 'highpass', freq: 2300 * p, q: 0.7, gain: 0.1, decay: 0.008 })
      thump(t + 0.014, { from: 210 * p, to: 85 * p, gain: 0.38, decay: big ? 0.08 : 0.05 })
      burst(t + 0.014, { freq: 600 * p, q: 1.3, gain: 0.38, decay: big ? 0.06 : 0.04 })
    },
    up(t, p) {
      burst(t, { freq: 1100 * p, q: 1.2, gain: 0.09, decay: 0.022 })
    },
  },
  cricket: {
    down(t, p, big) {
      burst(t, { type: 'highpass', freq: 3800 * p, q: 0.8, gain: 0.42, decay: 0.012 })
      burst(t + 0.018, { freq: 760 * p, q: 1.2, gain: 0.28, decay: big ? 0.05 : 0.035 })
      thump(t + 0.018, { from: 240 * p, to: 110 * p, gain: 0.22, decay: 0.04 })
    },
    up(t, p) {
      burst(t, { type: 'highpass', freq: 3400 * p, q: 0.8, gain: 0.28, decay: 0.01 })
    },
  },
}

function notify() {
  listeners.forEach((listener) => listener())
}

export const sound = {
  subscribe(listener) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  isOn: () => enabled,
  set(on) {
    enabled = on
    if (on) {
      if (!ctx) setup()
      ctx.resume()
    }
    notify()
  },
  // `force` is for buttons whose whole job is making a sound
  play(switchId, { up = false, big = false, force = false } = {}) {
    if (!enabled && !force) return
    if (!ctx) setup()
    if (ctx.state === 'suspended') ctx.resume()
    const voice = voices[switchId] ?? voices.pebble
    // a few percent of random pitch, big keys a fair bit lower
    const pitch = (big ? 0.72 : 1) * (0.94 + Math.random() * 0.12)
    voice[up ? 'up' : 'down'](ctx.currentTime, pitch, big)
  },
}
