-- Migration number: 0001 	 2025-02-21T08:32:21.105Z
-- CreateTable
CREATE TABLE "Rom" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME,
    "updated_at" DATETIME,
    "status" INTEGER,
    "user_id" TEXT,
    "file_name" TEXT,
    "file_id" TEXT,
    "platform" TEXT,
    "good_code" JSONB,
    "libretro_rdb" JSONB,
    "fbneo_game_info" JSONB
);

-- CreateTable
CREATE TABLE "LaunchboxGame" (
    "database_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "release_year" DATETIME,
    "overview" TEXT,
    "max_players" INTEGER,
    "release_type" TEXT,
    "cooperative" BOOLEAN,
    "video_url" TEXT,
    "community_rating" DECIMAL,
    "platform" TEXT,
    "esrb" TEXT,
    "community_rating_count" INTEGER,
    "genres" TEXT,
    "developer" TEXT,
    "publisher" TEXT,
    "release_date" TEXT,
    "wikipedia_url" TEXT,
    "steam_app_id" TEXT,
    "dos" TEXT,
    "startup_file" TEXT,
    "startup_md5" TEXT,
    "setup_file" TEXT,
    "setup_md5" TEXT,
    "startup_parameters" TEXT
);

-- CreateTable
CREATE TABLE "LaunchboxPlatform" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "emulated" INTEGER,
    "release_date" DATETIME,
    "developer" TEXT,
    "manufacturer" TEXT,
    "cpu" TEXT,
    "memory" TEXT,
    "graphics" TEXT,
    "sound" TEXT,
    "display" TEXT,
    "media" TEXT,
    "max_controllers" TEXT,
    "notes" TEXT,
    "category" TEXT,
    "use_mame_files" BOOLEAN
);

-- CreateTable
CREATE TABLE "LaunchboxPlatformAlternateName" (
    "alternate" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT
);

-- CreateTable
CREATE TABLE "LaunchboxGameAlternateName" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "alternate_name" TEXT,
    "database_id" INTEGER,
    "region" TEXT
);

-- CreateIndex
CREATE INDEX "Rom_id_platform_user_id_idx" ON "Rom"("id", "platform", "user_id");

-- CreateIndex
CREATE INDEX "LaunchboxGame_database_id_name_platform_idx" ON "LaunchboxGame"("database_id", "name", "platform");

-- CreateIndex
CREATE INDEX "LaunchboxPlatform_name_idx" ON "LaunchboxPlatform"("name");

-- CreateIndex
CREATE INDEX "LaunchboxPlatformAlternateName_alternate_idx" ON "LaunchboxPlatformAlternateName"("alternate");

-- CreateIndex
CREATE INDEX "LaunchboxGameAlternateName_id_alternate_name_database_id_idx" ON "LaunchboxGameAlternateName"("id", "alternate_name", "database_id");
