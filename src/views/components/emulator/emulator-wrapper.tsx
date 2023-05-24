import classNames from 'classnames'
import { useAtom } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import { game, ui } from '../../../core'
import { currentRomAtom } from '../../lib/atoms'
import { emitter } from '../../lib/emitter'
import { StatesList } from './states-list'

const menuHotButtons = ['l3', 'r3']

export default function EmulatorWrapper() {
  const [rom, setCurrentRom] = useAtom(currentRomAtom)
  const [isPaused, setIsPaused] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const [showEmulatorControllMenu, setShowEmulatorControllMenu] = useState(false)

  useEffect(() => {
    function toggleMenu() {
      if (showEmulatorControllMenu) {
        start()
      } else {
        pause()
        setTimeout(() => {
          const button = ref.current?.querySelector('button')
          button?.focus()
        })
      }
      setShowEmulatorControllMenu(!showEmulatorControllMenu)
    }
    ui.onPressButtons(menuHotButtons, toggleMenu)
    document.addEventListener('keyup', (event) => {
      if (game.isRunning() && event.key === 'Control') {
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
    setCurrentRom(undefined)
    emitter.emit('exit')
    setShowEmulatorControllMenu(false)
  }

  const menuButtonClassNames = 'py-4 pr-20 text-right transition-[color,background-color] focus:bg-white focus:text-red-600'

  return (
    showEmulatorControllMenu && (
      <div
        ref={ref}
        className={classNames('absolute inset-0 z-30 flex justify-center bg-[#00000033] text-white backdrop-blur', {
          hidden: !showEmulatorControllMenu,
        })}
      >
        <div className='w-1/2'>
          <div className='relative h-full w-full py-10 text-xl'>
            <div className='absolute inset-y-10 flex w-full flex-col justify-center border-r-2 border-r-white'>
              {isPaused ? (
                <button className={menuButtonClassNames} onClick={start}>
                  Start
                </button>
              ) : (
                <button className={menuButtonClassNames} onClick={pause}>
                  Pause
                </button>
              )}

              <button className={menuButtonClassNames} onClick={saveState}>
                Save state
              </button>

              <button className={menuButtonClassNames} onClick={saveState}>
                Load state
              </button>

              <button className={menuButtonClassNames} onClick={exit}>
                Exit
              </button>
            </div>
          </div>
        </div>
        <div className='w-1/2'>
          <StatesList />
        </div>
      </div>
    )
  )
}
