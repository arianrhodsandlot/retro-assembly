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
