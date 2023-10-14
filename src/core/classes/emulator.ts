import delay from 'delay'
import { type Nostalgist } from 'nostalgist'
import { cdnHost, vendorsInfo } from '../constants/dependencies'
import { systemCoreMap } from '../constants/systems'
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

const defaultStyle = {
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
    this.canvas.id = 'canvas'
    this.canvas.width = 900
    this.canvas.height = 900
    this.previousActiveElement = document.activeElement
    this.canvas.tabIndex = 0
    this.coreConfig = coreConfig
    this.retroarchConfig = retroarchConfig
    this.canvas.dataset.testid = 'emulator'
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

    const { Nostalgist } = await import('nostalgist')

    this.nostalgist = await Nostalgist.launch({
      style: this.style,
      core: this.core,
      rom: [
        { fileName, fileContent },
        ...(this.additionalFiles?.map(({ name, blob }) => ({ fileName: name, fileContent: blob })) || []),
        ...(this.biosFiles?.map(({ name, blob }) => ({ fileName: name, fileContent: blob })) || []),
      ],

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
  }

  resume() {
    this.nostalgist?.resume()
  }

  restart() {
    this.nostalgist?.resume()
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

  private cleanupDOM() {
    document.body.removeEventListener('mousemove', this.showCanvasCusor, false)
    window.removeEventListener('resize', this.resizeCanvas, false)
    this.canvas.remove()
    document.body.style.removeProperty('overflow')
  }
}
