import clsx from 'clsx'
import { isNil } from 'lodash-es'
import { useState } from 'react'
import { onPressAny } from '../../../../core'
import { BaseCallout } from '../../primitives/base-callout'
import { BouncingEllipsis } from '../bouncing-ellipsis'

type GamepadMapping = Record<string | number, string>

interface GamepadMappingPanelProps {
  gamepad: Gamepad
  mapping: GamepadMapping | undefined
  onUpdateMapping: (mapping: GamepadMapping) => void
  onResetMapping: () => void
}

export function GamepadMappingPanel({ gamepad, mapping, onUpdateMapping, onResetMapping }: GamepadMappingPanelProps) {
  const [waitingButton, setWaitingButton] = useState('')

  function getCode(buttonName: string) {
    for (const codeKey in mapping) {
      if (mapping[codeKey] === buttonName) {
        return codeKey
      }
    }
    return 'N/A'
  }

  function waitForButtonPressed(buttonName: string) {
    setWaitingButton(buttonName)

    const offPressAny = onPressAny((params) => {
      if (params.gamepad?.id !== gamepad.id) {
        return
      }
      const code = params.pressedForTimesButtonIndicies?.[0]
      if (!isNil(code)) {
        const newMapping = { ...mapping }
        for (const code in newMapping) {
          if (buttonName === newMapping[code]) {
            delete newMapping[code]
          }
        }
        newMapping[code] = buttonName
        onUpdateMapping(newMapping)
      }
      setWaitingButton('')
      offPressAny()
    })
  }

  return (
    <BaseCallout className='mx-1 rounded-t-none border-t-0'>
      <div className='text-sm'>
        <div className={clsx('text-center text-xs transition-opacity', { 'opacity-0': !waitingButton })}>
          Press a button on your controller <BouncingEllipsis />
        </div>

        <div className='mt-1 flex justify-between'>
          <div className='flex gap-2'>
            <button
              className={clsx('flex h-6 w-14 items-center justify-center rounded bg-rose-800 text-white', {
                'animate-pulse': waitingButton === 'l1',
              })}
              onClick={() => waitForButtonPressed('l1')}
            >
              L1<div className='ml-2 font-mono text-xs text-white/60'>{getCode('l1')}</div>
            </button>
            <button
              className={clsx('flex h-6 w-14 items-center justify-center rounded bg-rose-800 text-white', {
                'animate-pulse': waitingButton === 'l2',
              })}
              onClick={() => waitForButtonPressed('l2')}
            >
              L2<div className='ml-2 font-mono text-xs text-white/60'>{getCode('l2')}</div>
            </button>
          </div>
          <div className='flex gap-2'>
            <button
              className={clsx('flex h-6 w-14 items-center justify-center rounded bg-rose-800 text-white', {
                'animate-pulse': waitingButton === 'r2',
              })}
              onClick={() => waitForButtonPressed('r2')}
            >
              R2<div className='ml-2 font-mono text-xs text-white/60'>{getCode('r2')}</div>
            </button>
            <button
              className={clsx('flex h-6 w-14 items-center justify-center rounded bg-rose-800 text-white', {
                'animate-pulse': waitingButton === 'r1',
              })}
              onClick={() => waitForButtonPressed('r1')}
            >
              R1<div className='ml-2 font-mono text-xs text-white/60'>{getCode('r1')}</div>
            </button>
          </div>
        </div>
        <div className='mt-4 flex items-center justify-between gap-2'>
          <div className='flex flex-col items-center'>
            <button
              className={clsx('flex h-8 w-8 items-center justify-center rounded-t-sm bg-rose-800 text-white', {
                'animate-pulse': waitingButton === 'up',
              })}
              onClick={() => waitForButtonPressed('up')}
            >
              <div className='font-mono text-xs text-white/60'>{getCode('up')}</div>
            </button>
            <div className='flex gap-8'>
              <button
                className={clsx('flex h-8 w-8 items-center justify-center rounded-l-sm bg-rose-800 text-white', {
                  'animate-pulse': waitingButton === 'left',
                })}
                onClick={() => waitForButtonPressed('left')}
              >
                <div className='font-mono text-xs text-white/60'>{getCode('left')}</div>
              </button>
              <button
                className={clsx('flex h-8 w-8 items-center justify-center rounded-r-sm bg-rose-800 text-white', {
                  'animate-pulse': waitingButton === 'right',
                })}
                onClick={() => waitForButtonPressed('right')}
              >
                <div className='font-mono text-xs text-white/60'>{getCode('right')}</div>
              </button>
            </div>
            <button
              className={clsx('flex h-8 w-8 items-center justify-center rounded-b-sm bg-rose-800 text-white', {
                'animate-pulse': waitingButton === 'down',
              })}
              onClick={() => waitForButtonPressed('down')}
            >
              <div className='font-mono text-xs text-white/60'>{getCode('down')}</div>
            </button>
          </div>

          <div className='mt-16 flex gap-2'>
            <button
              className={clsx('flex h-6 w-20 items-center justify-center rounded-sm bg-rose-800 text-white', {
                'animate-pulse': waitingButton === 'select',
              })}
              onClick={() => waitForButtonPressed('select')}
            >
              select<div className='ml-2 font-mono text-xs text-white/60'>{getCode('select')}</div>
            </button>
            <button
              className={clsx('flex h-6 w-20 items-center justify-center rounded-sm bg-rose-800 text-white', {
                'animate-pulse': waitingButton === 'start',
              })}
              onClick={() => waitForButtonPressed('start')}
            >
              start<div className='ml-2 font-mono text-xs text-white/60'>{getCode('start')}</div>
            </button>
          </div>

          <div className='flex flex-col items-center'>
            <button
              className={clsx('flex h-8 w-8 items-center justify-center rounded-full bg-rose-800 text-white', {
                'animate-pulse': waitingButton === 'x',
              })}
              onClick={() => waitForButtonPressed('x')}
            >
              <div className='font-mono text-xs text-white/60'>{getCode('x')}</div>
            </button>
            <div className='flex gap-8'>
              <button
                className={clsx('flex h-8 w-8 items-center justify-center rounded-full bg-rose-800 text-white', {
                  'animate-pulse': waitingButton === 'y',
                })}
                onClick={() => waitForButtonPressed('y')}
              >
                <div className='font-mono text-xs text-white/60'>{getCode('y')}</div>
              </button>
              <button
                className={clsx('flex h-8 w-8 items-center justify-center rounded-full bg-rose-800 text-white', {
                  'animate-pulse': waitingButton === 'a',
                })}
                onClick={() => waitForButtonPressed('a')}
              >
                <div className='font-mono text-xs text-white/60'>{getCode('a')}</div>
              </button>
            </div>
            <button
              className={clsx('flex h-8 w-8 items-center justify-center rounded-full bg-rose-800 text-white', {
                'animate-pulse': waitingButton === 'b',
              })}
              onClick={() => waitForButtonPressed('b')}
            >
              <div className='font-mono text-xs text-white/60'>{getCode('b')}</div>
            </button>
          </div>
        </div>
      </div>

      <div className={clsx('mt-2 flex justify-end text-sm transition-opacity', { 'opacity-0': waitingButton })}>
        <button
          className='flex items-center justify-center gap-1 rounded border border-rose-800 bg-white px-2 py-1 text-rose-700'
          onClick={onResetMapping}
        >
          <span className='icon-[mdi--reload-alert] h-4 w-4' />
          Reset to default
        </button>
      </div>
    </BaseCallout>
  )
}
