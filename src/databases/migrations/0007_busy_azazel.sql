CREATE TABLE `oidc_identities` (
	`issuer` text NOT NULL,
	`subject` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`status` integer DEFAULT 1 NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_oidc_identities_issuer_subject` ON `oidc_identities` (`issuer`,`subject`);--> statement-breakpoint
CREATE UNIQUE INDEX `idx_oidc_identities_user` ON `oidc_identities` (`user_id`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`library_mode` integer DEFAULT 0 NOT NULL,
	`password_hash` text,
	`registration_ip` text,
	`registration_user_agent` text,
	`username` text NOT NULL,
	`created_at` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`status` integer DEFAULT 1 NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users`("library_mode", "password_hash", "registration_ip", "registration_user_agent", "username", "created_at", "id", "status", "updated_at") SELECT "library_mode", "password_hash", "registration_ip", "registration_user_agent", "username", "created_at", "id", "status", "updated_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `idx_users_username` ON `users` (`username`);--> statement-breakpoint
ALTER TABLE `sessions` ADD `authentication_method` text DEFAULT 'password' NOT NULL;