import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dbCredentials: {
    url: 'src/scripts/artifacts/launchbox-metadata.db',
  },
  dialect: 'sqlite',
  out: 'src/database/migrations',
  schema: 'src/database/schema.ts',
})
