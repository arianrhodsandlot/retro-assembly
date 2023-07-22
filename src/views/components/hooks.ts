import { useState } from 'react'

const isAppleMobile = /iphone|ipad|ipod/i.test(navigator.userAgent)
const isAppleMobileDesktopMode = /safari/i.test(navigator.userAgent) && screen.height <= 1366
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

  return {
    mayNeedsUserInteraction,
    needsUserInteraction,
    showInteractionButton,
    onUserInteract,
    waitForUserInteraction,
    setNeedsUserInteraction,
  }
}
