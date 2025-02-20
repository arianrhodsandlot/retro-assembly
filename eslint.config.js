import { createConfig } from '@arianrhodsandlot/eslint-config'

export default createConfig({
  append: {
    ignores: ['packages/legacy/**/*'],
  },
})
