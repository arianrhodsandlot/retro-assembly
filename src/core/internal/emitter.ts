import mitt from 'mitt'
import { Rom } from '..'
import { PreferenceParser } from '../classes/preference-parser'
import { addHistoryItem } from '../helpers/history'

export const emitter = mitt<{
  launched: Rom
}>()

emitter.on('launched', async (rom) => {
  const romProviderType = PreferenceParser.get('romProviderType')
  if (romProviderType === 'demo') {
    return
  }
  await addHistoryItem(rom)
})
