import { useParams } from 'wouter'
import { getRom, start } from '../../core'
import { SpatialNavigation } from '../lib/spatial-navigation'
import { UserInteractionButton } from './common/user-interaction-button'
import { GameLaunchingText } from './home-screen/game-launching/game-launching-text'
import { GameMenus } from './home-screen/game-menus'
import { useExit } from './home-screen/hooks'
import { VirtualController } from './home-screen/virtual-controller'
import { useAsyncExecute, useUserInteraction } from './hooks'

export function RomScreen() {
  const { showInteractionButton, onUserInteract, launchGame } = useUserInteraction()

  const params = useParams()
  const { exit } = useExit()

  const [state] = useAsyncExecute(async () => {
    await start()
    const rom = getRom({ system: params.system, rom: params.rom })

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
