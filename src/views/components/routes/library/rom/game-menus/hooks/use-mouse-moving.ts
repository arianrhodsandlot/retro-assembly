import delay from 'delay'
import { useEffect, useRef, useState } from 'react'

export function useMouseMoving({ timeout }: { timeout: number }) {
  const abortControllerRef = useRef<AbortController>()
  const [isMouseMoving, setIsMouseMoving] = useState(false)

  useEffect(() => {
    async function onMouseMove() {
      abortControllerRef.current?.abort()
      setIsMouseMoving(true)

      const abortController = new AbortController()
      abortControllerRef.current = abortController
      try {
        await delay(timeout, { signal: abortController.signal })
        setIsMouseMoving(false)
      } catch {}
    }

    document.body.addEventListener('mousemove', onMouseMove, false)

    return () => {
      document.body.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return { isMouseMoving }
}
