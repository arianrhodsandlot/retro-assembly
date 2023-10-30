import delay from 'delay'
import { isEqual, map, omit } from 'lodash-es'
import { memo, useCallback, useEffect, useRef } from 'react'
import { FixedSizeGrid } from 'react-window'
import { type Rom } from '../../../../core'
import { isFocusingHome } from '../utils'
import { GameEntryGridItem } from './game-entry-grid-item'
import { clearLoadImageQueue } from './utils'

interface GameEntryGridProps extends Omit<FixedSizeGrid['props'], 'children'> {
  roms: Rom[]
}

function GameEntryGrid({ roms, ...props }: GameEntryGridProps) {
  const innerRef = useRef<HTMLDivElement>()
  const { rowCount, columnCount } = props

  const focusFirstButton = useCallback(async () => {
    if (!isFocusingHome()) {
      return
    }
    if (roms?.length) {
      await delay(0)
      innerRef.current?.querySelector('button')?.focus()
    }
  }, [roms])

  useEffect(() => {
    focusFirstButton()
  }, [focusFirstButton])

  useEffect(() => {
    return () => {
      clearLoadImageQueue()
    }
  }, [])

  return roms?.length ? (
    <FixedSizeGrid {...props} innerRef={innerRef} itemData={{ roms, rowCount, columnCount }}>
      {GameEntryGridItem}
    </FixedSizeGrid>
  ) : null
}

// do not rerender when ROMs from server are the same as those from cache
function propsAreEqual(prevProps: GameEntryGridProps, nextProps: GameEntryGridProps) {
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
