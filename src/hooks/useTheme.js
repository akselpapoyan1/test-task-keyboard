import { useSyncExternalStore } from 'react'

// The inline script in index.html sets data-theme before React loads,
// so the <html> attribute is the source of truth.
const listeners = new Set()

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const getTheme = () => (document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')

// the prerendered HTML is always built in light mode
const getServerTheme = () => 'light'

export function setTheme(theme) {
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem('theme', theme)
  } catch {
    // private mode or storage disabled, the theme just won't stick
  }
  listeners.forEach((listener) => listener())
}

export function useTheme() {
  return useSyncExternalStore(subscribe, getTheme, getServerTheme)
}
