import clsx from 'clsx'
import { useCallback, useEffect, useState } from 'react'
import { useMeasure, useWindowSize } from 'react-use'
import { type Rom, system, systemFullNameMap, systemNamesSorted, ui } from '../../../core'
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

export function GameEntryContainer() {
  const [groupedRoms, setGroupedRoms] = useState<Record<string, Rom[]>>({})
  const [currentSystemName, setCurrentSystemName] = useState<string>('')
  const [navSystems, setNavSystems] = useState<
    {
      name: string
      fullName: string
    }[]
  >([])
  const windowSize = useWindowSize()
  const [navElement, { width, height: navHeight }] = useMeasure<HTMLDivElement>()

  const roms = groupedRoms[currentSystemName]
  const columnCount = getColumnCount(width)

  const gridWidth = width
  const gridHeight = windowSize.height - navHeight
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
    system.onStarted(async () => {
      await loadRoms()
    })
  }, [])

  useEffect(() => {
    if (currentSystemName) {
      localStorage.setItem(lastSelectedSystemStorageKey, currentSystemName)
    }
  }, [currentSystemName])

  async function loadRoms() {
    const roms = await ui.listRoms()

    if (!Object.keys(roms)) {
      // todo: needs better user experience
      alert('empty dir')
      return
    }

    const navSystems = systems
      .filter((system) => roms[system.name]?.length)
      .sort((a, b) => (systemNamesSorted.indexOf(a.name) > systemNamesSorted.indexOf(b.name) ? 1 : -1))

    setGroupedRoms(roms)
    setNavSystems(navSystems)
    setCurrentSystemName(localStorage.getItem(lastSelectedSystemStorageKey) ?? navSystems[0].name ?? '')
  }

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
    <div className='relative h-screen'>
      <SystemNavigation
        currentSystem={currentSystemName}
        elementRef={navElement}
        onChange={setCurrentSystemName}
        systems={navSystems}
      />

      {roms?.length ? (
        <GameEntryGrid
          className={clsx([
            'game-entry-grid absolute bottom-0 !overflow-x-hidden bg-gray-300 bg-[length:30px_30px] bg-center shadow-inner',
          ])}
          columnCount={columnCount}
          columnWidth={gridWidth / columnCount}
          height={gridHeight}
          roms={roms}
          rowCount={Math.ceil(roms.length / columnCount)}
          rowHeight={gridWidth / columnCount}
          style={{
            top: navHeight,
            backgroundImage:
              'repeating-linear-gradient(45deg, #ddd 25%, transparent 25%, transparent 75%, #ddd 75%, #ddd), repeating-linear-gradient(45deg, #ddd 25%, #e5e5f7 25%, #e5e5f7 75%, #ddd 75%, #ddd)',
            backgroundPosition: '0 0, 15px 15px',
          }}
          width={gridWidth}
        />
      ) : null}
    </div>
  )
}
