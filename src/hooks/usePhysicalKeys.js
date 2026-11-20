import { useEffect } from 'react'
import { markPhysical, pressKey } from '../lib/keys'
import { sound } from '../lib/sound'
import { buildStore } from '../lib/buildStore'
import { isBigKey } from '../data/layout'

// Whatever you type on your own keyboard shows up on ours, with the sound of your build.
export function usePhysicalKeys() {
  useEffect(() => {
    const held = new Set()
    const switchId = () => buildStore.getSnapshot().switchId

    const down = (event) => {
      // shortcuts aren't typing
      if (event.metaKey || event.ctrlKey || !event.code) return
      markPhysical()
      pressKey(event.code, true)
      if (event.repeat) return
      held.add(event.code)
      sound.play(switchId(), { big: isBigKey(event.code) })
    }
    const up = (event) => {
      pressKey(event.code, false)
      if (!held.delete(event.code)) return
      sound.play(switchId(), { up: true, big: isBigKey(event.code) })
    }
    // keys released while the window wasn't looking would stay pressed forever
    const letGo = () => {
      held.forEach((code) => pressKey(code, false))
      held.clear()
    }

    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', letGo)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', letGo)
    }
  }, [])
}
