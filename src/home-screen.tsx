import { type FileWithDirectoryAndFileHandle } from 'browser-fs-access'
import { useRef } from 'react'
import { Emulator } from './emulator'

function guessSystem(file: FileWithDirectoryAndFileHandle) {
  if (file.webkitRelativePath.includes('nes')) {
    return 'nes'
  }
  if (file.webkitRelativePath.includes('n64')) {
    return 'n64'
  }
  if (file.webkitRelativePath.includes('gba')) {
    return 'gba'
  }
  if (file.webkitRelativePath.includes('gbc')) {
    return 'gbc'
  }
  if (file.webkitRelativePath.includes('gb')) {
    return 'gb'
  }
  if (file.webkitRelativePath.includes('megadrive')) {
    return 'megadrive'
  }
}

export default function HomeScreen({ files }: { files: File[] }) {
  const emulatorRef = useRef<Emulator>()

  async function launchRom(file: File) {
    if (emulatorRef.current) {
      exit()
    }
    const emulator = await Emulator.launch({ rom: file })
    emulatorRef.current = emulator
  }

  function exit() {
    emulatorRef.current?.exit()
    emulatorRef.current = undefined
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
        <div>
          {files.map((file) => (
            <button key={file.webkitRelativePath} onClick={() => launchRom(file)} className='flex'>
              <div className='w-32 text-center'>{guessSystem(file)}</div>
              <div className='ml-10'>{file.name}</div>
            </button>
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
