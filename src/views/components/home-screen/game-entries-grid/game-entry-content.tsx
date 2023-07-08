import { useAsync } from 'react-use'
import { systemContentImageMap } from '../../../lib/constants'
import { GameEntryImage } from './game-entry-image'

const loadedImages = new Map<string, boolean>()
async function loadImage(src: string) {
  if (loadedImages.has(src)) {
    if (loadedImages.get(src)) {
      return true
    }
    throw new Error('invalid src')
  }
  const img = new Image()
  img.src = src
  return await new Promise<void>((resolve, reject) => {
    img.addEventListener('load', () => {
      loadedImages.set(src, true)
      resolve()
    })
    img.addEventListener('error', (error) => {
      loadedImages.set(src, false)
      reject(error)
    })
  })
}

function pseudoRandomDeg(seed: string) {
  let code = 0
  for (let i = 0; i < seed.length; i++) {
    code += seed.codePointAt(i) ?? 0
  }
  return code % 180
}

export function GameEntryContent({ rom }: { rom: any }) {
  const state = useAsync(async () => {
    await rom.ready()
    const { cover } = rom
    await loadImage(cover)
    return cover
  }, [rom])

  if (state.loading) {
    const rotate = pseudoRandomDeg(rom.name)
    return (
      <div className='m-auto flex h-full items-center justify-center bg-zinc-300 text-center font-bold'>
        <span
          className='icon-[line-md--loading-loop] h-8 w-8 text-slate-400'
          style={{ transform: `rotate(${rotate}deg)` }}
        />
      </div>
    )
  }

  if (state.error) {
    return (
      <div className='m-auto flex h-full items-center justify-center bg-zinc-300 text-center font-bold'>
        <img alt={rom.name} className='w-3/5 object-contain' src={systemContentImageMap[rom.system]} />
      </div>
    )
  }

  if (state.value) {
    return <GameEntryImage alt={rom.goodCode.rom} src={state.value} />
  }
}
