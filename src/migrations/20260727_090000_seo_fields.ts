import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // SEO group scalar fields -> columns on site_settings
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`seo_naver_verification\` text;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`seo_google_verification\` text;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`seo_person_name\` text;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`seo_job_title\` text;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`seo_affiliation\` text;`)

  // hasMany text fields (seo.keywords, seo.alternateNames) -> _texts table (path discriminated)
  await db.run(sql`CREATE TABLE \`site_settings_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_texts_order_parent\` ON \`site_settings_texts\` (\`order\`,\`parent_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`site_settings_texts\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`seo_naver_verification\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`seo_google_verification\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`seo_person_name\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`seo_job_title\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`seo_affiliation\`;`)
}
