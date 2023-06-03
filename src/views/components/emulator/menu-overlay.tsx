import { clsx } from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { game, ui } from '../../../core'
import { emitter } from '../../lib/emitter'
import { StatesList } from './states-list'

const menuHotButtons = ['l3', 'r3']

export function MenuOverlay() {
  const ref = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)
  const [showStateList, setShowStateList] = useState(false)
  const firstButtonRef = useRef<HTMLButtonElement>(null)
  const previousActiveElementRef = useRef<Element | null>(null)

  useEffect(() => {
    function toggleMenu() {
      if (!game.isRunning()) {
        return
      }

      if (show) {
        resume()
      } else {
        game.pause()
      }
      setShow(!show)
    }

    function onControlKeyup(event: KeyboardEvent) {
      if (game.isRunning() && event.key === 'Control') {
        toggleMenu()
      }
    }

    ui.onPressButtons(menuHotButtons, toggleMenu)
    document.addEventListener('keyup', onControlKeyup)

    if (show) {
      previousActiveElementRef.current = document.activeElement
      firstButtonRef.current?.focus()
    } else {
      // @ts-expect-error focus previous active element
      previousActiveElementRef.current?.focus()
    }

    return () => {
      ui.offPressButtons(menuHotButtons, toggleMenu)
      document.removeEventListener('keyup', onControlKeyup)
    }
  }, [show])

  async function saveState() {
    await game.saveState()
    game.start()
    setShow(false)
  }

  function resume() {
    game.start()
    setShow(false)
  }

  function exit() {
    game.exit()
    setShow(false)
    emitter.emit('exit')
  }

  async function onSelectState(stateId: string) {
    await game.loadState(stateId)
    setShow(false)
  }

  if (!show) {
    return null
  }

  const menuButtonClassNames =
    'py-4 pr-20 text-right transition-[color,background-color] focus:bg-white focus:text-red-600 flex items-center justify-end'

  return (
    <div
      className={clsx(
        'menu-overlay absolute inset-0 z-30 flex justify-center bg-[#00000033] text-white backdrop-blur',
        {
          hidden: !show,
        }
      )}
      ref={ref}
    >
      <div className='menu-overlay-buttons w-1/2'>
        <div className='relative h-full w-full py-10 text-xl'>
          <div className='absolute inset-y-10 flex w-full flex-col justify-center border-r-2 border-r-white'>
            <button
              className={menuButtonClassNames}
              onClick={resume}
              onFocus={() => setShowStateList(false)}
              ref={firstButtonRef}
            >
              <span className='icon-[material-symbols--resume] mr-2 h-6 w-6' />
              Resume
            </button>

            <button className={menuButtonClassNames} onClick={saveState} onFocus={() => setShowStateList(false)}>
              <span className='icon-[mdi--content-save] mr-2 h-6 w-6' />
              Save state
            </button>

            <button
              className={clsx(menuButtonClassNames, { 'bg-white text-red-600': showStateList })}
              onFocus={() => setShowStateList(true)}
            >
              <span className='icon-[mdi--tray-arrow-down] mr-2 h-6 w-6' />
              Load state
            </button>

            <button className={menuButtonClassNames} onClick={exit} onFocus={() => setShowStateList(false)}>
              <span className='icon-[mdi--exit-to-app] mr-2 h-6 w-6' />
              Exit
            </button>
          </div>
        </div>
      </div>
      <div className='menu-overlay-button-details w-1/2'>
        {showStateList ? <StatesList onSelect={onSelectState} /> : null}
      </div>
    </div>
  )
}
