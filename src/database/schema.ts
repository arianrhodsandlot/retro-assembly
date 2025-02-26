import { index, integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { customAlphabet } from 'nanoid'
import nanoidDictionary from 'nanoid-dictionary'

const nanoid = customAlphabet(nanoidDictionary.nolookalikes, 7)

const baseSchema = {
  created_at: integer({ mode: 'timestamp_ms' }).notNull(),
  id: text('id').primaryKey().notNull().$defaultFn(nanoid),
  status: integer().notNull(),
  updated_at: integer({ mode: 'timestamp_ms' }).notNull(),
}

const fileSchema = {
  ...baseSchema,
  file_id: text().notNull(),
  user_id: text().notNull(),
}

export const rom = sqliteTable(
  'roms',
  {
    fbneo_game_info: text({ mode: 'json' }),
    file_name: text().notNull(),
    good_code: text({ mode: 'json' }),
    launchbox_game_id: integer(),
    libretro_rdb: text({ mode: 'json' }),
    platform: text().notNull(),
    ...fileSchema,
  },
  (table) => [index('idx_roms').on(table.id, table.platform, table.user_id)],
)

export const state = sqliteTable(
  'states',
  {
    platform: text().notNull(),
    rom_id: text().notNull(),
    thumbnail_file_id: text().notNull(),
    ...fileSchema,
  },
  (table) => [index('idx_states').on(table.id, table.platform, table.user_id)],
)

export const launchRecord = sqliteTable(
  'launch_records',
  {
    platform: text().notNull(),
    rom_id: text().notNull(),
    user_id: text().notNull(),
    ...baseSchema,
  },
  (table) => [index('idx_launch_records').on(table.id, table.platform, table.user_id)],
)

export const launchboxGame = sqliteTable(
  'launchbox_games',
  {
    community_rating: real(),
    community_rating_count: integer(),
    compact_name: text().notNull(),
    cooperative: integer({ mode: 'boolean' }),
    database_id: integer().primaryKey().notNull(),
    developer: text(),
    dos: text(),
    esrb: text(),
    genres: text(),
    max_players: integer(),
    name: text().notNull(),
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
  (table) => [index('idx_launchbox_games').on(table.database_id, table.compact_name, table.name, table.platform)],
)

export const launchboxPlatform = sqliteTable(
  'launchbox_platforms',
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
    name: text().primaryKey().notNull(),
    notes: text(),
    release_date: integer({ mode: 'timestamp_ms' }),
    sound: text(),
    use_mame_files: integer({ mode: 'boolean' }),
  },
  (table) => [index('idx_launchbox_platforms').on(table.name)],
)

export const launchboxPlatformAlternateName = sqliteTable(
  'launchbox_platform_alternate_names',
  {
    alternate: text().notNull(),
    id: text('id').primaryKey().notNull().$defaultFn(nanoid),
    name: text(),
  },
  (table) => [index('idx_launchbox_platform_alternate_names').on(table.id, table.alternate, table.name)],
)

export const launchboxGameAlternateName = sqliteTable(
  'launchbox_game_alternate_names',
  {
    alternate_name: text(),
    database_id: integer(),
    id: text().primaryKey().notNull().$defaultFn(nanoid),
    region: text(),
  },
  (table) => [index('idx_launchbox_game_alternate_names').on(table.id, table.alternate_name, table.database_id)],
)

export const libretroGame = sqliteTable(
  'libretro_games',
  {
    compact_name: text().notNull(),
    crc: text(),
    description: text(),
    developer: text(),
    esrb_rating: text(),
    franchise: text(),
    genre: text(),
    id: text().primaryKey().notNull().$defaultFn(nanoid),
    md5: text(),
    name: text(),
    origin: text(),
    platform: text(),
    publisher: text(),
    releasemonth: integer(),
    releaseyear: integer(),
    rom_name: text(),
    sha1: text(),
    size: integer(),
    users: integer(),
  },
  (table) => [index('idx_libretro_game').on(table.id, table.name, table.rom_name)],
)
