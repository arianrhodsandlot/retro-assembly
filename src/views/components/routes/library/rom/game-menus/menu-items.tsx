import clsx from 'clsx'
import { useSetAtom } from 'jotai'
import $ from 'jquery'
import { useEffect, useRef, useState } from 'react'
import { isUsingDemo, onCancel, resumeGame } from '../../../../../../core'
import { SpatialNavigation } from '../../../../../lib/spatial-navigation'
import { showMenuOverlayAtom } from '../atoms'
import { shouldFocusStatesListAtom } from './atoms'
import { StatesList } from './states-list'

const menuButtonClassNames =
  'flex items-center justify-end py-4 pr-20 text-right transition-[color,background-color] focus:animate-[pulse-white-bg_1.5s_ease-in-out_infinite] focus:bg-white focus:text-rose-700 disabled:text-white/20'

interface MenuItemsProps {
  onResume: () => void
  onRestart: () => void
  onSaveState: () => void
  onSaveAndExit: () => void
  onExit: () => void
  onLoadState: (stateId: string) => void
}

export function MenuItems({ onResume, onRestart, onSaveState, onSaveAndExit, onExit, onLoadState }: MenuItemsProps) {
  const setShowMenuOverlay = useSetAtom(showMenuOverlayAtom)
  const setShouldFocusStatesList = useSetAtom(shouldFocusStatesListAtom)
  const [showStateList, setShowStateList] = useState(false)
  const firstButtonRef = useRef<HTMLButtonElement>(null)

  const usingDemo = isUsingDemo()

  function onLoadStateButtonFocus() {
    setShowStateList(true)
    setShouldFocusStatesList(false)
  }

  useEffect(() => {
    const offCancel = onCancel(() => {
      if ($('.menu-overlay-buttons button:focus')) {
        setShowMenuOverlay(false)
        resumeGame()
      } else {
        SpatialNavigation.move('left')
      }
    })

    firstButtonRef.current?.focus()

    return () => {
      offCancel()
    }
  }, [setShowMenuOverlay])

  return (
    <div className='flex h-full w-full items-stretch justify-center'>
      <div className='menu-overlay-buttons flex w-1/2 items-center border-r-4 border-r-white'>
        <div className='absolut inset-y-10 flex w-full flex-col justify-center text-xl'>
          <button
            className={menuButtonClassNames}
            data-testid='menu-item-resume'
            onClick={onResume}
            onFocus={() => setShowStateList(false)}
            ref={firstButtonRef}
          >
            <span className='icon-[material-symbols--resume] mr-2 h-6 w-6' />
            Resume
          </button>

          <button
            className={menuButtonClassNames}
            data-testid='menu-item-restart'
            onClick={onRestart}
            onFocus={() => setShowStateList(false)}
          >
            <span className='icon-[mdi--restart] mr-2 h-6 w-6' />
            Restart
          </button>

          <button
            className={menuButtonClassNames}
            data-testid='menu-item-save-state'
            disabled={usingDemo}
            onClick={onSaveState}
            onFocus={() => setShowStateList(false)}
          >
            <span className='icon-[mdi--content-save] mr-2 h-6 w-6' />
            Save state
          </button>

          <button
            className={clsx(menuButtonClassNames, {
              'bg-white text-rose-700': showStateList,
            })}
            data-testid='menu-item-load-state'
            disabled={usingDemo}
            onClick={() => setShouldFocusStatesList(true)}
            onFocus={onLoadStateButtonFocus}
          >
            <span className='icon-[mdi--tray-arrow-down] mr-2 h-6 w-6' />
            Load state
          </button>

          <button
            className={menuButtonClassNames}
            data-testid='menu-item-save-and-exit'
            disabled={usingDemo}
            onClick={onSaveAndExit}
            onFocus={() => setShowStateList(false)}
          >
            <span className='icon-[mdi--location-exit] mr-2 h-6 w-6' />
            Save & exit
          </button>

          <button className={menuButtonClassNames} onClick={onExit} onFocus={() => setShowStateList(false)}>
            <span className='icon-[mdi--exit-to-app] mr-2 h-6 w-6' />
            Exit
          </button>
        </div>
      </div>

      <div className='menu-overlay-button-details w-1/2'>
        {showStateList ? <StatesList onSelect={onLoadState} /> : null}
      </div>
    </div>
  )
}
