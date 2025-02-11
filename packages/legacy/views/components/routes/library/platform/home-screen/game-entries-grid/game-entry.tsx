import { useSetAtom } from 'jotai'
import type { CSSProperties, FocusEvent, MouseEvent } from 'react'
import type { Rom } from '../../../../../../../core'
import { launchingMaskAtom } from '../../../atoms'
import { GameEntryButton } from './game-entry-button'
import { GameEntryContent } from './game-entry-content'
import { GameTitle } from './game-title'

function scrollAsNeeded(e: FocusEvent<HTMLButtonElement, Element>) {
  const target = e.currentTarget
  const container = e.currentTarget.offsetParent
  if (!container) {
    return
  }
  const top = target.offsetTop - target.clientHeight
  if (top >= 0) {
    container.scrollTo({ behavior: 'smooth', top })
  }
}

export function GameEntry({
  columnCount,
  columnIndex,
  rom,
  rowCount,
  rowIndex,
  style,
}: {
  columnCount: number
  columnIndex: number
  rom: Rom
  rowCount: number
  rowIndex: number
  style: CSSProperties
}) {
  const setMask = useSetAtom(launchingMaskAtom)

  function onClickGameEntryButton(event: MouseEvent<HTMLButtonElement>) {
    event.currentTarget.focus()
    setMask({ event, rom, target: event.currentTarget })
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
      onFocus={scrollAsNeeded}
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
