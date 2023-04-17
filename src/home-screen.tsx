import { type FileWithDirectoryAndFileHandle } from 'browser-fs-access'
import classnames from 'classnames'
import { useRef, useState } from 'react'
import { Emulator } from './emulator'
import GameEntry from './game-entry'

export default function HomeScreen({ files }: { files: FileWithDirectoryAndFileHandle[] }) {
  const emulatorRef = useRef<Emulator>()

  const [showGameEntries, setShowGameEntries] = useState(true)

  async function launchRom(file: File) {
    if (emulatorRef.current) {
      exit()
    }
    setShowGameEntries(false)
    const emulator = await Emulator.launch({ rom: file })
    emulatorRef.current = emulator
  }

  function exit() {
    emulatorRef.current?.exit()
    emulatorRef.current = undefined
    setShowGameEntries(true)
  }

  function pause() {
    emulatorRef.current?.pause()
  }

  function start() {
    emulatorRef.current?.start()
  }

  function fullscreen() {
    emulatorRef.current?.emscripten.Module.requestFullscreen()
  }

  const actions = (
    <div className='flex w-80 justify-around'>
      <button onClick={pause}>pause</button>
      <button onClick={start}>start</button>
      <button onClick={fullscreen}>fullscreen</button>
      <button onClick={exit}>exit</button>
    </div>
  )

  if (files) {
    return (
      <div>
        {actions}
        <div
          className={classnames('items-center', 'justify-center', 'gap-4', 'flex-wrap', 'm-auto', [
            {
              flex: showGameEntries,
              hidden: !showGameEntries,
            },
          ])}
        >
          {files.map((file) => (
            <GameEntry file={file} key={file.webkitRelativePath} onClick={() => launchRom(file)}></GameEntry>
          ))}
        </div>
      </div>
    )
  }
  return (
    <div>
      {actions}
      no roms
    </div>
  )
}
