import { FixedSizeGrid, type GridChildComponentProps } from 'react-window'
import { type Rom } from '../../../core'
import GameEntry from './game-entry'

interface GameEntryGridProps extends Omit<FixedSizeGrid['props'], 'children'> {
  roms: Rom[]
}

export function GameEntryGrid({ roms, ...props }: GameEntryGridProps) {
  const { rowCount, columnCount } = props

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
        />
      )
    )
  }

  return roms.length > 0 ? <FixedSizeGrid {...props}>{FixedSizeGridItem}</FixedSizeGrid> : null
}
