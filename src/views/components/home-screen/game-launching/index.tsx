import { type AnimationDefinition } from 'framer-motion'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { isEqual } from 'lodash-es'
import { createPortal } from 'react-dom'
import { isGameLaunchingAtom, isGameRunningAtom } from '../../atoms'
import { UserInteractionButton } from '../../common/user-interaction-button'
import { useUserInteraction } from '../../hooks'
import { maskAtom } from '../atoms'
import { GameEntryContent } from '../game-entries-grid/game-entry-content'
import { useExit } from '../hooks'
import { GameLaunchingImage } from './game-launching-image'
import { GameLaunchingText } from './game-launching-text'

function getMaskStyle(target: HTMLButtonElement | undefined) {
  const boundingClientRect = target?.getBoundingClientRect()
  const { y, x, width, height } = boundingClientRect || {}
  let maskPosition = {}
  if (boundingClientRect) {
    maskPosition =
      width && height ? { top: y, left: x, width, height } : { top: '50%', left: '50%', width: '0', height: '0' }
  }
  const initial = { ...maskPosition, filter: 'brightness(1)' }
  const expanded = { ...maskPosition, top: 0, left: 0, width: '100%', height: '100%', filter: 'brightness(0)' }
  return { valid: Boolean(boundingClientRect), initial, expanded }
}

export function GameLaunching() {
  const { mayNeedsUserInteraction, showInteractionButton, setNeedsUserInteraction, onUserInteract, launchGame } =
    useUserInteraction()
  const setIsGameRunningAtom = useSetAtom(isGameRunningAtom)
  const { exit } = useExit()
  const mask = useAtomValue(maskAtom)

  const { rom, target, event } = mask || {}
  const [isGameLaunching, setIsGameLaunching] = useAtom(isGameLaunchingAtom)

  const maskStyle = getMaskStyle(target)

  function onAnimationStart(definition: AnimationDefinition) {
    // exit animation
    if (isEqual(definition, maskStyle.initial)) {
      return
    }

    if (event?.clientX || event?.clientY) {
      setNeedsUserInteraction(false)
    } else {
      setNeedsUserInteraction(mayNeedsUserInteraction)
    }
  }

  async function onAnimationComplete(definition: AnimationDefinition) {
    if (!isEqual(definition, maskStyle.expanded)) {
      return
    }

    setIsGameLaunching(true)
    setIsGameRunningAtom(true)
    try {
      await launchGame(rom)
      document.body.dispatchEvent(new MouseEvent('mousemove'))
    } catch (error) {
      console.warn(error)
      exit()
    }
    setIsGameLaunching(false)
  }

  return createPortal(
    <>
      <GameLaunchingImage
        onAnimationComplete={onAnimationComplete}
        onAnimationStart={onAnimationStart}
        show={Boolean(maskStyle.valid && rom)}
        styles={{
          initial: maskStyle.initial,
          exit: maskStyle.initial,
          animate: maskStyle.expanded,
        }}
      >
        <GameEntryContent rom={rom} />
      </GameLaunchingImage>

      <GameLaunchingText show={Boolean(maskStyle.valid && isGameLaunching)} />

      {showInteractionButton ? <UserInteractionButton onUserInteract={onUserInteract} /> : null}
    </>,
    document.body,
  )
}
