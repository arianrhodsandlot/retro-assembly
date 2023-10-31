import { useRouterHelpers } from '../../../hooks/use-router-helpers'
import { LibraryPlatform } from '../platform/platform-main'
import { GameAddons } from './game-addons'

export function LibraryPlatformRom() {
  const { params } = useRouterHelpers()

  return (
    <>
      <LibraryPlatform />
      {params.rom ? <GameAddons /> : null}
    </>
  )
}
