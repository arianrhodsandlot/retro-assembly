'use client'
import ky from 'ky'
import type { Nostalgist } from 'nostalgist'
import { createPortal } from 'react-dom'
import useSWRImmutable from 'swr/immutable'
import useSWRMutation from 'swr/mutation'
import { platformCoreMap } from '@/constants/platform.ts'
import { GameOverlayButton } from './game-overlay-button.tsx'

export function GameOverlay({ nostalgist, rom }: { nostalgist: Nostalgist; rom: any }) {
  const { data: states } = useSWRImmutable('/api/v1/states', (url) =>
    ky(url, { searchParams: { rom_id: rom.id } }).json(),
  )

  const { trigger: handleClickSaveState } = useSWRMutation(
    '/api/v1/state/new',
    async (url, { arg: type }: { arg: string }) => {
      const { state, thumbnail } = await nostalgist.saveState()
      const formData = new FormData()
      formData.append('state', state)
      if (thumbnail) {
        formData.append('thumbnail', thumbnail)
      }
      formData.append('rom_id', rom.id)
      formData.append('core', platformCoreMap[rom.platform])
      formData.append('type', type)
      await ky.post(url, { body: formData })
    },
  )

  return createPortal(
    <div className='bg-linear-to-b absolute inset-0 z-10 flex h-screen w-screen flex-col bg-black/40'>
      <div className='bg-linear-to-b to-text-transparent h-32 w-full from-black' />
      <div className='w-6xl mx-auto flex flex-1 flex-col gap-8'>
        <div className='flex gap-8 text-white'>
          <GameOverlayButton>
            <span className='icon-[material-symbols--resume] size-7' />
            Resume
          </GameOverlayButton>

          <GameOverlayButton onClick={() => handleClickSaveState('manual')}>
            <span className='icon-[mdi--content-save] size-7' />
            Save State
          </GameOverlayButton>
          <div className='flex-1' />
          <GameOverlayButton>
            <span className='icon-[mdi--restart] size-7' />
            Restart
          </GameOverlayButton>
          <GameOverlayButton>
            <span className='icon-[mdi--exit-to-app] size-7' />
            Exit
          </GameOverlayButton>
          <GameOverlayButton>
            <span className='icon-[mdi--location-exit] size-7' />
            Save & Exit
          </GameOverlayButton>
        </div>
        <h3 className='flex items-center gap-2 text-2xl font-semibold text-white'>
          <span className='icon-[mdi--database] size-7' />
          States
        </h3>
        <div className='overflow-auto'>
          <div className='flex flex-nowrap gap-8'>
            {states?.map((state) => (
              <button
                className='flex size-52 shrink-0 flex-col overflow-hidden rounded border-4 border-white bg-white shadow'
                key={state.id}
                type='button'
              >
                <img
                  alt={state.id}
                  className='block flex-1 object-cover'
                  src={`/api/v1/file/${state.thumbnail_file_id}/content`}
                />
                <div className='text-sm'>{state.created_at}</div>
              </button>
            ))}
          </div>
        </div>
        <div className='overflow-auto'>
          <div className='flex flex-nowrap gap-8'>
            {states?.map((state) => (
              <button
                className='flex size-52 shrink-0 flex-col overflow-hidden rounded border-4 border-white bg-white shadow'
                key={state.id}
                type='button'
              >
                <img
                  alt={state.id}
                  className='block flex-1 object-cover'
                  src={`/api/v1/file/${state.thumbnail_file_id}/content`}
                />
                <div className='text-sm'>{state.created_at}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className='bg-linear-to-b h-32 w-full from-transparent to-black text-transparent' />
    </div>,
    document.body,
  )
}
