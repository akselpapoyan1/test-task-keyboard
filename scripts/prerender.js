// Runs after both builds. Renders the app to HTML once, so search engines and
// link previews get real content instead of an empty <div id="root">.
import { readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { loadEnv } from 'vite'

const { VITE_SITE_URL = '' } = loadEnv('production', process.cwd(), 'VITE_')
const siteUrl = VITE_SITE_URL.replace(/\/$/, '')
const { render } = await import('../dist-ssr/entry-server.js')

// The two fonts the first screen needs. Preloading them means they're usually there
// before the first paint, so the headline doesn't reflow (and push the keyboard down) later.
const fonts = (await readdir('dist/assets')).filter((file) =>
  /^(archivo-latin-wdth-normal|martian-mono-latin-wght-normal)-.*\.woff2$/.test(file),
)
const preloads = fonts
  .map(
    (file) => `<link rel="preload" href="/assets/${file}" as="font" type="font/woff2" crossorigin>`,
  )
  .join('\n    ')

const template = await readFile('dist/index.html', 'utf8')
await writeFile(
  'dist/index.html',
  template.replace('</title>', `</title>\n    ${preloads}`).replace('<!--app-html-->', render()),
)

await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`)
await writeFile(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${siteUrl}/</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod></url>
</urlset>
`,
)

await rm('dist-ssr', { recursive: true, force: true })
console.log('prerendered dist/index.html, wrote robots.txt and sitemap.xml')
