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
          index={index}
          columnIndex={columnIndex}
          rowCount={rowCount}
          columnCount={columnCount}
          rowIndex={rowIndex}
          style={style}
          rom={rom}
          onFocus={onFocus}
        />
      )
    )
  }

  return roms.length > 0 ? (
    <FixedSizeGrid {...props} outerRef={outerRef} innerRef={innerRef}>
      {FixedSizeGridItem}
    </FixedSizeGrid>
  ) : null
}
