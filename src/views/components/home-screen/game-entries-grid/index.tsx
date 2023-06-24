import delay from 'delay'
import { useAtomValue } from 'jotai'
import { useCallback, useEffect, useRef } from 'react'
import { FixedSizeGrid } from 'react-window'
import { currentRomsAtom } from '../atoms'
import { GameEntry } from './game-entry'

export function GameEntryGrid(props: Omit<FixedSizeGrid['props'], 'children'>) {
  const currentRoms = useAtomValue(currentRomsAtom)
  const innerRef = useRef<HTMLDivElement>()
  const { rowCount, columnCount } = props

  const focusFirstButton = useCallback(async () => {
    if (currentRoms?.length) {
      await delay(1)
      innerRef.current?.querySelector('button')?.focus()
    }
  }, [currentRoms])

  useEffect(() => {
    focusFirstButton()
  }, [focusFirstButton])

  return currentRoms?.length ? (
    <FixedSizeGrid {...props} innerRef={innerRef}>
      {({ columnIndex, rowIndex, style }) => {
        const index = rowIndex * columnCount + columnIndex
        const rom = currentRoms[index]
        return (
          rom && (
            <GameEntry
              columnCount={columnCount}
              columnIndex={columnIndex}
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
