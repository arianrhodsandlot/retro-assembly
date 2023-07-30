import PQueue from 'p-queue'

const queue = new PQueue({ concurrency: 5 })

async function loadImage(src: string) {
  const img = new Image()
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
  return queue.add(() => loadImage(src), { signal })
}

export function clearLoadImageQueue() {
  queue.clear()
}
