# Canaan Third Space — Design System

A reference document for all AI-assisted and human development work on this project.

---

## Organisation

**Canaan Third Space Senior Care Home**
Medical services and supportive senior residential living.
Manimala, Kottayam, Kerala, India.

---

## Core Design Principles

**Tone:** Premium · Minimal · Calm · Editorial · Dignified · Trustworthy  
**Direction:** Restrained warmth, not clinical coldness. Quiet confidence, not sales-pitch energy.

> "One image should have the visual impact of an entire section."

> "Desktop should use horizontal space for composition, not simply create larger empty margins around tablet-sized content."

---

## Colour Palette

Do not introduce new colours. Do not use gradients.

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#FDFBF9` | Page background |
| `--color-surface` | `#FFFFFF` | Cards, nav, header |
| `--color-surface-2` | `#F9F7F4` | Hero background, subtle fills |
| `--color-surface-3` | `#F5F1ED` | Dividers, dim fills |
| `--color-text` | `#2C3330` | Primary body text |
| `--color-text-muted` | `#4A5550` | Supporting text |
| `--color-text-faint` | `#6B7570` | Labels, captions |
| `--color-primary` | `#6B8E7A` | Sage green — CTAs, links, accents |
| `--color-primary-hover` | `#5A7A68` | Hover state |
| `--color-primary-light` | `#E8F0EB` | Subtle green fill |
| `--color-secondary` | `#C97B5A` | Warm terracotta — bullet points, highlights |
| `--brass` | `#b89551` | Legacy accent — footer links, rule hover |

**Forbidden:** Purple, blue gradients, electric teal, generic brand colours, linear-gradient backgrounds.

---

## Typography

| Token | Font | Notes |
|---|---|---|
| `--font-display` | Lora, serif | Headlines, nav links, editorial text |
| `--font-body` | Inter, sans-serif | Body copy, labels, UI elements |

### Heading scale (fluid `clamp()`)

```css
h1 { font-size: clamp(2rem, 4vw + 1rem, 4.5rem); }
h2 { font-size: clamp(1.5rem, 2.5vw + 0.75rem, 3.5rem); }
h3 { font-size: clamp(1.25rem, 1.5vw + 0.75rem, 2.5rem); }
```

All headings: `font-weight: 400` (display weight), `line-height: 1.15`.

**Rules:**
- One `<h1>` per page.
- Headings use Lora. Never apply Inter to headlines.
- Avoid excessive multi-line labels — keep navigation items single-line where possible.

---

## Layout

### Containers

| Class | Max-width | Use |
|---|---|---|
| `.container` | `1280px` | Standard sections |
| `.container-wide` | `1440px` | Footer, full-bleed editorial |
| `.text-block-narrow` | `65ch` | Long-form prose, privacy, about body copy |

### Breakpoints

| Label | Width | Notes |
|---|---|---|
| Small mobile | 320px–360px | Must work, test first |
| Mobile | 360px–430px | **Primary target audience** |
| Large phone | 430px–480px | |
| Tablet | 768px | Moderate stacking |
| Desktop | 1024px+ | Horizontal compositions unlock |
| Wide desktop | 1280px+ | Increased padding and section height |

**Mobile-first rule:** Default CSS styles the mobile experience. Desktop is a progressive enhancement via `@media (min-width: ...)`.

### Section spacing

```css
.section         { padding-block: var(--space-12); }      /* default */
@media ≥1280px   { padding-block: var(--space-16); }      /* desktop */
@media ≤768px    { padding-block: var(--space-8); }       /* mobile */

.section-compact { padding-block: var(--space-8); }       /* tighter */
@media ≤768px    { padding-block: var(--space-6); }
```

---

## Approved Layout Patterns

### ✅ Do use

- **Asymmetric 2-column compositions** on desktop: text + image, heading + list
- **Sticky-heading lists** for feature/benefit sections on desktop
- **Horizontal contact strips** — info left, CTAs right
- **Full-bleed section backgrounds** using `--color-surface-2` or `--color-surface-3`
- **Editorial divider rules** — subtle `1px solid var(--color-surface-3)` between list items
- **`position: sticky` headings** for desktop reading rhythm
- **Progressive enhancement** — mobile stacks, desktop uses `flex-direction: row` or `grid`

### ❌ Do not use

- Gradients on backgrounds or buttons
- Cards with identical height, icon, title, and body text (generic feature card grid)
- Centred hero with badge text above the `<h1>` (SaaS template pattern)
- Purple, blue, or electric accent colours
- Masonry or Pinterest-style image grids
- Stock imagery of doctors, medical equipment, or clinical settings
- Fake statistics or testimonials
- `!important` overrides without documented reason

---

## Component Patterns

### Buttons

```html
<a href="…" class="btn btn-primary">Primary CTA</a>
<a href="…" class="btn btn-secondary">Secondary CTA</a>
```

Buttons use `border-radius: var(--radius-md)`, `font-weight: 600`, `font-family: var(--font-body)`.  
Minimum touch target: **44×44px** on mobile.

### Inline links (editorial)

```html
<a href="…" class="thin-rule" style="color: var(--color-primary); border-color: var(--color-primary);">
  View Services →
</a>
```

`.thin-rule` is an underline-style link used inside editorial sections and contact strips.

### Eyebrow labels

```html
<span class="eyebrow">Manimala, Kottayam, Kerala</span>
```

Small, uppercase, letter-spaced label above headings. Uses `--font-body`, `--text-xs`, `letter-spacing: 0.12em`.

### Image Placeholders

```astro
<ImagePlaceholder aspectRatio="16:9" label={"CANAAN THIRD SPACE\nFACILITY EXTERIOR"} />
```

Used when real photography is unavailable. Must:
- Match the intended final aspect ratio
- Use `--color-surface-2` as background
- Show only a minimal label in `--color-text-faint`
- Never show broken image icons or "image goes here" text
- Cap at `max-height: 60vw` on mobile to prevent excessive height

Approved aspect ratios: `16:9`, `3:2`, `4:3`, `1:1`, `21:9`

---

## Navigation

### Approved pages (5 only)

| Route | Title |
|---|---|
| `/` | Home |
| `/about` | About |
| `/services` | Services |
| `/contact` | Contact |
| `/privacy` | Privacy |

**Do not add, restore, or link to:** `/senior-living`, `/facilities`, `/team`, `/patient-info`, or any other page.

### Header menu (open state)

- About
- Services
- Contact Us

Privacy is footer-only (legal row). It is not a primary navigation item.

### Mobile nav requirements

- Full-screen overlay with explicit `×` close button (44×44px)
- Logo inside nav panel links to home
- Nav links: minimum 52px tap targets
- Contact details + Enquire Now anchored to bottom of overlay
- No excessive vertical scrolling required to reach Enquire Now

---

## Tone & Copy Rules

- **Do not invent** unverified medical claims, services, or capabilities
- **Do not imply** services that haven't been confirmed (e.g. specific surgical specialties, ICU, emergency services not confirmed as available)
- **Do not use** superlatives or unverifiable claims ("best", "most trusted", "award-winning")
- **Do not add** fake staff, testimonials, or patient stories
- **Keep copy** short, calm, and specific — describe what exists, not what sounds good
- **Environmental imagery** only — no doctors, stethoscopes, hospital equipment, or clinical settings

---

## Site Architecture Rules

This is a **deliberately minimal 5-page website**. It is not an SEO-heavy information portal.

- **Do not add pages** to make the site feel more "complete"
- **Do not add sections** that exist only for SEO
- **Do not add content** that dilutes the calm, focused experience
- The website should feel calm — **not empty**. Minimal — **not incomplete**

---

## AI-Specific Rules

When generating code for this project:

1. **Always follow this document.** If a pattern conflicts with a generic best practice, this document takes precedence.
2. **Avoid these patterns:**
   - Gradients on any surface
   - Purple or blue accent colours
   - Generic SaaS layout patterns (badge → H1 → subtext → 2 buttons → hero image centered)
   - Identical icon + title + body feature cards
   - Overusing `.text-block-narrow` on desktop sections that should be wide
3. **Prefer:**
   - Solid colour backgrounds
   - Asymmetric desktop compositions
   - Strong, specific typography
   - Progressive mobile-first CSS
   - Scoped `<style>` blocks in Astro components for layout variations
4. **If unsure:** Ask a clarifying question rather than guessing. Especially for:
   - Copy that implies medical services
   - Adding new pages or navigation items
   - Introducing visual patterns not established in this document
5. **Explain major changes** in 1–2 sentences before showing code.
6. **Check for regressions** after any navigation change — verify deleted pages are not re-linked anywhere in `src/`.

---

## File Reference

| File | Purpose |
|---|---|
| `src/config.ts` | All contact info, feature flags, form config. **Do not modify.** |
| `src/styles/global.css` | Global tokens, reset, utilities |
| `src/layouts/BaseLayout.astro` | HTML shell, SEO meta, sticky mobile CTA, JS |
| `src/components/Header.astro` | Compact header + mobile-first nav overlay |
| `src/components/Footer.astro` | 3-column desktop footer |
| `src/components/ContactForm.astro` | Enquiry form — hooks into `SITE_CONFIG.form` |
| `src/components/ImagePlaceholder.astro` | Editorial image placeholder |
| `src/pages/index.astro` | Homepage — 5 compositional sections |
| `src/pages/about.astro` | About page |
| `src/pages/services.astro` | Services page |
| `src/pages/contact.astro` | Contact page with form |
| `src/pages/privacy.astro` | Privacy policy |
| `astro.config.mjs` | Astro config — includes `/old-age-home.html → /about` redirect |

---

*Last updated: September 2026*
