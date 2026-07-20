import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`about_skill_groups\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`category\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`about_skill_groups_order_idx\` ON \`about_skill_groups\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`about_skill_groups_parent_id_idx\` ON \`about_skill_groups\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`about_skill_groups_locale_idx\` ON \`about_skill_groups\` (\`_locale\`);`)
  await db.run(sql`ALTER TABLE \`about\` ADD \`email\` text;`)
  await db.run(sql`ALTER TABLE \`about\` ADD \`phone\` text;`)
  await db.run(sql`ALTER TABLE \`about_locales\` ADD \`location\` text;`)
  await db.run(sql`ALTER TABLE \`about_locales\` ADD \`studying\` text;`)
  await db.run(sql`ALTER TABLE \`about_locales\` ADD \`focus\` text;`)
  await db.run(sql`ALTER TABLE \`about_texts\` ADD \`locale\` text;`)
  await db.run(sql`CREATE INDEX \`about_texts_locale_parent\` ON \`about_texts\` (\`locale\`,\`parent_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`about_skill_groups\`;`)
  await db.run(sql`DROP INDEX \`about_texts_locale_parent\`;`)
  await db.run(sql`ALTER TABLE \`about_texts\` DROP COLUMN \`locale\`;`)
  await db.run(sql`ALTER TABLE \`about\` DROP COLUMN \`email\`;`)
  await db.run(sql`ALTER TABLE \`about\` DROP COLUMN \`phone\`;`)
  await db.run(sql`ALTER TABLE \`about_locales\` DROP COLUMN \`location\`;`)
  await db.run(sql`ALTER TABLE \`about_locales\` DROP COLUMN \`studying\`;`)
  await db.run(sql`ALTER TABLE \`about_locales\` DROP COLUMN \`focus\`;`)
}
