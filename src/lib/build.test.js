import { describe, expect, it } from 'vitest'
import { buildPrice, buildReducer, describeBuild, initialBuild, restoreBuild } from './build'

describe('buildReducer', () => {
  it('swaps the colourway and the switch', () => {
    let build = buildReducer(initialBuild, { type: 'colorway', id: 'matcha' })
    build = buildReducer(build, { type: 'switch', id: 'cricket' })
    expect(build).toMatchObject({ colorway: 'matcha', switchId: 'cricket' })
  })

  it('toggles extras on and off', () => {
    const once = buildReducer(initialBuild, { type: 'extra', id: 'wristRest' })
    expect(once.extras).toEqual(['wristRest'])
    expect(buildReducer(once, { type: 'extra', id: 'wristRest' }).extras).toEqual([])
  })

  it('throws on actions it does not know', () => {
    expect(() => buildReducer(initialBuild, { type: 'nope' })).toThrow(/nope/)
  })
})

describe('restoreBuild', () => {
  it('keeps a saved build that makes sense', () => {
    const saved = { colorway: 'lavender', switchId: 'moss', extras: ['coiledCable'] }
    expect(restoreBuild(saved)).toEqual(saved)
  })

  it('throws out anything it does not recognise', () => {
    const junk = { colorway: 'neon', switchId: 42, extras: ['jetpack', 'sparePack'] }
    expect(restoreBuild(junk)).toEqual({ ...initialBuild, extras: ['sparePack'] })
    expect(restoreBuild(null)).toEqual(initialBuild)
  })
})

describe('price and summary', () => {
  it('adds extras to the base price', () => {
    expect(buildPrice(initialBuild)).toBe(189)
    expect(buildPrice({ ...initialBuild, extras: ['wristRest', 'coiledCable'] })).toBe(253)
  })

  it('describes a build in words', () => {
    const build = { colorway: 'grapefruit', switchId: 'pebble', extras: ['wristRest'] }
    expect(describeBuild(build)).toEqual({
      title: 'Indent 75 in Grapefruit',
      detail: 'Pebble switches, walnut wrist rest',
    })
  })
})
