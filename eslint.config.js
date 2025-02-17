import { createConfig } from '@arianrhodsandlot/eslint-config'

export default createConfig({
  append: {
    ignores: ['packages/legacy/**/*'],
  },
  rules: {
    '@eslint-react/no-array-index-key': 'off',
    '@eslint-react/no-complex-conditional-rendering': 'off',
    'import-x/extensions': 'off',
    'max-lines-per-function': 'off',
    'sonarjs/no-nested-conditional': 'off',
  },
})
