// The colours themselves live in global.css under [data-colorway], these are the names.
export const colorways = [
  { id: 'highlighter', name: 'Highlighter', note: 'Grey with yellow accents' },
  { id: 'grapefruit', name: 'Grapefruit', note: 'Black case, coral accents' },
  { id: 'matcha', name: 'Matcha', note: 'Cream case, two greens' },
  { id: 'lavender', name: 'Lavender', note: 'Anodised lilac, slate mods' },
]

// Force curves are [travel in mm, force in grams] along the downstroke.
export const switches = [
  {
    id: 'moss',
    name: 'Moss',
    type: 'Linear',
    stem: '#6f8f4e',
    text: 'Smooth all the way down, with a low, round thock. For people who type late at night.',
    specs: [
      ['Actuation', '45 g'],
      ['Bottom out', '62 g'],
      ['Pre-travel', '2.0 mm'],
      ['Total travel', '4.0 mm'],
    ],
    actuation: 2,
    curve: [
      [0, 30],
      [3.9, 61],
      [4, 62],
      [4.04, 85],
    ],
  },
  {
    id: 'pebble',
    name: 'Pebble',
    type: 'Tactile',
    stem: '#b38b5d',
    text: 'A small bump right where the key fires. Quiet enough for an office, honest enough for writing.',
    specs: [
      ['Bump', '58 g'],
      ['Bottom out', '63 g'],
      ['Pre-travel', '2.0 mm'],
      ['Total travel', '4.0 mm'],
    ],
    actuation: 2,
    curve: [
      [0, 30],
      [0.35, 50],
      [0.7, 58],
      [1.25, 42],
      [2, 46],
      [3.9, 62],
      [4, 63],
      [4.04, 85],
    ],
  },
  {
    id: 'cricket',
    name: 'Cricket',
    type: 'Clicky',
    stem: '#4f8fd6',
    text: 'A crisp click on the way down and another on the way up. Not for open offices. Ask us how we know.',
    specs: [
      ['Click', '60 g'],
      ['Bottom out', '65 g'],
      ['Pre-travel', '1.8 mm'],
      ['Total travel', '4.0 mm'],
    ],
    actuation: 1.8,
    curve: [
      [0, 30],
      [1.55, 60],
      [1.7, 37],
      [2.2, 47],
      [3.9, 64],
      [4, 65],
      [4.04, 85],
    ],
  },
]

export const BASE_PRICE = 189

export const extras = [
  { id: 'wristRest', name: 'Walnut wrist rest', price: 39 },
  { id: 'coiledCable', name: 'Coiled cable', price: 25 },
  { id: 'sparePack', name: 'Ten spare switches', price: 12 },
]
