import { useMeasure } from '@react-hookz/web'
import { useAtom, useSetAtom } from 'jotai'
import { some } from 'lodash-es'
import { useEffect, useRef, useState } from 'react'
import { useAsync, useAsyncRetry } from 'react-use'
import {
  type PlatformName,
  getHistoryRoms,
  getPlatformRoms,
  getPlatforms,
  peekHistoryRoms,
  peekPlatformRoms,
  peekPlatforms,
} from '../../../../../../core'
import { useRouterHelpers } from '../../../../hooks/use-router-helpers'
import { platformsAtom, romsAtom } from './atoms'
import { historyDummyPlatform } from './constants'
import { ErrorContent } from './error-content'
import { GameEntryGrid } from './game-entries-grid'
import { GameLaunching } from './game-launching'
import { HomeScreenLayout } from './home-screen-layout'
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

const lastSelectedPlatformStorageKey = 'last-selected-system'

async function peekRoms(platform: string) {
  if (platform === 'history') {
    return { platform, roms: await peekHistoryRoms() }
  }
  return { platform, roms: await peekPlatformRoms(platform) }
}

async function getRoms(platform: string) {
  if (platform === 'history') {
    return { platform, roms: await getHistoryRoms() }
  }
  return { platform, roms: await getPlatformRoms(platform) }
}

export function HomeScreen() {
  const [roms, setRoms] = useAtom(romsAtom)
  const setPlatforms = useSetAtom(platformsAtom)
  const { params, isPlatformRoute, navigateToPlatform } = useRouterHelpers()
  const [measurements = { width: 0, height: 0 }, gridContainerRef] = useMeasure<HTMLDivElement>()
  const [isRetrying, setIsRetrying] = useState(false)

  const currentPlatformRef = useRef(params.platform)

  const { width: gridWidth, height: gridHeight } = measurements

  const columnCount = getColumnCount(gridWidth)

  function getNewCurrentPlatformName(platforms: { name: PlatformName; fullName: string }[]) {
    if (!platforms?.length) {
      return ''
    }
    const newCurrentPlatform = params.platform || localStorage.getItem(lastSelectedPlatformStorageKey)
    const allPlatforms = [historyDummyPlatform, ...platforms]
    const isPlatformValid = some(allPlatforms, { name: newCurrentPlatform })
    return isPlatformValid ? newCurrentPlatform : platforms[0].name
  }

  useEffect(() => {
    currentPlatformRef.current = params.platform
  }, [params.platform])

  // load platforms from cache
  useAsync(async () => {
    const platforms = await peekPlatforms()
    if (!platforms?.length) {
      return
    }
    const newCurrentPlatformName = getNewCurrentPlatformName(platforms)
    setPlatforms(platforms)
    if (newCurrentPlatformName && isPlatformRoute) {
      navigateToPlatform(newCurrentPlatformName)
    }
  }, [setPlatforms, params.library])

  // load roms from cache
  const peekRomsState = useAsync(async () => {
    setRoms([])
    if (params.platform) {
      const { platform: romsPlatform, roms } = await peekRoms(params.platform)
      const currentPlatform = currentPlatformRef.current
      if (romsPlatform === currentPlatform && roms) {
        setRoms(roms)
      }
    }
  }, [params.platform])

  // load platforms from remote
  const platformsState = useAsyncRetry(async () => {
    if (params.rom) {
      return
    }
    const platforms = await getPlatforms()
    const newCurrentPlatformName = getNewCurrentPlatformName(platforms)
    setPlatforms(platforms)
    if (newCurrentPlatformName && isPlatformRoute) {
      navigateToPlatform(newCurrentPlatformName)
    }
    updateRetrying()
  }, [setPlatforms, params.library])

  // load roms from remote
  const romsState = useAsyncRetry(async () => {
    if (params.rom) {
      return
    }
    if (params.platform) {
      const { platform: romsPlatform, roms } = await getRoms(params.platform)
      const currentPlatform = currentPlatformRef.current
      if (romsPlatform === currentPlatform) {
        setRoms(roms)
      }
    }
    updateRetrying()
  }, [params.platform])

  function updateRetrying() {
    if (isRetrying) {
      setIsRetrying(platformsState.loading || romsState.loading)
    }
  }

  function retry() {
    setIsRetrying(true)
    if (platformsState.error) {
      platformsState.retry()
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
  const error = romsState.loading ? undefined : platformsState.error || romsState.error
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
