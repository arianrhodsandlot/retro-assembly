import { compact, last } from 'lodash-es'
import { PreferenceParser } from '../classes/preference-parser'

const defaultRetroarchConfig = {
  menu_driver: 'rgui',
  rewind_enable: true,
  notification_show_when_menu_is_alive: true,
  stdin_cmd_enable: true,
  quit_press_twice: false,
  video_vsync: true,

  rgui_menu_color_theme: 4,
  rgui_show_start_screen: false,
  savestate_file_compression: true,
  savestate_thumbnail_enable: true,
  save_file_compression: true,

  input_rewind_btn: 6, // L2
  input_hold_fast_forward_btn: 7, // R2
  // input_menu_toggle_gamepad_combo: 6, // L1+R1
  input_enable_hotkey_btn: 8, // select
  rewind_granularity: 4,

  input_exit_emulator: 'nul',

  input_player1_analog_dpad_mode: 1,
  input_player2_analog_dpad_mode: 1,
  input_player3_analog_dpad_mode: 1,
  input_player4_analog_dpad_mode: 1,
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export function getRetroarchConfig() {
  const gamepadMappings = PreferenceParser.get('gamepadMappings')
  const gamepads = navigator.getGamepads()

  const gamepadMappingsMap = new Map<string, Record<string, string>>()
  for (const { name, mapping } of gamepadMappings) {
    gamepadMappingsMap.set(name, mapping)
  }

  const inputConfig = {}
  if (compact(gamepads).length > 0) {
    for (const [index, gamepad] of gamepads.entries()) {
      const mapping = gamepadMappingsMap.get(gamepad?.id ?? '')
      if (mapping && gamepad) {
        for (const codeKey in mapping) {
          let buttonName = mapping[codeKey]
          // eslint-disable-next-line max-depth
          if (buttonName === 'l1') {
            buttonName = 'l'
          } else if (buttonName === 'r1') {
            buttonName = 'r'
          }
          const configItemName = `input_player${index + 1}_${buttonName}_btn`
          inputConfig[configItemName] = codeKey
        }
      }
    }
  } else if (gamepadMappings.length <= 2) {
    const mapping = last(gamepadMappings)?.mapping
    if (mapping) {
      for (const codeKey in mapping) {
        let buttonName = mapping[codeKey]

        if (buttonName === 'l1') {
          buttonName = 'l'
        } else if (buttonName === 'r1') {
          buttonName = 'r'
        }
        const configItemName = `input_player1_${buttonName}_btn`
        const code = Number.parseInt(codeKey, 10)
        if (!Number.isNaN(code)) {
          inputConfig[configItemName] = code
        }
      }
    }
  }

  return {
    ...defaultRetroarchConfig,
    ...inputConfig,
  }
}

export const defaultRetroarchCoresConfig = {
  nestopia: {
    nestopia_turbo_pulse: 2,
  },
  fceumm: {
    fceumm_turbo_enable: 'Both',
  },
  snes9x: {},
  gearboy: {},
  genesis_plus_gx: {},
}
