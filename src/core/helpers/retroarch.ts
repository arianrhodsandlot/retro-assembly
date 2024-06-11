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

  input_cheat_index_minus: 'nul', // override default 't',
  input_cheat_index_plus: 'nul', // override default 'y',
  input_cheat_toggle: 'nul', // override default 'u',
  input_frame_advance: 'nul', // override default 'k',
  input_hold_fast_forward: 'nul', // override default 'l',
  input_hold_slowmotion: 'nul', // override default 'e',
  input_netplay_game_watch: 'nul', // override default 'i',
  input_pause_toggle: 'nul', // override default 'p',
  input_reset: 'nul', // override default 'h',
  input_rewind: 'nul', // override default 'r',
  input_shader_next: 'nul', // override default 'm',
  input_shader_prev: 'nul', // override default 'n',
  input_toggle_fullscreen: 'nul', // override default 'f',

  input_player1_analog_dpad_mode: 1,
  input_player2_analog_dpad_mode: 1,
  input_player3_analog_dpad_mode: 1,
  input_player4_analog_dpad_mode: 1,
}

export const defaultRetroarchCoresConfig = {
  fceumm: {
    fceumm_turbo_enable: 'Both',
  },
  mgba: {
    mgba_gb_colors: 'DMG Green',
    mgba_skip_bios: 'ON',
  },
}

function getEmptyInputConfig() {
  const gamepadButtonNames = [
    'a',
    'b',
    'x',
    'y',
    'l',
    'l2',
    'l3',
    'r',
    'r2',
    'r3',
    'up',
    'down',
    'left',
    'right',
    'select',
    'start',
  ]
  const inputConfig = {}
  for (const gamepadButtonName of gamepadButtonNames) {
    for (let i = 0; i < 4; i += 1) {
      inputConfig[`input_player${i + 1}_${gamepadButtonName}`] = ''
      inputConfig[`input_player${i + 1}_${gamepadButtonName}_btn`] = ''
    }
  }
  return inputConfig
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export function getRetroarchConfig() {
  const gamepadMappings = PreferenceParser.get('gamepadMappings')
  const gamepads = navigator.getGamepads()

  const gamepadMappingsMap = new Map<string, Record<string, string>>()
  for (const { name, mapping } of gamepadMappings) {
    gamepadMappingsMap.set(name, mapping)
  }

  const inputConfig = getEmptyInputConfig()
  if (compact(gamepads).length > 0) {
    for (const [index, gamepad] of gamepads.entries()) {
      if (gamepad) {
        const mapping = gamepadMappingsMap.get(gamepad.id) || gamepadMappingsMap.get('')
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

  const keyboardMappings = PreferenceParser.get('keyboardMappings')
  for (const [index, { mapping }] of keyboardMappings.entries()) {
    for (const codeKey in mapping) {
      let buttonName = mapping[codeKey]

      if (buttonName === 'l1') {
        buttonName = 'l'
      } else if (buttonName === 'r1') {
        buttonName = 'r'
      }
      const configItemName = `input_player${index + 1}_${buttonName}`
      inputConfig[configItemName] = codeKey
    }
  }

  return {
    ...defaultRetroarchConfig,
    ...inputConfig,
  }
}
