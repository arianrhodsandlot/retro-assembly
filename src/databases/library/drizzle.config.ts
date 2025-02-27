import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dbCredentials: {
    url: 'src/scripts/artifacts/library.db',
  },
  dialect: 'sqlite',
  out: 'src/databases/library/migrations',
  schema: 'src/databases/library/schema.ts',
})
