import { isNil } from 'lodash-es'
import { useEffect, useRef, useState } from 'react'
import { onPressAny } from '../../../../../../../../core'
import { InputMappingPanel } from '../../../../../../common/input-mapping-panel'

type GamepadMapping = Record<number | string, string>

interface GamepadMappingPanelProps {
  gamepad: Gamepad
  mapping: GamepadMapping | undefined
  onResetMapping: () => void
  onUpdateMapping: (mapping: GamepadMapping) => void
}

export function GamepadMappingPanel({ gamepad, mapping, onResetMapping, onUpdateMapping }: GamepadMappingPanelProps) {
  const [waitingButton, setWaitingButton] = useState('')
  const inputTimerRef = useRef(0)
  const offPressAnyRef = useRef<() => void>()

  useEffect(() => {
    if (inputTimerRef.current) {
      clearTimeout(inputTimerRef.current)
    }
    if (offPressAnyRef.current) {
      offPressAnyRef.current()
    }
  }, [])

  function waitForButtonPressed(buttonName: string) {
    if (inputTimerRef.current) {
      clearTimeout(inputTimerRef.current)
    }
    if (offPressAnyRef.current) {
      offPressAnyRef.current()
    }

    setWaitingButton(buttonName)

    offPressAnyRef.current = onPressAny((params) => {
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
      finishWaitForButtonPressed()
    })

    function finishWaitForButtonPressed() {
      setWaitingButton('')
      offPressAnyRef.current?.()
    }

    inputTimerRef.current = globalThis.setTimeout(() => {
      finishWaitForButtonPressed()
    }, 5000)
  }

  return (
    <InputMappingPanel
      mapping={mapping}
      onResetMapping={onResetMapping}
      waitForButtonPressed={waitForButtonPressed}
      waitingButton={waitingButton}
    />
  )
}
