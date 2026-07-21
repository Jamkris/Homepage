import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`about_certifications\` ADD \`attachment_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`about_certifications_attachment_idx\` ON \`about_certifications\` (\`attachment_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_about_certifications\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`_locale\` text NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`issuer\` text,
  	\`issued_at\` text,
  	\`url\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`about\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_about_certifications\`("_order", "_parent_id", "_locale", "id", "name", "issuer", "issued_at", "url") SELECT "_order", "_parent_id", "_locale", "id", "name", "issuer", "issued_at", "url" FROM \`about_certifications\`;`)
  await db.run(sql`DROP TABLE \`about_certifications\`;`)
  await db.run(sql`ALTER TABLE \`__new_about_certifications\` RENAME TO \`about_certifications\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`about_certifications_order_idx\` ON \`about_certifications\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`about_certifications_parent_id_idx\` ON \`about_certifications\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`about_certifications_locale_idx\` ON \`about_certifications\` (\`_locale\`);`)
}
