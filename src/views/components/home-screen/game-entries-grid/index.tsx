import delay from 'delay'
import { isEqual, map, omit } from 'lodash-es'
import { memo, useCallback, useEffect, useRef } from 'react'
import { FixedSizeGrid } from 'react-window'
import { type Rom } from '../../../../core'
import { GameEntry } from './game-entry'

interface GameEntryGridProps extends Omit<FixedSizeGrid['props'], 'children'> {
  roms: Rom[]
}

function GameEntryGrid({ roms, ...props }: GameEntryGridProps) {
  const innerRef = useRef<HTMLDivElement>()
  const { rowCount, columnCount } = props

  const focusFirstButton = useCallback(async () => {
    if (roms?.length) {
      await delay(0)
      innerRef.current?.querySelector('button')?.focus()
    }
  }, [roms])

  useEffect(() => {
    focusFirstButton()
  }, [focusFirstButton])

  return roms?.length ? (
    <FixedSizeGrid {...props} innerRef={innerRef}>
      {({ columnIndex, rowIndex, style }) => {
        const index = rowIndex * columnCount + columnIndex
        if (index > roms.length - 1) {
          return
        }
        return (
          <GameEntry
            columnCount={columnCount}
            columnIndex={columnIndex}
            rom={roms[index]}
            rowCount={rowCount}
            rowIndex={rowIndex}
            style={style}
          />
        )
      }}
    </FixedSizeGrid>
  ) : null
}

function propsAreEqual(prevProps, nextProps) {
  if (prevProps === nextProps) {
    return true
  }

  if (!isEqual(omit(prevProps, 'roms'), omit(nextProps, 'roms'))) {
    return false
  }

  const prevRoms = prevProps.roms
  const nextRoms = nextProps.roms
  if (prevRoms.length !== nextRoms.length) {
    return false
  }

  const prevRomsIds = map(prevRoms, 'id')
  const nextRomsIds = map(nextRoms, 'id')
  return prevRomsIds.join(',') === nextRomsIds.join(',')
}

const MemorizedGameEntryGrid = memo(GameEntryGrid, propsAreEqual)

export { MemorizedGameEntryGrid as GameEntryGrid }
