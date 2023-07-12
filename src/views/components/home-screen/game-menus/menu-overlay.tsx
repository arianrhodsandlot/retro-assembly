import { useAtomValue, useSetAtom } from 'jotai'
import { useAsyncFn } from 'react-use'
import { loadGameState, restartGame, resumeGame, saveGameState } from '../../../../core'
import { LightInputButton } from '../../common/light-input-button'
import { LoadingScreen } from '../../common/loading-screen'
import { useExit } from '../hooks'
import { previousFocusedElementAtom, showMenuOverlayAtom } from './atoms'
import { MenuItems } from './menu-items'

export function MenuOverlay() {
  const setShowMenuOverlay = useSetAtom(showMenuOverlayAtom)
  const previousFocusedElement = useAtomValue(previousFocusedElementAtom)
  const { exit } = useExit()

  const [saveStateState, saveState] = useAsyncFn(async () => {
    if (saveStateState.loading) {
      return
    }
    await saveGameState()
    resumeGame()
    setShowMenuOverlay(false)
    previousFocusedElement?.focus()
  })

  const [loadStateState, loadState] = useAsyncFn(async (stateId: string) => {
    if (loadStateState.loading) {
      return
    }
    await loadGameState(stateId)
    setShowMenuOverlay(false)
    previousFocusedElement?.focus()
    resumeGame()
  })

  function resume() {
    setShowMenuOverlay(false)
    previousFocusedElement?.focus()
    resumeGame()
  }

  function restart() {
    setShowMenuOverlay(false)
    previousFocusedElement?.focus()
    restartGame()
  }

  async function saveAndExit() {
    await saveState()
    exit()
  }

  return (
    <div className='menu-overlay h-full w-full py-10'>
      {saveStateState.loading ? (
        <LoadingScreen>Saving... Please do not turn off your device!</LoadingScreen>
      ) : loadStateState.loading ? (
        <LoadingScreen>Loading selected state...</LoadingScreen>
      ) : (
        <>
          <MenuItems
            onExit={exit}
            onLoadState={loadState}
            onRestart={restart}
            onResume={resume}
            onSaveAndExit={saveAndExit}
            onSaveState={saveState}
          />
          <div className='absolute bottom-10 right-10 flex gap-3'>
            <span className='icon-[mdi--lightbulb-on-outline] mt-1 h-4 w-4' />
            <div>
              <div className='flex items-center gap-2'>
                Press<LightInputButton>L1</LightInputButton>+<LightInputButton>R1</LightInputButton>or
                <LightInputButton>ESC</LightInputButton>to open/hide this menu.
              </div>
              <div className='flex items-center gap-2'>
                Press<LightInputButton>select</LightInputButton>+<LightInputButton>L1</LightInputButton>to
                rewind while playing.
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
