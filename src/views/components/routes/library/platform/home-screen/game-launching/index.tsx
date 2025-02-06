import type { AnimationDefinition } from 'framer-motion'
import { useAtomValue, useSetAtom } from 'jotai'
import { isEqual } from 'lodash-es'
import { useRouterHelpers } from '../../../../../hooks/use-router-helpers'
import { launchingFromHistoryAtom, launchingMaskAtom } from '../../../atoms'
import { useUserInteraction } from '../../../hooks/use-user-interaction'
import { mayNeedsUserInteraction } from '../../../lib/env'
import { isTouchDevice } from '../../../lib/utils'
import { GameEntryContent } from '../game-entries-grid/game-entry-content'
import { useGamepads } from '../input-tips/hooks/use-gamepads'
import { GameLaunchingImage } from './game-launching-image'

function getMaskStyle(target: HTMLButtonElement | undefined) {
  const boundingClientRect = target?.getBoundingClientRect()
  const { height, width, x, y } = boundingClientRect || {}
  const isValidBounding =
    typeof y === 'number' && typeof x === 'number' && typeof width === 'number' && typeof height === 'number'
  let maskPosition = {}
  if (isValidBounding) {
    maskPosition =
      width && height ? { height, left: x, top: y, width } : { height: '0', left: '50%', top: '50%', width: '0' }
  }
  const initial = { ...maskPosition, filter: 'brightness(1)' }
  const expanded = { ...maskPosition, filter: 'brightness(0)', height: '100%', left: 0, top: 0, width: '100%' }
  const exit = isValidBounding ? { height: 0, left: x + width / 2, opacity: 0, top: y + height / 2, width: 0 } : initial
  return { exit, expanded, initial, valid: isValidBounding }
}

export function GameLaunching() {
  const { setNeedsUserInteraction } = useUserInteraction()
  const { isPlatformRoute, navigateToRom, params } = useRouterHelpers()
  const launchingMask = useAtomValue(launchingMaskAtom)
  const setLaunchingFromHistory = useSetAtom(launchingFromHistoryAtom)
  const { connected } = useGamepads()

  const { event, rom, target } = launchingMask || {}

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
    setLaunchingFromHistory(params.platform === 'history')
  }

  function onAnimationComplete(definition: AnimationDefinition) {
    if (!isPlatformRoute) {
      return
    }

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

  const styles = {
    animate: maskStyle.expanded,
    exit: maskStyle.exit,
    initial: maskStyle.initial,
  }

  return (
    <GameLaunchingImage
      onAnimationComplete={onAnimationComplete}
      onAnimationStart={onAnimationStart}
      show={Boolean(maskStyle.valid && rom)}
      styles={styles}
    >
      {rom ? <GameEntryContent rom={rom} /> : null}
    </GameLaunchingImage>
  )
}
