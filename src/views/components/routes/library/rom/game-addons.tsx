import { getRom, start } from '../../../../../core'
import { SpatialNavigation } from '../../../../lib/spatial-navigation'
import { UserInteractionButton } from '../../../common/user-interaction-button'
import { useAsyncExecute } from '../../../hooks/use-async-execute'
import { useRouterHelpers } from '../../../hooks/use-router-helpers'
import { useUserInteraction } from '../hooks/use-user-interaction'
import { GameLaunchingText } from '../platform/home-screen/game-launching/game-launching-text'
import { GameMenus } from './game-menus'
import { useExit } from './hooks/use-exit'
import { VirtualController } from './virtual-controller'

export function GameAddons() {
  const { showInteractionButton, onUserInteract, launchGame } = useUserInteraction()
  const { params } = useRouterHelpers()
  const { exit } = useExit()

  const [state] = useAsyncExecute(async () => {
    await start()
    const rom = getRom({ platform: params.platform, rom: params.rom })

    SpatialNavigation.pause()
    try {
      await launchGame(rom)
      document.body.dispatchEvent(new MouseEvent('mousemove'))
    } catch (error) {
      console.warn(error)
      exit()
    } finally {
      SpatialNavigation.resume()
    }
  })

  if (state.status === 'loading') {
    return <GameLaunchingText />
  }

  if (showInteractionButton) {
    return <UserInteractionButton onUserInteract={onUserInteract} />
  }

  if (state.status === 'success') {
    return (
      <>
        <GameMenus />
        <VirtualController />
      </>
    )
  }
}
