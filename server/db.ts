/**
 * db.ts — PostgreSQL database pool and enquiry helpers
 *
 * Uses the `pg` (node-postgres) library with a connection pool.
 *
 * Configuration:
 *   DATABASE_URL  — PostgreSQL connection string, e.g.
 *                   postgresql://user:pass@host:5432/dbname
 *                   Append ?sslmode=require for platforms that require SSL.
 *
 * On startup, runMigrations() is called once to ensure the enquiries
 * table exists. This is safe to run repeatedly (CREATE TABLE IF NOT EXISTS).
 */

import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

// ── Connection pool ───────────────────────────────────────────────────────────

if (!process.env.DATABASE_URL) {
  throw new Error(
    '[db] DATABASE_URL is not set. ' +
    'Set it to a PostgreSQL connection string, e.g.:\n' +
    '  DATABASE_URL=postgresql://user:pass@localhost:5432/canaan_enquiries'
  );
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // ssl: { rejectUnauthorized: false } is NOT set globally here.
  // For platforms requiring SSL, append ?sslmode=require to DATABASE_URL,
  // or set ?ssl=true — pg handles it automatically from the connection string.
  max: 10,             // Maximum pool connections (sufficient for small site)
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

pool.on('error', (err) => {
  console.error('[db] Unexpected pool error:', err);
});

// ── Migrations ────────────────────────────────────────────────────────────────

/**
 * Run all SQL migration files in server/migrations/ in filename order.
 * Each migration is tracked in a _migrations table so it only ever runs once.
 * Safe to call on every startup.
 */
export async function runMigrations(): Promise<void> {
  const client = await pool.connect();
  try {
    // Create the migrations tracker table if it does not exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id         SERIAL PRIMARY KEY,
        filename   TEXT        NOT NULL UNIQUE,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    const migrationsDir = path.join(__dirname, '..', 'migrations');

    // In compiled (dist/) build, migrations are copied there by tsc.
    // We try both locations so ts-node dev also works.
    const dirs = [migrationsDir];
    // When running via ts-node from server/, __dirname = server/
    // so '..migrations' is wrong; also check ./migrations
    const localMigrationsDir = path.join(__dirname, 'migrations');
    if (localMigrationsDir !== migrationsDir) dirs.push(localMigrationsDir);

    let resolvedDir: string | null = null;
    for (const dir of dirs) {
      if (fs.existsSync(dir)) { resolvedDir = dir; break; }
    }
    if (!resolvedDir) {
      console.warn('[db] No migrations directory found — skipping migrations.');
      return;
    }

    const files = fs.readdirSync(resolvedDir)
      .filter(f => f.endsWith('.sql'))
      .sort();                               // 001_, 002_, ... order

    for (const file of files) {
      const { rows } = await client.query(
        'SELECT 1 FROM _migrations WHERE filename = $1', [file]
      );
      if (rows.length > 0) continue;        // Already applied

      const sql = fs.readFileSync(path.join(resolvedDir, file), 'utf8');
      await client.query(sql);
      await client.query(
        'INSERT INTO _migrations (filename) VALUES ($1)', [file]
      );
      console.log(`[db] Migration applied: ${file}`);
    }
  } finally {
    client.release();
  }
}

// ── Health check ──────────────────────────────────────────────────────────────

/**
 * Returns true if the pool can acquire a connection and run a trivial query.
 */
export async function checkDbHealth(): Promise<boolean> {
  try {
    const client = await pool.connect();
    try {
      await client.query('SELECT 1');
      return true;
    } finally {
      client.release();
    }
  } catch {
    return false;
  }
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface EnquiryRow {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  enquiry_type: string | null;
  preferred_contact: string | null;
  message: string;
  consent: boolean;
  created_at: Date;
}

export interface InsertEnquiryInput {
  name: string;
  email: string;
  phone?: string;
  enquiryType?: string;
  preferredContact?: string;
  message: string;
  consent: boolean;
}

// ── Insert ────────────────────────────────────────────────────────────────────

/**
 * Insert a new enquiry row and return the full saved row
 * (including the auto-generated id and created_at timestamp).
 *
 * Uses parameterized queries — never string-concatenates user input.
 */
export async function insertEnquiry(input: InsertEnquiryInput): Promise<EnquiryRow> {
  const { rows } = await pool.query<EnquiryRow>(
    `INSERT INTO enquiries
       (name, email, phone, enquiry_type, preferred_contact, message, consent)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      input.name,
      input.email,
      input.phone ?? null,
      input.enquiryType ?? null,
      input.preferredContact ?? null,
      input.message,
      input.consent,
    ]
  );
  return rows[0];
}
