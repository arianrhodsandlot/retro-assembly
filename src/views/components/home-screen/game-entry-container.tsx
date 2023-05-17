import { useEffect, useState } from 'react'
import { useMeasure } from 'react-use'
import { type Rom, system, systemFullNameMap, ui } from '../../../core'
import EmulatorWrapper from '../emulator/emulator-wrapper'
import { GameEntryGrid } from './game-entry-grid'
import { SystemNavigation } from './system-navigation'

const systems = Object.entries(systemFullNameMap).map(([name, fullName]) => ({ name, fullName }))

export function GameEntryContainer() {
  const [groupedRoms, setGroupedRoms] = useState<Record<string, Rom[]>>({})
  const [currentRom, setCurrentRom] = useState<Rom | false>(false)
  const [currentSystem, setCurrentSystem] = useState<string>('')
  const [containerElement, { width, height }] = useMeasure<HTMLDivElement>()
  const [navElement, { height: navHeight }] = useMeasure<HTMLDivElement>()

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
  const columnCount = 5
  const navSystems = systems.filter((system) => groupedRoms[system.name]?.length)

  const gridWidth = width + 2
  const gridHeight = height + 2
  return (
    <div className='h-screen w-full overflow-x-hidden pl-[200px]' ref={containerElement}>
      <SystemNavigation
        elementRef={navElement}
        currentSystem={currentSystem}
        systems={navSystems}
        onChange={setCurrentSystem}
      />

      {roms?.length && (
        <GameEntryGrid
          className='-ml-[2px] -mt-[2px] !overflow-x-hidden'
          roms={roms}
          columnCount={columnCount}
          columnWidth={gridWidth / columnCount}
          rowCount={Math.ceil(roms.length / columnCount)}
          rowHeight={gridWidth / columnCount}
          height={gridHeight - navHeight}
          width={gridWidth}
          onLaunch={setCurrentRom}
        />
      )}

      {currentRom && <EmulatorWrapper rom={currentRom} onExit={() => setCurrentRom(false)} />}
    </div>
  )
}
