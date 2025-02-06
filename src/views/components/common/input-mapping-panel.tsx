import { clsx } from 'clsx'
import { useTranslation } from 'react-i18next'
import { BaseCallout } from '../primitives/base-callout'
import { BouncingEllipsis } from './bouncing-ellipsis'

type InputMapping = Record<string, string>

interface InputMappingPanelProps {
  mapping?: InputMapping
  onResetMapping: () => void
  waitForButtonPressed: (name: string) => void
  waitingButton: string
}

export function InputMappingPanel({
  mapping,
  onResetMapping,
  waitForButtonPressed,
  waitingButton,
}: InputMappingPanelProps) {
  const { t } = useTranslation()

  function getCode(buttonName: string) {
    if (waitingButton === buttonName) {
      return ''
    }

    for (const codeKey in mapping) {
      if (mapping[codeKey] === buttonName) {
        return codeKey
      }
    }
    return 'N/A'
  }

  return (
    <BaseCallout className='mx-1 rounded-t-none border-t-0'>
      <div className='text-sm'>
        <div className={clsx('text-center text-xs transition-opacity', { 'opacity-0': !waitingButton })}>
          {t('Press a button on your controller')} <BouncingEllipsis />
        </div>

        <div className='mt-1 flex justify-between'>
          <div className='flex gap-2'>
            <button
              className={clsx('flex h-6 w-14 items-center justify-center rounded bg-rose-800 text-white', {
                'transform-gpu animate-[bounce-scale_1s_linear_infinite]': waitingButton === 'l1',
              })}
              onClick={() => waitForButtonPressed('l1')}
              tabIndex={-1}
              type='button'
            >
              L1<div className='ml-2 font-mono text-xs text-white/60'>{getCode('l1')}</div>
            </button>
            <button
              className={clsx('flex h-6 w-14 items-center justify-center rounded bg-rose-800 text-white', {
                'transform-gpu animate-[bounce-scale_1s_linear_infinite]': waitingButton === 'l2',
              })}
              onClick={() => waitForButtonPressed('l2')}
              tabIndex={-1}
              type='button'
            >
              L2<div className='ml-2 font-mono text-xs text-white/60'>{getCode('l2')}</div>
            </button>
          </div>
          <div className='flex gap-2'>
            <button
              className={clsx('flex h-6 w-14 items-center justify-center rounded bg-rose-800 text-white', {
                'transform-gpu animate-[bounce-scale_1s_linear_infinite]': waitingButton === 'r2',
              })}
              onClick={() => waitForButtonPressed('r2')}
              tabIndex={-1}
              type='button'
            >
              R2<div className='ml-2 font-mono text-xs text-white/60'>{getCode('r2')}</div>
            </button>
            <button
              className={clsx('flex h-6 w-14 items-center justify-center rounded bg-rose-800 text-white', {
                'transform-gpu animate-[bounce-scale_1s_linear_infinite]': waitingButton === 'r1',
              })}
              onClick={() => waitForButtonPressed('r1')}
              tabIndex={-1}
              type='button'
            >
              R1<div className='ml-2 font-mono text-xs text-white/60'>{getCode('r1')}</div>
            </button>
          </div>
        </div>
        <div className='mt-4 flex items-center justify-between gap-2'>
          <div className='flex flex-col items-center'>
            <button
              className={clsx('flex size-8 items-center justify-center rounded-t-sm bg-rose-800 text-white', {
                'transform-gpu animate-[bounce-scale_1s_linear_infinite]': waitingButton === 'up',
              })}
              onClick={() => waitForButtonPressed('up')}
              tabIndex={-1}
              type='button'
            >
              <div className='font-mono text-xs text-white/60'>{getCode('up')}</div>
            </button>
            <div className='flex gap-8'>
              <button
                className={clsx('flex size-8 items-center justify-center rounded-l-sm bg-rose-800 text-white', {
                  'transform-gpu animate-[bounce-scale_1s_linear_infinite]': waitingButton === 'left',
                })}
                onClick={() => waitForButtonPressed('left')}
                tabIndex={-1}
                type='button'
              >
                <div className='font-mono text-xs text-white/60'>{getCode('left')}</div>
              </button>
              <button
                className={clsx('flex size-8 items-center justify-center rounded-r-sm bg-rose-800 text-white', {
                  'transform-gpu animate-[bounce-scale_1s_linear_infinite]': waitingButton === 'right',
                })}
                onClick={() => waitForButtonPressed('right')}
                tabIndex={-1}
                type='button'
              >
                <div className='font-mono text-xs text-white/60'>{getCode('right')}</div>
              </button>
            </div>
            <button
              className={clsx('flex size-8 items-center justify-center rounded-b-sm bg-rose-800 text-white', {
                'transform-gpu animate-[bounce-scale_1s_linear_infinite]': waitingButton === 'down',
              })}
              onClick={() => waitForButtonPressed('down')}
              tabIndex={-1}
              type='button'
            >
              <div className='font-mono text-xs text-white/60'>{getCode('down')}</div>
            </button>
          </div>

          <div className='mt-16 flex gap-2'>
            <button
              className={clsx('flex h-6 w-20 items-center justify-center rounded-sm bg-rose-800 text-white', {
                'transform-gpu animate-[bounce-scale_1s_linear_infinite]': waitingButton === 'select',
              })}
              onClick={() => waitForButtonPressed('select')}
              tabIndex={-1}
              type='button'
            >
              select<div className='ml-2 font-mono text-xs text-white/60'>{getCode('select')}</div>
            </button>
            <button
              className={clsx('flex h-6 w-20 items-center justify-center rounded-sm bg-rose-800 text-white', {
                'transform-gpu animate-[bounce-scale_1s_linear_infinite]': waitingButton === 'start',
              })}
              onClick={() => waitForButtonPressed('start')}
              tabIndex={-1}
              type='button'
            >
              start<div className='ml-2 font-mono text-xs text-white/60'>{getCode('start')}</div>
            </button>
          </div>

          <div className='flex flex-col items-center'>
            <button
              className={clsx('flex size-8 items-center justify-center rounded-full bg-rose-800 text-white', {
                'transform-gpu animate-[bounce-scale_1s_linear_infinite]': waitingButton === 'x',
              })}
              onClick={() => waitForButtonPressed('x')}
              tabIndex={-1}
              type='button'
            >
              <div className='font-mono text-xs text-white/60'>{getCode('x')}</div>
            </button>
            <div className='flex gap-8'>
              <button
                className={clsx('flex size-8 items-center justify-center rounded-full bg-rose-800 text-white', {
                  'transform-gpu animate-[bounce-scale_1s_linear_infinite]': waitingButton === 'y',
                })}
                onClick={() => waitForButtonPressed('y')}
                tabIndex={-1}
                type='button'
              >
                <div className='font-mono text-xs text-white/60'>{getCode('y')}</div>
              </button>
              <button
                className={clsx('flex size-8 items-center justify-center rounded-full bg-rose-800 text-white', {
                  'transform-gpu animate-[bounce-scale_1s_linear_infinite]': waitingButton === 'a',
                })}
                onClick={() => waitForButtonPressed('a')}
                tabIndex={-1}
                type='button'
              >
                <div className='font-mono text-xs text-white/60'>{getCode('a')}</div>
              </button>
            </div>
            <button
              className={clsx('flex size-8 items-center justify-center rounded-full bg-rose-800 text-white', {
                'transform-gpu animate-[bounce-scale_1s_linear_infinite]': waitingButton === 'b',
              })}
              onClick={() => waitForButtonPressed('b')}
              tabIndex={-1}
              type='button'
            >
              <div className='font-mono text-xs text-white/60'>{getCode('b')}</div>
            </button>
          </div>
        </div>
      </div>

      <div className={clsx('mt-2 flex justify-end text-sm', { 'scale-0': waitingButton })}>
        <button
          className='flex-center gap-1 rounded border border-rose-800 bg-white px-2 py-1 text-rose-700'
          onClick={onResetMapping}
          tabIndex={-1}
          type='button'
        >
          <span className='icon-[mdi--reload-alert] size-4' />
          {t('Reset to default')}
        </button>
      </div>
    </BaseCallout>
  )
}
