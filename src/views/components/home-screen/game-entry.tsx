import { type Target } from 'framer-motion'
import $ from 'jquery'
import { useEffect, useState } from 'react'
import { type Rom, game } from '../../../core'
import { emitter } from '../../lib/emitter'
import { GameEntryButton } from './game-entry-button'
import { GameEntryContent } from './game-entry-content'
import { GameEntryPortals } from './game-entry-portals'

function onFocus(e: React.FocusEvent<HTMLButtonElement, Element>) {
  const $focusedElement = $(e.currentTarget)
  const $outer = $focusedElement.offsetParent()
  const offsetTop = $focusedElement.position().top + $outer.scrollTop()
  const scrollTop = offsetTop - $outer.height() / 2 + $focusedElement.height() / 2
  $outer.stop().animate({ scrollTop }, 100)
}

export function GameEntry({
  rom,
  index,
  columnIndex,
  rowIndex,
  rowCount,
  columnCount,
  style,
}: {
  rom: Rom
  index: number
  columnIndex: number
  rowIndex: number
  rowCount: number
  columnCount: number
  style: React.CSSProperties
}) {
  const [maskPosition, setMaskPosition] = useState<Target>()

  function onClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    const boundingClientRect = event.currentTarget.getBoundingClientRect()
    setMaskPosition({
      top: boundingClientRect.y,
      left: boundingClientRect.x,
      width: boundingClientRect.width,
      height: boundingClientRect.height,
    })
  }

  useEffect(() => {
    emitter.on('exit', () => {
      setMaskPosition(undefined)
    })

    return () => {
      emitter.off('exit')
    }
  }, [])

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
        onClick={onClick}
        onFocus={onFocus}
        style={style}
      >
        {gameEntryContent}
        <div className='absolute bottom-0 w-full overflow-hidden text-ellipsis whitespace-nowrap bg-[#ffffffee] px-3 py-1 text-center text-xs text-slate-400'>
          {rom.goodCode.rom}
        </div>
      </GameEntryButton>

      <GameEntryPortals
        maskContent={gameEntryContent}
        maskPosition={maskPosition}
        onMaskShow={() => game.launch(rom)}
      />
    </>
  )
}
