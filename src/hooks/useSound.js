import { useSyncExternalStore } from 'react'
import { sound } from '../lib/sound'

const serverSnapshot = () => false

export function useSound() {
  return useSyncExternalStore(sound.subscribe, sound.isOn, serverSnapshot)
}
