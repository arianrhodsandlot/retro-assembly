import { isEqual, pull } from 'lodash-es'
import { PreferenceParser } from '../classes/preference-parser'

type GamepadButtonMap = Map<string, string>
const buttonsMaps = new Map<string, GamepadButtonMap>()

function updateButtonsMaps() {
  const gamepadMappings = PreferenceParser.get('gamepadMappings')
  for (const gamepadMapping of gamepadMappings) {
    const gamepadButtonMap = new Map(Object.entries(gamepadMapping.mapping))
    buttonsMaps.set(gamepadMapping.name, gamepadButtonMap)
  }
}

PreferenceParser.onUpdated(({ name }) => {
  if (name === 'gamepadMappings') {
    updateButtonsMaps()
  }
})

updateButtonsMaps()

type GamepadButtonStatus = {
  -readonly [key in keyof GamepadButton]: GamepadButton[key]
}
const gamepadsStatus: GamepadButtonStatus[][] = []

function updateGamepadStatus({ gamepad, gamepadStatus }) {
  const { buttons } = gamepad
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
    pressButtonsCallback({ gamepad, pressedForTimesButtonIndicies, pressedButtonIndicies })
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

function updateGamepadsStatus({ index, gamepad }) {
  const gamepadStatus = gamepadsStatus[index] ?? []
  updateGamepadStatus({ gamepad, gamepadStatus })
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
  gamepad: Gamepad
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
interface pressButtonsCallbackParams {
  gamepad: Gamepad
  pressedForTimesButtonIndicies: number[]
  pressedButtonIndicies: number[]
}
function pressButtonsCallback({
  gamepad,
  pressedButtonIndicies,
  pressedForTimesButtonIndicies,
}: pressButtonsCallbackParams) {
  const buttonsMap = buttonsMaps.get(gamepad.id) ?? buttonsMaps.get('')
  if (!buttonsMap) {
    return
  }

  const pressedForTimesButtonNames = pressedForTimesButtonIndicies.map((i) => buttonsMap.get(`${i}`) as string)
  const pressedButtonNames = pressedButtonIndicies.map((i) => buttonsMap.get(`${i}`) as string)
  if (pressedForTimesButtonNames.length > 0) {
    for (const { listener } of pressButtonListeners) {
      listener({
        gamepad,
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
