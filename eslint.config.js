import { createConfig } from '@arianrhodsandlot/eslint-config'

export default createConfig({
  typeChecking: false,
  overrides: {
    ts: {
      rules: {
        '@typescript-eslint/no-shadow': 'off',
      },
    },
  },
})
