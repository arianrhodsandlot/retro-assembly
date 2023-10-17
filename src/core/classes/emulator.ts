import delay from 'delay'
import { Nostalgist } from 'nostalgist'
import { cdnHost, vendorsInfo } from '../constants/dependencies'
import { systemCoreMap } from '../constants/systems'
import { defaultRetroarchCoresConfig, getRetroarchConfig } from '../helpers/retroarch'
import { type Rom } from './rom'

interface EmulatorConstructorOptions {
  core?: string
  rom?: Rom
  style?: Partial<CSSStyleDeclaration>
  biosFiles?: { name: string; blob: Blob }[]
  additionalFiles?: { name: string; blob: Blob }[]
  coreConfig?: Record<string, Record<string, string>>
  retroarchConfig?: Record<string, string>
}

const defaultStyle: Partial<CSSStyleDeclaration> = {
  backgroundImage:
    'repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, #222 25%, #222 75%, #000 75%, #000)',
  backgroundPosition: '0 0,15px 15px',
  backgroundSize: '30px 30px',
  cursor: 'default',
  position: 'fixed',
  inset: '0',
  height: '100%',
  width: '100%',
  zIndex: '10',
}

export class Emulator {
  core = ''
  rom?: Rom
  biosFiles?: { name: string; blob: Blob }[]
  additionalFiles?: { name: string; blob: Blob }[]
  processStatus: 'initial' | 'ready' | 'terminated' = 'initial'
  gameStatus: 'paused' | 'running' = 'running'
  canvas: HTMLCanvasElement
  style: Partial<CSSStyleDeclaration>
  nostalgist: Nostalgist | undefined
  coreConfig: Record<string, Record<string, string>> | undefined
  retroarchConfig: Record<string, string> | undefined
  private previousActiveElement: Element | null

  private hideCursorAbortController: AbortController | undefined

  constructor({
    core,
    rom,
    style,
    biosFiles,
    additionalFiles,
    coreConfig,
    retroarchConfig,
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

  async launch(waitForUserInteraction?: () => Promise<void>) {
    if (!this.rom) {
      throw new Error('invalid rom')
    }

    // todo: maybe this is not necessary
    await this.rom.ready()
    this.core = systemCoreMap[this.rom.system]

    if (!this.rom) {
      throw new Error('invalid rom')
    }

    const fileName = this.rom.fileAccessor.name
    const fileContent = await this.rom.getBlob()

    const rom = [
      { fileName, fileContent },
      ...(this.additionalFiles?.map(({ name, blob }) => ({ fileName: name, fileContent: blob })) || []),
    ]
    const bios = this.biosFiles?.map(({ name, blob }) => ({ fileName: name, fileContent: blob })) || []
    const retroarchConfig = { ...getRetroarchConfig(), ...this.retroarchConfig }
    const retroarchCoreConfig = { ...defaultRetroarchCoresConfig[this.core], ...this.coreConfig?.[this.core] }
    this.nostalgist = await Nostalgist.launch({
      style: this.style,
      element: this.canvas,
      core: this.core,
      rom,
      bios,
      retroarchConfig,
      retroarchCoreConfig,
      respondToGlobalEvents: false,

      async waitForInteraction({ done }) {
        await waitForUserInteraction?.()
        done()
      },

      resolveCoreJs(core) {
        const corePath = `dist/cores/${core}_libretro.js`
        return `${cdnHost}/npm/${vendorsInfo.name}@${vendorsInfo.version}/${corePath}`
      },

      resolveCoreWasm(core) {
        const corePath = `dist/cores/${core}_libretro.wasm`
        return `${cdnHost}/npm/${vendorsInfo.name}@${vendorsInfo.version}/${corePath}`
      },
    })
    this.setupDOM()
    this.processStatus = 'ready'
  }

  resume() {
    this.nostalgist?.resume()
  }

  restart() {
    this.nostalgist?.restart()
  }

  pause() {
    this.nostalgist?.pause()
  }

  async saveState() {
    if (!this.nostalgist) {
      throw new Error('invalid nostalgist')
    }

    const { state, thumbnail } = await this.nostalgist.saveState()
    return {
      name: this.rom?.fileAccessor.name,
      core: this.core,
      createTime: Date.now(),
      blob: state,
      thumbnailBlob: thumbnail,
    }
  }

  loadState(blob: Blob) {
    this.nostalgist?.loadState(blob)
  }

  exit() {
    this.processStatus = 'terminated'

    this.nostalgist?.exit()

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

  private resizeCanvas() {
    requestAnimationFrame(() => {
      this.nostalgist?.resize({
        width: innerWidth,
        height: innerHeight,
      })
    })
  }

  private setupDOM() {
    this.showCanvasCusor()

    document.body.addEventListener('mousemove', this.showCanvasCusor, false)
    window.addEventListener('resize', this.resizeCanvas, false)
    document.body.style.setProperty('overflow', 'hidden')

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
