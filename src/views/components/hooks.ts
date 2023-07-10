import { useState } from 'react'

const mayNeedsUserInteraction = /iphone|ipad|ipod/i.test(navigator.userAgent) || true

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
