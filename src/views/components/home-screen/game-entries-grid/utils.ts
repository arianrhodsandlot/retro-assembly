import ky from 'ky'
import PQueue from 'p-queue'

const queue = new PQueue({ concurrency: 5 })

const validImages = {}
const invalidImages = {}
async function loadImage(src: string, signal: AbortSignal) {
  if (src in validImages) {
    return
  }
  if (src in invalidImages) {
    throw new Error('invalid image')
  }

  try {
    await ky.get(src, { signal, timeout: false })
  } catch (error: any) {
    if (typeof error?.response?.status === 'number') {
      invalidImages[src] = true
    }
    throw error
  }

  const img = new Image()
  img.src = src
  return await new Promise<void>((resolve, reject) => {
    img.addEventListener('load', () => {
      validImages[src] = true
      resolve()
    })
    img.addEventListener('error', (error) => {
      reject(error)
    })
  })
}

export function loadImageWithLimit(src: string, signal: AbortSignal) {
  return queue.add(() => loadImage(src, signal), { signal })
}

export function clearLoadImageQueue() {
  queue.clear()
}
