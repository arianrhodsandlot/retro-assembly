import { useAsync } from 'react-use'
import { getCover } from '../../../core'
import { GameEntryImage } from './game-entry-image'

async function loadImage(src: string) {
  const img = new Image()
  img.src = src
  return await new Promise<void>((resolve, reject) => {
    img.addEventListener('load', (event) => {
      resolve()
    })
    img.addEventListener('error', (error) => {
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
    const cover = rom.gameInfo ? getCover({ system: rom.system, name: rom.gameInfo.name }) : ''
    await loadImage(cover)
    return cover
  }, [rom])

  if (state.loading) {
    const rotate = pseudoRandomDeg(rom.fileSummary.name)
    return (
      <div className='m-auto flex h-full items-center justify-center bg-[#eee] text-center font-bold'>
        <span
          className='icon-[line-md--loading-loop] h-12 w-12 text-slate-400'
          style={{ transform: `rotate(${rotate}deg)` }}
        />
      </div>
    )
  }

  if (state.error) {
    return (
      <div className='m-auto flex h-full items-center justify-center bg-[#eee] text-center font-bold'>
        <span className='icon-[mdi--image-broken-variant] h-12 w-12 text-slate-400' />
      </div>
    )
  }

  if (state.value) {
    return <GameEntryImage alt={rom.goodCode.rom} src={state.value} />
  }
}
