import { clsx } from 'clsx'
import { useAtom, useSetAtom, useStore } from 'jotai'
import { useEffect } from 'react'
import { useAsyncRetry, useMeasure } from 'react-use'
import { getSystemRoms, getSystems } from '../../../core'
import { Emulator } from '../emulator'
import { currentRomsAtom, currentSystemNameAtom, systemsAtom } from './atoms'
import { ErrorContent } from './error-content'
import { GameEntryGrid } from './game-entries-grid'
import { HomeScreenLayout } from './home-screen-layout'
import { InputTips } from './input-tips'

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

export function HomeScreen() {
  const [currentRoms, setCurrentRoms] = useAtom(currentRomsAtom)
  const setSystems = useSetAtom(systemsAtom)
  const store = useStore()
  const [currentSystemName, setCurrentSystemName] = useAtom(currentSystemNameAtom)
  const [gridContainerRef, { width: gridWidth, height: gridHeight }] = useMeasure<HTMLDivElement>()

  const columnCount = getColumnCount(gridWidth)

  useEffect(() => {
    async function updateSystems() {
      const systems = await getSystems()

      const lastSelectedSystem = localStorage.getItem(lastSelectedSystemStorageKey)
      const newCurrentSystemName =
        lastSelectedSystem && systems.some(({ name }) => name === lastSelectedSystem)
          ? lastSelectedSystem
          : systems[0].name

      setSystems(systems)
      setCurrentSystemName(newCurrentSystemName)

      localStorage.setItem(lastSelectedSystemStorageKey, newCurrentSystemName)
    }
    updateSystems()
  }, [setSystems, setCurrentSystemName])

  const state = useAsyncRetry(async () => {
    if (currentSystemName) {
      const roms = await getSystemRoms(currentSystemName)
      if (currentSystemName === store.get(currentSystemNameAtom)) {
        setCurrentRoms(roms)
      }
    }
  }, [currentSystemName])

  if (state.error) {
    return (
      <HomeScreenLayout>
        <ErrorContent error={state.error} onSolve={() => state.retry()} />
      </HomeScreenLayout>
    )
  }

  if (state.loading) {
    return (
      <HomeScreenLayout>
        <span className='icon-[line-md--loading-loop] h-16 w-16 text-red-600' />
      </HomeScreenLayout>
    )
  }

  const columnWidth = gridWidth / columnCount
  return (
    <HomeScreenLayout>
      <div className='h-full w-full' ref={gridContainerRef}>
        <GameEntryGrid
          className={clsx(['game-entry-grid absolute bottom-0 flex-1 !overflow-x-hidden'])}
          columnCount={columnCount}
          columnWidth={columnWidth}
          height={gridHeight}
          rowCount={Math.ceil(currentRoms?.length ? currentRoms.length / columnCount : 0)}
          rowHeight={columnWidth}
          width={gridWidth}
        />
      </div>

      <Emulator />

      <InputTips />
    </HomeScreenLayout>
  )
}
