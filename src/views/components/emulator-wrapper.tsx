import { useEffect, useRef, useState } from 'react'
import { Emulator } from '../../core'

const emulatorStyle: Partial<CSSStyleDeclaration> = {
  position: 'absolute',
  top: '0',
  left: '0',
  background: 'black',
  zIndex: '20',
}

export default function EmulatorWrapper({ rom, onExit }: { rom: File; onExit?: () => void }) {
  type LaunchStatus = 'initial' | 'pending' | 'complete' | 'error'
  const [launchStatus, setLaunchStatus] = useState<LaunchStatus>('initial')
  const emulatorRef = useRef<Emulator>()
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (!rom) {
      return
    }
    if (launchStatus !== 'initial') {
      return
    }
    setLaunchStatus('pending')
    ;(async function () {
      try {
        emulatorRef.current = await Emulator.launch({ rom, style: emulatorStyle })
      } catch (error) {
        console.warn(error)
        setLaunchStatus('error')
        return
      }
      setLaunchStatus('complete')
    })()

    return function destruct() {
      exitEmulator()
    }
  }, [rom, launchStatus])

  function exitEmulator() {
    if (emulatorRef.current) {
      emulatorRef.current.exit()
      emulatorRef.current = undefined
    }
  }

  function pause() {
    emulatorRef.current?.pause()
    setIsPaused(true)
  }

  function start() {
    emulatorRef.current?.start()
    setIsPaused(false)
  }

  function fullscreen() {
    emulatorRef.current?.emscripten.Module.requestFullscreen()
  }

  function exit() {
    exitEmulator()
    onExit?.()
  }

  return (
    <div className='w-full h-full z-30 absolute top-0 left-0 flex flex-col'>
      <div className='flex-1 bg-gradient-to-t from-black/90 to-black/0' />
      <div className='flex bottom-0 w-full justify-around h-40 bg-gradient-to-t from-black to-black/90 text-white '>
        {isPaused ? <button onClick={start}>start</button> : <button onClick={pause}>pause</button>}
        <button onClick={fullscreen}>fullscreen</button>
        <button onClick={exit}>exit</button>
      </div>
    </div>
  )
}
