import { useAsync, useMeasure } from '@react-hookz/web'
import { useAtom, useSetAtom } from 'jotai'
import { some } from 'lodash-es'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  type PlatformName,
  getHistoryRoms,
  getPlatformRoms,
  getPlatforms,
  isUsingDemo,
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
import { useCurrentPlatformName } from './hooks/use-current-platform'
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
  const { params, isPlatformRoute, isRomRoute, redirectToPlatform } = useRouterHelpers()
  const [measurements = { width: 0, height: 0 }, gridContainerRef] = useMeasure<HTMLDivElement>()
  const [isRetrying, setIsRetrying] = useState(false)
  const currentPlatformName = useCurrentPlatformName()

  const currentPlatformRef = useRef(currentPlatformName)

  const { width: gridWidth, height: gridHeight } = measurements

  const columnCount = getColumnCount(gridWidth)

  function getNewCurrentPlatformName(platforms: { name: PlatformName; fullName: string }[]) {
    if (!platforms?.length) {
      return ''
    }
    const newCurrentPlatform = currentPlatformName || localStorage.getItem(lastSelectedPlatformStorageKey)
    const usingDemo = isUsingDemo()
    const allPlatforms = usingDemo ? platforms : [historyDummyPlatform, ...platforms]
    const isPlatformValid = some(allPlatforms, { name: newCurrentPlatform })
    return isPlatformValid ? newCurrentPlatform : platforms[0].name
  }

  useEffect(() => {
    currentPlatformRef.current = currentPlatformName
  }, [currentPlatformName])

  const [, { execute: loadPlatformsFromCache }] = useAsync(async () => {
    const platforms = await peekPlatforms()
    if (!platforms?.length) {
      return
    }
    const newCurrentPlatformName = getNewCurrentPlatformName(platforms)
    setPlatforms(platforms)
    if (newCurrentPlatformName && isPlatformRoute) {
      redirectToPlatform(newCurrentPlatformName)
    }
  })

  // load roms from cache
  const [peekRomsState, { execute: loadRomsFromCache }] = useAsync(async () => {
    if (currentPlatformName) {
      const { platform: romsPlatform, roms: newRoms } = await peekRoms(currentPlatformName)
      if (romsPlatform === currentPlatformRef.current) {
        if (newRoms?.length) {
          setRoms(newRoms)
        } else {
          setRoms([])
        }
      }
    }
  })

  // load platforms from remote
  const [platformsState, { execute: loadPlatformsFromRemote }] = useAsync(async () => {
    const platforms = await getPlatforms()
    const newCurrentPlatformName = getNewCurrentPlatformName(platforms)
    setPlatforms(platforms)
    if (newCurrentPlatformName && isPlatformRoute) {
      redirectToPlatform(newCurrentPlatformName)
    }
    updateRetrying()
  })

  // load roms from remote
  const [romsState, { execute: loadRomsFromRemote }] = useAsync(async () => {
    if (currentPlatformName) {
      const { platform: romsPlatform, roms } = await getRoms(currentPlatformName)
      if (romsPlatform === currentPlatformRef.current) {
        setRoms(roms)
      }
    }
    updateRetrying()
  })

  function updateRetrying() {
    if (isRetrying) {
      setIsRetrying(platformsState.status === 'loading' || romsState.status === 'loading')
    }
  }

  async function retry() {
    setIsRetrying(true)
    if (platformsState.status !== 'success') {
      await loadPlatformsFromRemote()
    }
    if (romsState.status !== 'success') {
      await loadRomsFromRemote()
    }
  }

  const loadPlatformsAndRomsFromCache = useCallback(
    async function () {
      await loadPlatformsFromCache()
      await loadRomsFromCache()
    },
    [loadPlatformsFromCache, loadRomsFromCache],
  )

  const loadPlatformsAndRomsFromRemote = useCallback(
    async function () {
      await loadPlatformsFromRemote()
      await loadRomsFromRemote()
    },
    [loadPlatformsFromRemote, loadRomsFromRemote],
  )

  useEffect(() => {
    if (isRomRoute) {
      return
    }

    ;(async () => {
      await loadPlatformsAndRomsFromCache()
      await loadPlatformsAndRomsFromRemote()
    })()
  }, [params.library, currentPlatformName, isRomRoute, loadPlatformsAndRomsFromCache, loadPlatformsAndRomsFromRemote])

  const isRomsEmpty = !roms?.length
  const showLoading = romsState.status === 'loading' && peekRomsState.status !== 'loading' && isRomsEmpty

  if (showLoading) {
    return (
      <HomeScreenLayout>
        <span className='icon-[line-md--loading-loop] size-16 text-rose-700' />
      </HomeScreenLayout>
    )
  }

  const columnWidth = gridWidth / columnCount
  const error = romsState.status === 'loading' ? undefined : platformsState.error || romsState.error
  return (
    <HomeScreenLayout>
      {isRomsEmpty || (
        <div className='size-full' ref={gridContainerRef}>
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
