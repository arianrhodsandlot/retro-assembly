import mitt from 'mitt'

export const emitter = mitt<{
  start: undefined
  'onedrive-token': 'start' | 'success' | 'error'
}>()
