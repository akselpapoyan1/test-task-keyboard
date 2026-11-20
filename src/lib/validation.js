const MESSAGES = {
  name: { valueMissing: 'Who’s it for? A name for the box, please.' },
  email: {
    valueMissing: 'We need an email to tell you when it ships.',
    typeMismatch: 'That email doesn’t look right. A typo maybe?',
  },
  country: { valueMissing: 'Where are we sending it?' },
}

// Uses the browser's own constraint validation and only swaps in friendlier words.
export function errorFor(field) {
  const { validity, name } = field
  if (validity.valid) return null
  for (const reason of ['valueMissing', 'typeMismatch']) {
    if (validity[reason]) return MESSAGES[name]?.[reason] ?? field.validationMessage
  }
  return field.validationMessage
}

export function validateForm(form) {
  const errors = {}
  for (const field of form.elements) {
    if (!field.name || !field.willValidate) continue
    const error = errorFor(field)
    if (error) errors[field.name] = error
  }
  return errors
}
