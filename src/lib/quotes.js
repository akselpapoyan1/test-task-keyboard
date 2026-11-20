const API = 'https://dummyjson.com/quotes'

// Curly quotes and long dashes are hard to type, so they become their plain versions.
// Phone keyboards put them back as you type, so the typing test runs its input through this too.
export const plainPunctuation = (text) =>
  text
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-')
    .replace(/…/g, '...')
    .replace(/\u00a0/g, ' ')

export const tidy = (text) => plainPunctuation(text).replace(/\s+/g, ' ').trim()

// About half of this dataset is Written Like This, Don'T Ask Why. Miserable to type.
export function isTitleCased(text) {
  const words = text.split(' ').filter((word) => /^[a-z]/i.test(word))
  return (
    /'[A-Z]/.test(text) || words.filter((word) => /^[A-Z]/.test(word)).length / words.length > 0.6
  )
}

// Grabs a random page of quotes and keeps the ones that make a good 20-second test.
export async function fetchQuotes({ signal } = {}) {
  const skip = Math.floor(Math.random() * 1400)
  const res = await fetch(`${API}?limit=50&skip=${skip}&select=quote,author`, { signal })
  if (!res.ok) throw new Error(`DummyJSON answered ${res.status}`)
  const { quotes = [] } = await res.json()
  const usable = quotes
    .map((q) => ({ text: tidy(q.quote), author: q.author }))
    .filter((q) => q.text.length >= 50 && q.text.length <= 140)
    .filter((q) => /^[\x20-\x7e]+$/.test(q.text) && !isTitleCased(q.text))
  if (!usable.length) throw new Error('No short quotes on this page')
  return usable
}
