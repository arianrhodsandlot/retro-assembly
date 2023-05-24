import $ from 'jquery'
import { useRef } from 'react'
import { FixedSizeGrid, type GridChildComponentProps } from 'react-window'
import { type Rom } from '../../../core'
import { GameEntry } from './game-entry'

interface GameEntryGridProps extends Omit<FixedSizeGrid['props'], 'children'> {
  roms: Rom[]
}

export function GameEntryGrid({ roms, ...props }: GameEntryGridProps) {
  const outerRef = useRef()
  const innerRef = useRef()
  const { rowCount, columnCount } = props
  const $outer = $(outerRef.current)

  function onFocus(e: React.FocusEvent<HTMLButtonElement, Element>) {
    const $focusedElement = $(e.currentTarget)
    const offsetTop = $focusedElement.position().top + $outer.scrollTop()
    const scrollTop = offsetTop - $outer.height() / 2 + $focusedElement.height() / 2
    $outer.stop().animate({ scrollTop }, 100)
  }

  function FixedSizeGridItem({ columnIndex, rowIndex, style }: GridChildComponentProps) {
    const index = rowIndex * columnCount + columnIndex
    const rom = roms[index]

    return (
      rom && (
        <GameEntry
          columnCount={columnCount}
          columnIndex={columnIndex}
          index={index}
          onFocus={onFocus}
          rom={rom}
          rowCount={rowCount}
          rowIndex={rowIndex}
          style={style}
        />
      )
    )
  }

  return roms.length > 0 ? (
    <FixedSizeGrid {...props} innerRef={innerRef} outerRef={outerRef}>
      {FixedSizeGridItem}
    </FixedSizeGrid>
  ) : null
}
