import { describe, expect, it } from 'vitest'
import { allKeys, codeForChar, isBigKey, rows } from './layout'

describe('the 75% layout', () => {
  it('has 84 keys and every row is exactly 16 units wide', () => {
    expect(allKeys).toHaveLength(84)
    for (const row of rows) {
      expect(row.reduce((sum, key) => sum + key.w, 0)).toBe(16)
    }
  })

  it('never uses the same key code twice', () => {
    const codes = allKeys.map((key) => key.code)
    expect(new Set(codes).size).toBe(codes.length)
  })

  it('finds the key behind a typed character, shifted or not', () => {
    expect(codeForChar('a')).toBe('KeyA')
    expect(codeForChar('A')).toBe('KeyA')
    expect(codeForChar('!')).toBe('Digit1')
    expect(codeForChar('?')).toBe('Slash')
    expect(codeForChar(' ')).toBe('Space')
    expect(codeForChar('é')).toBeNull()
  })

  it('knows which keys are long enough for stabilisers', () => {
    expect(isBigKey('Space')).toBe(true)
    expect(isBigKey('Backspace')).toBe(true)
    expect(isBigKey('KeyQ')).toBe(false)
  })
})
