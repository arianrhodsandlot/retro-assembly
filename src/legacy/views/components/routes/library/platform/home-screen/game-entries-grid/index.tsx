import { useAsync } from '@react-hookz/web'
import delay from 'delay'
import { isEqual, map, omit } from 'lodash-es'
import { memo, useEffect, useRef } from 'react'
import { FixedSizeGrid } from 'react-window'
import type { Rom } from '../../../../../../../core'
import { useFocusingHome } from '../hooks/use-focusing-home'
import { useGamepads } from '../input-tips/hooks/use-gamepads'
import { GameEntryGridItem } from './game-entry-grid-item'
import { clearLoadImageQueue } from './utils'

interface GameEntryGridProps extends Omit<FixedSizeGrid['props'], 'children'> {
  roms: Rom[]
}

function GameEntryGrid({ roms, ...props }: GameEntryGridProps) {
  const innerRef = useRef<HTMLDivElement>()
  const gridRef = useRef<any>()
  const { columnCount, rowCount } = props
  const { connected } = useGamepads()
  const focusingHome = useFocusingHome()

  const [, { execute: focusFirstGame }] = useAsync(async () => {
    if (!connected || !focusingHome) {
      return
    }
    if (roms?.length) {
      await delay(0)
      innerRef.current?.querySelector('button')?.focus()
    }
  })

  useEffect(() => {
    gridRef.current.scrollTo({ scrollLeft: 0, scrollTop: 0 })
    focusFirstGame()
  }, [focusFirstGame, roms])

  useEffect(() => {
    return () => {
      clearLoadImageQueue()
    }
  }, [])

  return roms?.length ? (
    <FixedSizeGrid ref={gridRef} {...props} innerRef={innerRef} itemData={{ columnCount, roms, rowCount }}>
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
