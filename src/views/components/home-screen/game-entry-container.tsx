import { useEffect, useState } from 'react'
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

  useEffect(() => {
    system.onStarted(async () => {
      await loadRoms()
    })
  }, [])

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

  const roms = groupedRoms[currentSystem]
  const columnCount = 8
  const navSystems = systems.filter((system) => groupedRoms[system.name]?.length)

  const gridWidth = width
  const gridHeight = windowSize.height - navHeight
  return (
    <div>
      <SystemNavigation
        elementRef={navElement}
        currentSystem={currentSystem}
        systems={navSystems}
        onChange={setCurrentSystem}
      />

      {roms?.length && (
        <GameEntryGrid
          className='absolute bottom-0 left-[200px] !overflow-x-hidden'
          roms={roms}
          style={{ top: navHeight }}
          columnCount={columnCount}
          columnWidth={gridWidth / columnCount}
          rowCount={Math.ceil(roms.length / columnCount)}
          rowHeight={gridWidth / columnCount}
          height={gridHeight}
          width={gridWidth}
        />
      )}
    </div>
  )
}
