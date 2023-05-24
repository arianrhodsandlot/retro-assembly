import { clsx } from 'clsx'
import { useSetAtom } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import { game, ui } from '../../../core'
import { currentRomAtom } from '../../lib/atoms'
import { emitter } from '../../lib/emitter'
import { StatesList } from './states-list'

const menuHotButtons = ['l3', 'r3']

export function MenuOverlay() {
  const setCurrentRom = useSetAtom(currentRomAtom)
  const ref = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)
  const [showStateList, setShowStateList] = useState(false)
  const firstButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function toggleMenu() {
      if (show) {
        resume()
      } else {
        game.pause()
      }
      setShow(!show)
    }

    ui.onPressButtons(menuHotButtons, toggleMenu)

    document.addEventListener('keyup', (event) => {
      if (game.isRunning() && event.key === 'Control') {
        toggleMenu()
      }
    })

    if (show) {
      firstButtonRef.current?.focus()
    }

    return () => {
      ui.offPressButtons(menuHotButtons, toggleMenu)
    }
  }, [show])

  async function saveState() {
    game.start()
    setShow(false)
    await game.saveState()
  }

  function resume() {
    game.start()
    setShow(false)
  }

  function exit() {
    game.exit()
    setCurrentRom(undefined)
    emitter.emit('exit')
    setShow(false)
  }

  async function onSelectState(stateId: string) {
    await game.loadState(stateId)
    setShow(false)
  }

  if (!show) {
    return null
  }

  const menuButtonClassNames =
    'py-4 pr-20 text-right transition-[color,background-color] focus:bg-white focus:text-red-600'

  return (
    <div
      className={clsx('absolute inset-0 z-30 flex justify-center bg-[#00000033] text-white backdrop-blur', {
        hidden: !show,
      })}
      ref={ref}
    >
      <div className='w-1/2'>
        <div className='relative h-full w-full py-10 text-xl'>
          <div className='absolute inset-y-10 flex w-full flex-col justify-center border-r-2 border-r-white'>
            <button
              className={menuButtonClassNames}
              onClick={resume}
              onFocus={() => setShowStateList(false)}
              ref={firstButtonRef}
            >
              Resume
            </button>

            <button className={menuButtonClassNames} onClick={saveState} onFocus={() => setShowStateList(false)}>
              Save state
            </button>

            <button
              className={clsx(menuButtonClassNames, { 'bg-white text-red-600': showStateList })}
              onFocus={() => setShowStateList(true)}
            >
              Load state
            </button>

            <button className={menuButtonClassNames} onClick={exit} onFocus={() => setShowStateList(false)}>
              Exit
            </button>
          </div>
        </div>
      </div>
      <div className='w-1/2'>{showStateList ? <StatesList onSelect={onSelectState} /> : null}</div>
    </div>
  )
}
