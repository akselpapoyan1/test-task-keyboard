# Indent 75

A landing page for Indent 75, a made-up 75% mechanical keyboard. You can type on it.

## Running it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # client build + prerender, output in dist/
npm run preview    # serve the production build
npm test           # vitest
npm run lint       # oxlint
```

Needs Node 20 or newer.

## Stack

- React 19 with Vite, plain JavaScript
- CSS Modules and CSS custom properties, no UI kit and no CSS framework
- GSAP (ScrollTrigger, SplitText, DrawSVG) and Lenis for animation and scrolling
- The Web Audio API for the switch sounds
- DummyJSON for the typing test quotes (free, no key)
- Vitest and Testing Library for tests

## How it's put together

```
src/
  components/   Keyboard, KeycapToggle, Button, SectionHeading, Accordion...
  sections/     one folder per page section, each with its own CSS module
  hooks/        build state, sound, theme, smooth scroll, real key presses
  lib/          plain logic: sound engine, key event bus, build store, typing maths, quotes
  data/         the keyboard layout, products and all the copy
  styles/       tokens, both themes and the four colourways
scripts/
  prerender.js  renders the page to static HTML after the build and preloads the fonts
```

## Things worth knowing

**The keyboard is CSS.**

- All 84 keys of a 75% layout are drawn with CSS, no images.
- Everything is sized in key units derived from container query units, so the same component works as the hero, the configurator preview and the small one in the typing test.
- Real key presses light up the matching keycap. `KeyboardEvent.code` goes into a tiny event bus that every keyboard listens to.
- Phone keyboards don't send usable key events, so the text fields map the typed character back to its key instead.

**Sound.**

- Nothing is a recording. Each switch is a few milliseconds of filtered noise plus a short falling sine, put together with the Web Audio API.
- There's a slightly random pitch on every press, and longer keys (space, shift, enter) sound lower.
- It's off until you turn it on, apart from the "hold" buttons, whose whole point is the sound.

**Colourways.**

- Each colourway is a set of CSS custom properties under `[data-colorway]`. One attribute on `<html>` recolours the keyboards and the accent across the page.
- The swatches use the same variables, because anything with the attribute picks them up.
- The colour wash across the keys is just a `transition-delay` worked out from each key's position.
- An inline script in `index.html` puts back a saved colourway before the first paint, so there's no flash.

**State.** The build (colourway, switch, extras) lives in a small external store read with `useSyncExternalStore`, so any section can use it without a provider: the configurator, the switch cards, the typing test, the reservation form and the key sounds. It's saved to localStorage and checked when it's read back. Its server snapshot is the default build, so the prerendered HTML hydrates without mismatches.

**API.**

- The typing test pulls a random page of quotes from DummyJSON, and only when the section is about to come on screen.
- It keeps quotes of a sensible length that can be typed on a normal keyboard.
- It also drops the ones written In Title Case Like This, which turned out to be about half of that dataset.
- If the service can't be reached, it falls back to pangrams.
- Words per minute and accuracy are worked out in `lib/typing.js`, and at the end the test suggests a switch for how you type.

**Exploded view.** Plain CSS 3D, no WebGL and no extra packages.

- Every part is a solid block. The top is SVG and the two sides you can see are CSS faces folded down with `rotateX(-90deg)` and `rotateY(-90deg)`. The case is a tray you can see into, and the holes in the plate are real holes.
- Keycaps are five SVG slices, each a bit smaller than the one below, which gives them a sloped skirt. The switches are stacked the same way. Each slice is one path for all 84 keys, so the page stays at about 1,300 elements.
- All of it is measured in one unit, `--su` (a tenth of a key), so the SVG, the CSS and the animation always line up. GSAP tweens custom properties (`--z` for each part, `--tilt` and `--spin` for the board) instead of transforms, because its own rotation order would tip the board back before turning it.
- On wide screens that are tall enough for the whole section, it pins and scrubs. Everywhere else it comes apart as it scrolls to the middle of the screen. With a mouse it leans a few degrees towards the pointer.

**Motion.** Everything goes through `gsap.matchMedia()`. With reduced motion there's no smooth scrolling, no typing intro and no pinning, and the exploded view is simply drawn apart.

**SEO.** The build renders the page to HTML (`scripts/prerender.js`), so crawlers and link previews get the content. It also adds `<link rel="preload">` for the two fonts the first screen needs, which removed the layout shift from the font swap. Meta, Open Graph and canonical tags are in `index.html`, JSON-LD for the FAQ comes from the same data as the page, and `robots.txt` and `sitemap.xml` are generated from `VITE_SITE_URL` in `.env`.

**Performance.** Lighthouse on my machine: desktop 100 / 100 / 100 / 100. Mobile is 100 for accessibility, best practices and SEO, 80 to 89 for performance, and layout shift is 0.

**Accessibility.**

- The drawn keyboards are `aria-hidden`. Everything they do is also possible with real controls: a text field to type in, buttons to hear each switch, radios and checkboxes for the build.
- Keyboard navigation works everywhere. The menu traps focus, closes on Escape and gives focus back.
- Colours pass WCAG AA in both themes and all four colourways. axe-core reports no violations.

## Credits

Fonts: Archivo and Martian Mono. Quotes from DummyJSON.

Indent, the keyboard, its prices and batch 02 are all made up.
