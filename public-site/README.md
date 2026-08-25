# Public SEO Website

This is the public-facing SEO website for the Home Care Centre and Old-Age Home. 

> **Important:** This website is strictly separated from the private hospital database application. It does not connect to patient records, resident records, staff dashboards, private APIs, PostgreSQL, authentication, or internal management routes.

## Development & Local Server

To run the site locally, we recommend using the **Live Server** extension in VS Code:
1. Open this directory in VS Code.
2. Right-click on `index.html` and select **Open with Live Server**.
3. The site will open in your default browser at `http://127.0.0.1:5500`.

*Note: Since the site uses Vanilla HTML/CSS/JS, no build step (`npm run build`) or package manager is required.*

## Configuration (`script.js`)

All dynamic data is configured in `script.js` within the `SITE_CONFIG` object. This centralises information so that updating it once reflects across the entire website.

### How to Replace Organization Details
1. Open `script.js`.
2. Locate `SITE_CONFIG.organization`.
3. Update `name`, `shortName`, `city`, `district`, `state`, `country`, and `description` with official details.

### How to Update Contact Details
1. In `script.js`, locate `SITE_CONFIG.contact`.
2. Update `phone`, `email`, `address`, and `hours`.
3. To enable the WhatsApp button, add a phone number to `whatsapp` (e.g., `"+919876543210"`). Leave it as `""` to hide the button.
4. Add a Google Maps URL to `mapUrl`.

### How to Enable or Disable Services
1. In `script.js`, locate `SITE_CONFIG.services`.
2. Under `hospital` or `oldAgeHome`, you can add or modify services.
3. Set `enabled: true` to display the service on the website, or `enabled: false` to hide it.

### The Contact Form
The contact form currently operates in `mailto` mode without a backend server:
1. When a user submits the form, client-side validation ensures all required fields are filled and the email format is correct.
2. If valid, JavaScript intercepts the submission and constructs a `mailto:` URL.
3. This URL is opened, launching the user's default email client with a pre-filled subject and body containing their message.
4. A success message is displayed on the site.

To switch to a backend in the future, change `SITE_CONFIG.form.mode` to `"backend"` and implement the endpoint logic in the `initContactForm()` function.

## Images and Placeholders

The `images/` directory contains placeholder SVG images.
- **Brand:** `images/brand/logo.svg` and `images/brand/og-image.svg`
- **Home Care:** `images/hospital/`
- **Old-Age Home:** `images/old-age-home/`

**Note on Folder Names:** We intentionally retain the `images/hospital/` folder and `services.hospital` JS configuration keys as internal technical identifiers to maintain structural integrity with past versions. This is developer-facing only and does not impact public branding.

To replace an image:
1. Save your real image in the appropriate folder (e.g., `images/hospital/hero.jpg`).
2. Update `SITE_CONFIG.images` in `script.js` with the new file path.

## SEO Metadata & Legal

### Updating SEO Metadata
1. Open each HTML file.
2. Search for `<title>` and `<meta name="description" ...>`.
3. Update these tags as needed.
4. Replace `https://REPLACE-WITH-DOMAIN.com` in all `<link rel="canonical">`, Open Graph (`og:url`, `og:image`), and Twitter metadata.

### Structured Data
In `index.html`, there is a JSON-LD block `<script type="application/ld+json">`. Update the schema values once the official details are confirmed.

### `robots.txt` and `sitemap.xml`
- **`robots.txt`:** Found in the root directory. Update it if you wish to block specific crawlers.
- **`sitemap.xml`:** Lists all 8 public pages. If you add or remove pages, update the `<urlset>` accordingly. Remember to update the domain.

### Privacy Policy
The `privacy.html` file contains a template privacy policy. **This must be reviewed and approved by a qualified legal professional before public launch**, especially to ensure compliance with the IT Act 2000 and DPDP Act 2023 in India.
