import mitt from 'mitt'

export const emitter = mitt<{
  'ready-to-start': undefined
  started: undefined
  'onedrive-token': 'start' | 'success' | 'error'
}>()
