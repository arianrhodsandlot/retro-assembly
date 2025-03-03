import { $ } from 'zx'

await $`drizzle-kit --config=src/databases/metadata/drizzle.config.ts generate`
await $`drizzle-kit --config=src/databases/metadata/drizzle.config.ts migrate`
await $`drizzle-kit --config=src/databases/library/drizzle.config.ts generate`
await $`drizzle-kit --config=src/databases/library/drizzle.config.ts migrate`
await $`wrangler d1 migrations apply retroassembly`
