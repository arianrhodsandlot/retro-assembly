import { createConfig } from '@arianrhodsandlot/eslint-config'

export default createConfig({
  rules: {
    '@eslint-react/no-array-index-key': 'off',
    '@eslint-react/no-complex-conditional-rendering': 'off',
    'max-lines-per-function': 'off',
    'sonarjs/no-nested-conditional': 'off',
  },
})
