import { useEffect, useRef } from 'react'
import { Emulator } from './emulator'

export default function App() {
  const emulatorRef = useRef<Emulator>()
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    console.info('mounted')
  }, [])

  async function launch(options: { core?: string; rom?: File }) {
    if (emulatorRef.current) {
      exit()
    }
    const emulator = await Emulator.launch(options)
    emulatorRef.current = emulator
    window.emu = emulator
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

  function menu() {
    emulatorRef.current?.emscripten.Module._cmd_toggle_menu()
  }

  function fullscreen() {
    emulatorRef.current?.emscripten.Module.requestFullscreen()
  }

  async function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const rom = event.target.files?.[0]
    if (rom) {
      await launch({ rom })
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div style={{ position: 'absolute', zIndex: 1 }}>
      <p>
        <button onClick={() => launch({ core: '2048' })}>launch 2048</button>
      </p>
      <p>
        <input type='file' name='rom' onChange={onFileChange} ref={fileInputRef} />
      </p>
      <p>
        <button onClick={pause}>pause</button>
      </p>
      <p>
        <button onClick={start}>start</button>
      </p>
      <p>
        <button onClick={fullscreen}>fullscreen</button>
      </p>
      <p>
        <button onClick={menu}>menu</button>
      </p>
      <p>
        <button onClick={exit}>exit</button>
      </p>
    </div>
  )
}
