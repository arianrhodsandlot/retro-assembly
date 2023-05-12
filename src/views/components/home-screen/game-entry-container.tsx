import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { type Rom, system, systemFullNameMap, ui } from '../../../core'
import EmulatorWrapper from '../emulator/emulator-wrapper'
import GameEntry from './game-entry'

const systems = Object.entries(systemFullNameMap).map(([name, fullName]) => ({ name, fullName }))

export function GameEntryContainer() {
  const [groupedRoms, setGroupedRoms] = useState<Record<string, Rom[]>>({})
  const [currentRom, setCurrentRom] = useState<Rom | false>(false)
  const [currentSystem, setCurrentSystem] = useState<string>('')

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
    setCurrentSystem(currentSystem)
  }

  const roms = groupedRoms[currentSystem]
  return (
    <>
      <div className='w-full overflow-auto'>
        <div className='flex flex-nowrap'>
          {systems
            .filter((system) => groupedRoms[system.name]?.length)
            .map((system) => (
              <div
                role='button'
                className={classNames('flex shrink-0 items-center justify-center border border-[#fe0000] px-3 py-2', {
                  'bg-[#fe0000] text-white': system.name === currentSystem,
                })}
                key={system.name}
                aria-hidden='true'
                onClick={() => setCurrentSystem(system.name)}
              >
                {system.fullName}
              </div>
            ))}
        </div>
      </div>
      <div className='m-auto flex min-h-screen flex-wrap items-start'>
        {roms?.map((rom) => (
          <GameEntry rom={rom} key={rom.id} onClick={() => setCurrentRom(rom)} />
        ))}
      </div>
      {currentRom && <EmulatorWrapper rom={currentRom} onExit={() => setCurrentRom(false)} />}
    </>
  )
}
