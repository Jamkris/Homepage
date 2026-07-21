import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // slug for activity detail pages (nullable to allow existing rows; filled on edit)
  await db.run(sql`ALTER TABLE \`activities\` ADD \`slug\` text;`)
  await db.run(sql`CREATE UNIQUE INDEX \`activities_slug_idx\` ON \`activities\` (\`slug\`);`)
  await db.run(sql`ALTER TABLE \`_activities_v\` ADD \`version_slug\` text;`)
  await db.run(sql`CREATE INDEX \`_activities_v_version_version_slug_idx\` ON \`_activities_v\` (\`version_slug\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX \`activities_slug_idx\`;`)
  await db.run(sql`DROP INDEX \`_activities_v_version_version_slug_idx\`;`)
  await db.run(sql`ALTER TABLE \`activities\` DROP COLUMN \`slug\`;`)
  await db.run(sql`ALTER TABLE \`_activities_v\` DROP COLUMN \`version_slug\`;`)
}
