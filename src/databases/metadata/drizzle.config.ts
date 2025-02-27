import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dbCredentials: {
    url: 'src/scripts/artifacts/metadata.db',
  },
  dialect: 'sqlite',
  out: 'src/databases/metadata/migrations',
  schema: 'src/databases/metadata/schema.ts',
})
