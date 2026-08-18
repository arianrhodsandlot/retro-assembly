import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'
import type { PlatformName } from '#@/constants/platform.ts'
import type { PreferenceSnippet } from '../constants/preference.ts'
import { nanoid } from '../utils/server/nanoid.ts'

export const statusEnum = {
  deleted: 0,
  normal: 1,
}

export const libraryModeEnum = {
  isolated: 0,
  shared: 1,
}

export const authenticationMethodEnum = {
  oidc: 'oidc',
  password: 'password',
} as const

const baseSchema = {
  createdAt: integer({ mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
  id: text('id').primaryKey().notNull().$defaultFn(nanoid),
  status: integer().notNull().default(statusEnum.normal),
  updatedAt: integer({ mode: 'timestamp_ms' })
    .notNull()
    .$onUpdateFn(() => new Date()),
}

const fileSchema = {
  ...baseSchema,
  fileId: text().notNull(),
  userId: text().notNull(),
}

export const userTable = sqliteTable(
  'users',
  {
    libraryMode: integer().notNull().default(libraryModeEnum.isolated),
    passwordHash: text(),
    registrationIp: text(),
    registrationUserAgent: text(),
    username: text().notNull(),
    ...baseSchema,
  },
  (table) => [index('idx_users_username').on(table.username)],
)

export const sessionTable = sqliteTable(
  'sessions',
  {
    authenticationMethod: text({ enum: [authenticationMethodEnum.password, authenticationMethodEnum.oidc] })
      .notNull()
      .default(authenticationMethodEnum.password),
    expiresAt: integer({ mode: 'timestamp_ms' }).notNull(),
    ip: text(),
    lastActivityAt: integer({ mode: 'timestamp_ms' })
      .notNull()
      .$defaultFn(() => new Date()),
    token: text().notNull().unique(),
    userAgent: text(),
    userId: text().notNull(),
    ...baseSchema,
  },
  (table) => [index('idx_sessions_user').on(table.userId, table.status)],
)

export const oidcIdentityTable = sqliteTable(
  'oidc_identities',
  {
    issuer: text().notNull(),
    subject: text().notNull(),
    userId: text().notNull(),
    ...baseSchema,
  },
  (table) => [
    uniqueIndex('idx_oidc_identities_issuer_subject').on(table.issuer, table.subject),
    uniqueIndex('idx_oidc_identities_user').on(table.userId),
  ],
)
export const romTable = sqliteTable(
  'roms',
  {
    fileName: text().notNull(),
    gameBoxartFileIds: text(),
    gameDescription: text(),
    gameDeveloper: text(),
    gameGenres: text(),
    gameName: text(),
    gamePlayers: integer(),
    gamePublisher: text(),
    gameRating: integer(),
    gameReleaseDate: integer({ mode: 'timestamp_ms' }),
    /** deprecated. use gameReleaseDate instead */
    gameReleaseYear: integer(),
    gameThumbnailFileIds: text(),
    launchboxGameId: integer(),
    libretroGameId: text(),
    platform: text().notNull().$type<PlatformName>(),
    rawGameMetadata: text({ mode: 'json' }).$type<{
      launchbox?: any
      libretro?: any
    }>(),
    ...fileSchema,
  },
  (table) => [
    index('idx_roms_user_status_platform').on(table.userId, table.status, table.platform),
    index('idx_roms_user_status_created').on(table.userId, table.status, table.createdAt),
    index('idx_roms_user_status_released').on(table.userId, table.status, table.gameReleaseDate),
    index('idx_roms_user_status_name').on(table.userId, table.status, table.fileName),
    // For delete-roms.ts: find still-referenced files during cleanup
    index('idx_roms_file_status').on(table.fileId, table.status),
    // For get-rom.ts: lookup ROM by filename when ID not provided
    index('idx_roms_user_platform_filename').on(table.userId, table.platform, table.fileName),
  ],
)

export const stateTable = sqliteTable(
  'states',
  {
    core: text().notNull(),
    platform: text().notNull(),
    romId: text().notNull(),
    thumbnailFileId: text().notNull(),
    type: text({ enum: ['auto', 'manual'] }).notNull(),
    ...fileSchema,
  },
  (table) => [
    index('idx_states_rom_status').on(table.romId, table.status, table.createdAt),
    index('idx_states_user_status').on(table.userId, table.status),
    // For get-states.ts: filter states by romId + type (manual/auto)
    index('idx_states_user_rom_status_type').on(table.userId, table.romId, table.status, table.type),
  ],
)

export const launchRecordTable = sqliteTable(
  'launch_records',
  {
    core: text().notNull(),
    platform: text().notNull(),
    romId: text().notNull(),
    userId: text().notNull(),
    ...baseSchema,
  },
  (table) => [
    index('idx_launch_records_user_status_platform').on(table.userId, table.status, table.platform, table.createdAt),
  ],
)

export const userPreferenceTable = sqliteTable(
  'user_preferences',
  {
    emulator: text({ mode: 'json' }).$type<PreferenceSnippet['emulator']>(),
    input: text({ mode: 'json' }).$type<PreferenceSnippet['input']>(),
    ui: text({ mode: 'json' }).$type<PreferenceSnippet['ui']>(),
    user: text({ mode: 'json' }),
    userId: text().notNull(),
    ...baseSchema,
  },
  (table) => [index('idx_user_preferences').on(table.userId)],
)

export const favoriteTable = sqliteTable(
  'favorites',
  {
    romId: text().notNull(),
    userId: text().notNull(),
    ...baseSchema,
  },
  (table) => [
    uniqueIndex('idx_favorites_user_rom').on(table.userId, table.romId),
    index('idx_favorites_user_status_created').on(table.userId, table.status, table.createdAt),
    // For remove-favorite.ts: soft-delete favorite with status check
    index('idx_favorites_user_rom_status').on(table.userId, table.romId, table.status),
  ],
)
