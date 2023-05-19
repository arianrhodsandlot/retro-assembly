import mitt from 'mitt'

export const emitter = mitt<{
  exit: undefined
  exited: undefined
}>()
