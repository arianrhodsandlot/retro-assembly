import { useMeasure } from '@react-hookz/web'
import { useAtom, useSetAtom } from 'jotai'
import { some } from 'lodash-es'
import { useEffect, useRef, useState } from 'react'
import { useAsync, useAsyncRetry } from 'react-use'
import {
  type SystemName,
  getHistoryRoms,
  getSystemRoms,
  getSystems,
  isUsingDemo,
  peekHistoryRoms,
  peekSystemRoms,
  peekSystems,
} from '../../../core'
import { romsAtom, systemsAtom } from './atoms'
import { historyDummySystem } from './constants'
import { ErrorContent } from './error-content'
import { GameEntryGrid } from './game-entries-grid'
import { GameLaunching } from './game-launching'
import { HomeScreenLayout } from './home-screen-layout'
import { useRouterHelpers } from './hooks'
import { InputTips } from './input-tips'

function getColumnCount(width: number) {
  const idealItemWidth = innerWidth > 800 ? 200 : 150
  const candicates = [20, 16, 10, 8, 5, 4, 2]
  for (const candicate of candicates) {
    if (width / candicate > idealItemWidth) {
      return candicate
    }
  }
  return candicates.at(-1) as number
}

const lastSelectedSystemStorageKey = 'last-selected-system'

async function peekRoms(system: string) {
  if (system === 'history') {
    return { system, roms: await peekHistoryRoms() }
  }
  return { system, roms: await peekSystemRoms(system) }
}

async function getRoms(system: string) {
  if (system === 'history') {
    return { system, roms: await getHistoryRoms() }
  }
  return { system, roms: await getSystemRoms(system) }
}

export function HomeScreen() {
  const [roms, setRoms] = useAtom(romsAtom)
  const setSystems = useSetAtom(systemsAtom)
  const {
    params,
    navigateToSystem,
    wouter: { useRoute },
  } = useRouterHelpers()
  const [measurements = { width: 0, height: 0 }, gridContainerRef] = useMeasure<HTMLDivElement>()
  const [isRetrying, setIsRetrying] = useState(false)
  const [match] = useRoute('/library/:library/system/:system?')
  const currentSystemRef = useRef(params.system)

  const { width: gridWidth, height: gridHeight } = measurements

  const columnCount = getColumnCount(gridWidth)

  function getNewCurrentSystemName(systems: { name: SystemName; fullName: string }[]) {
    if (!systems?.length) {
      return ''
    }
    const system = params.system || localStorage.getItem(lastSelectedSystemStorageKey)
    const allSystems = [historyDummySystem, ...systems]
    const isSystemValid = some(allSystems, { name: system })
    if (isSystemValid) {
      return system
    }
    if (isUsingDemo()) {
      return 'nes'
    }
    return systems[0].name
  }

  useEffect(() => {
    currentSystemRef.current = params.system
  }, [params.system])

  // load systems from cache
  useAsync(async () => {
    const systems = await peekSystems()
    if (!systems?.length) {
      return
    }
    const newCurrentSystemName = getNewCurrentSystemName(systems)
    setSystems(systems)
    if (newCurrentSystemName && match) {
      navigateToSystem(newCurrentSystemName)
    }
  }, [setSystems])

  // load roms from cache
  const peekRomsState = useAsync(async () => {
    setRoms([])
    if (params.system) {
      const { system, roms } = await peekRoms(params.system)
      const currentSystem = currentSystemRef.current
      if (system === currentSystem && roms) {
        setRoms(roms)
      }
    }
  }, [params.system])

  // load systems from remote
  const systemsState = useAsyncRetry(async () => {
    const systems = await getSystems()
    const newCurrentSystemName = getNewCurrentSystemName(systems)
    setSystems(systems)
    if (newCurrentSystemName && match) {
      navigateToSystem(newCurrentSystemName)
    }
    updateRetrying()
  }, [setSystems])

  // load roms from remote
  const romsState = useAsyncRetry(async () => {
    if (params.system) {
      const { system, roms } = await getRoms(params.system)
      const currentSystem = currentSystemRef.current
      if (system === currentSystem) {
        setRoms(roms)
      }
    }
    updateRetrying()
  }, [params.system])

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

  const isRomsEmpty = !roms?.length
  const showLoading = romsState.loading && !peekRomsState.loading && isRomsEmpty

  if (showLoading) {
    return (
      <HomeScreenLayout>
        <span className='icon-[line-md--loading-loop] h-16 w-16 text-rose-700' />
      </HomeScreenLayout>
    )
  }

  const columnWidth = gridWidth / columnCount
  const error = romsState.loading ? undefined : systemsState.error || romsState.error
  return (
    <HomeScreenLayout>
      {isRomsEmpty || (
        <div className='h-full w-full' ref={gridContainerRef}>
          <GameEntryGrid
            className='game-entry-grid absolute bottom-0 flex-1 !overflow-x-hidden'
            columnCount={columnCount}
            columnWidth={columnWidth}
            height={gridHeight}
            roms={roms}
            rowCount={Math.ceil(roms?.length ? roms.length / columnCount : 0)}
            rowHeight={columnWidth}
            width={gridWidth}
          />
          <InputTips />
          <GameLaunching />
        </div>
      )}

      {error ? <ErrorContent error={error} onSolve={retry} /> : null}
    </HomeScreenLayout>
  )
}
