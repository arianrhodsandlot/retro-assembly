import ini from 'ini'
import { createEmscriptenFS } from '../helpers/emscripten-fs'
import { guessCore, readFileAsUint8Array } from '../helpers/file'

const raUserdataDir = '/home/web_user/retroarch/userdata/'
const raCoreConfigDir = `${raUserdataDir}config/`
const raConfigPath = `${raUserdataDir}retroarch.cfg`

function getEmscriptenModuleOverrides() {
  let resolveRunDependenciesPromise: () => void
  const runDependenciesPromise = new Promise<void>((resolve) => {
    resolveRunDependenciesPromise = resolve
  })

  return {
    noInitialRun: true,
    noExitRuntime: false,

    print(...args: unknown[]) {
      console.info(...args)
    },

    printErr(...args: unknown[]) {
      console.error(...args)
    },

    quit(status: unknown, toThrow: unknown) {
      if (status) {
        console.info(status, toThrow)
      }
    },

    locateFile(path) {
      return path
    },

    async monitorRunDependencies(left: number) {
      if (left === 0) {
        resolveRunDependenciesPromise()
      }
      return await runDependenciesPromise
    },
  }
}

interface EmulatorConstructorOptions {
  core?: string
  rom?: File
  style?: Partial<CSSStyleDeclaration>
}

export class Emulator {
  core = ''
  rom?: File
  status: 'initial' | 'ready' | 'terminated' = 'initial'
  canvas: HTMLCanvasElement
  emscripten: any

  constructor({ core, rom, style }: EmulatorConstructorOptions) {
    this.rom = rom ?? undefined
    this.core = core ?? ''
    this.canvas = document.createElement('canvas')
    this.canvas.id = 'canvas'
    this.canvas.hidden = true
    this.canvas.style.display = 'block'

    for (const rule in style) {
      this.canvas.style[rule] = style[rule]
    }

    this.resizeCanvas = this.resizeCanvas.bind(this)
  }

  async launch() {
    if (this.rom) {
      this.core = await guessCore(this.rom)
    }

    if (this.isTerminated()) {
      this.forceExit()
      return
    }

    if (!this.core) {
      throw new Error('Invalid core')
    }
    await this.prepareEmscripten()

    if (this.isTerminated()) {
      this.forceExit()
      return
    }

    this.prepareRaConfigFile()
    this.prepareRaCoreConfigFile()
    this.runMain()
    this.resizeCanvas()
    window.addEventListener('resize', this.resizeCanvas, false)
    if (this.canvas) {
      this.canvas.hidden = false
    }
    this.status = 'ready'
  }

  start() {
    const { Module } = this.emscripten
    Module.resumeMainLoop()
  }

  pause() {
    const { Module } = this.emscripten
    Module.pauseMainLoop()
  }

  exit(statusCode = 0) {
    this.status = 'terminated'
    if (this.emscripten) {
      const { FS, exit, JSEvents } = this.emscripten
      exit(statusCode)
      FS.unmount('/home')
      JSEvents.removeAllEventListeners()
    }
    window.removeEventListener('resize', this.resizeCanvas, false)
    this.canvas?.parentElement?.removeChild(this.canvas)
  }

  private isTerminated() {
    return this.status === 'terminated'
  }

  private forceExit() {
    this.status = 'terminated'
    const { FS, exit, JSEvents } = this.emscripten || {}
    try {
      exit(0)
    } catch {}
    try {
      FS.unmount('/home')
    } catch {}
    try {
      window.removeEventListener('resize', this.resizeCanvas, false)
    } catch {}
    try {
      JSEvents.removeAllEventListeners()
    } catch {}
    try {
      this.canvas?.parentElement?.removeChild(this.canvas)
    } catch {}
  }

  private async prepareEmscripten() {
    const { getEmscripten } = await import(`../../generated/retroarch-cores/${this.core}_libretro.js`)
    this.emscripten = getEmscripten({ Module: getEmscriptenModuleOverrides() })
    document.body.append(this.canvas)

    const { Module } = this.emscripten
    await Promise.all([await this.prepareFileSystem(), await Module.monitorRunDependencies()])
  }

  private async prepareFileSystem() {
    const { Module, FS, PATH, ERRNO_CODES } = this.emscripten

    Module.canvas = this.canvas
    Module.preRun = [() => FS.init()]

    const emscriptenFS = createEmscriptenFS({ FS, PATH, ERRNO_CODES })
    FS.mount(emscriptenFS, { root: '/home' }, '/home')

    if (this.rom) {
      const uint8Array = await readFileAsUint8Array(this.rom)
      FS.createDataFile('/', this.rom.name, uint8Array, true, false)
      const data = FS.readFile(this.rom.name, { encoding: 'binary' })
      FS.mkdirTree(`${raUserdataDir}content/`)
      FS.writeFile(`${raUserdataDir}content/${this.rom.name}`, data, { encoding: 'binary' })
      FS.unlink(this.rom.name)
    }
  }

  private writeConfig({ path, config }) {
    const { FS } = this.emscripten
    const dir = path.slice(0, path.lastIndexOf('/'))
    FS.mkdirTree(dir)
    FS.writeFile(path, ini.stringify(config, { whitespace: true }))
  }

  private getRaCoreConfig() {
    const map = {
      nestopia: {
        nestopia_turbo_pulse: 2,
        nestopia_overclock: '2x',
        nestopia_nospritelimit: 'enabled',
      },
      fceumm: {
        fceumm_turbo_enable: 'Both',
      },
      snes9x: {},
      gearboy: {},
      genesis_plus_gx: {},
      genesis_plus_gx_wide: {},
    }
    return map[this.core]
  }

  private prepareRaCoreConfigFile() {
    const raCoreConfigPathMap = {
      nestopia: 'Nestopia/Nestopia.opt',
      fceumm: 'FCEUmm/FCEUmm.opt',
      gearboy: 'Gearboy/Gearboy.opt',
      picodrive: 'PicoDrive/PicoDrive.opt',
      genesis_plus_gx: 'Genesis Plus GX/Genesis Plus GX.opt',
      genesis_plus_gx_wide: 'Genesis Plus GX Wide/Genesis Plus GX Wide.opt',
    }
    const raCoreConfigPath = raCoreConfigPathMap[this.core] ?? ''
    const raCoreConfig = this.getRaCoreConfig()
    if (raCoreConfigPath && raCoreConfig) {
      this.writeConfig({
        path: `${raCoreConfigDir}${raCoreConfigPath}`,
        config: raCoreConfig,
      })
    }
  }

  private prepareRaConfigFile() {
    const raConfig = {
      menu_driver: 'rgui',
      rewind_enable: true,

      rgui_menu_color_theme: 4,
      // rgui_particle_effect: 3,
      rgui_show_start_screen: false,

      input_rewind_btn: 6, // L2
      // input_hold_fast_forward_btn: 7, // R2
      input_menu_toggle_gamepad_combo: 6, // L1+R1
      rewind_granularity: 4,
    }
    this.writeConfig({ path: raConfigPath, config: raConfig })
  }

  private runMain() {
    const { Module } = this.emscripten
    const raArgs: string[] = []
    if (this.rom) {
      raArgs.push(`/home/web_user/retroarch/userdata/content/${this.rom.name}`)
    }
    Module.callMain(raArgs)
    // Module.resumeMainLoop()

    // tell retroarch that controllers are connected
    for (const gamepad of navigator.getGamepads?.() ?? []) {
      if (gamepad) {
        window.dispatchEvent(new GamepadEvent('gamepadconnected', { gamepad }))
      }
    }
  }

  private resizeCanvas() {
    requestAnimationFrame(() => {
      const { Module } = this.emscripten

      Module.setCanvasSize(innerWidth, innerHeight)
    })
  }
}
