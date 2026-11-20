import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import Accordion from './Accordion'

describe('Accordion', () => {
  it('opens and closes, and tells assistive tech about it', () => {
    render(
      <Accordion question="Tabs or spaces?">
        <p>Yes.</p>
      </Accordion>,
    )

    const button = screen.getByRole('button', { name: 'Tabs or spaces?' })
    const panel = document.getElementById(button.getAttribute('aria-controls'))

    expect(button.getAttribute('aria-expanded')).toBe('false')
    expect(panel.textContent).toBe('Yes.')

    fireEvent.click(button)
    expect(button.getAttribute('aria-expanded')).toBe('true')

    fireEvent.click(button)
    expect(button.getAttribute('aria-expanded')).toBe('false')
  })
})
