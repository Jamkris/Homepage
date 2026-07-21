import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // date -> start_date, plus ongoing + end_date on the collection and its versions
  await db.run(sql`ALTER TABLE \`activities\` RENAME COLUMN \`date\` TO \`start_date\`;`)
  await db.run(sql`ALTER TABLE \`activities\` ADD \`ongoing\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`activities\` ADD \`end_date\` text;`)
  await db.run(sql`ALTER TABLE \`_activities_v\` RENAME COLUMN \`version_date\` TO \`version_start_date\`;`)
  await db.run(sql`ALTER TABLE \`_activities_v\` ADD \`version_ongoing\` integer DEFAULT false;`)
  await db.run(sql`ALTER TABLE \`_activities_v\` ADD \`version_end_date\` text;`)

  // hasMany "tags" text field — stored in dedicated _texts tables
  await db.run(sql`CREATE TABLE \`activities_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`activities\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`activities_texts_order_parent\` ON \`activities_texts\` (\`order\`,\`parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_activities_v_texts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer NOT NULL,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`text\` text,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_activities_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_activities_v_texts_order_parent\` ON \`_activities_v_texts\` (\`order\`,\`parent_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`activities_texts\`;`)
  await db.run(sql`DROP TABLE \`_activities_v_texts\`;`)
  await db.run(sql`ALTER TABLE \`activities\` DROP COLUMN \`ongoing\`;`)
  await db.run(sql`ALTER TABLE \`activities\` DROP COLUMN \`end_date\`;`)
  await db.run(sql`ALTER TABLE \`activities\` RENAME COLUMN \`start_date\` TO \`date\`;`)
  await db.run(sql`ALTER TABLE \`_activities_v\` DROP COLUMN \`version_ongoing\`;`)
  await db.run(sql`ALTER TABLE \`_activities_v\` DROP COLUMN \`version_end_date\`;`)
  await db.run(sql`ALTER TABLE \`_activities_v\` RENAME COLUMN \`version_start_date\` TO \`version_date\`;`)
}
