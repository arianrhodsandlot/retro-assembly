import { useCallback, useEffect, useState } from 'react'
import { useMeasure, useWindowSize } from 'react-use'
import { type Rom, system, systemFullNameMap, ui } from '../../../core'
import { GameEntryGrid } from './game-entry-grid'
import { SystemNavigation } from './system-navigation'

const systems = Object.entries(systemFullNameMap).map(([name, fullName]) => ({ name, fullName }))

export function GameEntryContainer() {
  const [groupedRoms, setGroupedRoms] = useState<Record<string, Rom[]>>({})
  const [currentSystem, setCurrentSystem] = useState<string>('')
  const windowSize = useWindowSize()
  const [navElement, { width, height: navHeight }] = useMeasure<HTMLDivElement>()

  const roms = groupedRoms[currentSystem]
  const columnCount = 8
  const navSystems = systems.filter((system) => groupedRoms[system.name]?.length)

  useEffect(() => {
    system.onStarted(async () => {
      await loadRoms()
    })
  }, [])

  const selectPrevSystem = useCallback(
    function selectPrevSystem() {
      const index = navSystems.findIndex((system) => system.name === currentSystem)
      if (index > 0) {
        setCurrentSystem(navSystems[index - 1].name)
      }
    },
    [currentSystem, navSystems]
  )

  const selectNextSystem = useCallback(
    function selectPrevSystem() {
      const index = navSystems.findIndex((system) => system.name === currentSystem)
      if (index < navSystems.length - 1) {
        setCurrentSystem(navSystems[index + 1].name)
      }
    },
    [currentSystem, navSystems]
  )

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

  async function loadRoms() {
    const roms = await ui.listRoms()
    const systems = Object.keys(roms)
    if (!systems) {
      alert('empty dir')
      return
    }
    const [currentSystem] = systems
    setGroupedRoms(roms)
    setCurrentSystem(currentSystem && 'nes')
  }

  const gridWidth = width
  const gridHeight = windowSize.height - navHeight
  return (
    <div>
      <SystemNavigation
        currentSystem={currentSystem}
        elementRef={navElement}
        onChange={setCurrentSystem}
        systems={navSystems}
      />

      {roms?.length ? (
        <GameEntryGrid
          className='game-entry-grid absolute bottom-0 left-[200px] !overflow-x-hidden'
          columnCount={columnCount}
          columnWidth={gridWidth / columnCount}
          height={gridHeight}
          roms={roms}
          rowCount={Math.ceil(roms.length / columnCount)}
          rowHeight={gridWidth / columnCount}
          style={{ top: navHeight }}
          width={gridWidth}
        />
      ) : null}
    </div>
  )
}
