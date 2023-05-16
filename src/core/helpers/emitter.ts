import mitt from 'mitt'

export const emitter = mitt<{
  'ready-to-start': undefined
  start: undefined
  started: undefined
  'request-auth-error': { type: 'onedrive'; error: any }
  'onedrive-token': 'start' | 'success' | 'error'
}>()
