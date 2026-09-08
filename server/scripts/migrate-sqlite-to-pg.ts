/**
 * migrate-sqlite-to-pg.ts
 *
 * One-time script to migrate historical enquiries from the legacy SQLite
 * database (data/enquiries.db) to the new PostgreSQL database.
 *
 * Requirements:
 * - PostgreSQL must be running and the schema initialized (run migrations first).
 * - DATABASE_URL must be set in .env
 *
 * Usage:
 *   cd server
 *   npx ts-node scripts/migrate-sqlite-to-pg.ts
 */

import { DatabaseSync } from 'node:sqlite';
import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

// Load .env from project root
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

async function run() {
  console.log('--- SQLite to PostgreSQL Data Migration ---');

  const sqlitePath = path.resolve(__dirname, '..', '..', 'data', 'enquiries.db');
  if (!fs.existsSync(sqlitePath)) {
    console.log(`[skip] SQLite database not found at ${sqlitePath}`);
    return;
  }

  if (!process.env.DATABASE_URL) {
    console.error('[error] DATABASE_URL is not set in .env');
    process.exit(1);
  }

  console.log('[pg] Connecting to PostgreSQL...');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const client = await pool.connect();

  console.log('[sqlite] Opening SQLite database...');
  const sqliteDb = new DatabaseSync(sqlitePath);

  try {
    const rows = sqliteDb.prepare('SELECT * FROM enquiries ORDER BY id ASC').all() as any[];
    if (rows.length === 0) {
      console.log('[skip] SQLite database is empty.');
      return;
    }

    console.log(`[migrate] Found ${rows.length} rows to migrate.`);

    let migrated = 0;
    let skipped = 0;

    for (const row of rows) {
      // Check if already exists in PostgreSQL
      const existing = await client.query('SELECT 1 FROM enquiries WHERE id = $1', [row.id]);
      if (existing.rows.length > 0) {
        skipped++;
        continue;
      }

      await client.query(`
        INSERT INTO enquiries (id, name, email, phone, enquiry_type, preferred_contact, message, consent, created_at)
        OVERRIDING SYSTEM VALUE
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [
        row.id,
        row.name,
        row.email,
        row.phone,
        row.enquiry_type,
        row.preferred_contact,
        row.message,
        row.consent === 1,
        // Ensure timestamp is parsed properly (SQLite stores 'YYYY-MM-DD HH:MM:SS' in local time default,
        // adding 'Z' assumes UTC. Realistically, we just feed it to PG)
        row.created_at
      ]);
      migrated++;
      console.log(`  -> Migrated enquiry #${row.id} (${row.name})`);
    }

    if (migrated > 0) {
      // Update the sequence since we explicitly inserted IDs
      await client.query(`
        SELECT setval(pg_get_serial_sequence('enquiries', 'id'), (SELECT MAX(id) FROM enquiries));
      `);
      console.log('[pg] Sequence updated.');
    }

    console.log(`\n✅ Migration complete. Migrated: ${migrated}, Skipped: ${skipped}`);
    console.log('You may now delete data/enquiries.db when ready.');

  } catch (err) {
    console.error('[error] Migration failed:', err);
  } finally {
    sqliteDb.close();
    client.release();
    await pool.end();
  }
}

run();
