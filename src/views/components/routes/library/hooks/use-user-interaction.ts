import { useState } from 'react'
import { type Rom, launchGame } from '../../../../../core'

const isAppleMobile = /iphone|ipad|ipod/i.test(navigator.userAgent)
const isChromeLike = /chrome/i.test(navigator.userAgent)
const isMacLike = /macintosh/i.test(navigator.userAgent)
const isAppleMobileDesktopMode =
  !isChromeLike && isMacLike && /safari/i.test(navigator.userAgent) && screen.height <= 1366
const mayNeedsUserInteraction = isAppleMobile || isAppleMobileDesktopMode

export function useUserInteraction() {
  const [showInteractionButton, setShowInteractionButton] = useState(false)
  const [finishInteraction, setFinishInteraction] = useState<() => void>()
  const [needsUserInteraction, setNeedsUserInteraction] = useState(false)

  async function waitForUserInteraction() {
    setShowInteractionButton(true)

    return await new Promise<void>((resolve) => {
      setFinishInteraction(() => resolve)
    })
  }

  function onUserInteract() {
    setShowInteractionButton(false)
    finishInteraction?.()
  }

  async function launchGame_(rom: Rom | undefined) {
    if (!rom) {
      return
    }
    await (needsUserInteraction ? launchGame(rom, { waitForUserInteraction }) : launchGame(rom))
  }

  return {
    mayNeedsUserInteraction,
    needsUserInteraction,
    showInteractionButton,
    onUserInteract,
    waitForUserInteraction,
    setNeedsUserInteraction,
    launchGame: launchGame_,
  }
}
