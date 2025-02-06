import { clsx } from 'clsx'
import { useSetAtom } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { isUsingDemo, onCancel, resumeGame } from '../../../../../../core'
import { SpatialNavigation } from '../../../../../lib/spatial-navigation'
import { showMenuOverlayAtom } from '../atoms'
import { shouldFocusStatesListAtom } from './atoms'
import { StatesList } from './states-list'

const menuButtonClassNames =
  'flex items-center justify-end py-4 pr-20 text-right transition-[color,background-color] focus:animate-[pulse-white-bg_1.5s_ease-in-out_infinite] focus:bg-white focus:text-rose-700 disabled:text-white/20'

interface MenuItemsProps {
  onExit: () => void
  onLoadState: (stateId: string) => void
  onRestart: () => void
  onResume: () => void
  onSaveAndExit: () => void
  onSaveState: () => void
}

export function MenuItems({ onExit, onLoadState, onRestart, onResume, onSaveAndExit, onSaveState }: MenuItemsProps) {
  const { t } = useTranslation()
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
      const buttonContainer = document.activeElement?.parentElement?.parentElement
      if (buttonContainer?.classList.contains('menu-overlay-buttons')) {
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
    <div className='flex size-full flex-1 items-stretch justify-center py-10'>
      <div
        className={clsx(
          'menu-overlay-buttons flex items-center border-r-4 transition-[width]',
          'sm:w-1/2 ',
          showStateList ? 'w-1/2' : 'w-2/3',
        )}
      >
        <div className='flex w-full flex-col sm:text-xl'>
          <button
            className={menuButtonClassNames}
            data-testid='menu-item-resume'
            onClick={onResume}
            onFocus={() => setShowStateList(false)}
            ref={firstButtonRef}
            type='button'
          >
            <span className='icon-[material-symbols--resume] mr-2 size-6 shrink-0' />
            {t('Resume')}
          </button>

          <button
            className={menuButtonClassNames}
            data-testid='menu-item-restart'
            onClick={onRestart}
            onFocus={() => setShowStateList(false)}
            type='button'
          >
            <span className='icon-[mdi--restart] mr-2 size-6 shrink-0' />
            {t('Restart')}
          </button>

          <button
            className={menuButtonClassNames}
            data-testid='menu-item-save-state'
            disabled={usingDemo}
            onClick={onSaveState}
            onFocus={() => setShowStateList(false)}
            type='button'
          >
            <span className='icon-[mdi--content-save] mr-2 size-6 shrink-0' />
            {t('Save state')}
          </button>

          <button
            className={clsx(menuButtonClassNames, {
              'bg-white text-rose-700': showStateList,
            })}
            data-testid='menu-item-load-state'
            disabled={usingDemo}
            onClick={() => setShouldFocusStatesList(true)}
            onFocus={onLoadStateButtonFocus}
            type='button'
          >
            <span className='icon-[mdi--tray-arrow-down] mr-2 size-6 shrink-0' />
            {t('Load state')}
          </button>

          <button
            className={menuButtonClassNames}
            data-testid='menu-item-save-and-exit'
            disabled={usingDemo}
            onClick={onSaveAndExit}
            onFocus={() => setShowStateList(false)}
            type='button'
          >
            <span className='icon-[mdi--location-exit] mr-2 size-6 shrink-0' />
            {t('Save & exit')}
          </button>

          <button
            className={menuButtonClassNames}
            onClick={onExit}
            onFocus={() => setShowStateList(false)}
            type='button'
          >
            <span className='icon-[mdi--exit-to-app] mr-2 size-6 shrink-0' />
            {t('Exit')}
          </button>
        </div>
      </div>

      <div
        className={clsx(
          'menu-overlay-button-details transition-[width]',
          'sm:w-1/2',
          showStateList ? 'w-1/2' : 'w-1/3',
        )}
      >
        {showStateList ? <StatesList onSelect={onLoadState} /> : null}
      </div>
    </div>
  )
}
