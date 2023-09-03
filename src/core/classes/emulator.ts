import delay from 'delay'
import ini from 'ini'
import ky from 'ky'
import { kebabCase } from 'lodash-es'
import { join } from 'path-browserify'
import { systemCoreMap } from '../constants/systems'
import { createEmscriptenFS } from '../helpers/emscripten-fs'
import { blobToBuffer } from '../helpers/file'
import { defaultRetroarchCoresConfig, getRetroarchConfig } from '../helpers/retroarch'
import { type Rom } from './rom'

// Commands reference https://docs.libretro.com/development/retroarch/network-control-interface/
type RetroArchCommand =
  | 'FAST_FORWARD'
  | 'FAST_FORWARD_HOLD'
  | 'LOAD_STATE'
  | 'SAVE_STATE'
  | 'FULLSCREEN_TOGGLE'
  | 'QUIT'
  | 'STATE_SLOT_PLUS'
  | 'STATE_SLOT_MINUS'
  | 'REWIND'
  | 'MOVIE_RECORD_TOGGLE'
  | 'PAUSE_TOGGLE'
  | 'FRAMEADVANCE'
  | 'RESET'
  | 'SHADER_NEXT'
  | 'SHADER_PREV'
  | 'CHEAT_INDEX_PLUS'
  | 'CHEAT_INDEX_MINUS'
  | 'CHEAT_TOGGLE'
  | 'SCREENSHOT'
  | 'MUTE'
  | 'NETPLAY_FLIP'
  | 'SLOWMOTION'
  | 'VOLUME_UP'
  | 'VOLUME_DOWN'
  | 'OVERLAY_NEXT'
  | 'DISK_EJECT_TOGGLE'
  | 'DISK_NEXT'
  | 'DISK_PREV'
  | 'GRAB_MOUSE_TOGGLE'
  | 'MENU_TOGGLE'

const raUserdataDir = '/home/web_user/retroarch/userdata/'
const raCoreConfigDir = `${raUserdataDir}config/`
const raConfigPath = `${raUserdataDir}retroarch.cfg`

const encoder = new TextEncoder()

const cdnHost = 'https://cdn.jsdelivr.net'
const cdnType = 'npm'
const vendorsRepo = 'retro-assembly-vendors'
const vendorsVersion = '1.16.0-202309022354'

function getCoreWasmUrl(coreFileName: string) {
  const corePath = `dist/cores/${coreFileName}`
  return `${cdnHost}/${cdnType}/${vendorsRepo}@${vendorsVersion}/${corePath}`
}

function getCoreJsUrl(coreName: string) {
  const corePath = `dist/cores/${coreName}_libretro.js`
  return `${cdnHost}/${cdnType}/${vendorsRepo}@${vendorsVersion}/${corePath}`
}

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

    locateFile(path: string) {
      return getCoreWasmUrl(path)
    },

    async monitorRunDependencies(left: number) {
      if (left === 0) {
        resolveRunDependenciesPromise()
      }
      return await runDependenciesPromise
    },
  }
}

function updateStyle(element: HTMLElement, style: Partial<CSSStyleDeclaration>) {
  if (!element) {
    return
  }
  for (const rule in style) {
    if (style[rule]) {
      element.style.setProperty(kebabCase(rule), style[rule] as string)
    } else {
      element.style.removeProperty(rule)
    }
  }
}

interface EmulatorConstructorOptions {
  core?: string
  rom?: Rom
  style?: Partial<CSSStyleDeclaration>
  biosFiles?: { name: string; blob: Blob }[]
}

export class Emulator {
  core = ''
  rom?: Rom
  biosFiles?: { name: string; blob: Blob }[]
  processStatus: 'initial' | 'ready' | 'terminated' = 'initial'
  gameStatus: 'paused' | 'running' = 'running'
  canvas: HTMLCanvasElement
  emscripten: any
  private previousActiveElement: Element | null
  private messageQueue: [Uint8Array, number][] = []

  private hideCursorAbortController: AbortController | undefined

  constructor({ core, rom, style, biosFiles }: EmulatorConstructorOptions) {
    this.rom = rom ?? undefined
    this.biosFiles = biosFiles
    this.core = core ?? ''
    this.canvas = document.createElement('canvas')
    this.canvas.id = 'canvas'
    this.canvas.hidden = true
    this.canvas.width = 900
    this.canvas.height = 900
    this.previousActiveElement = document.activeElement
    this.canvas.tabIndex = 0
    updateStyle(this.canvas, {
      backgroundColor: 'black',
      backgroundImage:
        'repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, #222 25%, #222 75%, #000 75%, #000)',
      backgroundPosition: '0 0,15px 15px',
      backgroundSize: '30px 30px',
      cursor: 'default',
      display: 'block',
      imageRendering: 'pixelated', // this boosts performance!
      inset: '0',
      maxHeight: '100%',
      maxWidth: '100%',
      position: 'fixed',
      visibility: 'hidden',
      zIndex: '10',
      ...style,
    })

    this.resizeCanvas = this.resizeCanvas.bind(this)
    this.showCanvasCusor = this.showCanvasCusor.bind(this)
  }

  private get stateFileName() {
    if (!this.rom) {
      throw new Error('rom is not ready')
    }
    const { name } = this.rom.fileAccessor
    const baseName = name.slice(0, name.lastIndexOf('.'))
    return `${raUserdataDir}states/${baseName}.state`
  }

  private get stateThumbnailFileName() {
    return `${this.stateFileName}.png`
  }

  async launch(waitForUserInteraction?: () => Promise<void>) {
    if (this.rom) {
      // todo: maybe this is not necessary
      await this.rom.ready()
      this.core = systemCoreMap[this.rom.system]
    }

    if (this.isTerminated()) {
      this.forceExit()
      return
    }

    if (!this.core) {
      throw new Error('Invalid core')
    }
    await this.setupEmscripten()

    if (this.isTerminated()) {
      this.forceExit()
      return
    }

    this.setupRaConfigFile()
    this.setupRaCoreConfigFile()

    await waitForUserInteraction?.()

    this.runMain()

    this.setupDOM()
    this.canvas.focus()

    this.processStatus = 'ready'
  }

  resume() {
    if (this.gameStatus === 'paused') {
      this.sendCommand('PAUSE_TOGGLE')
    }
    this.gameStatus = 'running'
  }

  restart() {
    this.sendCommand('RESET')
    this.resume()
  }

  pause() {
    if (this.gameStatus === 'running') {
      this.sendCommand('PAUSE_TOGGLE')
    }
    this.gameStatus = 'paused'
  }

  async saveState() {
    this.clearStateFile()
    if (!this.rom || !this.emscripten) {
      return
    }
    this.sendCommand('SAVE_STATE')
    const shouldSaveThumbnail = true
    let stateBuffer: Buffer
    let stateThumbnailBuffer: Buffer | undefined
    if (shouldSaveThumbnail) {
      ;[stateBuffer, stateThumbnailBuffer] = await Promise.all([
        this.waitForEmscriptenFile(this.stateFileName),
        this.waitForEmscriptenFile(this.stateThumbnailFileName),
      ])
    } else {
      stateBuffer = await this.waitForEmscriptenFile(this.stateFileName)
    }
    this.clearStateFile()
    return {
      name: this.rom?.fileAccessor.name,
      core: this.core,
      createTime: Date.now(),
      blob: new Blob([stateBuffer], { type: 'application/octet-stream' }),
      thumbnailBlob: stateThumbnailBuffer ? new Blob([stateThumbnailBuffer], { type: 'image/png' }) : undefined,
    }
  }

  async loadState(blob: Blob) {
    this.clearStateFile()
    if (this.emscripten) {
      const { FS } = this.emscripten
      const buffer = await blobToBuffer(blob)
      FS.writeFile(this.stateFileName, buffer)
      await this.waitForEmscriptenFile(this.stateFileName)
      this.sendCommand('LOAD_STATE')
    }
  }

  exit(statusCode = 0) {
    this.processStatus = 'terminated'
    if (this.emscripten) {
      const { FS, exit, JSEvents } = this.emscripten
      exit(statusCode)
      FS.unmount('/home')
      JSEvents.removeAllEventListeners()
    }
    this.cleanupDOM()
    // @ts-expect-error try to focus on previous active element
    this.previousActiveElement?.focus?.()
  }

  private async showCanvasCusor() {
    this.canvas.style.cursor = 'default'

    if (this.hideCursorAbortController) {
      this.hideCursorAbortController.abort()
    }
    this.hideCursorAbortController = new AbortController()
    try {
      await delay(3000, { signal: this.hideCursorAbortController.signal })
      this.canvas.style.cursor = 'none'
    } catch {}
  }

  private sendCommand(msg: RetroArchCommand) {
    const bytes = encoder.encode(`${msg}\n`)
    this.messageQueue.push([bytes, 0])
  }

  // copied from https://github.com/libretro/RetroArch/pull/15017
  private stdin() {
    const { messageQueue } = this
    // Return ASCII code of character, or null if no input
    while (messageQueue.length > 0) {
      const msg = messageQueue[0][0]
      const index = messageQueue[0][1]
      if (index >= msg.length) {
        messageQueue.shift()
      } else {
        messageQueue[0][1] = index + 1
        // assumption: msg is a uint8array
        return msg[index]
      }
    }
    return null
  }

  private clearStateFile() {
    const { FS } = this.emscripten
    try {
      FS.unlink(this.stateFileName)
      FS.unlink(this.stateThumbnailFileName)
    } catch {}
  }

  private async waitForEmscriptenFile(fileName) {
    const { FS } = this.emscripten
    const maxRetries = 30
    let buffer
    let isFinished = false
    let retryTimes = 0
    while (retryTimes <= maxRetries && !isFinished) {
      const delayTime = Math.min(100 * 2 ** retryTimes, 1000)
      await delay(delayTime)
      try {
        const newBuffer = FS.readFile(fileName).buffer
        isFinished = buffer?.byteLength > 0 && buffer?.byteLength === newBuffer.byteLength
        buffer = newBuffer
      } catch (error) {
        console.warn(error)
      }
      retryTimes += 1
    }
    if (!isFinished) {
      throw new Error('fs timeout')
    }
    return buffer
  }

  private isTerminated() {
    return this.processStatus === 'terminated'
  }

  private forceExit() {
    this.processStatus = 'terminated'
    const { FS, exit, JSEvents } = this.emscripten || {}
    try {
      exit(0)
    } catch {}
    try {
      FS.unmount('/home')
    } catch {}
    try {
      JSEvents.removeAllEventListeners()
    } catch {}
    try {
      this.cleanupDOM()
    } catch {}
  }

  private async setupEmscripten() {
    // @ts-expect-error for retroarch fast forward
    window.setImmediate ??= window.setTimeout
    const coreJsUrl = getCoreJsUrl(this.core)
    const jsContentBody = await ky(coreJsUrl).text()
    const jsContent = `
    export function getEmscripten({ Module }) {
      ${jsContentBody}
      return { PATH, FS, ERRNO_CODES, JSEvents, ENV, Module, exit: _emscripten_force_exit }
    }
    `
    const jsBlob = new Blob([jsContent], {
      type: 'application/javascript',
    })
    const jsBlobUrl = URL.createObjectURL(jsBlob)
    const { getEmscripten } = await import(/* @vite-ignore */ jsBlobUrl)
    URL.revokeObjectURL(jsBlobUrl)

    this.emscripten = getEmscripten({ Module: getEmscriptenModuleOverrides() })
    document.body.append(this.canvas)
    document.body.style.setProperty('overflow', 'hidden')

    const { Module } = this.emscripten
    await Promise.all([await this.setupFileSystem(), await Module.monitorRunDependencies()])
  }

  private async setupFileSystem() {
    const { Module, FS, PATH, ERRNO_CODES } = this.emscripten

    Module.canvas = this.canvas
    Module.preRun = [
      () =>
        FS.init(() => {
          return this.stdin()
        }),
    ]

    const emscriptenFS = await createEmscriptenFS({ FS, PATH, ERRNO_CODES })
    FS.mount(emscriptenFS, { root: '/home' }, '/home')

    if (this.rom) {
      FS.mkdirTree(`${raUserdataDir}content/`)
    }

    if (this.rom) {
      const blob = await this.rom.getBlob()
      const fileName = this.rom.fileAccessor.name
      const buffer = await blobToBuffer(blob)
      FS.createDataFile('/', fileName, buffer, true, false)
      const data = FS.readFile(fileName, { encoding: 'binary' })
      FS.writeFile(`${raUserdataDir}content/${fileName}`, data, { encoding: 'binary' })
      FS.unlink(fileName)
    }

    if (this.biosFiles) {
      FS.mkdirTree(`${raUserdataDir}system/`)
      for (const { name, blob } of this.biosFiles) {
        const fileName = name
        const buffer = await blobToBuffer(blob)
        FS.createDataFile('/', fileName, buffer, true, false)
        const data = FS.readFile(fileName, { encoding: 'binary' })
        FS.writeFile(`${raUserdataDir}system/${fileName}`, data, { encoding: 'binary' })
        FS.unlink(fileName)
      }
    }
  }

  private writeFile({ path, config }) {
    const { FS } = this.emscripten
    const dir = path.slice(0, path.lastIndexOf('/'))
    FS.mkdirTree(dir)
    // @ts-expect-error `platform` option is not listed in @types/ini for now
    FS.writeFile(path, ini.stringify(config, { whitespace: true, platform: 'linux' }))
  }

  private getRaCoreConfig() {
    return defaultRetroarchCoresConfig[this.core]
  }

  private setupRaCoreConfigFile() {
    const raCoreConfigPathMap = {
      nestopia: 'Nestopia/Nestopia.opt',
      fceumm: 'FCEUmm/FCEUmm.opt',
      gearboy: 'Gearboy/Gearboy.opt',
      genesis_plus_gx: 'Genesis Plus GX/Genesis Plus GX.opt',
    }
    const raCoreConfigPath = raCoreConfigPathMap[this.core] ?? ''
    const raCoreConfig = this.getRaCoreConfig()
    if (raCoreConfigPath && raCoreConfig) {
      this.writeFile({
        path: join(raCoreConfigDir, raCoreConfigPath),
        config: raCoreConfig,
      })
    }
  }

  private setupRaConfigFile() {
    const config = getRetroarchConfig()
    this.writeFile({ path: raConfigPath, config })
  }

  private runMain() {
    const { Module, JSEvents } = this.emscripten
    const raArgs: string[] = []
    if (this.rom) {
      raArgs.push(`/home/web_user/retroarch/userdata/content/${this.rom.fileAccessor.name}`)
    }
    Module.callMain(raArgs)

    // Emscripten module register keyboard events to document, which make custome interactions unavilable.
    // Let's modify the default event liseners
    const keyboardEvents = new Set(['keyup', 'keydown', 'keypress'])
    const globalKeyboardEventHandlers = JSEvents.eventHandlers.filter(
      ({ eventTypeString, target }) => keyboardEvents.has(eventTypeString) && target === document,
    )
    for (const globalKeyboardEventHandler of globalKeyboardEventHandlers) {
      const { eventTypeString, target, handlerFunc } = globalKeyboardEventHandler
      JSEvents.registerOrRemoveHandler({ eventTypeString, target })
      JSEvents.registerOrRemoveHandler({
        ...globalKeyboardEventHandler,
        handlerFunc: (...args) => {
          const [event] = args
          if (event?.target === this.canvas) {
            handlerFunc(...args)
          }
        },
      })
    }
  }

  private resizeCanvas() {
    requestAnimationFrame(() => {
      const { Module } = this.emscripten
      Module.setCanvasSize(innerWidth, innerHeight)
    })
  }

  private setupDOM() {
    this.resizeCanvas()
    this.showCanvasCusor()

    document.body.addEventListener('mousemove', this.showCanvasCusor, false)
    window.addEventListener('resize', this.resizeCanvas, false)
    document.body.style.setProperty('overflow', 'hidden')
    updateStyle(this.canvas, { visibility: 'visible' })

    // tell retroarch that controllers are connected
    for (const gamepad of navigator.getGamepads?.() ?? []) {
      if (gamepad) {
        window.dispatchEvent(new GamepadEvent('gamepadconnected', { gamepad }))
      }
    }
  }

  private cleanupDOM() {
    document.body.removeEventListener('mousemove', this.showCanvasCusor, false)
    window.removeEventListener('resize', this.resizeCanvas, false)
    this.canvas.remove()
    document.body.style.removeProperty('overflow')
  }
}
