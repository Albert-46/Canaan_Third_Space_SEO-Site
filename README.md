# Premium Home Care & Old-Age Home Website

This is a custom-coded, vanilla HTML5, CSS3, and JavaScript website designed for a combined Home Care centre and old-age home. The design is intended to be calm, editorial, and highly optimized for SEO and performance without relying on heavy frameworks. It keeps public marketing content completely separate from the private care-management application.

## Project Structure

- `index.html` - Homepage
- `about.html` - About Us
- `services.html` - Home Care Services
- `old-age-home.html` - Senior Living Info
- `facilities.html` - Image Gallery
- `patient-info.html` - Information for Patients & Families
- `contact.html` - Contact Form and Location Details
- `privacy.html` - Privacy Policy
- `styles.css` - Custom design system utilizing CSS Custom Properties and `clamp()` for fluid typography
- `script.js` - Configuration, interactive logic, and simple animations
- `robots.txt` & `sitemap.xml` - SEO configuration files
- `images/` - Directory for images, organized by category (`hospital/` for Home Care facility images, `old-age-home/`, `brand/`)

## Running Locally

To view the site correctly and test features like form submission logic, run it on a local web server.

**Using VS Code:**
1. Install the "Live Server" extension.
2. Right-click on `index.html` and select "Open with Live Server".

**Using Python (if installed):**
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.

## Configuration & Content Updates

To update core organization details, edit the `SITE_CONFIG` object in `script.js`:

```javascript
const SITE_CONFIG = {
  form: {
    mode: "mailto"
  },
  organization: {
    name: "REPLACE WITH ORGANIZATION NAME",
    shortName: "REPLACE WITH SHORT NAME",
    // ...
  },
  contact: {
    phone: "REPLACE WITH PHONE",
    email: "REPLACE WITH EMAIL",
    // ...
  },
  services: {
    hospital: [ /* Home Care services — key name retained as internal identifier */ ],
    oldAgeHome: [ /* ... */ ]
  },
  images: {
    // ...
  }
};
```
These values automatically populate across all pages wherever a `data-config` attribute is present (e.g., `<span data-config="organization.name"></span>`).

> **Note on naming:** The internal JS key `services.hospital` and the image folder `images/hospital/` intentionally retain the legacy identifier name. These are private code identifiers that users never see — they are not brand labels. Renaming them would require updating every `data-config` attribute and every `src` path across all HTML files simultaneously with no public benefit. The folder holds Home Care facility imagery; the key maps to Home Care services data.

## Updating Images

Currently, placeholder `.svg` files are used. To add real photography:

1. Replace the `.svg` files in the `images/hospital/` and `images/old-age-home/` folders with appropriately optimized `.webp` or `.avif` images, keeping the same base filenames (e.g., `hero.svg` → `hero.webp`).
2. Update the `images` section in `SITE_CONFIG` inside `script.js` to point to your new file paths.
3. Replace `images/brand/logo.svg` with your actual logo.
4. Update `images/brand/og-image.svg` (or `.webp`) for social sharing.

## SEO Updates

- **Meta Tags:** Each page has a unique `<title>` and `<meta name="description">`. Update these manually in the `<head>` of each file when final copy is ready.
- **Structured Data:** Open `index.html` and update the JSON-LD `<script>` tag in the `<head>` with accurate coordinates, verified social profiles, and precise address data.
- **Sitemap/Robots:** Update `sitemap.xml` with the final production domain replacing `https://REPLACE-WITH-DOMAIN.com`.

## Contact Form

The contact form is configured to use a `mailto` action in the first version. When a user submits the form, it will open their local email application pre-filled with their enquiry details. This can be updated to a backend API later without changing the HTML markup, by modifying the form logic in `script.js`.

## Privacy & Security

This public website strictly avoids linking to any internal care management portals. No patient data or credentials should ever be stored or displayed on this site.
