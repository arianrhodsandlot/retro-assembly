import { type AnimationDefinition } from 'framer-motion'
import { useAtomValue } from 'jotai'
import { isEqual } from 'lodash-es'
import { useRouterHelpers } from '../../../../../hooks/use-router-helpers'
import { launchingMaskAtom } from '../../../atoms'
import { useUserInteraction } from '../../../hooks/use-user-interaction'
import { mayNeedsUserInteraction } from '../../../lib/env'
import { isTouchDevice } from '../../../lib/utils'
import { GameEntryContent } from '../game-entries-grid/game-entry-content'
import { useGamepads } from '../input-tips/hooks/use-gamepads'
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
  const { setNeedsUserInteraction } = useUserInteraction()
  const { navigateToRom } = useRouterHelpers()
  const launchingMask = useAtomValue(launchingMaskAtom)
  const { connected } = useGamepads()

  const { rom, target, event } = launchingMask || {}

  const maskStyle = getMaskStyle(target)

  function onAnimationStart(definition: AnimationDefinition) {
    // exit animation
    if (isEqual(definition, maskStyle.initial)) {
      return
    }

    let needsUserInteraction = mayNeedsUserInteraction
    if (event?.clientX || event?.clientY) {
      needsUserInteraction = false
      // eslint-disable-next-line sonarjs/no-duplicated-branches
    } else if (!isTouchDevice() && connected) {
      needsUserInteraction = false
    }
    setNeedsUserInteraction(needsUserInteraction)
  }

  function onAnimationComplete(definition: AnimationDefinition) {
    if (!rom) {
      throw new Error('invalid rom')
    }

    if (!isEqual(definition, maskStyle.expanded)) {
      return
    }

    if (rom) {
      navigateToRom(rom.fileAccessor.name, rom.platform)
    }
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
