import { describe, expect, it } from 'vitest'
import { accuracy, compare, recommendSwitch, wordsPerMinute } from './typing'

describe('wordsPerMinute', () => {
  it('counts five characters as a word', () => {
    // 300 correct characters in a minute is 60 words
    expect(wordsPerMinute(300, 60000)).toBe(60)
    expect(wordsPerMinute(50, 10000)).toBe(60)
  })

  it('does not show silly numbers in the first second', () => {
    expect(wordsPerMinute(3, 200)).toBe(0)
  })
})

describe('accuracy', () => {
  it('is the share of keystrokes that were right', () => {
    expect(accuracy(100, 3)).toBe(97)
    expect(accuracy(0, 0)).toBe(100)
  })
})

describe('compare', () => {
  it('marks each character as correct, wrong or still to come', () => {
    const { states, correct, done } = compare('cat', 'cu')
    expect(states).toEqual(['correct', 'wrong', 'pending'])
    expect(correct).toBe(1)
    expect(done).toBe(false)
    expect(compare('cat', 'cat').done).toBe(true)
  })
})

describe('recommendSwitch', () => {
  it('suggests a quieter switch for slower typists', () => {
    expect(recommendSwitch(28).id).toBe('moss')
    expect(recommendSwitch(50).id).toBe('pebble')
    expect(recommendSwitch(80).id).toBe('cricket')
    expect(recommendSwitch(120).line).toMatch(/show-off/)
  })
})
