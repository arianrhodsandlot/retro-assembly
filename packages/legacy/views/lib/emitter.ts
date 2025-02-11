import mitt from 'mitt'

export const emitter = mitt<{
  exit: undefined
  reload: undefined
}>()
