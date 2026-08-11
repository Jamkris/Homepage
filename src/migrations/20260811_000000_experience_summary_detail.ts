import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`about_experiences\` ADD \`summary\` text;`)
  await db.run(sql`ALTER TABLE \`about_experiences\` ADD \`detail\` text;`)
  // Preserve any existing text: the old single description becomes the summary
  await db.run(sql`UPDATE \`about_experiences\` SET \`summary\` = \`description\`;`)
  await db.run(sql`ALTER TABLE \`about_experiences\` DROP COLUMN \`description\`;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`about_experiences\` ADD \`description\` text;`)
  await db.run(sql`UPDATE \`about_experiences\` SET \`description\` = \`summary\`;`)
  await db.run(sql`ALTER TABLE \`about_experiences\` DROP COLUMN \`summary\`;`)
  await db.run(sql`ALTER TABLE \`about_experiences\` DROP COLUMN \`detail\`;`)
}
