import { clsx } from 'clsx'
import { useCallback, useEffect, useState } from 'react'
import { useMeasure } from 'react-use'
import { type Rom, systemFullNameMap, systemNamesSorted, ui } from '../../../core'
import { GameEntryGrid } from './game-entry-grid'
import { SystemNavigation } from './system-navigation'

const systems = Object.entries(systemFullNameMap).map(
  ([name, fullName]) =>
    ({ name, fullName } as {
      name: keyof typeof systemFullNameMap
      fullName: string
    })
)

function getColumnCount(width: number) {
  const idealItemWidth = 250
  const candicates = [10, 8, 5, 4]
  for (const candicate of candicates) {
    if (width / candicate > idealItemWidth) {
      return candicate
    }
  }
  return candicates.at(-1) as number
}

const lastSelectedSystemStorageKey = 'last-selected-system'

interface GameEntryContainerProps {
  groupedRoms: Record<string, Rom[]> | undefined
  loading: boolean
}

export function GameEntryContainer({ groupedRoms, loading }: GameEntryContainerProps) {
  const navSystems = systems
    .filter((system) => groupedRoms?.[system.name]?.length)
    .sort((a, b) => (systemNamesSorted.indexOf(a.name) > systemNamesSorted.indexOf(b.name) ? 1 : -1))
  const defaultSystemName = localStorage.getItem(lastSelectedSystemStorageKey) ?? navSystems?.[0]?.name ?? ''
  const [currentSystemName, setCurrentSystemName] = useState<string>(defaultSystemName)
  const [gridContainerRef, { width: gridWidth, height: gridHeight }] = useMeasure<HTMLDivElement>()

  const roms = groupedRoms?.[currentSystemName]
  const columnCount = getColumnCount(gridWidth)
  const backgroundImage =
    'repeating-linear-gradient(45deg, #fafafa 25%, transparent 25%, transparent 75%, #fafafa 75%, #fafafa), repeating-linear-gradient(45deg, #fafafa 25%, white 25%, white 75%, #fafafa 75%, #fafafa)'
  const selectPrevSystem = useCallback(
    function selectPrevSystem() {
      const index = navSystems.findIndex((system) => system.name === currentSystemName)
      if (index > 0) {
        setCurrentSystemName(navSystems[index - 1].name)
      } else {
        setCurrentSystemName(navSystems.at(-1)?.name || '')
      }
    },
    [currentSystemName, navSystems]
  )

  const selectNextSystem = useCallback(
    function selectPrevSystem() {
      const index = navSystems.findIndex((system) => system.name === currentSystemName)
      if (index < navSystems.length - 1) {
        setCurrentSystemName(navSystems[index + 1].name)
      } else {
        setCurrentSystemName(navSystems[0].name)
      }
    },
    [currentSystemName, navSystems]
  )

  useEffect(() => {
    if (currentSystemName) {
      localStorage.setItem(lastSelectedSystemStorageKey, currentSystemName)
    }
  }, [currentSystemName])

  useEffect(() => {
    ui.onPressButton('l1', selectPrevSystem)
    return () => {
      ui.offPressButton('l1', selectPrevSystem)
    }
  }, [selectPrevSystem])

  useEffect(() => {
    ui.onPressButton('r1', selectNextSystem)
    return () => {
      ui.offPressButton('r1', selectNextSystem)
    }
  }, [selectNextSystem])

  return (
    <div
      className='relative flex h-screen flex-col bg-[length:30px_30px] bg-[0_0,15px_15px]'
      style={{ backgroundImage }}
    >
      <SystemNavigation currentSystem={currentSystemName} onChange={setCurrentSystemName} systems={navSystems} />

      <div className='flex-1 overflow-hidden' ref={gridContainerRef}>
        {loading ? (
          <div className='flex h-full items-center justify-center'>
            <span className='icon-[line-md--loading-loop] h-16 w-16 text-red-600' />
          </div>
        ) : (
          <GameEntryGrid
            className={clsx(['game-entry-grid absolute bottom-0 flex-1 !overflow-x-hidden'])}
            columnCount={columnCount}
            columnWidth={gridWidth / columnCount}
            height={gridHeight}
            roms={roms}
            rowCount={Math.ceil(roms?.length ? roms.length / columnCount : 0)}
            rowHeight={gridWidth / columnCount}
            width={gridWidth}
          />
        )}
      </div>
    </div>
  )
}
