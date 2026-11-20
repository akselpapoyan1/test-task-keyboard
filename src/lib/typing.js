// Typing test maths. A "word" is five characters, the usual convention.
export function wordsPerMinute(correctChars, elapsedMs) {
  if (elapsedMs < 1000) return 0
  return Math.round(correctChars / 5 / (elapsedMs / 60000))
}

export function accuracy(keystrokes, mistakes) {
  if (!keystrokes) return 100
  return Math.max(0, Math.round(((keystrokes - mistakes) / keystrokes) * 100))
}

// How each character of the target is doing: typed right, typed wrong, or still to come.
export function compare(target, typed) {
  let correct = 0
  const states = [...target].map((char, i) => {
    if (i >= typed.length) return 'pending'
    if (typed[i] === char) {
      correct++
      return 'correct'
    }
    return 'wrong'
  })
  return { states, correct, done: typed.length >= target.length }
}

// Which switch to suggest, going by how fast someone types.
export function recommendSwitch(wpm) {
  if (wpm < 35)
    return { id: 'moss', line: 'Unhurried and steady. Moss would suit you, smooth and quiet.' }
  if (wpm < 65)
    return {
      id: 'pebble',
      line: 'Right in the comfortable middle. Pebble’s bump keeps you honest.',
    }
  if (wpm < 95)
    return { id: 'cricket', line: 'Quick. Cricket would make it sound as fast as it is.' }
  return { id: 'cricket', line: 'Okay, show-off. Cricket, obviously.' }
}
