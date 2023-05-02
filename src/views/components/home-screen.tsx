import classNames from 'classnames'
import { useEffect, useState } from 'react'
import { OneDriveCloudProvider, Rom, systemFullNameMap } from '../../core'
import EmulatorWrapper from './emulator-wrapper'
import GameEntry from './game-entry'
import StartButtons from './start-buttons'

const oneDrive = OneDriveCloudProvider.get()

window.O = OneDriveCloudProvider
window.o = oneDrive
window.c = oneDrive.client

const systems = Object.entries(systemFullNameMap).map(([name, fullName]) => ({ name, fullName }))

export default function HomeScreen() {
  const [groupedRoms, setGroupedRoms] = useState<Record<string, Rom[]>>({})
  const [currentRom, setCurrentRom] = useState<Rom | false>(false)
  const [currentSystem, setCurrentSystem] = useState<string>('')

  // function onSelectFiles(files: File[]) {
  //   const roms = Rom.fromFiles(files)
  //   setRoms(roms)
  // }

  // function onSelectFile(file: File) {
  //   const rom = Rom.fromFile(file)
  //   if (rom) {
  //     setRoms([rom])
  //     setCurrentRom(rom)
  //   }
  // }

  useEffect(() => {
    ;(async () => {
      const selectedDir = '/test-roms/'
      const remoteFiles = await oneDrive.listDirFilesRecursely(selectedDir)
      const roms = Rom.fromOneDrivePaths(remoteFiles)
      const grouped = Rom.groupBySystem(roms)
      const currentSystem = Object.keys(grouped)[0] && 'nes'
      setGroupedRoms(grouped)
      setCurrentSystem(currentSystem)
    })()
  }, [])

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
