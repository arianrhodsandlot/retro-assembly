import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { nanoid } from '../../utils/misc.ts'

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
