import { clsx } from 'clsx'
import { useAtom } from 'jotai'
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
  const [systems, setSystems] = useAtom(systemsAtom)
  const [currentSystemName, setCurrentSystemName] = useAtom(currentSystemNameAtom)
  const [gridContainerRef, { width: gridWidth, height: gridHeight }] = useMeasure<HTMLDivElement>()

  const columnCount = getColumnCount(gridWidth)

  const state = useAsyncRetry(async () => {
    if (currentSystemName) {
      const roms = await getSystemRoms(currentSystemName)
      setCurrentRoms(roms)
    } else {
      const systems = await getSystems()
      setSystems(systems)
      const lastSelectedSystem = localStorage.getItem(lastSelectedSystemStorageKey)
      if (lastSelectedSystem && systems.some(({ name }) => name === lastSelectedSystem)) {
        setCurrentSystemName(lastSelectedSystem)
      } else {
        setCurrentSystemName(systems.at(-1).name)
      }

      const roms = await getSystemRoms(lastSelectedSystem)
      setCurrentRoms(roms)
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
