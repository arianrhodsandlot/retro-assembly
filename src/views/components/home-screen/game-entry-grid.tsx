import { useAtomValue } from 'jotai'
import { useEffect, useRef } from 'react'
import { FixedSizeGrid } from 'react-window'
import { currentSystemRomsAtom } from './atoms'
import { GameEntry } from './game-entry'

export function GameEntryGrid(props: Omit<FixedSizeGrid['props'], 'children'>) {
  const currentSystemRoms = useAtomValue(currentSystemRomsAtom)
  const innerRef = useRef<HTMLDivElement>()
  const { rowCount, columnCount } = props

  useEffect(() => {
    innerRef.current?.querySelector('button')?.focus()
  }, [currentSystemRoms])

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
