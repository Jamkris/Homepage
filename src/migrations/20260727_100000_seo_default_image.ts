import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`seo_default_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`site_settings_seo_default_image_idx\` ON \`site_settings\` (\`seo_default_image_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX \`site_settings_seo_default_image_idx\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`seo_default_image_id\`;`)
}
