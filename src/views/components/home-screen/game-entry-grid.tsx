import $ from 'jquery'
import { useEffect, useRef } from 'react'
import { FixedSizeGrid } from 'react-window'
import { type Rom } from '../../../core'
import { GameEntry } from './game-entry'

interface GameEntryGridProps extends Omit<FixedSizeGrid['props'], 'children'> {
  roms: Rom[]
}

export function GameEntryGrid({ roms, ...props }: GameEntryGridProps) {
  const outerRef = useRef()
  const innerRef = useRef<HTMLDivElement>()
  const { rowCount, columnCount } = props

  function onFocus(e: React.FocusEvent<HTMLButtonElement, Element>) {
    const $outer = $(outerRef.current)
    const $focusedElement = $(e.currentTarget)
    const offsetTop = $focusedElement.position().top + $outer.scrollTop()
    const scrollTop = offsetTop - $outer.height() / 2 + $focusedElement.height() / 2
    $outer.stop().animate({ scrollTop }, 100)
  }

  useEffect(() => {
    innerRef.current?.querySelector('button')?.focus()
  }, [roms])

  return roms.length > 0 ? (
    <FixedSizeGrid {...props} innerRef={innerRef} outerRef={outerRef}>
      {({ columnIndex, rowIndex, style }) => {
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
      }}
    </FixedSizeGrid>
  ) : null
}
