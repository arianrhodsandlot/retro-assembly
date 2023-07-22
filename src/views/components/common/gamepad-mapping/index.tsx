import clsx from 'clsx'
import { compact, find, reject, uniqBy } from 'lodash-es'
import { useEffect, useState } from 'react'
import { getGamepadMappings, updateGamepadMappings } from '../../../../core'
import { GamepadMappingPanel } from './gamepad-mapping-panel'

export function GamepadMapping() {
  const [gamepads, setGamepads] = useState<Gamepad[]>([])
  const [currentGamePadId, setCurrentGamePadId] = useState<string>()
  const [gamepadMappings, setGamepadMappings] = useState(getGamepadMappings())
  const currentMapping = find(gamepadMappings, ({ name }) => name === currentGamePadId) ?? gamepadMappings[0]

  function updateMapping(mapping) {
    if (!currentGamePadId) {
      return
    }

    const index = currentMapping ? gamepadMappings.indexOf(currentMapping) : -1
    const newMappings = [...gamepadMappings]

    if (index > -1) {
      newMappings[index] = { name: currentGamePadId, mapping }
    } else {
      newMappings.push({ name: currentGamePadId, mapping })
    }

    updateGamepadMappings(newMappings)
    setGamepadMappings(newMappings)
  }

  function resetMapping() {
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

    window.addEventListener('gamepadconnected', updateGamepads)
    window.addEventListener('gamepaddisconnected', updateGamepads)

    return () => {
      window.removeEventListener('gamepadconnected', updateGamepads)
      window.removeEventListener('gamepaddisconnected', updateGamepads)
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
                  'flex w-full items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap rounded bg-rose-800 px-4 py-2 text-sm text-white',
                )}
                onClick={() => setCurrentGamePadId(gamepad.id)}
              >
                <span className='icon-[mdi--controller] h-5 w-5' />
                {gamepad.id}
              </button>
              {currentGamePadId === gamepad.id ? (
                <GamepadMappingPanel
                  gamepad={gamepad}
                  mapping={currentMapping?.mapping}
                  onResetMapping={resetMapping}
                  onUpdateMapping={updateMapping}
                />
              ) : null}
            </div>
          ))
        ) : (
          <div className='flex flex-col items-center justify-center'>
            <div className='text-lg'>Connect your controller and press any button to begin!</div>
            <span className='icon-[line-md--loading-loop] mt-4 h-10 w-10 text-rose-700' />
          </div>
        )}
      </div>
    </div>
  )
}
