import type { CSSProperties } from 'react'
import type { Rom } from '../../../../../../../core'
import { GameEntry } from './game-entry'

interface GameEntryGridItemProps {
  columnIndex: number
  rowIndex: number
  style: CSSProperties
  data: {
    rowCount: number
    columnCount: number
    roms: Rom[]
  }
}

export function GameEntryGridItem({ columnIndex, rowIndex, style, data }: GameEntryGridItemProps) {
  const { rowCount, columnCount, roms } = data
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
