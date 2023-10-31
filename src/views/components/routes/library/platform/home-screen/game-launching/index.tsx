import { type AnimationDefinition } from 'framer-motion'
import { useAtomValue } from 'jotai'
import { isEqual } from 'lodash-es'
import { useRouterHelpers } from '../../../../../hooks/use-router-helpers'
import { launchingMaskAtom } from '../../../atoms'
import { useUserInteraction } from '../../../hooks/use-user-interaction'
import { GameEntryContent } from '../game-entries-grid/game-entry-content'
import { GameLaunchingImage } from './game-launching-image'

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
  const { mayNeedsUserInteraction, setNeedsUserInteraction } = useUserInteraction()
  const { navigateToRom } = useRouterHelpers()
  const launchingMask = useAtomValue(launchingMaskAtom)

  const { rom, target, event } = launchingMask || {}

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

  function onAnimationComplete(definition: AnimationDefinition) {
    if (!rom) {
      throw new Error('invalid rom')
    }

    if (!isEqual(definition, maskStyle.expanded)) {
      return
    }

    navigateToRom(rom?.fileAccessor.name)
  }

  return (
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
      {rom ? <GameEntryContent rom={rom} /> : null}
    </GameLaunchingImage>
  )
}
