/**
 * ============================================================
 * Canaan Third Space Senior Care Home — Enquiry API Server
 * ============================================================
 *
 * PURPOSE
 *   Receives contact form submissions from the Astro frontend,
 *   saves each enquiry to PostgreSQL, then sends an SMTP email
 *   notification to the configured inbox.
 *
 * ARCHITECTURE
 *   - Express HTTP server listening on PORT (default 3001)
 *   - PostgreSQL via pg connection pool (DATABASE_URL)
 *   - Nodemailer SMTP transport for email notifications
 *   - Email failures are logged but never block the API response
 *
 * REQUIRED ENVIRONMENT VARIABLES
 *   Copy .env.example → .env and fill in the values below.
 *
 *   PORT                 Port this server listens on (default: 3001)
 *   DATABASE_URL         PostgreSQL connection string
 *                        e.g. postgresql://user:pass@localhost:5432/canaan_enquiries
 *   ALLOWED_ORIGIN       Extra/staging origin for CORS (optional)
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
 *   (or) npm start    ← builds then runs compiled output
 * ============================================================
 */

import path from 'path';
import dotenv from 'dotenv';

// ── Load .env ─────────────────────────────────────────────────────────────────
// Supports an explicit DOTENV_PATH override for maximum deployment flexibility.
// Without the override we navigate two levels up from __dirname so the path is
// correct whether running via ts-node (server/) or compiled build (server/dist/).
const dotenvPath = process.env.DOTENV_PATH
  ?? path.resolve(__dirname, '..', '..', '.env');
dotenv.config({ path: dotenvPath });

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { insertEnquiry, InsertEnquiryInput, runMigrations, checkDbHealth } from './db';
import { sendEnquiryEmail } from './mailer';

const app = express();
const PORT = parseInt(process.env.PORT ?? '3001', 10);

// ── CORS ──────────────────────────────────────────────────────────────────────
// Production origins are hardcoded — they are not secrets.
// ALLOWED_ORIGIN (from .env) adds one extra slot for staging / overrides.
const extraOrigin = process.env.ALLOWED_ORIGIN ?? '';
const isProd = process.env.NODE_ENV === 'production';
const allowedOrigins: string[] = [
  'https://canaanthirdspace.com',
  'https://www.canaanthirdspace.com',
  'https://canaan-third-space.web.app',
];
if (!isProd) {
  allowedOrigins.push('http://localhost:4321', 'http://127.0.0.1:4321');
}
if (extraOrigin) allowedOrigins.push(extraOrigin);

// ── Middleware ────────────────────────────────────────────────────────────────

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept'],
}));

app.use(express.json({ limit: '64kb' }));
app.use(express.urlencoded({ extended: true, limit: '64kb' }));

// ── Health checks ─────────────────────────────────────────────────────────────
// Both /health (plain) and /api/health are supported so deployment platforms
// can use the simpler path, while the API-prefixed route remains for clients.

app.get('/health', async (_req: Request, res: Response): Promise<void> => {
  const dbOk = await checkDbHealth();
  const status = dbOk ? 200 : 503;
  res.status(status).json({
    ok: dbOk,
    service: 'canaan-third-space-api',
    db: dbOk ? 'ok' : 'unavailable',
  });
});

app.get('/api/health', async (_req: Request, res: Response): Promise<void> => {
  const dbOk = await checkDbHealth();
  const status = dbOk ? 200 : 503;
  res.status(status).json({
    ok: dbOk,
    service: 'canaan-third-space-api',
    db: dbOk ? 'ok' : 'unavailable',
  });
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

const enquiryRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'Too many requests' },
});

app.post('/api/enquiries', enquiryRateLimiter, async (req: Request<{}, {}, EnquiryBody>, res: Response) => {
  const { name, email, phone, enquiryType, preferredContact, message, consent } = req.body;

  // ── Input validation ────────────────────────────────────────────────────
  const errors: string[] = [];
  if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
    errors.push('name: required, between 2 and 100 characters');
  }
  if (!email || typeof email !== 'string' || email.trim().length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.push('email: must be a valid email address under 255 characters');
  }
  if (phone && (typeof phone !== 'string' || phone.trim().length > 50)) {
    errors.push('phone: must be under 50 characters');
  }
  if (enquiryType && (typeof enquiryType !== 'string' || enquiryType.trim().length > 50)) {
    errors.push('enquiryType: must be under 50 characters');
  }
  if (preferredContact && (typeof preferredContact !== 'string' || preferredContact.trim().length > 50)) {
    errors.push('preferredContact: must be under 50 characters');
  }
  if (!message || typeof message !== 'string' || message.trim().length < 5 || message.trim().length > 5000) {
    errors.push('message: required, between 5 and 5000 characters');
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
    row = await insertEnquiry(input);
    console.log(`[db] Enquiry #${row.id} saved — from ${row.email} at ${row.created_at}`);
  } catch (err) {
    // Log the technical detail server-side; never send it to the client
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

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[server] Unhandled error:', err);
  const status = err.status || err.statusCode || 500;
  const message = status === 400 ? 'Invalid request' : 'Internal server error';
  res.status(status).json({ ok: false, error: message });
});

// ── Start ─────────────────────────────────────────────────────────────────────

async function start(): Promise<void> {
  // Run migrations before accepting traffic
  try {
    await runMigrations();
    console.log('[db] Migrations complete.');
  } catch (err) {
    console.error('[db] Migration failed — server will not start:', err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    const env = process.env.NODE_ENV ?? 'development';
    console.log(`\n✅  Canaan enquiry server running [${env}] on port ${PORT}`);
    console.log(`   GET  http://localhost:${PORT}/health`);
    console.log(`   GET  http://localhost:${PORT}/api/health`);
    console.log(`   POST http://localhost:${PORT}/api/enquiries`);

    // SMTP availability check — confirm config is present without printing secrets
    const smtpReady =
      !!process.env.SMTP_HOST &&
      !!process.env.SMTP_USER &&
      !!process.env.SMTP_PASS &&
      process.env.SMTP_PASS !== 'REPLACE_WITH_YOUR_APP_PASSWORD';
    console.log(`\n   SMTP ready : ${smtpReady ? '✅ yes' : '⚠️  no — set SMTP_HOST/SMTP_USER/SMTP_PASS in .env'}`);
    console.log(`   SMTP host  : ${process.env.SMTP_HOST ?? '(not set)'}`);
    console.log(`   SMTP user  : ${process.env.SMTP_USER ?? '(not set)'}`);
    console.log(`   Notify to  : ${process.env.ENQUIRY_TO_EMAIL ?? '(not set)'}\n`);
  });
}

start();

export default app;
