import { isNil } from 'lodash-es'
import { useEffect, useRef, useState } from 'react'
import { InputMappingPanel } from '../input-mapping-panel'

type InputMapping = Record<string | number, string>

interface KeyboardMappingPanelProps {
  mapping: InputMapping | undefined
  onUpdateMapping: (mapping: InputMapping) => void
  onResetMapping: () => void
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
  Minus: 'minus',
  Equal: 'equals',
  BracketLeft: 'leftbracket',
  BracketRight: 'rightbracket',
  Backslash: 'backslash',
  Semicolon: 'semicolon',
  Quote: 'quote',
  Comma: 'comma',
  Period: 'period',
  Slash: 'slash',
  Enter: 'enter',
  ShiftLeft: 'shift',
  ControlLeft: 'ctrl',
  AltLeft: 'alt',
  ShiftRight: 'rshift',
  ControlRight: 'rctrl',
  AltRight: 'ralt',
  Space: 'space',
  Insert: 'insert',
  Home: 'home',
  PageUp: 'pageup',
  Delete: 'del',
  End: 'end',
  PageDown: 'pagedown',
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  NumpadDivide: 'divide',
  NumpadMultiply: 'multiply',
  NumpadSubtract: 'subtract',
  NumpadAdd: 'add',
  NumpadEnter: 'kp_enter',
  CapsLock: 'capslock',
  Tab: 'tab',
  Backspace: 'backspace',
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

export function KeyboardMappingPanel({ mapping, onUpdateMapping, onResetMapping }: KeyboardMappingPanelProps) {
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

    offPressAnyRef.current = function () {
      document.removeEventListener('keydown', onKeyPress)
    }

    function finishWaitForButtonPressed() {
      setWaitingButton('')
      offPressAnyRef.current?.()
    }

    inputTimerRef.current = window.setTimeout(() => {
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
