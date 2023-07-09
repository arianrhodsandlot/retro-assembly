import { useAtomValue, useSetAtom } from 'jotai'
import { useAsyncFn } from 'react-use'
import { exitGame, loadGameState, restartGame, resumeGame, saveGameState } from '../../../../core'
import { emitter } from '../../../lib/emitter'
import { ButtonOnInputDevice } from '../../common/button-on-input-device'
import { previousFocusedElementAtom, showMenuOverlayAtom } from './atoms'
import { MenuItems } from './menu-items'
import { MenuLoading } from './menu-loading'

export function MenuOverlay() {
  const setShowMenuOverlay = useSetAtom(showMenuOverlayAtom)
  const previousFocusedElement = useAtomValue(previousFocusedElementAtom)

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

  function exit() {
    exitGame()
    setShowMenuOverlay(false)
    previousFocusedElement?.focus()
    emitter.emit('exit')
  }

  async function saveAndExit() {
    await saveState()
    exit()
  }

  return (
    <div className='menu-overlay h-full w-full py-10'>
      {saveStateState.loading ? (
        <MenuLoading>Saving... Please do not turn off your device!</MenuLoading>
      ) : loadStateState.loading ? (
        <MenuLoading>Loading selected state...</MenuLoading>
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
          <div className='absolute bottom-10 right-10 flex items-center'>
            <span className='icon-[mdi--lightbulb-on-outline] mr-2 h-4 w-4' />
            <div className='flex items-center gap-2'>
              Press<ButtonOnInputDevice>L1</ButtonOnInputDevice>+<ButtonOnInputDevice>R1</ButtonOnInputDevice>or
              <ButtonOnInputDevice>ESC</ButtonOnInputDevice>to open / hide this menu
            </div>
          </div>
        </>
      )}
    </div>
  )
}
