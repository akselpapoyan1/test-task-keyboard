import { BASE_PRICE, colorways, extras, switches } from '../data/products'

export const initialBuild = {
  colorway: 'highlighter',
  switchId: 'pebble',
  extras: [],
}

const exists = (list, id) => list.some((item) => item.id === id)

// Saved builds come from localStorage, so anything in there gets checked first.
export function restoreBuild(saved) {
  if (!saved || typeof saved !== 'object') return initialBuild
  return {
    colorway: exists(colorways, saved.colorway) ? saved.colorway : initialBuild.colorway,
    switchId: exists(switches, saved.switchId) ? saved.switchId : initialBuild.switchId,
    extras: Array.isArray(saved.extras) ? saved.extras.filter((id) => exists(extras, id)) : [],
  }
}

export function buildReducer(build, action) {
  switch (action.type) {
    case 'colorway':
      return { ...build, colorway: action.id }
    case 'switch':
      return { ...build, switchId: action.id }
    case 'extra':
      return {
        ...build,
        extras: build.extras.includes(action.id)
          ? build.extras.filter((id) => id !== action.id)
          : [...build.extras, action.id],
      }
    case 'restore':
      return restoreBuild(action.saved)
    default:
      throw new Error(`Unknown build action: ${action.type}`)
  }
}

export function buildPrice(build) {
  return extras
    .filter((extra) => build.extras.includes(extra.id))
    .reduce((sum, extra) => sum + extra.price, BASE_PRICE)
}

export function describeBuild(build) {
  const colorway = colorways.find((c) => c.id === build.colorway)
  const switchType = switches.find((s) => s.id === build.switchId)
  const added = extras.filter((e) => build.extras.includes(e.id)).map((e) => e.name.toLowerCase())
  return {
    title: `Indent 75 in ${colorway.name}`,
    detail: [`${switchType.name} switches`, ...added].join(', '),
  }
}

export const reservationNumber = () =>
  `IND-02-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`
