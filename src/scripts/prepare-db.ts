import { $ } from 'zx'

$.verbose = true

await $`sqlite3 src/scripts/artifacts/launchbox-metadata.db .dump > src/scripts/artifacts/launchbox-metadata.sql`
await $`pnpm wrangler d1 execute retroassembly --file=src/scripts/artifacts/launchbox-metadata.sql`
