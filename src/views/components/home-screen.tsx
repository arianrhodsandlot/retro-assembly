import { useState } from 'react'
import { Rom } from '../../core'
import EmulatorWrapper from './emulator-wrapper'
import GameEntry from './game-entry'
import StartButtons from './start-buttons'

export default function HomeScreen() {
  const [roms, setRoms] = useState<Rom[]>()
  const [currentRom, setCurrentRom] = useState<Rom | false>(false)

  function onSelectFiles(files: File[]) {
    const roms = Rom.fromFiles(files)
    setRoms(roms)
  }

  function onSelectFile(file: File) {
    const rom = Rom.fromFile(file)
    if (rom) {
      setRoms([rom])
      setCurrentRom(rom)
    }
  }

  function onSelectOneDriveFile(remoteItems: string[]) {
    const roms = Rom.fromOneDrivePaths(remoteItems)
    setRoms(roms)
  }

  if (roms) {
    return (
      <>
        <div className='m-auto flex min-h-screen flex-wrap items-start'>
          {roms.map((rom) => (
            <GameEntry rom={rom} key={rom.id ?? rom.path} onClick={() => setCurrentRom(rom)} />
          ))}
        </div>
        {currentRom && <EmulatorWrapper rom={currentRom} onExit={() => setCurrentRom(false)} />}
      </>
    )
  }
  return (
    <StartButtons
      onSelectFiles={onSelectFiles}
      onSelectFile={onSelectFile}
      onSelectOneDriveFile={onSelectOneDriveFile}
    />
  )
}
