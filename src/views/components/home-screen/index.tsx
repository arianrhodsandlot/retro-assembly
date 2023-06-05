import { clsx } from 'clsx'
import delay from 'delay'
import { useAtomValue, useSetAtom } from 'jotai'
import { useRef, useState } from 'react'
import { useAsync, useMeasure } from 'react-use'
import { system, systemFullNameMap, systemNamesSorted, ui } from '../../../core'
import { needsShowSetupWizardAtom } from '../../lib/atoms'
import { currentSystemNameAtom, currentSystemRomsAtom, groupedRomsAtom } from './atoms'
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

export function HomeScreen() {
  const setGroupedRoms = useSetAtom(groupedRomsAtom)
  const setCurrentSystemName = useSetAtom(currentSystemNameAtom)
  const currentSystemRoms = useAtomValue(currentSystemRomsAtom)
  const [navSystems, setNavSystems] = useState<any[]>([])
  const [gridContainerRef, { width: gridWidth, height: gridHeight }] = useMeasure<HTMLDivElement>()
  const needsShowSetupWizard = useAtomValue(needsShowSetupWizardAtom)
  const needsWaitSetupClose = useRef(false)

  if (needsShowSetupWizard) {
    needsWaitSetupClose.current = true
  }

  const columnCount = getColumnCount(gridWidth)
  const backgroundImage =
    'repeating-linear-gradient(45deg, #fafafa 25%, transparent 25%, transparent 75%, #fafafa 75%, #fafafa), repeating-linear-gradient(45deg, #fafafa 25%, white 25%, white 75%, #fafafa 75%, #fafafa)'

  const state = useAsync(async () => {
    await new Promise((resolve) => system.onStarted(resolve))
    if (needsWaitSetupClose.current) {
      await delay(500)
    }
    const groupedRoms = await ui.listRoms()

    if (!Object.keys(groupedRoms)) {
      // todo: needs better user experience
      throw new Error('empty dir')
    }

    const navSystems = systems
      .filter((system) => groupedRoms?.[system.name]?.length)
      .sort((a, b) => (systemNamesSorted.indexOf(a.name) > systemNamesSorted.indexOf(b.name) ? 1 : -1))

    setGroupedRoms(groupedRoms)
    setNavSystems(navSystems)

    const lastSelectedSystem = localStorage.getItem(lastSelectedSystemStorageKey)
    if (lastSelectedSystem && navSystems.map((system: { name: string }) => system.name).includes(lastSelectedSystem)) {
      setCurrentSystemName(lastSelectedSystem)
    } else {
      setCurrentSystemName(navSystems[0].name)
    }
  })

  if (needsShowSetupWizard) {
    return false
  }

  if (state.error) {
    return false
  }

  if (state.loading) {
    return (
      <div
        className='absolute inset-0 flex flex-col bg-[length:30px_30px] bg-[0_0,15px_15px]'
        style={{ backgroundImage }}
      >
        <SystemNavigation />
        <div className='flex-1 overflow-hidden'>
          <div className='flex h-full items-center justify-center'>
            <span className='icon-[line-md--loading-loop] h-16 w-16 text-red-600' />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className='absolute inset-0 flex flex-col bg-[length:30px_30px] bg-[0_0,15px_15px]'
      style={{ backgroundImage }}
    >
      <SystemNavigation systems={navSystems} />

      <div className='flex-1 overflow-hidden' ref={gridContainerRef}>
        <GameEntryGrid
          className={clsx(['game-entry-grid absolute bottom-0 flex-1 !overflow-x-hidden'])}
          columnCount={columnCount}
          columnWidth={gridWidth / columnCount}
          height={gridHeight}
          rowCount={Math.ceil(currentSystemRoms?.length ? currentSystemRoms.length / columnCount : 0)}
          rowHeight={gridWidth / columnCount}
          width={gridWidth}
        />
      </div>
    </div>
  )
}
