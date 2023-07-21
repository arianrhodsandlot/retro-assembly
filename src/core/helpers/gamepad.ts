import { isEqual, pull } from 'lodash-es'
import { PreferenceParser } from '../classes/preference-parser'

const [defaultInputConfig] = PreferenceParser.get('gamepadMappings')
const buttonsMap = new Map(Object.entries(defaultInputConfig.mapping))

// window.addEventListener('gamepadconnected', updateGamepadInfo)
// window.addEventListener('gamepaddisconnected', updateGamepadInfo)

type GamepadButtonStatus = {
  -readonly [key in keyof GamepadButton]: GamepadButton[key]
}
const gamepadsStatus: GamepadButtonStatus[][] = []

function updateGamepadStatus({ buttons, gamepadStatus }) {
  const gamepadButtonsEntries = [...buttons.entries()]

  // run callback functions if certain buttons are pressed / touched
  // pressed in this loop
  const pressedButtonIndicies: number[] = []
  // pressed before or in this loop, includes `pressedButtonIndicies`
  const pressedForTimesButtonIndicies: number[] = []
  for (const [buttonIndex, button] of gamepadButtonsEntries) {
    const prevbuttonStatus = gamepadStatus[buttonIndex]
    if (button.pressed) {
      pressedForTimesButtonIndicies.push(buttonIndex)
      if (!prevbuttonStatus?.pressed) {
        pressedButtonIndicies.push(buttonIndex)
      }
    }
  }
  if (pressedForTimesButtonIndicies.length > 0) {
    pressButtonsCallback(pressedForTimesButtonIndicies, pressedButtonIndicies)
  }

  // update button status record for using in next loop
  for (const [buttonIndex, button] of gamepadButtonsEntries) {
    const buttonStatus = gamepadStatus[buttonIndex] ?? { pressed: false, touched: false, value: 0 }
    buttonStatus.pressed = button.pressed
    buttonStatus.touched = button.touched
    buttonStatus.value = button.value
    gamepadStatus[buttonIndex] = buttonStatus
  }
}

function updateGamepadsStatus({ index, gamepad: { buttons } }) {
  const gamepadStatus = gamepadsStatus[index] ?? []
  updateGamepadStatus({ buttons, gamepadStatus })
  gamepadsStatus[index] = gamepadStatus
}

export function gamepadPollLoop() {
  if (document.hasFocus()) {
    const gamepads = navigator.getGamepads()
    for (const [index, gamepad] of gamepads.entries()) {
      if (gamepad) {
        updateGamepadsStatus({ index, gamepad })
      }
    }
  }
  requestAnimationFrame(gamepadPollLoop)
}

interface PressButtonListenerFunctionParam {
  pressedForTimesButtonNames?: string[]
  pressedButtonNames?: string[]
  pressedForTimesButtonIndicies?: number[]
  pressedButtonIndicies?: number[]
}
type PressButtonListenerFunction = (param: PressButtonListenerFunctionParam) => void
interface PressButtonListener {
  buttonNames: string[]
  originalCallback: any
  listener: PressButtonListenerFunction
}
const pressButtonListeners: PressButtonListener[] = []
function pressButtonsCallback(pressedForTimesButtonIndicies: number[], pressedButtonIndicies: number[]) {
  const pressedForTimesButtonNames = pressedForTimesButtonIndicies.map((i) => buttonsMap.get(`${i}`) as string)
  const pressedButtonNames = pressedButtonIndicies.map((i) => buttonsMap.get(`${i}`) as string)
  if (pressedForTimesButtonNames.length > 0) {
    for (const { listener } of pressButtonListeners) {
      listener({
        pressedForTimesButtonNames,
        pressedButtonNames,
        pressedForTimesButtonIndicies,
        pressedButtonIndicies,
      })
    }
  }
}

export function onPressAnyButton(
  callback: (param: { pressedForTimesButtonIndicies: number[]; pressedButtonIndicies: number[] }) => void,
) {
  if (typeof callback === 'function') {
    pressButtonListeners.push({
      buttonNames: [],
      originalCallback: callback,
      listener({ pressedForTimesButtonIndicies, pressedButtonIndicies }) {
        if (pressedForTimesButtonIndicies && pressedButtonIndicies) {
          // eslint-disable-next-line n/no-callback-literal
          callback({ pressedForTimesButtonIndicies, pressedButtonIndicies })
        }
      },
    })
  }
}

export function offPressAnyButton(callback) {
  for (const pressButtonListener of pressButtonListeners) {
    if (callback === pressButtonListener.originalCallback) {
      pull(pressButtonListeners, pressButtonListener)
    }
  }
}

export function onPressButtons(buttonNames: string[], callback) {
  if (typeof callback === 'function') {
    pressButtonListeners.push({
      buttonNames,
      originalCallback: callback,
      listener({ pressedForTimesButtonNames, pressedButtonNames }) {
        if (
          buttonNames.every((buttonName) => pressedForTimesButtonNames?.includes(buttonName)) &&
          buttonNames.some((buttonName) => pressedButtonNames?.includes(buttonName))
        ) {
          callback()
        }
      },
    })
  }
}

export function onPressButton(buttonName: string, callback) {
  onPressButtons([buttonName], callback)
}

export function offPressButtons(buttonNames: string[], callback) {
  for (const pressButtonListener of pressButtonListeners) {
    if (isEqual(buttonNames, pressButtonListener.buttonNames) && callback === pressButtonListener.originalCallback) {
      pull(pressButtonListeners, pressButtonListener)
    }
  }
}

export function offPressButton(buttonName: string, callback) {
  offPressButtons([buttonName], callback)
}

function startGamepadPollLoop() {
  const gamepads = navigator.getGamepads?.()
  if (gamepads?.some(Boolean)) {
    gamepadPollLoop()
  }
}

window.addEventListener('gamepadconnected', () => {
  startGamepadPollLoop()
})

startGamepadPollLoop()
