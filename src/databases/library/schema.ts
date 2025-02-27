import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { customAlphabet } from 'nanoid'
import nanoidDictionary from 'nanoid-dictionary'

const nanoid = customAlphabet(nanoidDictionary.nolookalikes, 10)

const baseSchema = {
  created_at: integer({ mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
  id: text('id').primaryKey().notNull().$defaultFn(nanoid),
  status: integer().notNull().default(1),
  updated_at: integer({ mode: 'timestamp_ms' })
    .notNull()
    .$onUpdateFn(() => new Date()),
}

const fileSchema = {
  ...baseSchema,
  file_id: text().notNull(),
  user_id: text().notNull(),
}

export const rom = sqliteTable(
  'roms',
  {
    file_name: text().notNull(),
    launchbox_game_id: integer(),
    libretro_game_id: text(),
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
