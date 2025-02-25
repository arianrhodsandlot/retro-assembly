import type { CSSProperties } from 'react'
import type { Rom } from '../../../../../../../core'
import { GameEntry } from './game-entry'

interface GameEntryGridItemProps {
  columnIndex: number
  data: {
    columnCount: number
    roms: Rom[]
    rowCount: number
  }
  rowIndex: number
  style: CSSProperties
}

export function GameEntryGridItem({ columnIndex, data, rowIndex, style }: GameEntryGridItemProps) {
  const { columnCount, roms, rowCount } = data
  const index = rowIndex * columnCount + columnIndex
  const rom = roms[index]

  if (rom) {
    return (
      <GameEntry
        columnCount={columnCount}
        columnIndex={columnIndex}
        key={rom.id}
        rom={rom}
        rowCount={rowCount}
        rowIndex={rowIndex}
        style={style}
      />
    )
  }
}
