import mitt from 'mitt'

export const emitter = mitt<{
  start: undefined
  'request-auth-error': { type: 'onedrive'; error: any }
  'onedrive-token': 'start' | 'success' | 'error'
}>()
