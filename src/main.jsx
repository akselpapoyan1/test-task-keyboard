import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource-variable/archivo/wdth.css'
import '@fontsource-variable/martian-mono/wght.css'
import 'lenis/dist/lenis.css'
import './styles/global.css'
import App from './App.jsx'

const root = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// the production build ships prerendered HTML (see scripts/prerender.js), dev doesn't
if (root.firstElementChild) hydrateRoot(root, app)
else createRoot(root).render(app)
