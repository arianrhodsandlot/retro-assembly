import { clsx } from 'clsx'
import { useSetAtom } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import { exitGame, loadGameState, onCancel, resumeGame, saveGameState } from '../../../core'
import { emitter } from '../../lib/emitter'
import { SpatialNavigation } from '../../lib/spatial-navigation'
import { shouldFocusStatesListAtom, showMenuOverlayAtom } from './atoms'
import { StatesList } from './states-list'

export function MenuOverlay() {
  const setShowMenuOverlay = useSetAtom(showMenuOverlayAtom)
  const [showStateList, setShowStateList] = useState(false)
  const firstButtonRef = useRef<HTMLButtonElement>(null)
  const [isLoadingState, setIsLoadingState] = useState(false)
  const setShouldFocusStatesList = useSetAtom(shouldFocusStatesListAtom)

  async function saveState() {
    await saveGameState()
    resumeGame()
    setShowMenuOverlay(false)
  }

  function resume() {
    resumeGame()
    setShowMenuOverlay(false)
  }

  function exit() {
    exitGame()
    setShowMenuOverlay(false)
    emitter.emit('exit')
  }

  async function onSelectState(stateId: string) {
    setIsLoadingState(true)
    await loadGameState(stateId)
    setIsLoadingState(false)
    setShowMenuOverlay(false)
  }

  function onLoadStateButtonFocus() {
    setShowStateList(true)
    setShouldFocusStatesList(false)
  }

  useEffect(() => {
    const offCancel = onCancel(() => {
      SpatialNavigation.move('left')
    })

    firstButtonRef.current?.focus()

    return () => {
      offCancel()
    }
  }, [])

  const menuButtonClassNames =
    'py-4 pr-20 text-right transition-[color,background-color] focus:bg-white focus:text-red-600 focus:animate-[pulse-white-bg_1.5s_ease-in-out_infinite] flex items-center justify-end'

  return (
    <div className='menu-overlay flex h-full w-full items-stretch justify-center py-10'>
      {isLoadingState ? (
        <div className='flex items-center'>
          <span className='icon-[line-md--loading-loop] h-12 w-12 text-white' />
        </div>
      ) : (
        <>
          <div className='menu-overlay-buttons flex w-1/2 items-center border-r-4 border-r-white'>
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
                className={clsx(menuButtonClassNames, {
                  'bg-white text-red-600': showStateList,
                })}
                onClick={() => setShouldFocusStatesList(true)}
                onFocus={onLoadStateButtonFocus}
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
