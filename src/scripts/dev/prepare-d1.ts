import { $ } from 'zx'

$.verbose = true

await $`rm -rf src/database/migrations`
await $`rm -rf src/scripts/artifacts`
await $`rm -rf .wrangler/state/v3/d1`
await $`mkdir -p src/scripts/artifacts`
await $`drizzle-kit --config=src/database/drizzle.config.ts generate --name=init`
await $`drizzle-kit --config=src/database/drizzle.config.ts migrate`
await $`node src/scripts/dev/extract-launchbox-metadata.ts`
await $`sqlite3 src/scripts/artifacts/launchbox-metadata.db .dump > src/scripts/artifacts/launchbox-metadata.sql`
await $`wrangler d1 execute retroassembly --file=src/scripts/artifacts/launchbox-metadata.sql`
