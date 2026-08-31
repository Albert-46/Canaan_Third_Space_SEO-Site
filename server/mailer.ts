/**
 * mailer.ts — Nodemailer SMTP transporter and enquiry email helper
 *
 * Required environment variables (set in ../.env):
 *   SMTP_HOST          — e.g. smtp.gmail.com
 *   SMTP_PORT          — e.g. 587 (STARTTLS) or 465 (SSL)
 *   SMTP_SECURE        — "true" for port 465, "false" for 587
 *   SMTP_USER          — your Gmail/SMTP username
 *   SMTP_PASS          — your Gmail App Password (not your login password)
 *   SMTP_FROM          — display name + address, e.g. "Canaan Website" <noreply@yourdomain.com>
 *   ENQUIRY_TO_EMAIL   — inbox that receives enquiry notifications
 *
 * Gmail App Password setup:
 *   1. Enable 2-Step Verification on your Google account.
 *   2. Go to https://myaccount.google.com/apppasswords
 *   3. Create an app password for "Mail" / "Other (custom name)".
 *   4. Use that 16-character password as SMTP_PASS.
 */

import nodemailer from 'nodemailer';
import type { EnquiryRow } from './db';

// ── Transporter ──────────────────────────────────────────────────────────────

function createTransport() {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT ?? '587', 10);
  const secure = process.env.SMTP_SECURE === 'true';   // true only for port 465
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    throw new Error(
      'SMTP configuration is incomplete. Ensure SMTP_HOST, SMTP_USER, and SMTP_PASS are set in .env'
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    tls: {
      // Allow self-signed certs in development; remove in production if needed
      rejectUnauthorized: process.env.NODE_ENV === 'production',
    },
  });
}

// ── Email templates ──────────────────────────────────────────────────────────

function buildPlainText(row: EnquiryRow): string {
  return [
    'New website enquiry received at Canaan Third Space Senior Care Home.',
    '',
    `Reference ID : #${row.id}`,
    `Received at  : ${row.created_at}`,
    '',
    '─────────────────────────────────────',
    'CONTACT DETAILS',
    '─────────────────────────────────────',
    `Name         : ${row.name}`,
    `Email        : ${row.email}`,
    `Phone        : ${row.phone ?? '—'}`,
    `Preferred    : ${row.preferred_contact ?? '—'}`,
    '',
    '─────────────────────────────────────',
    'ENQUIRY',
    '─────────────────────────────────────',
    `Type         : ${row.enquiry_type ?? '—'}`,
    '',
    row.message,
    '',
    '─────────────────────────────────────',
    'This enquiry was submitted through the website contact form and has been',
    'saved to the enquiries database.',
    'Do not reply to this notification email; reply directly to the enquirer.',
    '',
    `Reply-to: ${row.email}`,
  ].join('\n');
}

function buildHtml(row: EnquiryRow): string {
  const td = (label: string, value: string) =>
    `<tr><td style="padding:6px 12px 6px 0;font-weight:600;color:#2a453f;white-space:nowrap;vertical-align:top">${label}</td><td style="padding:6px 0;color:#141c19">${value}</td></tr>`;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>New Enquiry</title></head>
<body style="margin:0;padding:0;background:#faf9f6;font-family:Inter,Helvetica,Arial,sans-serif;color:#141c19">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f6;padding:32px 16px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:4px;border:1px solid #efefe9;overflow:hidden;max-width:600px">
        <!-- Header -->
        <tr>
          <td style="background:#2a453f;padding:24px 32px">
            <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#dfd1c2">Canaan Third Space Senior Care Home</p>
            <h1 style="margin:8px 0 0;font-size:22px;color:#ffffff;font-weight:500">New Website Enquiry</h1>
          </td>
        </tr>
        <!-- Meta -->
        <tr>
          <td style="padding:16px 32px;background:#efefe9;font-size:13px;color:#6b8478">
            Reference <strong style="color:#141c19">#${row.id}</strong> &nbsp;·&nbsp; Received ${row.created_at}
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px">
            <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:0.08em;color:#6b8478;margin:0 0 16px">Contact Details</h2>
            <table cellpadding="0" cellspacing="0">
              ${td('Name', row.name)}
              ${td('Email', `<a href="mailto:${row.email}" style="color:#2a453f">${row.email}</a>`)}
              ${td('Phone', row.phone ? `<a href="tel:${row.phone}" style="color:#2a453f">${row.phone}</a>` : '—')}
              ${td('Preferred contact', row.preferred_contact ?? '—')}
            </table>

            <hr style="margin:24px 0;border:none;border-top:1px solid #efefe9">

            <h2 style="font-size:14px;text-transform:uppercase;letter-spacing:0.08em;color:#6b8478;margin:0 0 16px">Enquiry</h2>
            <table cellpadding="0" cellspacing="0">
              ${td('Enquiry type', row.enquiry_type ?? '—')}
            </table>
            <div style="margin-top:16px;padding:16px;background:#faf9f6;border-radius:4px;border-left:3px solid #2a453f;font-size:15px;line-height:1.7;white-space:pre-wrap">${row.message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>

            <hr style="margin:24px 0;border:none;border-top:1px solid #efefe9">

            <p style="font-size:13px;color:#6b8478;margin:0">
              This enquiry has been saved to the database. Reply directly to the enquirer at
              <a href="mailto:${row.email}" style="color:#2a453f">${row.email}</a>.
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#efefe9;padding:16px 32px;font-size:12px;color:#6b8478;text-align:center">
            Canaan Third Space Senior Care Home · Manimala, Kottayam, Kerala 686541
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Send an email notification for a new website enquiry.
 *
 * Errors are caught and logged — they do NOT bubble up so the API can still
 * return { ok: true } even if email delivery fails. The enquiry is always
 * saved in the database regardless of email outcome.
 */
export async function sendEnquiryEmail(row: EnquiryRow): Promise<void> {
  const to = process.env.ENQUIRY_TO_EMAIL;
  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER;

  if (!to) {
    console.warn('[mailer] ENQUIRY_TO_EMAIL is not set — skipping email notification.');
    return;
  }

  let transporter: ReturnType<typeof nodemailer.createTransport>;
  try {
    transporter = createTransport();
  } catch (err) {
    console.error('[mailer] Failed to create SMTP transporter:', err);
    return;
  }

  try {
    const info = await transporter.sendMail({
      from,
      to,
      replyTo: row.email,
      subject: `New website enquiry from ${row.name}`,
      text: buildPlainText(row),
      html: buildHtml(row),
    });
    console.log(`[mailer] Email sent — messageId: ${info.messageId}`);
  } catch (err) {
    // Log the error but do NOT re-throw — DB insert already succeeded
    console.error('[mailer] SMTP delivery failed:', err);
  }
}
