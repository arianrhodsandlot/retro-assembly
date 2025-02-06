import { clsx } from 'clsx'
import { compact, find, reject, uniqBy } from 'lodash-es'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getGamepadMappings, updateGamepadMappings } from '../../../../../../../../core'
import { BaseCallout } from '../../../../../../primitives/base-callout'
import { GamepadMappingPanel } from './gamepad-mapping-panel'

export function GamepadMapping() {
  const { t } = useTranslation()
  const [gamepads, setGamepads] = useState<Gamepad[]>([])
  const [currentGamePadId, setCurrentGamePadId] = useState<string>()
  const [gamepadMappings, setGamepadMappings] = useState(getGamepadMappings())
  const currentGamepadMapping = find(gamepadMappings, ({ name }) => name === currentGamePadId) ?? gamepadMappings[0]
  function updateGamepadMapping(mapping) {
    if (!currentGamePadId) {
      return
    }

    const index = currentGamepadMapping ? gamepadMappings.indexOf(currentGamepadMapping) : -1
    const newMappings = [...gamepadMappings]

    if (index > -1) {
      newMappings[index] = { mapping, name: currentGamePadId }
    } else {
      newMappings.push({ mapping, name: currentGamePadId })
    }

    updateGamepadMappings(newMappings)
    setGamepadMappings(newMappings)
  }

  function resetGamepadMapping() {
    if (currentGamePadId) {
      const newMappings = reject(gamepadMappings, { name: currentGamePadId })
      updateGamepadMappings(newMappings)
      setGamepadMappings(newMappings)
    }
  }

  useEffect(() => {
    function updateGamepads() {
      const gamepads = uniqBy(compact(navigator.getGamepads()), 'id')
      setGamepads(gamepads)
      for (const gamepad of gamepads) {
        if (gamepad?.id) {
          setCurrentGamePadId(gamepad.id)
          break
        }
      }
    }

    updateGamepads()

    globalThis.addEventListener('gamepadconnected', updateGamepads)
    globalThis.addEventListener('gamepaddisconnected', updateGamepads)

    return () => {
      globalThis.removeEventListener('gamepadconnected', updateGamepads)
      globalThis.removeEventListener('gamepaddisconnected', updateGamepads)
    }
  }, [setGamepads, setCurrentGamePadId])

  return (
    <div>
      <div className='mt-4 flex flex-col gap-8'>
        {gamepads.length > 0 ? (
          gamepads.map((gamepad) => (
            <div key={gamepad.id}>
              <button
                className={clsx(
                  'flex w-full items-center gap-2 truncate rounded bg-rose-800 px-4 py-2 text-sm text-white',
                )}
                onClick={() => setCurrentGamePadId(gamepad.id)}
                type='button'
              >
                <span className='icon-[mdi--controller] size-5' />
                {gamepad.id}
              </button>
              {currentGamePadId === gamepad.id ? (
                <GamepadMappingPanel
                  gamepad={gamepad}
                  mapping={currentGamepadMapping?.mapping}
                  onResetMapping={resetGamepadMapping}
                  onUpdateMapping={updateGamepadMapping}
                />
              ) : null}
            </div>
          ))
        ) : (
          <div className='flex flex-col items-center justify-center'>
            <BaseCallout className='flex-center'>
              <span className='icon-[mdi--information-outline] mr-2 size-4' />
              {t('Connect your controller and press any button to begin')}
            </BaseCallout>
            <div className='py-4'>
              <span className='icon-[line-md--loading-loop] mt-4 size-10 text-rose-700' />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
