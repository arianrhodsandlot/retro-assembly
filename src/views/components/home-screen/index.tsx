import { clsx } from 'clsx'
import { useAtomValue, useSetAtom, useStore } from 'jotai'
import { useAsyncRetry, useMeasure } from 'react-use'
import { ui } from '../../../core'
import { Emulator } from '../emulator'
import { currentSystemNameAtom, currentSystemRomsAtom, groupedRomsAtom, systemsAtom } from './atoms'
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
  const setGroupedRoms = useSetAtom(groupedRomsAtom)
  const setCurrentSystemName = useSetAtom(currentSystemNameAtom)
  const currentSystemRoms = useAtomValue(currentSystemRomsAtom)
  const [gridContainerRef, { width: gridWidth, height: gridHeight }] = useMeasure<HTMLDivElement>()
  const store = useStore()

  const columnCount = getColumnCount(gridWidth)

  const state = useAsyncRetry(async () => {
    const groupedRoms = await ui.listRoms()

    if (!Object.keys(groupedRoms)) {
      // todo: needs better user experience
      throw new Error('empty dir')
    }

    setGroupedRoms(groupedRoms)
    const lastSelectedSystem = localStorage.getItem(lastSelectedSystemStorageKey)
    const systems = store.get(systemsAtom)
    if (systems?.length) {
      if (lastSelectedSystem && systems.map((system: { name: string }) => system.name).includes(lastSelectedSystem)) {
        setCurrentSystemName(lastSelectedSystem)
      } else {
        setCurrentSystemName(systems[0].name)
      }
    }
  })

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
          rowCount={Math.ceil(currentSystemRoms?.length ? currentSystemRoms.length / columnCount : 0)}
          rowHeight={columnWidth}
          width={gridWidth}
        />
      </div>

      <Emulator />

      <InputTips />
    </HomeScreenLayout>
  )
}
