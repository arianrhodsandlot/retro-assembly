import { randomUUID } from 'node:crypto'
import { index, integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const rom = sqliteTable(
  'Rom',
  {
    created_at: integer({ mode: 'timestamp_ms' }),
    fbneo_game_info: text({ mode: 'json' }),
    file_id: text(),
    file_name: text(),
    good_code: text({ mode: 'json' }),
    id: text('id').primaryKey().$defaultFn(randomUUID),
    libretro_rdb: text({ mode: 'json' }),
    platform: text(),
    status: integer(),
    updated_at: integer({ mode: 'timestamp_ms' }),
    user_id: text(),
  },
  (table) => [index('idx_rom').on(table.id, table.platform, table.user_id)],
)

export const launchboxGame = sqliteTable(
  'LaunchboxGame',
  {
    community_rating: real(),
    community_rating_count: integer(),
    cooperative: integer({ mode: 'boolean' }),
    database_id: integer().primaryKey(),
    developer: text(),
    dos: text(),
    esrb: text(),
    genres: text(),
    max_players: integer(),
    name: text(),
    overview: text(),
    platform: text(),
    publisher: text(),
    release_date: integer({ mode: 'timestamp_ms' }),
    release_type: text(),
    release_year: text(),
    setup_file: text(),
    setup_md5: text(),
    startup_file: text(),
    startup_md5: text(),
    startup_parameters: text(),
    steam_app_id: text(),
    video_url: text(),
    wikipedia_url: text(),
  },
  (table) => [index('idx_launchboxGame').on(table.database_id, table.name, table.platform)],
)

export const launchboxPlatform = sqliteTable(
  'LaunchboxPlatform',
  {
    category: text(),
    cpu: text(),
    developer: text(),
    display: text(),
    emulated: integer({ mode: 'boolean' }),
    graphics: text(),
    manufacturer: text(),
    max_controllers: text(),
    media: text(),
    memory: text(),
    name: text().primaryKey(),
    notes: text(),
    release_date: integer({ mode: 'timestamp_ms' }),
    sound: text(),
    use_mame_files: integer({ mode: 'boolean' }),
  },
  (table) => [index('idx_launchboxPlatform').on(table.name)],
)

export const launchboxPlatformAlternateName = sqliteTable(
  'LaunchboxPlatformAlternateName',
  {
    alternate: text().notNull(),
    id: text('id').primaryKey().$defaultFn(randomUUID),
    name: text(),
  },
  (table) => [index('idx_launchboxPlatformAlternateName').on(table.id, table.alternate, table.name)],
)

export const launchboxGameAlternateName = sqliteTable(
  'LaunchboxGameAlternateName',
  {
    alternate_name: text(),
    database_id: integer(),
    id: text().primaryKey().$defaultFn(randomUUID),
    region: text(),
  },
  (table) => [index('idx_launchboxGameAlternateName').on(table.id, table.alternate_name, table.database_id)],
)
