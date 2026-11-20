import { describe, expect, it } from 'vitest'
import { barsFor } from './barcode'

describe('barsFor', () => {
  it('draws the same bars for the same number and different ones otherwise', () => {
    expect(barsFor('IND-02-0417')).toEqual(barsFor('IND-02-0417'))
    expect(barsFor('IND-02-0417')).not.toEqual(barsFor('IND-02-0418'))
  })

  it('keeps every bar inside the drawing', () => {
    const { bars, width } = barsFor('IND-02-9999')
    for (const bar of bars) expect(bar.x + bar.width).toBeLessThanOrEqual(width)
  })
})
