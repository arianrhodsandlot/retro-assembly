import { useAsync } from '@react-hookz/web'
import { useEffect, useState } from 'react'
import { type Rom, launchGame, teardown } from '../../core'
import { useRouterHelpers } from './home-screen/hooks'

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

export function useTeardown() {
  const { navigateToHome } = useRouterHelpers()

  async function teardown_() {
    await teardown()
    navigateToHome()
  }

  return { teardown: teardown_ }
}

// eslint-disable-next-line func-style
export const useAsyncExecute: typeof useAsync = function useAsyncExecute(
  asyncFn: (...params: unknown[]) => Promise<unknown>,
  initialValue?: unknown,
) {
  const hooks = useAsync(asyncFn, initialValue)

  const [, { execute }] = hooks
  useEffect(() => {
    execute()
  }, [execute])
  return hooks
}

export function useGamepads() {
  const [gamepads, setGamepads] = useState(navigator.getGamepads())
  const gamepad = gamepads[0]
  const connected = Boolean(gamepad)

  useEffect(() => {
    function updateGamepads() {
      setGamepads(navigator.getGamepads())
    }
    window.addEventListener('gamepadconnected', updateGamepads)
    window.addEventListener('gamepaddisconnected', updateGamepads)
    return () => {
      window.removeEventListener('gamepadconnected', updateGamepads)
      window.removeEventListener('gamepaddisconnected', updateGamepads)
    }
  }, [])

  return { gamepads, gamepad, connected }
}
