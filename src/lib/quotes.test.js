import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchQuotes, plainPunctuation, tidy } from './quotes'

afterEach(() => vi.unstubAllGlobals())

const respond = (body, ok = true) =>
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({ ok, status: ok ? 200 : 503, json: async () => body })),
  )

describe('tidy', () => {
  it('turns curly quotes and dashes into ones you can type', () => {
    expect(tidy('“It’s fine” — she said…')).toBe('"It\'s fine" - she said...')
  })
})

describe('plainPunctuation', () => {
  it('undoes what phone keyboards do to typed text, without touching spacing', () => {
    expect(plainPunctuation('don’t  “stop”—now\u00a0')).toBe('don\'t  "stop"-now ')
  })
})

describe('fetchQuotes', () => {
  it('keeps quotes that are a good length and easy to type', async () => {
    respond({
      quotes: [
        { quote: 'Too short.', author: 'A' },
        {
          quote:
            'Simplicity is the soul of efficiency, and it is also the soul of a good keyboard.',
          author: 'B',
        },
        {
          quote:
            'Ünïcödé everywhere makes for a miserable typing test, sadly for everyone involved.',
          author: 'C',
        },
        { quote: 'x'.repeat(200), author: 'D' },
        {
          quote: "I Have Not Failed. I'Ve Just Found Ten Thousand Ways That Won'T Work.",
          author: 'E',
        },
      ],
    })
    const quotes = await fetchQuotes()
    expect(quotes.map((q) => q.author)).toEqual(['B'])
    expect(fetch.mock.calls[0][0]).toMatch(
      /dummyjson\.com\/quotes\?limit=50&skip=\d+&select=quote,author/,
    )
  })

  it('fails loudly so the caller can fall back', async () => {
    respond({}, false)
    await expect(fetchQuotes()).rejects.toThrow(/503/)
    respond({ quotes: [{ quote: 'Nope.', author: 'A' }] })
    await expect(fetchQuotes()).rejects.toThrow(/No short quotes/)
  })
})
