# Premium Healthcare & Senior Care Website Template

A premium, commercially sellable static website template built with [Astro](https://astro.build). Designed specifically for clinics, hospitals, assisted-living homes, senior-care facilities, and rehabilitation centres. 

This template outputs fast, accessible, static HTML with minimal client-side JavaScript, ensuring excellent SEO and performance out of the box.

## 🚀 Quick Start

### Requirements
- [Node.js](https://nodejs.org/en/) (v18 or higher)
- npm or yarn

### Installation

1. Clone or download this repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the local development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:4321`.

---

## 🛠 Customisation & Branding

This template is designed to be easily rebranded without touching the HTML/Astro markup.

### 1. Global Configuration (`src/config.ts`)
The `src/config.ts` file acts as the central brain of your website. Update this file to change:
- **Organisation Details:** Name, short name, location, etc.
- **Contact Info:** Phone, email, WhatsApp, and physical address.
- **SEO Metadata:** Production URL, default descriptions, and social images.
- **Feature Toggles:** Enable or disable the Emergency Notice, WhatsApp button, Testimonials, or the Care Team section.
- **Form Provider:** Set up your enquiry form endpoint.

### 2. Content Data (`src/content/`)
The content for specific sections is separated into easy-to-edit TypeScript arrays in the `src/content/` directory:
- `services.ts`: Medical and senior care services.
- `team.ts`: Care team members, their qualifications, and bios.
- `testimonials.ts`: Reviews and testimonials.
- `faqs.ts`: Frequently asked questions for the accordion component.

> **Important Demo Notice:** The initial content provided in this template is fictional. Ensure you replace all demo text, testimonials, team members, and credentials with real information before launching your site. Do not make invented medical, legal, or accreditation claims.

### 3. Images and Branding (`public/images/`)
Replace the demo images in the `public/images/` directory with your own photography. 
- **Logo:** `public/images/brand/Logo.png` (Update your favicon and OG image here as well).
- **Format Recommendation:** For the best performance, it is recommended to use modern image formats like **WebP** or **AVIF** and ensure images are compressed.

---

## ✉️ Form Integration

The template includes an accessible enquiry form on the `/contact` page. 

By default, the form is set to `demo` mode in `src/config.ts`, which simulates a successful submission without actually sending an email.

To receive emails from the form:
1. Open `src/config.ts`.
2. Change the `form.provider` to `'custom'` (or any specific string for your records).
3. Set `form.endpoint` to your form handler URL.
   
**Recommended Free Form Providers:**
- [Formspree](https://formspree.io/)
- [Netlify Forms](https://docs.netlify.com/forms/setup/)
- [Web3Forms](https://web3forms.com/)

---

## 📈 SEO & Production Setup

This template includes everything needed for excellent SEO:
- **Canonical URLs & Meta Tags:** Automatically generated in `src/layouts/BaseLayout.astro`.
- **Schema.org JSON-LD:** LocalBusiness / MedicalOrganization schema is injected based on `src/config.ts`.
- **Sitemap & Robots.txt:** A sitemap is automatically generated on build using `@astrojs/sitemap`.

### Domain Setup
Before building for production, ensure you update the `site` property in `astro.config.mjs` and the `seo.siteUrl` in `src/config.ts` to your actual production domain.

---

## 🚀 Deployment

The site is built to generate static files in the `dist/` directory.

### Build Command
```bash
npm run build
```

### Preview Production Build Locally
```bash
npm run preview
```

### Deploying to Firebase Hosting (Included)
This repository includes a `firebase.json` pre-configured to serve the `dist/` folder.
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Deploy: `firebase deploy`

### Deploying to Vercel / Netlify
1. Connect your GitHub repository to Vercel or Netlify.
2. The platform will automatically detect Astro.
3. Build Command: `npm run build`
4. Publish Directory: `dist`

---

## ✅ Pre-Launch Checklist

- [ ] Updated `src/config.ts` with real organisation details.
- [ ] Replaced fictional content in `src/content/`.
- [ ] Updated logo and images in `public/images/`.
- [ ] Configured the contact form endpoint.
- [ ] Updated `site` in `astro.config.mjs` for the sitemap.
- [ ] Tested all links, mobile navigation, and forms.
- [ ] Run `npm run build` and verified the output.
- [ ] Set up the enquiry server (`server/`) with Gmail App Password in `.env`.
- [ ] Verified a test enquiry is saved to the PostgreSQL database and emailed to the inbox.

---

## 📬 Backend API Server (Enquiry Form)

The `server/` directory contains a standalone Node.js/Express API that:
1. **Saves** every form submission to a PostgreSQL database.
2. **Emails** an SMTP notification to the configured inbox for every new enquiry.
3. **Never loses data** — email failures are logged but do not block the API response.

### Quick Start

```bash
# 1. Install server dependencies
cd server
npm install

# 2. Configure SMTP credentials
cp ../.env.example ../.env
# Edit .env and fill in SMTP_PASS (see below)

# 3. Start the server (hot-reload)
npm run dev
```

The server listens on `http://localhost:3001` by default.

### Gmail App Password Setup

Using Gmail SMTP requires an **App Password** (not your regular login password):

1. Enable 2-Step Verification: [myaccount.google.com/security](https://myaccount.google.com/security)
2. Create an App Password: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)  
   (App = **Mail**, Device = **Other / Custom name**)
3. Copy the 16-character password into `.env` as `SMTP_PASS`.

### Required Environment Variables (`.env`)

| Variable | Example | Description |
|---|---|---|
| `PORT` | `3001` | Server port |
| `ALLOWED_ORIGIN` | `http://localhost:4321` | Astro dev URL for CORS |
| `SMTP_HOST` | `smtp.gmail.com` | SMTP server hostname |
| `SMTP_PORT` | `587` | 587 = STARTTLS, 465 = SSL |
| `SMTP_SECURE` | `false` | `true` only for port 465 |
| `SMTP_USER` | `thirdspacecarehome@gmail.com` | Gmail address |
| `SMTP_PASS` | `abcd efgh ijkl mnop` | 16-char App Password |
| `SMTP_FROM` | `"Canaan Website" <...>` | Sender display name |
| `ENQUIRY_TO_EMAIL` | `thirdspacecarehome@gmail.com` | Notification destination |

### API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `POST` | `/api/enquiries` | Submit a new enquiry |

### Database

The backend requires a running PostgreSQL database. Provide the connection string via the `DATABASE_URL` environment variable.

### Production Deployment

To run the server in production alongside the static Astro site:
1. Build: `cd server && npm run build`
2. Start: `node server/dist/index.js`
3. Use a process manager like **PM2**: `pm2 start server/dist/index.js --name canaan-api`
4. Update `src/config.ts → form.endpoint` to your production server URL before deploying the Astro build.
