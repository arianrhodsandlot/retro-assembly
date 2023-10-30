import { useEffect, useMemo, useRef } from 'react'
import { useAsync } from 'react-use'
import { type Rom, isUsingDemo } from '../../../../../../../core'
import { cdnHost } from '../../../../../../../core/constants/dependencies'
import { systemContentImageMap } from '../../../../../../lib/constants'
import { GameEntryImage } from './game-entry-image'
import { loadImageWithLimit } from './utils'

function pseudoRandomDeg(seed: string) {
  let code = 0
  for (let i = 0; i < seed.length; i++) {
    code += seed.codePointAt(i) ?? 0
  }
  return code % 180
}

export function GameEntryContent({ rom }: { rom: Rom }) {
  const abortControllerRef = useRef<AbortController>()
  const usingDemo = useMemo(() => isUsingDemo(), [])

  const state = useAsync(async () => {
    const abortController = new AbortController()
    abortControllerRef.current = abortController
    if (usingDemo) {
      let { system, fileAccessor } = rom
      if (system === 'megadrive') {
        system = 'md'
      }
      const repo = `${system}-games`
      const cover = `${cdnHost}/gh/retrobrews/${repo}@master/${fileAccessor.basename}.png`
      await loadImageWithLimit(cover, abortController.signal)
      return cover
    }

    await rom.ready()
    const { covers } = rom
    for (const cover of covers) {
      try {
        await loadImageWithLimit(cover, abortController.signal)
        return cover
      } catch {}
    }
    throw new Error('invalid cover')
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
