import { useAtom } from 'jotai'
import { useState } from 'react'
import { type Rom, launchGame } from '../../../../../core'
import { SpatialNavigation } from '../../../../lib/spatial-navigation'
import { needsUserInteractionAtom } from '../atoms'

export function useUserInteraction() {
  const [showInteractionButton, setShowInteractionButton] = useState(false)
  const [finishInteraction, setFinishInteraction] = useState<() => void>()
  const [needsUserInteraction, setNeedsUserInteraction] = useAtom(needsUserInteractionAtom)

  async function waitForUserInteraction() {
    setShowInteractionButton(true)

    return await new Promise<void>((resolve) => {
      setFinishInteraction(() => resolve)
    })
  }

  function onUserInteract() {
    setShowInteractionButton(false)
    finishInteraction?.()
    SpatialNavigation.focus('canvas')
  }

  async function launchGame_(rom: Rom | undefined) {
    if (!rom) {
      return
    }
    await (needsUserInteraction ? launchGame(rom, { waitForUserInteraction }) : launchGame(rom))
  }

  return {
    needsUserInteraction,
    showInteractionButton,
    onUserInteract,
    waitForUserInteraction,
    setNeedsUserInteraction,
    launchGame: launchGame_,
  }
}
