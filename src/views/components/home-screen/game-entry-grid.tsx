import { FixedSizeGrid } from 'react-window'
import { type Rom } from '../../../core'
import GameEntry from './game-entry'

export function GameEntryGrid({
  roms,
  onLaunch,
  ...props
}: {
  roms: Rom[]
  onLaunch: (rom: Rom) => void
} & Omit<FixedSizeGrid['props'], 'children'>) {
  if (roms.length === 0) {
    return null
  }
  const { columnCount } = props

  return (
    <FixedSizeGrid {...props}>
      {({ columnIndex, rowIndex, style }) => {
        const index = rowIndex * columnCount + columnIndex
        const rom = roms[index]
        return (
          rom && (
            <div style={style}>
              <GameEntry rom={rom} onClick={() => onLaunch(rom)} />
            </div>
          )
        )
      }}
    </FixedSizeGrid>
  )
}
