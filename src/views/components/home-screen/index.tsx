import { useAtom, useSetAtom, useStore } from 'jotai'
import { some } from 'lodash-es'
import { useEffect, useState } from 'react'
import { useAsync, useAsyncRetry, useMeasure } from 'react-use'
import { getHistoryRoms, getSystemRoms, getSystems, peekHistoryRoms, peekSystemRoms, peekSystems } from '../../../core'
import { currentSystemNameAtom, romsAtom, systemsAtom } from './atoms'
import { historyDummySystem } from './constants'
import { ErrorContent } from './error-content'
import { GameEntryGrid } from './game-entries-grid'
import { GameLaunching } from './game-launching'
import { GameMenus } from './game-menus'
import { HomeScreenLayout } from './home-screen-layout'
import { InputTips } from './input-tips'
import { VirtualController } from './virtual-controller'

function getColumnCount(width: number) {
  const idealItemWidth = 200
  const candicates = [20, 16, 10, 8, 5, 4, 2]
  for (const candicate of candicates) {
    if (width / candicate > idealItemWidth) {
      return candicate
    }
  }
  return candicates.at(-1) as number
}

const lastSelectedSystemStorageKey = 'last-selected-system'

function getNewCurrentSystemName(systems) {
  if (!systems?.length) {
    return ''
  }
  const lastSelectedSystem = localStorage.getItem(lastSelectedSystemStorageKey)
  const allSystems = [historyDummySystem, ...systems]
  const isLastSelectedSystemValid = some(allSystems, { name: lastSelectedSystem })
  const defaultSystemName = systems[0].name
  return isLastSelectedSystemValid ? lastSelectedSystem : defaultSystemName
}

async function peekRoms(system: string) {
  if (system === 'history') {
    return await peekHistoryRoms()
  }
  return await peekSystemRoms(system)
}

async function getRoms(system: string) {
  if (system === 'history') {
    return await getHistoryRoms()
  }
  return await getSystemRoms(system)
}

export function HomeScreen() {
  const [roms, setRoms] = useAtom(romsAtom)
  const setSystems = useSetAtom(systemsAtom)
  const store = useStore()
  const [currentSystemName, setCurrentSystemName] = useAtom(currentSystemNameAtom)
  const [gridContainerRef, { width: gridWidth, height: gridHeight }] = useMeasure<HTMLDivElement>()
  const [isRetrying, setIsRetrying] = useState(false)

  const columnCount = getColumnCount(gridWidth)

  // load systems from cache
  useAsync(async () => {
    const systems = await peekSystems()
    if (!systems) {
      return
    }
    const newCurrentSystemName = getNewCurrentSystemName(systems)
    setSystems(systems)
    setCurrentSystemName(newCurrentSystemName)
  }, [setSystems, setCurrentSystemName])

  // load roms from cache
  const peekRomsState = useAsync(async () => {
    setRoms([])
    if (currentSystemName) {
      const roms = await peekRoms(currentSystemName)
      if (currentSystemName === store.get(currentSystemNameAtom) && roms) {
        setRoms(roms)
      }
    }
  }, [currentSystemName])

  // load systems from remote
  const systemsState = useAsyncRetry(async () => {
    const systems = await getSystems()
    const newCurrentSystemName = getNewCurrentSystemName(systems)
    setSystems(systems)
    setCurrentSystemName(newCurrentSystemName)
    updateRetrying()
  }, [setSystems, setCurrentSystemName])

  // load roms from remote
  const romsState = useAsyncRetry(async () => {
    if (currentSystemName) {
      const roms = await getRoms(currentSystemName)
      if (currentSystemName === store.get(currentSystemNameAtom)) {
        setRoms(roms)
      }
    }
    updateRetrying()
  }, [currentSystemName])

  function updateRetrying() {
    if (isRetrying) {
      setIsRetrying(systemsState.loading || romsState.loading)
    }
  }

  function retry() {
    setIsRetrying(true)
    if (systemsState.error) {
      systemsState.retry()
    }
    if (romsState.error) {
      romsState.retry()
    }
  }

  useEffect(() => {
    return () => {
      setCurrentSystemName('')
    }
  }, [setCurrentSystemName])

  const isRomsEmpty = !roms?.length
  const loading = (romsState.loading && !peekRomsState.loading && isRomsEmpty) || systemsState.loading
  const error = systemsState.error || romsState.error

  if (loading) {
    return (
      <HomeScreenLayout>
        <span className='icon-[line-md--loading-loop] h-16 w-16 text-rose-700' />
      </HomeScreenLayout>
    )
  }

  const columnWidth = gridWidth / columnCount
  return (
    <HomeScreenLayout>
      <>
        {isRomsEmpty || (
          <>
            <div className='h-full w-full' ref={gridContainerRef}>
              <GameEntryGrid
                className='a game-entry-grid absolute bottom-0 flex-1 !overflow-x-hidden'
                columnCount={columnCount}
                columnWidth={columnWidth}
                height={gridHeight}
                roms={roms}
                rowCount={Math.ceil(roms?.length ? roms.length / columnCount : 0)}
                rowHeight={columnWidth}
                width={gridWidth}
              />

              <GameLaunching />
            </div>

            <GameMenus />

            <InputTips />

            <VirtualController />
          </>
        )}

        {error ? <ErrorContent error={error} onSolve={retry} /> : null}
      </>
    </HomeScreenLayout>
  )
}
