import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // "references" array field (label/url) — one table for the collection, one for versions
  await db.run(sql`CREATE TABLE \`activities_references\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`url\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`activities\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`activities_references_order_idx\` ON \`activities_references\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`activities_references_parent_id_idx\` ON \`activities_references\` (\`_parent_id\`);`)

  await db.run(sql`CREATE TABLE \`_activities_v_version_references\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`label\` text,
  	\`url\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_activities_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_activities_v_version_references_order_idx\` ON \`_activities_v_version_references\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_activities_v_version_references_parent_id_idx\` ON \`_activities_v_version_references\` (\`_parent_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`activities_references\`;`)
  await db.run(sql`DROP TABLE \`_activities_v_version_references\`;`)
}
