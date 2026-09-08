/**
 * ============================================================
 * Canaan Third Space Senior Care Home — Enquiry API Server
 * ============================================================
 *
 * PURPOSE
 *   Receives contact form submissions from the Astro frontend,
 *   saves each enquiry to SQLite, then sends an SMTP email
 *   notification to the configured inbox.
 *
 * ARCHITECTURE
 *   - Express HTTP server listening on PORT (default 3001)
 *   - better-sqlite3 database at ../data/enquiries.db
 *   - Nodemailer SMTP transport for email notifications
 *   - Email failures are logged but never block the API response
 *
 * REQUIRED ENVIRONMENT VARIABLES
 *   Copy .env.example → .env and fill in the values below.
 *
 *   PORT                 Port this server listens on (default: 3001)
 *   ALLOWED_ORIGIN       Astro dev URL for CORS (default: http://localhost:4321)
 *   SMTP_HOST            SMTP server hostname (e.g. smtp.gmail.com)
 *   SMTP_PORT            SMTP port (587 for STARTTLS, 465 for SSL)
 *   SMTP_SECURE          "true" for port 465, "false" for 587
 *   SMTP_USER            SMTP username / Gmail address
 *   SMTP_PASS            Gmail App Password (NOT your login password)
 *   SMTP_FROM            Friendly sender name + address
 *                        e.g. "Canaan Website Enquiry" <thirdspacecarehome@gmail.com>
 *   ENQUIRY_TO_EMAIL     Inbox that receives new enquiry notifications
 *
 * GMAIL APP PASSWORD SETUP
 *   1. Enable 2-Step Verification: https://myaccount.google.com/security
 *   2. Create an App Password:     https://myaccount.google.com/apppasswords
 *      (App = "Mail", Device = "Other" or "Custom name")
 *   3. Copy the 16-character password into SMTP_PASS.
 *
 * RUNNING LOCALLY
 *   cd server
 *   npm install
 *   npm run dev       ← ts-node hot-reload
 *   (or) npm run build && npm start
 * ============================================================
 */

import path from 'path';
import dotenv from 'dotenv';
// Load .env from the project root.
// __dirname is server/ in ts-node (dev) and server/dist/ in compiled build,
// so we navigate two levels up to reliably reach the project root in both cases.
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { insertEnquiry, InsertEnquiryInput } from './db';
import { sendEnquiryEmail } from './mailer';

const app = express();
const PORT = parseInt(process.env.PORT ?? '3001', 10);

// ALLOWED_ORIGIN is an additional configurable origin (e.g. a staging URL).
// The two production frontend domains and the local dev server are always allowed.
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN ?? '';

// ── Middleware ────────────────────────────────────────────────────────────────

// Production origins are hardcoded — they are not secrets.
// ALLOWED_ORIGIN (from .env) adds one extra slot for staging / overrides.
const allowedOrigins: string[] = [
  'https://canaanthirdspace.com',
  'https://canaan-third-space.web.app',
  'http://localhost:4321',
  'http://127.0.0.1:4321',
];
if (ALLOWED_ORIGIN) allowedOrigins.push(ALLOWED_ORIGIN);

app.use(cors({
  origin: allowedOrigins,
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json({ limit: '64kb' }));
app.use(express.urlencoded({ extended: true, limit: '64kb' }));

// ── Health check ─────────────────────────────────────────────────────────────

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

// ── POST /api/enquiries ───────────────────────────────────────────────────────

interface EnquiryBody {
  name?: string;
  email?: string;
  phone?: string;
  enquiryType?: string;
  preferredContact?: string;
  message?: string;
  consent?: string | boolean | number;
}

app.post('/api/enquiries', async (req: Request<{}, {}, EnquiryBody>, res: Response) => {
  const { name, email, phone, enquiryType, preferredContact, message, consent } = req.body;

  // ── Input validation ────────────────────────────────────────────────────
  const errors: string[] = [];
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push('name: required, minimum 2 characters');
  }
  if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.push('email: must be a valid email address');
  }
  if (!message || typeof message !== 'string' || message.trim().length < 5) {
    errors.push('message: required, minimum 5 characters');
  }
  const consentValue = String(consent ?? '').toLowerCase();
  if (!consent || consentValue === 'false' || consentValue === '0') {
    errors.push('consent: must be accepted');
  }

  if (errors.length > 0) {
    res.status(400).json({ ok: false, errors });
    return;
  }

  // ── Insert into database ────────────────────────────────────────────────
  let row;
  try {
    const input: InsertEnquiryInput = {
      name:             name!.trim(),
      email:            email!.trim().toLowerCase(),
      phone:            phone?.trim() || undefined,
      enquiryType:      enquiryType?.trim() || undefined,
      preferredContact: preferredContact?.trim() || undefined,
      message:          message!.trim(),
      consent:          true,
    };
    row = insertEnquiry(input);
    console.log(`[db] Enquiry #${row.id} saved — from ${row.email} at ${row.created_at}`);
  } catch (err) {
    console.error('[db] Failed to insert enquiry:', err);
    res.status(500).json({ ok: false, error: 'Could not save your enquiry. Please try again or call us directly.' });
    return;
  }

  // ── Send email notification (non-blocking) ──────────────────────────────
  // Email failures are caught inside sendEnquiryEmail() and logged.
  // They do NOT affect the API response — the enquiry is already saved.
  sendEnquiryEmail(row).catch((err) => {
    console.error('[mailer] Unexpected error in sendEnquiryEmail:', err);
  });

  // ── Respond to client ───────────────────────────────────────────────────
  res.status(201).json({ ok: true, id: row.id });
});

// ── Global error handler ──────────────────────────────────────────────────────

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[server] Unhandled error:', err);
  res.status(500).json({ ok: false, error: 'Internal server error' });
});

// ── Start ─────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n✅  Canaan enquiry server running on http://localhost:${PORT}`);
  console.log(`   POST http://localhost:${PORT}/api/enquiries`);
  console.log(`   GET  http://localhost:${PORT}/api/health\n`);
});

export default app;
