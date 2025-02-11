import delay from 'delay'
import { Nostalgist } from 'nostalgist'
import { getCDNHost, vendorsInfo } from '../constants/dependencies'
import { platformCoreMap } from '../constants/platforms'
import { defaultRetroarchCoresConfig, getRetroarchConfig } from '../helpers/retroarch'
import type { Rom } from './rom'

interface EmulatorConstructorOptions {
  additionalFiles?: { blob: Blob; name: string }[]
  biosFiles?: { blob: Blob; name: string }[]
  core?: string
  coreConfig?: Record<string, Record<string, string>>
  retroarchConfig?: Record<string, string>
  rom?: Rom
  style?: Partial<CSSStyleDeclaration>
}

const defaultStyle: Partial<CSSStyleDeclaration> = {
  backgroundImage:
    'repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, #222 25%, #222 75%, #000 75%, #000)',
  backgroundPosition: '0 0,15px 15px',
  backgroundSize: '30px 30px',
  cursor: 'default',
  height: '100%',
  inset: '0',
  opacity: '1',
  position: 'fixed',
  touchAction: 'none',
  width: '100%',
  zIndex: '10',
}

export class Emulator {
  additionalFiles?: { blob: Blob; name: string }[]
  biosFiles?: { blob: Blob; name: string }[]
  canvas: HTMLCanvasElement
  core = ''
  coreConfig: Record<string, Record<string, string>> | undefined
  gameStatus: 'paused' | 'running' = 'running'
  nostalgist: Nostalgist | undefined
  processStatus: 'initial' | 'ready' | 'terminated' = 'initial'
  retroarchConfig: Record<string, string> | undefined
  rom?: Rom
  style: Partial<CSSStyleDeclaration>
  private hideCursorAbortController: AbortController | undefined

  private previousActiveElement: Element | null

  constructor({
    additionalFiles,
    biosFiles,
    core,
    coreConfig,
    retroarchConfig,
    rom,
    style,
  }: EmulatorConstructorOptions) {
    this.rom = rom ?? undefined
    this.biosFiles = biosFiles
    this.additionalFiles = additionalFiles
    this.core = core ?? ''
    this.canvas = document.createElement('canvas')
    this.previousActiveElement = document.activeElement
    this.coreConfig = coreConfig
    this.retroarchConfig = retroarchConfig
    this.style = { ...defaultStyle, ...style }

    this.resizeCanvas = this.resizeCanvas.bind(this)
    this.showCanvasCusor = this.showCanvasCusor.bind(this)
  }

  exit() {
    this.processStatus = 'terminated'

    this.nostalgist?.exit()

    this.cleanupDOM()
    // @ts-expect-error try to focus on previous active element
    this.previousActiveElement?.focus?.()
  }

  async launch(waitForUserInteraction?: () => Promise<void>) {
    if (!this.rom) {
      throw new Error('invalid rom')
    }

    // todo: maybe this is not necessary
    await this.rom.ready()
    this.core = platformCoreMap[this.rom.platform]

    if (!this.rom) {
      throw new Error('invalid rom')
    }

    const fileName = this.rom.fileAccessor.name
    const fileContent = await this.rom.getBlob()

    const rom = [
      { fileContent, fileName },
      ...(this.additionalFiles?.map(({ blob, name }) => ({ fileContent: blob, fileName: name })) || []),
    ]
    const bios = this.biosFiles?.map(({ blob, name }) => ({ fileContent: blob, fileName: name })) || []
    const retroarchConfig = { ...getRetroarchConfig(), ...this.retroarchConfig }
    const retroarchCoreConfig = { ...defaultRetroarchCoresConfig[this.core], ...this.coreConfig?.[this.core] }
    const launchOptions = {
      bios,
      core: this.core,
      element: this.canvas,
      respondToGlobalEvents: false,
      retroarchConfig,
      retroarchCoreConfig,
      rom,
      // experimental shader support
      shader: localStorage._shader,
      style: this.style,
      async waitForInteraction({ done }) {
        await waitForUserInteraction?.()
        done()
      },
    }
    const vendorCores = ['a5200', 'fbneo', 'prosystem', 'stella2014']
    if (vendorCores.includes(launchOptions.core)) {
      Object.assign(launchOptions, {
        resolveCoreJs(core: string) {
          const corePath = `dist/cores/${core}_libretro.js`
          return `${getCDNHost()}/npm/${vendorsInfo.name}@${vendorsInfo.version}/${corePath}`
        },
        resolveCoreWasm(core: string) {
          const corePath = `dist/cores/${core}_libretro.wasm`
          return `${getCDNHost()}/npm/${vendorsInfo.name}@${vendorsInfo.version}/${corePath}`
        },
      })
    }
    this.nostalgist = await Nostalgist.launch(launchOptions)
    this.setupDOM()
    this.processStatus = 'ready'
  }

  loadState(blob: Blob) {
    this.nostalgist?.loadState(blob)
  }

  pause() {
    this.nostalgist?.pause()
  }

  restart() {
    this.nostalgist?.restart()
  }

  resume() {
    this.nostalgist?.resume()
  }

  async saveState() {
    if (!this.nostalgist) {
      throw new Error('invalid nostalgist')
    }

    const { state, thumbnail } = await this.nostalgist.saveState()
    return {
      blob: state,
      core: this.core,
      createTime: Date.now(),
      name: this.rom?.fileAccessor.name,
      thumbnailBlob: thumbnail,
    }
  }

  private cleanupDOM() {
    document.body.removeEventListener('mousemove', this.showCanvasCusor, false)
    window.removeEventListener('resize', this.resizeCanvas, false)
    this.canvas.remove()
    document.body.style.removeProperty('overflow')
    if (screen.orientation) {
      screen.orientation.removeEventListener('change', this.resizeCanvas, false)
    }
  }

  private async resizeCanvas() {
    await delay(100)
    this.nostalgist?.resize({
      height: innerHeight,
      width: innerWidth,
    })
  }

  private setupDOM() {
    this.showCanvasCusor()

    document.body.addEventListener('mousemove', this.showCanvasCusor, false)
    window.addEventListener('resize', this.resizeCanvas, false)
    document.body.style.setProperty('overflow', 'hidden')

    if (screen.orientation) {
      screen.orientation.addEventListener('change', this.resizeCanvas, false)
    }

    // tell retroarch that controllers are connected
    for (const gamepad of navigator.getGamepads?.() ?? []) {
      if (gamepad) {
        globalThis.dispatchEvent(new GamepadEvent('gamepadconnected', { gamepad }))
      }
    }
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
}
