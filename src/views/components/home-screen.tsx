import { type FileWithDirectoryAndFileHandle } from 'browser-fs-access'
import { useState } from 'react'
import EmulatorWrapper from './emulator-wrapper'
import GameEntry from './game-entry'
import StartButtons from './start-buttons'

export default function HomeScreen() {
  const [roms, setRoms] = useState<FileWithDirectoryAndFileHandle[]>()
  const [currentRom, setCurrentRom] = useState<FileWithDirectoryAndFileHandle | false>(false)

  function onSelectRoms(files: FileWithDirectoryAndFileHandle[]) {
    setRoms(files)
  }

  function onSelectRom(file: FileWithDirectoryAndFileHandle) {
    setRoms([file])
    setCurrentRom(file)
  }

  if (roms) {
    return (
      <>
        <div className='m-auto flex min-h-screen flex-wrap items-start'>
          {roms.map((rom) => (
            <GameEntry file={rom} key={rom.webkitRelativePath} onClick={() => setCurrentRom(rom)} />
          ))}
        </div>
        {currentRom && <EmulatorWrapper rom={currentRom} onExit={() => setCurrentRom(false)} />}
      </>
    )
  }
  return <StartButtons onSelectRoms={onSelectRoms} onSelectRom={onSelectRom} />
}
