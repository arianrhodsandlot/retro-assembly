import { type Target } from 'framer-motion'
import { useSetAtom } from 'jotai'
import $ from 'jquery'
import { type CSSProperties, type FocusEvent, type MouseEvent, memo, useState } from 'react'
import { type Rom, launchGame } from '../../../../core'
import { emitter } from '../../../lib/emitter'
import { isGameRunningAtom } from '../../atoms'
import { UserInteractionButton } from '../../common/user-interaction-button'
import { useUserInteraction } from '../../hooks'
import { GameEntryButton } from './game-entry-button'
import { GameEntryContent } from './game-entry-content'
import { GameEntryPortals } from './game-entry-portals'
import { GameTitle } from './game-title'

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
  const {
    mayNeedsUserInteraction,
    needsUserInteraction,
    showInteractionButton,
    setNeedsUserInteraction,
    onUserInteract,
    waitForUserInteraction,
  } = useUserInteraction()
  const [maskPosition, setMaskPosition] = useState<Target>()
  const setIsGameRunningAtom = useSetAtom(isGameRunningAtom)

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

  async function onMaskShow() {
    setIsGameRunningAtom(true)
    await (needsUserInteraction ? launchGame(rom, { waitForUserInteraction }) : launchGame(rom))
    document.body.dispatchEvent(new MouseEvent('mousemove'))
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

      {showInteractionButton ? <UserInteractionButton onUserInteract={onUserInteract} /> : null}
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
