import { clsx } from 'clsx'
import { useSetAtom } from 'jotai'
import { BaseDialogTrigger } from '../../../primitives/base-dialog-trigger'
import { introVisibleAtom } from './atoms'
import { ContinueModalContent } from './continue-modal-content'
import { IconShortcutButtons } from './icon-shortcut-buttons'

export function MainButtons() {
  const setIntroVisible = useSetAtom(introVisibleAtom)

  function onClickTryPublicLibrary() {
    setIntroVisible(false)
  }

  return (
    <div className='flex flex-1 flex-col items-center justify-center pb-10'>
      <div>
        <button
          className={clsx(
            'flex w-80 max-w-full items-center justify-center rounded-full border-4 border-rose-700 bg-white py-4 text-rose-700 transition-transform',
            'focus:scale-105 focus:animate-[pulse-rose-border_1.5s_ease-in-out_infinite]',
            'hover:scale-105 hover:animate-[pulse-rose-border_1.5s_ease-in-out_infinite]',
          )}
          onClick={onClickTryPublicLibrary}
        >
          <span className='icon-[mdi--play] h-6 w-6' />
          <div className='ml-2'>Try public library</div>
        </button>
        <div className='mt-2 text-xs text-white/60'>
          Enjoy free (<b>legal</b>) games from&nbsp;
          <a className='underline' href='https://retrobrews.github.io/' rel='noreferrer' target='_blank'>
            retrobrews
          </a>
        </div>
      </div>

      <div>
        <BaseDialogTrigger content={<ContinueModalContent />}>
          <button
            className={clsx(
              'mt-8 flex w-80 max-w-full items-center justify-center rounded-full border-4 border-white bg-rose-700 py-4 transition-transform',
              'focus:scale-105 focus:animate-[pulse-rose-border_1.5s_ease-in-out_infinite]',
              'hover:scale-105 hover:animate-[pulse-rose-border_1.5s_ease-in-out_infinite]',
            )}
          >
            <span className='icon-[mdi--login] h-6 w-6' />
            <div className='ml-2'>Continue with your own library</div>
          </button>
        </BaseDialogTrigger>
        <IconShortcutButtons />
        <div className='mt-2 text-xs text-white/60'>
          Your personal retro game collection cabinet
          <br />
          built with your own ROM files
        </div>
      </div>
    </div>
  )
}
