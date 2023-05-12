import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { type Rom, game, ui } from '../../../core'
import { StatesList } from './states-list'

const menuHotButtons = ['l3', 'r3']

export default function EmulatorWrapper({ rom, onExit }: { rom: Rom; onExit?: () => void }) {
  const [isPaused, setIsPaused] = useState(false)
  const [showEmulatorControllMenu, setShowEmulatorControllMenu] = useState(false)

  useEffect(() => {
    function toggleMenu() {
      if (showEmulatorControllMenu) {
        start()
      } else {
        pause()
      }
      setShowEmulatorControllMenu(!showEmulatorControllMenu)
    }
    ui.onPressButtons(menuHotButtons, toggleMenu)
    document.addEventListener('keyup', (event) => {
      if (event.key === 'Control') {
        toggleMenu()
      }
    })
    return () => {
      ui.offPressButtons(menuHotButtons, toggleMenu)
    }
  }, [showEmulatorControllMenu])

  useEffect(() => {
    if (!rom) {
      return
    }
    game.launch(rom)
  }, [rom])

  function saveState() {
    game.start()
    game.saveState()
    setIsPaused(false)
  }

  function pause() {
    game.pause()
    setIsPaused(true)
  }

  function start() {
    game.start()
    setIsPaused(false)
  }

  function exit() {
    game.exit()
    onExit?.()
  }

  return (
    <div
      className={classNames('absolute left-0 top-0 z-30 flex h-full w-full flex-col text-white', {
        hidden: !showEmulatorControllMenu,
      })}
    >
      <div className='flex-1 bg-gradient-to-t from-black/90 to-black/0' />
      {showEmulatorControllMenu && <StatesList />}
      <div className='bottom-0 flex h-40 w-full justify-around bg-gradient-to-t from-black to-black/90'>
        {isPaused ? <button onClick={start}>start</button> : <button onClick={pause}>pause</button>}
        <button onClick={game.fullscreen}>fullscreen</button>
        <button onClick={saveState}>save state</button>
        <button onClick={exit}>exit</button>
      </div>
    </div>
  )
}
