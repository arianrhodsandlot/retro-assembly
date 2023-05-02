import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import { Emulator, type Rom, offPressButtons, onPressButtons } from '../../core'
import { OneDriveCloudProvider } from '../../core'
import { EmulatorContext } from '../lib/contexts'
import { StatesList } from './states-list'

const onedrive = OneDriveCloudProvider.get()

const emulatorStyle: Partial<CSSStyleDeclaration> = {
  position: 'absolute',
  top: '0',
  left: '0',
  background: 'black',
  zIndex: '20',
}

const menuHotButtons = ['l3', 'r3']

export default function EmulatorWrapper({ rom, onExit }: { rom: Rom; onExit?: () => void }) {
  const emulatorRef = useRef<Emulator>()
  const [isPaused, setIsPaused] = useState(false)
  const [showEmulatorControllMenu, setShowEmulatorControllMenu] = useState(false)

  const shouldShowStatesList = Boolean(rom.file.name && emulatorRef.current?.core)

  useEffect(() => {
    function toggleMenu() {
      if (showEmulatorControllMenu) {
        start()
      } else {
        pause()
      }
      setShowEmulatorControllMenu(!showEmulatorControllMenu)
    }
    onPressButtons(menuHotButtons, toggleMenu)
    document.addEventListener('keyup', (event) => {
      if (event.key === 'Control') {
        toggleMenu()
      }
    })
    return () => {
      offPressButtons(menuHotButtons, toggleMenu)
    }
  }, [showEmulatorControllMenu])

  useEffect(() => {
    if (!rom) {
      return
    }
    if (emulatorRef.current) {
      return
    }
    const emulator = new Emulator({ rom, style: emulatorStyle })
    emulatorRef.current = emulator
    ;(async function () {
      try {
        await emulator.launch()
        window.emu = emulator
        window.em = emu.emscripten
        window.RA = em.RA
        window.Module = em.Module
        window.FS = em.FS
      } catch (error) {
        console.warn(error)
      }
    })()

    return function destruct() {
      exitEmulator()
    }
  }, [rom])

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

  async function saveState() {
    const state = await emulatorRef.current?.saveState()
    if (state) {
      await onedrive.uploadState(state)
    }
  }

  return (
    <div
      className={classNames('absolute left-0 top-0 z-30 flex h-full w-full flex-col text-white', {
        hidden: !showEmulatorControllMenu,
      })}
    >
      <div className='flex-1 bg-gradient-to-t from-black/90 to-black/0' />
      {shouldShowStatesList && (
        <EmulatorContext.Provider value={emulatorRef.current}>
          <StatesList name={rom.file.name} />
        </EmulatorContext.Provider>
      )}
      <div className='bottom-0 flex h-40 w-full justify-around bg-gradient-to-t from-black to-black/90'>
        {isPaused ? <button onClick={start}>start</button> : <button onClick={pause}>pause</button>}
        <button onClick={fullscreen}>fullscreen</button>
        <button onClick={saveState}>save state</button>
        <button onClick={exit}>exit</button>
      </div>
    </div>
  )
}
