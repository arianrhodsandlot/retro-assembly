import PQueue from 'p-queue'

const emptyImage = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEAAAAALAAAAAABAAEAAAI=;'

const queue = new PQueue({ concurrency: 5 })

async function loadImage(src: string, img: HTMLImageElement) {
  img.src = src
  return await new Promise<void>((resolve, reject) => {
    img.addEventListener('load', () => {
      resolve()
    })
    img.addEventListener('error', (error) => {
      reject(error)
    })
  })
}

export function loadImageWithLimit(src: string, signal: AbortController['signal']) {
  return queue.add(
    async () => {
      const img = new Image()
      signal.addEventListener('abort', () => {
        img.src = emptyImage
      })
      await loadImage(src, img)
    },
    { signal },
  )
}

export function clearLoadImageQueue() {
  queue.clear()
}
