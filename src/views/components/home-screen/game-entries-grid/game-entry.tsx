import { type Target } from 'framer-motion'
import $ from 'jquery'
import { type CSSProperties, type FocusEvent, type MouseEvent, memo, useState } from 'react'
import { type Rom, launchGame } from '../../../../core'
import { emitter } from '../../../lib/emitter'
import { BaseDialogContent } from '../../primitives/base-dialog-content'
import { GameEntryButton } from './game-entry-button'
import { GameEntryContent } from './game-entry-content'
import { GameEntryPortals } from './game-entry-portals'
import { GameTitle } from './game-title'

const mayNeedsUserInteraction = /iphone|ipad|ipod/i.test(navigator.userAgent)

function onFocus(e: FocusEvent<HTMLButtonElement, Element>) {
  const $focusedElement = $(e.currentTarget)
  const $outer = $focusedElement.offsetParent()
  const outerScrollTop = $outer.scrollTop()
  const outerHeight = $outer.height()
  const focusedElementHeight = $focusedElement.height()
  if (outerScrollTop && outerHeight && focusedElementHeight) {
    const offsetTop = $focusedElement.position().top + outerScrollTop
    const scrollTop = offsetTop - outerHeight / 2 + focusedElementHeight / 2
    $outer.stop().animate({ scrollTop }, { duration: 40 })
  }
}

function GameEntry({
  rom,
  columnIndex,
  rowIndex,
  rowCount,
  columnCount,
  style,
}: {
  rom: Rom
  columnIndex: number
  rowIndex: number
  rowCount: number
  columnCount: number
  style: CSSProperties
}) {
  const [maskPosition, setMaskPosition] = useState<Target>()
  const [showInteractionButton, setShowInteractionButton] = useState(false)
  const [finishInteraction, setFinishInteraction] = useState<() => void>()
  const [needsUserInteraction, setNeedsUserInteraction] = useState(false)

  function onExit() {
    setMaskPosition(undefined)
    emitter.off('exit', onExit)
  }

  function onClickGameEntryButton(event: MouseEvent<HTMLButtonElement>) {
    event.currentTarget.focus()

    const boundingClientRect = event.currentTarget.getBoundingClientRect()
    setMaskPosition({
      top: boundingClientRect.y,
      left: boundingClientRect.x,
      width: boundingClientRect.width,
      height: boundingClientRect.height,
    })

    setNeedsUserInteraction(mayNeedsUserInteraction && event.clientX === 0 && event.clientY === 0)

    emitter.on('exit', onExit)
  }

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

  async function onMaskShow() {
    await (needsUserInteraction ? launchGame(rom, { waitForUserInteraction }) : launchGame(rom))
  }

  const isFirstRow = rowIndex === 0
  const isFirstColumn = columnIndex === 0
  const isLastRow = !isFirstRow && rowIndex === rowCount - 1
  const isLastColumn = !isFirstColumn && columnIndex === columnCount - 1

  const gameEntryContent = <GameEntryContent rom={rom} />

  return (
    <>
      <GameEntryButton
        isFirstColumn={isFirstColumn}
        isFirstRow={isFirstRow}
        isLastColumn={isLastColumn}
        isLastRow={isLastRow}
        onClick={onClickGameEntryButton}
        onFocus={onFocus}
        style={style}
      >
        <div className='flex h-full flex-col'>
          <div className='relative flex-1'>{gameEntryContent}</div>
          <GameTitle rom={rom} />
        </div>
      </GameEntryButton>

      <GameEntryPortals maskContent={gameEntryContent} maskPosition={maskPosition} onMaskShow={onMaskShow} />
      {showInteractionButton ? (
        <BaseDialogContent>
          <div
            aria-hidden
            className='relative flex cursor-pointer items-center justify-center rounded border-2 border-rose-700 bg-rose-700 px-4 py-2 text-white'
            onClick={onUserInteract}
          >
            <span className='icon-[mdi--gesture-tap] mr-2 h-5 w-5' />
            Please tap here to launch the game
          </div>
          <div className='mt-2 flex max-w-xs text-xs'>
            <span className='icon-[mdi--lightbulb-on-outline] mr-2 h-4 w-4' />
            <div>
              This is due to a limitation of the browser.
              <br />A game can only run after the screen is tapped, rather than clicking a button on a gamepad.
            </div>
          </div>
        </BaseDialogContent>
      ) : null}
    </>
  )
}

function arePropsEqual(oldProps, newProps) {
  if (oldProps === newProps) {
    return true
  }

  if (oldProps.rom.id !== newProps.rom.id) {
    return false
  }

  for (const key of ['columnCount', 'columnIndex', 'rowCount', 'rowIndex']) {
    if (oldProps[key] !== newProps[key]) {
      return false
    }
  }

  return true
}

const MemoedGameEntry = memo(GameEntry, arePropsEqual)

export { MemoedGameEntry as GameEntry }
