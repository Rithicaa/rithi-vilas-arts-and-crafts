import { useEffect } from 'react'

const FRAMES = [1, 2, 3, 4, 5, 6, 7, 8, 7, 6, 5, 4, 3, 2]
const INTERVAL = 80 // ms per frame

export function useAnimatedCursor() {
  useEffect(() => {
    let frame = 0
    const el = document.documentElement

    const tick = () => {
      el.style.cursor = `url('/cursor_${FRAMES[frame]}_sm.png') 20 20, auto`
      frame = (frame + 1) % FRAMES.length
    }

    tick()
    const id = setInterval(tick, INTERVAL)
    return () => {
      clearInterval(id)
      el.style.cursor = ''
    }
  }, [])
}
