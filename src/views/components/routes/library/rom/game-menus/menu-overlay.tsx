import { useAsync as useAsyncFn } from '@react-hookz/web'
import { useSetAtom } from 'jotai'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { loadGameState, restartGame, resumeGame, saveGameState } from '../../../../../../core'
import { SpatialNavigation } from '../../../../../lib/spatial-navigation'
import { BouncingEllipsis } from '../../../../common/bouncing-ellipsis'
import { LoadingScreen } from '../../../../common/loading-screen'
import { showMenuOverlayAtom } from '../atoms'
import { useExit } from '../hooks/use-exit'
import { MenuItems } from './menu-items'
import { MenuTips } from './menu-tips'

export function MenuOverlay() {
  const { t } = useTranslation()
  const setShowMenuOverlay = useSetAtom(showMenuOverlayAtom)
  const { exit } = useExit()

  const [saveStateState, { execute: saveState }] = useAsyncFn(async () => {
    if (saveStateState.status === 'loading') {
      return
    }
    await saveGameState()
    resumeGame()
    setShowMenuOverlay(false)
  })

  const [loadStateState, { execute: loadState }] = useAsyncFn(async (stateId: string) => {
    if (loadStateState.status === 'loading') {
      return
    }
    SpatialNavigation.focus('canvas')
    await loadGameState(stateId)
    setShowMenuOverlay(false)
    resumeGame()
  })

  function resume() {
    SpatialNavigation.focus('canvas')
    setShowMenuOverlay(false)
    resumeGame()
  }

  function restart() {
    SpatialNavigation.focus('canvas')
    setShowMenuOverlay(false)
    restartGame()
  }

  async function saveAndExit() {
    SpatialNavigation.focus('canvas')
    await saveState()
    exit()
  }

  useEffect(() => {
    return () => {
      SpatialNavigation.focus('canvas')
    }
  })

  return (
    <div className='menu-overlay h-full w-full py-10' data-testid='menu-overlay'>
      {saveStateState.status === 'loading' ? (
        <LoadingScreen>
          {t('Saving')} <BouncingEllipsis /> {t('Please do not turn off your device!')}
        </LoadingScreen>
      ) : loadStateState.status === 'loading' ? (
        <LoadingScreen>
          {t('Loading selected state')}
          <BouncingEllipsis />
        </LoadingScreen>
      ) : (
        <div className='absolute inset-0 flex flex-col'>
          <MenuItems
            onExit={exit}
            onLoadState={loadState}
            onRestart={restart}
            onResume={resume}
            onSaveAndExit={saveAndExit}
            onSaveState={saveState}
          />
          <MenuTips />
        </div>
      )}
    </div>
  )
}
