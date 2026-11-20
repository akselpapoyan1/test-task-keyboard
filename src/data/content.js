// From the top of the keyboard down, as they come apart in the exploded view.
export const layers = [
  {
    id: 'caps',
    name: 'Keycaps',
    text: 'PBT, dye-sublimated, 1.5 mm thick. They won’t go shiny and they don’t sound hollow.',
  },
  {
    id: 'switches',
    name: 'Switches',
    text: 'Hot-swap sockets. Every switch is lubed by hand, which takes us an afternoon per batch.',
  },
  {
    id: 'plate',
    name: 'Plate',
    text: 'FR4, a fibreglass board. It flexes about a millimetre when you lean on it, on purpose.',
  },
  {
    id: 'gasket',
    name: 'Gaskets',
    text: 'Poron strips hold the plate. No screw touches it, so the case doesn’t ring.',
  },
  {
    id: 'pcb',
    name: 'PCB',
    text: '1.2 mm with flex cuts between the columns. Runs QMK and VIA, remap anything.',
  },
  {
    id: 'case',
    name: 'Case',
    text: 'CNC-milled aluminium, bead-blasted. 1.6 kg, so it stays put.',
  },
]

export const specs = [
  ['Layout', '75%, 84 keys, ANSI'],
  ['Case', '6063 aluminium, bead-blasted'],
  ['Mount', 'Gasket, Poron strips'],
  ['Plate', 'FR4'],
  ['Switches', 'Moss, Pebble or Cricket, hot-swap'],
  ['Keycaps', 'PBT, dye-sub, Cherry profile'],
  ['Typing angle', '6.5°'],
  ['Front height', '19 mm'],
  ['Size', '317 × 132 × 34 mm'],
  ['Weight', '1.6 kg built'],
  ['Connection', 'USB-C, 1000 Hz polling'],
  ['Firmware', 'QMK and VIA'],
]

export const inTheBox = [
  'The keyboard, built',
  'Braided USB-C cable',
  'Keycap and switch puller',
  'Four spare switches',
]

export const faq = [
  {
    q: 'Tabs or spaces?',
    a: 'Yes. The Tab key is the one in your accent colour, so draw your own conclusions.',
  },
  {
    q: 'Does it work with a Mac?',
    a: 'It comes with both Mac and Windows modifiers in the box, and Fn + M or Fn + W switches the layout over.',
  },
  {
    q: 'Can I change the switches later?',
    a: 'Any 3-pin or 5-pin MX-style switch goes in, no soldering. The puller is in the box.',
  },
  {
    q: 'Why no wireless?',
    a: 'One cable, no batteries, no pairing, no lag. We’d rather spend the money on the case.',
  },
  {
    q: 'How loud is Cricket, really?',
    a: 'Loud enough that we only recommend it if you work alone or your colleagues already like you a lot.',
  },
  {
    q: 'When do I pay?',
    a: 'When your keyboard ships, not before. A reservation just holds your spot in batch 02.',
  },
]

// Used when the quotes API can't be reached. Pangrams, so every key gets a turn.
export const pangrams = [
  { text: 'Pack my box with five dozen liquor jugs.', author: 'Pangram' },
  { text: 'The five boxing wizards jump quickly.', author: 'Pangram' },
  { text: 'Sphinx of black quartz, judge my vow.', author: 'Pangram' },
  { text: 'How vexingly quick daft zebras jump!', author: 'Pangram' },
]
