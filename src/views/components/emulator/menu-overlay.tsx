import { clsx } from 'clsx'
import { useSetAtom } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import { game } from '../../../core'
import { emitter } from '../../lib/emitter'
import { showMenuOverlayAtom } from './atoms'
import { StatesList } from './states-list'

export function MenuOverlay() {
  const setShowMenuOverlay = useSetAtom(showMenuOverlayAtom)
  const [showStateList, setShowStateList] = useState(false)
  const firstButtonRef = useRef<HTMLButtonElement>(null)
  const [isLoadingState, setIsLoadingState] = useState(false)

  async function saveState() {
    await game.saveState()
    game.start()
    setShowMenuOverlay(false)
  }

  function resume() {
    game.start()
    setShowMenuOverlay(false)
  }

  function exit() {
    game.exit()
    setShowMenuOverlay(false)
    emitter.emit('exit')
  }

  async function onSelectState(stateId: string) {
    setIsLoadingState(true)
    await game.loadState(stateId)
    setIsLoadingState(false)
    setShowMenuOverlay(false)
  }

  useEffect(() => {
    firstButtonRef.current?.focus()
  }, [])

  const menuButtonClassNames =
    'py-4 pr-20 text-right transition-[color,background-color] focus:bg-white focus:text-red-600 flex items-center justify-end'

  return (
    <div className='menu-overlay flex h-full w-full items-stretch justify-center py-10'>
      {isLoadingState ? (
        <span className='icon-[line-md--loading-loop] h-12 w-12 text-white' />
      ) : (
        <>
          <div className='menu-overlay-buttons flex w-1/2 items-center border-r-2 border-r-white'>
            <div className='absolut inset-y-10 flex w-full flex-col justify-center text-xl'>
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
          <div className='menu-overlay-button-details w-1/2'>
            {showStateList ? <StatesList onSelect={onSelectState} /> : null}
          </div>
        </>
      )}
    </div>
  )
}
