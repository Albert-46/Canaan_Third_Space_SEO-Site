/**
 * db.ts — SQLite database initialisation and enquiry helpers
 *
 * Uses the built-in `node:sqlite` module (Node.js 22.5+ / 24+).
 * No third-party native bindings required — no compilation step.
 *
 * Database file is stored at: ../data/enquiries.db
 * Table is created automatically on first run.
 */

import { DatabaseSync } from 'node:sqlite';
import * as fs from 'fs';
import * as path from 'path';

// Resolve the data directory to project-root/data/.
// __dirname is server/ under ts-node (dev) and server/dist/ in the compiled build.
// Two levels up from either location correctly reaches the project root.
const DATA_DIR = path.resolve(__dirname, '..', '..', 'data');
const DB_PATH  = path.join(DATA_DIR, 'enquiries.db');

let _db: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (_db) return _db;

  // Ensure ../data/ exists
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  _db = new DatabaseSync(DB_PATH);
  _db.exec('PRAGMA journal_mode = WAL;');  // Safe concurrent reads
  initSchema(_db);
  return _db;
}

function initSchema(db: DatabaseSync): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS enquiries (
      id                INTEGER PRIMARY KEY AUTOINCREMENT,
      name              TEXT NOT NULL,
      email             TEXT NOT NULL,
      phone             TEXT,
      enquiry_type      TEXT,
      preferred_contact TEXT,
      message           TEXT NOT NULL,
      consent           INTEGER NOT NULL DEFAULT 1,
      created_at        TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );
  `);
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
  consent: number;
  created_at: string;
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
 */
export function insertEnquiry(input: InsertEnquiryInput): EnquiryRow {
  const db = getDb();

  const insert = db.prepare(`
    INSERT INTO enquiries (name, email, phone, enquiry_type, preferred_contact, message, consent)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const result = insert.run(
    input.name,
    input.email,
    input.phone ?? null,
    input.enquiryType ?? null,
    input.preferredContact ?? null,
    input.message,
    input.consent ? 1 : 0,
  );

  const row = db
    .prepare('SELECT * FROM enquiries WHERE id = ?')
    .get(result.lastInsertRowid) as unknown as EnquiryRow;

  return row;
}
