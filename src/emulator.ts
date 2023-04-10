import { BlobReader, ZipReader } from '@zip.js/zip.js'
import ini from 'ini'
import { createEmscriptenFS } from './emscripten-fs.js'
import { getEmscriptenModuleOverrides } from './emscripten-module'

const raUserdataDir = '/home/web_user/retroarch/userdata/'
const raCoreConfigDir = `${raUserdataDir}config/`
const raConfigPath = `${raUserdataDir}retroarch.cfg`

async function readFileAsUint8Array(file: File) {
  const fileReader = new FileReader()
  fileReader.readAsArrayBuffer(file)
  return await new Promise<ArrayBuffer>((resolve, reject) => {
    fileReader.addEventListener('load', () => {
      resolve(new Uint8Array(fileReader.result as ArrayBuffer))
    })
  })
}

function guessCoreByFilename(filename: string) {
  const extname = filename.split('.').pop()
  if (!extname) {
    return ''
  }
  const coreMap = {
    nes: 'nestopia',
    fds: 'nestopia',
    unf: 'fceumm',
    unif: 'fceumm',
    sms: 'genesis_plus_gx',
    gg: 'genesis_plus_gx',
    md: 'genesis_plus_gx',
    '32x': 'picodrive',
    sfc: 'snes9x',
    gb: 'gearboy',
    gbc: 'gearboy',
    gba: 'mgba',
    mgw: 'gw',
    vb: 'beetle_vb',
    vboy: 'beetle_vb',
  }
  return coreMap[extname] ?? ''
}

async function guessCoreByExtractedContent(file) {
  if (!file) {
    return ''
  }
  const blobReader = new BlobReader(file)
  const zipReader = new ZipReader(blobReader)
  const entries = await zipReader.getEntries()
  for (const { filename } of entries) {
    const core = guessCoreByFilename(filename)
    if (core) {
      return core
    }
  }
  return ''
}

export class Emulator {
  core = ''
  rom?: File
  status: 'initial' | 'ready' = 'initial'
  canvas: HTMLCanvasElement
  emscripten: any

  constructor({ core, rom }: { core?: string; rom?: File }) {
    this.rom = rom ?? undefined
    this.core = core ?? ''
    this.canvas = document.createElement('canvas')
    this.canvas.id = 'canvas'
    this.canvas.hidden = true
    this.canvas.style.display = 'block'

    this.resizeCanvas = this.resizeCanvas.bind(this)
  }

  static async launch({ core, rom }: { core?: string; rom?: File }) {
    const emulator = new Emulator({ core, rom })
    if (rom) {
      emulator.core = await emulator.guessCore()
    }
    if (!emulator.core) {
      throw new Error('Invalid core')
    }
    await emulator.prepareEmscripten()
    emulator.prepareRaConfigFile()
    emulator.prepareRaCoreConfigFile()
    emulator.runMain()
    emulator.resizeCanvas()
    window.addEventListener('resize', emulator.resizeCanvas, false)
    if (emulator.canvas) {
      emulator.canvas.hidden = false
    }
    emulator.status = 'ready'
    return emulator
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
    const { FS, exit, JSEvents } = this.emscripten
    exit(statusCode)
    FS.unmount('/home')
    window.removeEventListener('resize', this.resizeCanvas, false)
    JSEvents.removeAllEventListeners()
    this.canvas?.parentElement?.removeChild(this.canvas)
  }

  private async guessCore() {
    if (!this.rom) {
      return ''
    }
    const filename = this.rom.name
    if (!filename) {
      return ''
    }
    if (filename.endsWith('.zip')) {
      return await guessCoreByExtractedContent(this.rom)
    }
    return guessCoreByFilename(filename)
  }

  private async prepareEmscripten() {
    const { getEmscripten } = await import(`./generated/retroarch-cores/${this.core}_libretro.js`)
    // const { getEmscripten } = await import(`./retroarch/${this.core}_libretro.dev.mjs`)
    this.emscripten = getEmscripten({ Module: getEmscriptenModuleOverrides() })
    document.body.append(this.canvas)

    const { Module } = this.emscripten
    await Promise.all([await this.prepareFileSystem(), await Module.monitorRunDependencies()])
  }

  private async prepareFileSystem() {
    const { Module, FS, PATH, ERRNO_CODES } = this.emscripten

    Module.canvas = this.canvas
    Module.preRun = [() => FS.init()]

    const emscriptenFS = await createEmscriptenFS({ FS, PATH, ERRNO_CODES })
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
      rgui_particle_effect: 3,
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

    for (const gamepad of navigator.getGamepads?.() ?? []) {
      if (gamepad) {
        window.dispatchEvent(new GamepadEvent('gamepadconnected', { gamepad }))
      }
    }
  }

  private resizeCanvas() {
    const { Module } = this.emscripten

    Module.setCanvasSize(innerWidth, innerHeight)
  }
}
