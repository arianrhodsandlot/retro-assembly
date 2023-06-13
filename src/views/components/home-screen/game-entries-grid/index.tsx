import delay from 'delay'
import { useAtomValue } from 'jotai'
import { useCallback, useEffect, useRef } from 'react'
import { FixedSizeGrid } from 'react-window'
import { currentSystemRomsAtom } from '../atoms'
import { GameEntry } from './game-entry'

export function GameEntryGrid(props: Omit<FixedSizeGrid['props'], 'children'>) {
  const currentSystemRoms = useAtomValue(currentSystemRomsAtom)
  const innerRef = useRef<HTMLDivElement>()
  const { rowCount, columnCount } = props

  const focusFirstButton = useCallback(async () => {
    if (currentSystemRoms?.length) {
      await delay(1)
      innerRef.current?.querySelector('button')?.focus()
    }
  }, [currentSystemRoms])

  useEffect(() => {
    focusFirstButton()
  }, [focusFirstButton])

  return currentSystemRoms?.length ? (
    <FixedSizeGrid {...props} innerRef={innerRef}>
      {({ columnIndex, rowIndex, style }) => {
        const index = rowIndex * columnCount + columnIndex
        const rom = currentSystemRoms[index]
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
