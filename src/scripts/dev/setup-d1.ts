import { $, fs, path } from 'zx'

async function prepareZip(inputSubDirectory: string, url: string) {
  const inputDirectory = path.join('src/scripts/inputs', inputSubDirectory)
  await $`mkdir -p ${inputDirectory}`
  const { base, name } = path.parse(new URL(url).pathname)
  const zipDirectory = path.join(inputDirectory, name)
  const zipPath = path.join(inputDirectory, base)
  if (!(await fs.exists(zipDirectory))) {
    if (!(await fs.exists(zipPath))) {
      await $`curl ${url} -o ${zipPath}`
    }
    $`unzip ${zipPath} -d ${zipDirectory}`
  }
}

$.verbose = true

const resetDirectories = ['src/database/migrations', 'src/scripts/artifacts', '.wrangler/state/v3/d1']
await Promise.all(resetDirectories.map((directory) => $`rm -rf ${directory}`))

// Prepare the input metadata files
await Promise.all([
  prepareZip('libretro', 'https://buildbot.libretro.com/assets/frontend/database-rdb.zip'),
  prepareZip('launchbox', 'https://gamesdb.launchbox-app.com/metadata.zip'),
])

// Initialize a temporary database
await $`drizzle-kit --config=src/database/metadata/drizzle.config.ts generate --name=init`
await $`mkdir src/scripts/artifacts`
await $`drizzle-kit --config=src/database/metadata/drizzle.config.ts migrate`

// Prepare data for the temporary database
await $`node src/scripts/dev/extract-libretro-db.ts`
await $`node src/scripts/dev/extract-launchbox-metadata.ts`

// Dump data from the temporary database to local d1
await $`sqlite3 src/scripts/artifacts/launchbox-metadata.db .dump > src/scripts/artifacts/launchbox-metadata.sql`
await $`wrangler d1 execute retroassembly --file=src/scripts/artifacts/launchbox-metadata.sql`
