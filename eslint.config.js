import { createConfig } from '@arianrhodsandlot/eslint-config'

export default createConfig({
  typeChecking: false,
  append: [{
    ignores: [
      'src/core/classes/libretrodb',
      'src/views/lib/spatial-navigation/js-spatial-navigation.ts'
    ]
  }]
})
