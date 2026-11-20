import { useSyncExternalStore } from 'react'
import { buildStore } from '../lib/buildStore'

export function useBuild() {
  const build = useSyncExternalStore(
    buildStore.subscribe,
    buildStore.getSnapshot,
    buildStore.getServerSnapshot,
  )
  return [build, buildStore.dispatch]
}
