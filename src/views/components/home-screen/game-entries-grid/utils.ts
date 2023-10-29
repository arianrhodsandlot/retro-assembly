import ky from 'ky'
import PQueue from 'p-queue'
import store2 from 'store2'

const queue = new PQueue({ concurrency: 6 })

const cacheKey = 'image-load-status-record'

const record = store2.session.get(cacheKey) || {}
const validImages = record?.validImages || {}
const invalidImages = record?.invalidImages || {}
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
      store2.session.set(cacheKey, { ...record, invalidImages })
    }
    throw error
  }

  const img = new Image()
  img.src = src
  return await new Promise<void>((resolve, reject) => {
    img.addEventListener('load', () => {
      validImages[src] = true
      store2.session.set(cacheKey, { ...record, validImages })
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
