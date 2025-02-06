import { isNil } from 'lodash-es'
import { useEffect, useRef, useState } from 'react'
import { InputMappingPanel } from '../../../../../../common/input-mapping-panel'

type InputMapping = Record<number | string, string>

interface KeyboardMappingPanelProps {
  mapping: InputMapping | undefined
  onResetMapping: () => void
  onUpdateMapping: (mapping: InputMapping) => void
}

/*
left, right, up, down, enter, kp_enter, tab, insert, del, end, home,
rshift, shift, ctrl, alt, space, escape, add, subtract, kp_plus, kp_minus,
f1, f2, f3, f4, f5, f6, f7, f8, f9, f10, f11, f12,
num0, num1, num2, num3, num4, num5, num6, num7, num8, num9, pageup, pagedown,
keypad0, keypad1, keypad2, keypad3, keypad4, keypad5, keypad6, keypad7, keypad8, keypad9,
period, capslock, numlock, backspace, multiply, divide, print_screen, scroll_lock,
tilde, backquote, pause, quote, comma, minus, slash, semicolon, equals, leftbracket,
backslash, rightbracket, kp_period, kp_equals, rctrl, ralt
*/
const knownKeyMap = {
  AltLeft: 'alt',
  AltRight: 'ralt',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  Backslash: 'backslash',
  Backspace: 'backspace',
  BracketLeft: 'leftbracket',
  BracketRight: 'rightbracket',
  CapsLock: 'capslock',
  Comma: 'comma',
  ControlLeft: 'ctrl',
  ControlRight: 'rctrl',
  Delete: 'del',
  End: 'end',
  Enter: 'enter',
  Equal: 'equals',
  Home: 'home',
  Insert: 'insert',
  Minus: 'minus',
  NumpadAdd: 'add',
  NumpadDivide: 'divide',
  NumpadEnter: 'kp_enter',
  NumpadMultiply: 'multiply',
  NumpadSubtract: 'subtract',
  PageDown: 'pagedown',
  PageUp: 'pageup',
  Period: 'period',
  Quote: 'quote',
  Semicolon: 'semicolon',
  ShiftLeft: 'shift',
  ShiftRight: 'rshift',
  Slash: 'slash',
  Space: 'space',
  Tab: 'tab',
}
function getKeyNameFromEvent(event: KeyboardEvent) {
  const { code } = event
  if (code in knownKeyMap) {
    return knownKeyMap[code]
  }
  if (code.startsWith('Key')) {
    return code.slice(3).toLowerCase()
  }
  if (code.startsWith('Digit')) {
    return `num${code.slice(5)}`
  }
  if (code.startsWith('F')) {
    return code.toLowerCase()
  }
  if (code.startsWith('Numpad')) {
    const keyName = code.slice(6).toLowerCase()
    if (/\d/.test(keyName)) {
      return `keypad${keyName}`
    }
  }
}

export function KeyboardMappingPanel({ mapping, onResetMapping, onUpdateMapping }: KeyboardMappingPanelProps) {
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

    function onKeyPress(event: KeyboardEvent) {
      event.preventDefault()
      event.stopPropagation()
      const keyName = getKeyNameFromEvent(event)
      if (!isNil(keyName)) {
        const newMapping = { ...mapping }
        for (const code in newMapping) {
          if (buttonName === newMapping[code]) {
            delete newMapping[code]
          }
        }
        newMapping[keyName] = buttonName
        onUpdateMapping(newMapping)
      }
      finishWaitForButtonPressed()
    }

    document.addEventListener('keydown', onKeyPress)

    offPressAnyRef.current = () => {
      document.removeEventListener('keydown', onKeyPress)
    }

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
