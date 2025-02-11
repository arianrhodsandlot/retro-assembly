import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'waku/config'

export default defineConfig({
  unstable_honoEnhancer(createApp) {
    return (base) => {
      const app = createApp(base)
      return app
    }
  },
  unstable_viteConfigs: {
    common() {
      return {
        plugins: [tailwindcss(), tsconfigPaths()],
      }
    },
  },
})
