import { useEffect, useMemo, useRef } from 'react'
import { useAsync } from 'react-use'
import { isUsingDemo } from '../../../../core/exposed/is-using-demo'
import { systemContentImageMap } from '../../../lib/constants'
import { GameEntryImage } from './game-entry-image'
import { loadImageWithLimit } from './utils'

function pseudoRandomDeg(seed: string) {
  let code = 0
  for (let i = 0; i < seed.length; i++) {
    code += seed.codePointAt(i) ?? 0
  }
  return code % 180
}

export function GameEntryContent({ rom }: { rom: any }) {
  const abortControllerRef = useRef<AbortController>()
  const skipLoadCover = useMemo(() => isUsingDemo(), [])

  const state = useAsync(async () => {
    if (skipLoadCover) {
      throw new Error('skip load cover')
    }
    await rom.ready()
    const { cover } = rom
    const abortController = new AbortController()
    abortControllerRef.current = abortController
    await loadImageWithLimit(cover, abortController.signal)
    return cover
  }, [rom])

  useEffect(() => {
    return () => {
      const abortController = abortControllerRef.current
      abortController?.abort()
    }
  }, [])

  if (state.loading) {
    const rotate = pseudoRandomDeg(rom.displayName)
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
        <img alt={rom.displayName} className='w-3/5 object-contain' src={systemContentImageMap[rom.system]} />
      </div>
    )
  }

  if (state.value) {
    return <GameEntryImage alt={rom.goodCode.rom} src={state.value} />
  }
}
