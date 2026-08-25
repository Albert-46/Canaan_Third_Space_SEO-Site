# Canaan Third Space Senior Care Home — Public Website

This is a custom-coded, vanilla HTML5, CSS3, and JavaScript public marketing website for **Canaan Third Space Senior Care Home**. The design is calm, editorial, and optimised for SEO and performance without relying on heavy frameworks. This site is completely separate from any private care-management application.

---

## ⚠️ Outstanding Configuration Required Before Launch

The following items **must be confirmed by the organisation** and entered into `script.js` before the website is published. Until then, the relevant UI elements are safely hidden.

| Field | Location in script.js | Status |
|---|---|---|
| Phone number (display) | `contact.phoneDisplay` | ❌ Required |
| Phone number (E.164 for tel: link) | `contact.phoneHref` | ❌ Required |
| Email address | `contact.email` | ❌ Required |
| Full address | `contact.address` | ❌ Required |
| Opening hours | `contact.openingHours` | ❌ Required |
| WhatsApp number | `contact.whatsappHref` | Optional — leave `""` to hide button |
| Google Maps URL | `contact.mapUrl` | Optional — leave `""` to disable link |
| Production domain | All `REPLACE-WITH-DOMAIN.com` occurrences | ❌ Required |
| Approved public descriptor | `organization.publicDescriptor` | ❌ Requires owner sign-off |
| Organisation description | `organization.description` | ❌ Required |
| City / district | `organization.city` / `organization.district` | ❌ Required |
| Form destination email | `contactForm.destinationEmail` | ❌ Required |

**To update the domain**, search the project for `REPLACE-WITH-DOMAIN.com` and replace every occurrence with the real domain. It appears in: `robots.txt`, `sitemap.xml`, and every HTML `<head>` (canonical and OG URLs, LD+JSON, og:image).

---

## Project Structure

| File | Purpose |
|---|---|
| `index.html` | Homepage |
| `about.html` | About Us |
| `services.html` | Medical Services (OPD, lab, IPD) |
| `old-age-home.html` | Senior Care Home information |
| `facilities.html` | Facility gallery |
| `patient-info.html` | Information for patients and families |
| `contact.html` | Contact form and location |
| `privacy.html` | Privacy Policy |
| `styles.css` | Design system (CSS custom properties, fluid typography) |
| `script.js` | Configuration, data injection, animations, form handling |
| `robots.txt` | Search engine crawl directives |
| `sitemap.xml` | Page index for search engines |
| `images/brand/` | Logo and brand assets |
| `images/hospital/` | Medical centre facility images (SVG placeholders) |
| `images/old-age-home/` | Senior care home facility images (SVG placeholders) |

> **Note on naming:** The internal JS key `services.hospital` and the image folder `images/hospital/` are private code identifiers. They are not public labels. These map to the medical centre / care facility content.

---

## Configuration

All configurable values live in the `SITE_CONFIG` object at the top of `script.js`. The data-injection engine reads `[data-config="key.path"]` attributes in every HTML page and injects values automatically. **Placeholder strings (empty values `""`) are silently skipped** — no raw placeholder text is ever rendered to users.

```javascript
const SITE_CONFIG = {
  organization: {
    officialName:     "Canaan Third Space Senior Care Home",
    publicDescriptor: "",   // ← REPLACE WITH APPROVED DESCRIPTOR
    city:             "",   // ← REPLACE WITH CITY
    ...
  },
  contact: {
    phoneDisplay:   "",   // ← REPLACE WITH PHONE (display format)
    phoneHref:      "",   // ← REPLACE WITH PHONE (E.164, e.g. +919876543210)
    email:          "",   // ← REPLACE WITH EMAIL
    ...
  },
  ...
};
```

---

## Running Locally

**VS Code Live Server:**
1. Install the "Live Server" extension.
2. Right-click `index.html` → **Open with Live Server**.

**Python:**
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000`.

---

## Updating Images

Placeholder `.svg` files are used until real photography is available. To replace them:

1. Add real photos to `images/hospital/` and `images/old-age-home/` in `.webp` or `.avif` format.
2. Update the `images` section of `SITE_CONFIG` in `script.js` to point to the new file paths.
3. The logo is already at `images/brand/Logo.png`. No change needed unless a new logo file is provided.

---

## Navigation Structure

| Label | Page |
|---|---|
| About | `about.html` |
| Medical Services | `services.html` |
| Senior Care Home | `old-age-home.html` |
| Facilities | `facilities.html` |
| Patient Information | `patient-info.html` |
| Contact | `contact.html` |

---

## Contact Form

The form is configured to use `mailto` (opens the user's email application). It includes:
- Full name, phone, email, enquiry type, preferred contact, and message fields
- A consent checkbox linked to the Privacy Policy
- A disclaimer that clearly states the email app will open

---

## Privacy &amp; Security

This public website strictly avoids linking to any internal care management portals. No patient data or credentials should ever be stored or displayed on this site.

The `privacy.html` policy has not been reviewed by a legal professional. Professional legal review is recommended before publishing.
