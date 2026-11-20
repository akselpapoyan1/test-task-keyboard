import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    assetsInlineLimit: 0,
  },
  ssr: {
    // gsap and lenis ship ESM without "type": "module", Node can't load them as externals
    noExternal: ['gsap', '@gsap/react', 'lenis'],
  },
  test: {
    environment: 'jsdom',
  },
})
