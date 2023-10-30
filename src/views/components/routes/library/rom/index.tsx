import { useRouterHelpers } from '../../../hooks/use-router-helpers'
import { LibrarySystem } from '../system/system-main'
import { GameAddons } from './game-addons'

export function LibrarySystemRom() {
  const { params } = useRouterHelpers()

  return (
    <>
      <LibrarySystem />
      {params.rom ? <GameAddons /> : null}
    </>
  )
}
