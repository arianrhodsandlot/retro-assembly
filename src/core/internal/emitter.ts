import mitt from 'mitt'
import { Rom } from '..'
import { addHistoryItem } from '../helpers/history'

export const emitter = mitt<{
  launched: Rom
}>()

emitter.on('launched', async (rom) => {
  await addHistoryItem(rom)
})
