import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'waku/config'

export default defineConfig({
  middleware() {
    return [
      import('waku/middleware/context'),
      import('./src/middlewares/controllers.ts'),
      import('waku/middleware/dev-server'),
      import('waku/middleware/handler'),
    ]
  },
  unstable_viteConfigs: {
    common() {
      return {
        plugins: [tailwindcss(), tsconfigPaths()],
      }
    },
  },
})
