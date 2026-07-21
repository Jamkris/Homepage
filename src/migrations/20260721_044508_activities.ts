import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`activities\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`type\` text DEFAULT 'award',
  	\`date\` text,
  	\`attachment_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`attachment_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`activities_attachment_idx\` ON \`activities\` (\`attachment_id\`);`)
  await db.run(sql`CREATE INDEX \`activities_updated_at_idx\` ON \`activities\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`activities_created_at_idx\` ON \`activities\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`activities__status_idx\` ON \`activities\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`activities_locales\` (
  	\`title\` text,
  	\`organization\` text,
  	\`content\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`activities\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`activities_locales_locale_parent_id_unique\` ON \`activities_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_activities_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_type\` text DEFAULT 'award',
  	\`version_date\` text,
  	\`version_attachment_id\` integer,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`snapshot\` integer,
  	\`published_locale\` text,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`activities\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_attachment_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_activities_v_parent_idx\` ON \`_activities_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_activities_v_version_version_attachment_idx\` ON \`_activities_v\` (\`version_attachment_id\`);`)
  await db.run(sql`CREATE INDEX \`_activities_v_version_version_updated_at_idx\` ON \`_activities_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_activities_v_version_version_created_at_idx\` ON \`_activities_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_activities_v_version_version__status_idx\` ON \`_activities_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_activities_v_created_at_idx\` ON \`_activities_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_activities_v_updated_at_idx\` ON \`_activities_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_activities_v_snapshot_idx\` ON \`_activities_v\` (\`snapshot\`);`)
  await db.run(sql`CREATE INDEX \`_activities_v_published_locale_idx\` ON \`_activities_v\` (\`published_locale\`);`)
  await db.run(sql`CREATE INDEX \`_activities_v_latest_idx\` ON \`_activities_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`_activities_v_locales\` (
  	\`version_title\` text,
  	\`version_organization\` text,
  	\`version_content\` text,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_activities_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`_activities_v_locales_locale_parent_id_unique\` ON \`_activities_v_locales\` (\`_locale\`,\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`activities_id\` integer REFERENCES activities(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_activities_id_idx\` ON \`payload_locked_documents_rels\` (\`activities_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`activities\`;`)
  await db.run(sql`DROP TABLE \`activities_locales\`;`)
  await db.run(sql`DROP TABLE \`_activities_v\`;`)
  await db.run(sql`DROP TABLE \`_activities_v_locales\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`posts_id\` integer,
  	\`projects_id\` integer,
  	\`contacts_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`posts_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`projects_id\`) REFERENCES \`projects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`contacts_id\`) REFERENCES \`contacts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id", "posts_id", "projects_id", "contacts_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id", "posts_id", "projects_id", "contacts_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_posts_id_idx\` ON \`payload_locked_documents_rels\` (\`posts_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_projects_id_idx\` ON \`payload_locked_documents_rels\` (\`projects_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_contacts_id_idx\` ON \`payload_locked_documents_rels\` (\`contacts_id\`);`)
}
