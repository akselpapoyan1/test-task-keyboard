import { describe, expect, it } from 'vitest'
import { errorFor, validateForm } from './validation'

function makeForm(html) {
  const form = document.createElement('form')
  form.innerHTML = html
  return form
}

describe('form validation', () => {
  it('asks for every required field in plain words', () => {
    const form = makeForm(`
      <input name="name" required>
      <input name="email" type="email" required>
      <input name="country" required>
    `)
    expect(validateForm(form)).toEqual({
      name: 'Who’s it for? A name for the box, please.',
      email: 'We need an email to tell you when it ships.',
      country: 'Where are we sending it?',
    })
  })

  it('catches a broken email address', () => {
    const form = makeForm('<input name="email" type="email" required value="sam@">')
    expect(errorFor(form.elements.email)).toMatch(/doesn’t look right/)
  })

  it('returns nothing when everything is filled in', () => {
    const form = makeForm(`
      <input name="name" required value="Sam">
      <input name="email" type="email" required value="sam@example.com">
      <input name="country" required value="Portugal">
    `)
    expect(validateForm(form)).toEqual({})
  })
})
