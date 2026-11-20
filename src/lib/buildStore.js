import { buildReducer, initialBuild, restoreBuild } from './build'

// The build lives outside React so the configurator, the typing test, the reservation
// form and the key sounds can all read it, and so it can be saved between visits.
const KEY = 'indent-build'
const listeners = new Set()
let state = null

function read() {
  if (state) return state
  try {
    state = restoreBuild(JSON.parse(localStorage.getItem(KEY)))
  } catch {
    state = initialBuild
  }
  return state
}

export const buildStore = {
  getSnapshot: read,
  // the prerendered HTML always shows the default build
  getServerSnapshot: () => initialBuild,
  subscribe(listener) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  dispatch(action) {
    state = buildReducer(read(), action)
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      // private mode, the build just won't be remembered
    }
    document.documentElement.dataset.colorway = state.colorway
    listeners.forEach((listener) => listener())
  },
}
