import clsx from 'clsx'
import { isNil } from 'lodash-es'
import { useState } from 'react'
import { onPressAny } from '../../../../core'
import { BaseCallout } from '../../primitives/base-callout'
import { BouncingEllipsis } from '../bouncing-ellipsis'

type GamepadMapping = Record<string | number, string>

export function GamepadMappingPanel({
  mapping,
  onUpdateMapping,
}: {
  mapping: GamepadMapping | undefined
  onUpdateMapping: (mapping: GamepadMapping) => void
}) {
  const [waitingButton, setWaitingButton] = useState('')

  function getCode(buttonName: string) {
    for (const code in mapping) {
      if (mapping[code] === buttonName) {
        return code
      }
    }
    return 'N/A'
  }

  function waitForButtonPressed(buttonName: string) {
    setWaitingButton(buttonName)

    const offPressAny = onPressAny((params) => {
      const code = params?.pressedForTimesButtonIndicies?.[0]
      if (!isNil(code)) {
        onUpdateMapping({ ...mapping, [code]: buttonName })
      }
      setWaitingButton('')
      offPressAny()
    })
  }

  return (
    <BaseCallout className='mx-1 rounded-t-none border-t-0'>
      <div className='text-sm'>
        <div className='flex justify-between pt-2'>
          <div className='flex gap-2'>
            <button
              className={clsx('flex h-6 w-14 items-center justify-center rounded bg-rose-800 text-white', {
                'animate-pulse': waitingButton === 'l1',
              })}
              onClick={() => waitForButtonPressed('l1')}
            >
              L1<div className='ml-2 text-xs text-white/60'>{getCode('l1')}</div>
            </button>
            <button
              className={clsx('flex h-6 w-14 items-center justify-center rounded bg-rose-800 text-white', {
                'animate-pulse': waitingButton === 'l2',
              })}
              onClick={() => waitForButtonPressed('l2')}
            >
              L2<div className='ml-2 text-xs text-white/60'>{getCode('l2')}</div>
            </button>
          </div>
          <div className='flex gap-2'>
            <button
              className={clsx('flex h-6 w-14 items-center justify-center rounded bg-rose-800 text-white', {
                'animate-pulse': waitingButton === 'r2',
              })}
              onClick={() => waitForButtonPressed('r2')}
            >
              R2<div className='ml-2 text-xs text-white/60'>{getCode('r2')}</div>
            </button>
            <button
              className={clsx('flex h-6 w-14 items-center justify-center rounded bg-rose-800 text-white', {
                'animate-pulse': waitingButton === 'r1',
              })}
              onClick={() => waitForButtonPressed('r1')}
            >
              R1<div className='ml-2 text-xs text-white/60'>{getCode('r1')}</div>
            </button>
          </div>
        </div>
        <div className='mt-4 flex items-end justify-between gap-2'>
          <div className='flex flex-col items-center'>
            <button
              className={clsx('flex h-8 w-8 items-center justify-center rounded-t-sm bg-rose-800 text-white', {
                'animate-pulse': waitingButton === 'up',
              })}
              onClick={() => waitForButtonPressed('up')}
            >
              <div className='text-xs text-white/60'>{getCode('up')}</div>
            </button>
            <div className='flex gap-8'>
              <button
                className={clsx('flex h-8 w-8 items-center justify-center rounded-l-sm bg-rose-800 text-white', {
                  'animate-pulse': waitingButton === 'left',
                })}
                onClick={() => waitForButtonPressed('left')}
              >
                <div className='text-xs text-white/60'>{getCode('left')}</div>
              </button>
              <button
                className={clsx('flex h-8 w-8 items-center justify-center rounded-r-sm bg-rose-800 text-white', {
                  'animate-pulse': waitingButton === 'right',
                })}
                onClick={() => waitForButtonPressed('right')}
              >
                <div className='text-xs text-white/60'>{getCode('right')}</div>
              </button>
            </div>
            <button
              className={clsx('flex h-8 w-8 items-center justify-center rounded-b-sm bg-rose-800 text-white', {
                'animate-pulse': waitingButton === 'down',
              })}
              onClick={() => waitForButtonPressed('down')}
            >
              <div className='text-xs text-white/60'>{getCode('down')}</div>
            </button>
          </div>
          <div className='flex gap-2'>
            <button
              className={clsx('flex h-6 w-20 items-center justify-center rounded-sm bg-rose-800 text-white', {
                'animate-pulse': waitingButton === 'select',
              })}
              onClick={() => waitForButtonPressed('select')}
            >
              select<div className='ml-2 text-xs text-white/60'>{getCode('select')}</div>
            </button>
            <button
              className={clsx('flex h-6 w-20 items-center justify-center rounded-sm bg-rose-800 text-white', {
                'animate-pulse': waitingButton === 'start',
              })}
              onClick={() => waitForButtonPressed('start')}
            >
              start<div className='ml-2 text-xs text-white/60'>{getCode('start')}</div>
            </button>
          </div>
          <div className='flex flex-col items-center'>
            <button
              className={clsx('flex h-8 w-8 items-center justify-center rounded-full bg-rose-800 text-white', {
                'animate-pulse': waitingButton === 'x',
              })}
              onClick={() => waitForButtonPressed('x')}
            >
              <div className='text-xs text-white/60'>{getCode('x')}</div>
            </button>
            <div className='flex gap-8'>
              <button
                className={clsx('flex h-8 w-8 items-center justify-center rounded-full bg-rose-800 text-white', {
                  'animate-pulse': waitingButton === 'y',
                })}
                onClick={() => waitForButtonPressed('y')}
              >
                <div className='text-xs text-white/60'>{getCode('y')}</div>
              </button>
              <button
                className={clsx('flex h-8 w-8 items-center justify-center rounded-full bg-rose-800 text-white', {
                  'animate-pulse': waitingButton === 'a',
                })}
                onClick={() => waitForButtonPressed('a')}
              >
                <div className='text-xs text-white/60'>{getCode('a')}</div>
              </button>
            </div>
            <button
              className={clsx('flex h-8 w-8 items-center justify-center rounded-full bg-rose-800 text-white', {
                'animate-pulse': waitingButton === 'b',
              })}
              onClick={() => waitForButtonPressed('b')}
            >
              <div className='text-xs text-white/60'>{getCode('b')}</div>
            </button>
          </div>
        </div>
      </div>
      <div className={clsx('mt-2 text-center text-xs transition-opacity', { 'opacity-0': !waitingButton })}>
        Please press a button on your controller <BouncingEllipsis />
      </div>
    </BaseCallout>
  )
}
