import { useSetAtom } from 'jotai'
import $ from 'jquery'
import { type CSSProperties, type FocusEvent, type MouseEvent } from 'react'
import { type Rom } from '../../../../core'
import { maskAtom } from '../atoms'
import { GameEntryButton } from './game-entry-button'
import { GameEntryContent } from './game-entry-content'
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

export function GameEntry({
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
  const setMask = useSetAtom(maskAtom)

  function onClickGameEntryButton(event: MouseEvent<HTMLButtonElement>) {
    event.currentTarget.focus()
    setMask({ event, target: event.currentTarget, rom })
  }

  const isFirstRow = rowIndex === 0
  const isFirstColumn = columnIndex === 0
  const isLastRow = !isFirstRow && rowIndex === rowCount - 1
  const isLastColumn = !isFirstColumn && columnIndex === columnCount - 1

  return (
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
        <div className='relative flex-1'>
          <GameEntryContent rom={rom} />
        </div>
        <GameTitle rom={rom} />
      </div>
    </GameEntryButton>
  )
}
