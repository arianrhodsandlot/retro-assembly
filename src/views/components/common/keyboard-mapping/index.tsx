import { useState } from 'react'
import { getDefaultKeyboardMappings, getKeyboardMappings, updateKeyboardMappings } from '../../../../core'
import { KeyboardMappingPanel } from '../keyboard-mapping/keyboard-mapping-panel'

const defaultKeyboardMapping = getDefaultKeyboardMappings()

export function KeyboardMapping() {
  const [keyboardMappings, setKeyboardMappings] = useState(getKeyboardMappings())

  function updateKeyboardMapping(mapping) {
    const newMappings = [{ mapping }]
    updateKeyboardMappings(newMappings)
    setKeyboardMappings(newMappings)
  }

  function resetKeyboardMapping() {
    const newMappings = [{ mapping: defaultKeyboardMapping }]
    updateKeyboardMappings(newMappings)
    setKeyboardMappings(newMappings)
  }

  return (
    <div>
      <div className='mt-4 flex flex-col gap-8'>
        <div>
          <div className='flex w-full items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap rounded bg-rose-800 px-4 py-2 text-sm text-white'>
            <span className='icon-[mdi--keyboard] h-5 w-5' />
            Keyboard
          </div>
          <KeyboardMappingPanel
            mapping={keyboardMappings[0].mapping}
            onResetMapping={resetKeyboardMapping}
            onUpdateMapping={updateKeyboardMapping}
          />
        </div>
      </div>
    </div>
  )
}
