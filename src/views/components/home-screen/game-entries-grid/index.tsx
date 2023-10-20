import delay from 'delay'
import { useCallback, useEffect, useRef } from 'react'
import { FixedSizeGrid } from 'react-window'
import { type Rom } from '../../../../core'
import { isFocusingHome } from '../utils'
import { GameEntryGridItem } from './game-entry-grid-item'
import { clearLoadImageQueue } from './utils'

interface GameEntryGridProps extends Omit<FixedSizeGrid['props'], 'children'> {
  roms: Rom[]
}

export function GameEntryGrid({ roms, ...props }: GameEntryGridProps) {
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
