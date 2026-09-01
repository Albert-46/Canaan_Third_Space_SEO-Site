# Canaan Third Space — Photography Brief

A reference for commissioning, sourcing, or approving photography for the public website.

> **Tone:** Calm · Dignified · Editorial · Warm · Environmental  
> **Direction:** Every image should feel like a quiet, considered moment — not a stock photo shoot.

---

## Governing Principles

- Photograph the **environment and atmosphere**, not procedures or clinical acts.
- No doctors with stethoscopes, no hospital equipment, no medical procedures.
- No posed stock-style group photos of generic "elderly people laughing."
- Light should feel warm and natural — preferably soft daylight or late afternoon.
- Images must work in their **compositional role** on the page, not just as standalone photos.
- Every image has a defined aspect ratio. Shoot or crop to that ratio.

---

## Image 1 — Hero (Homepage)

| Field | Detail |
|---|---|
| **Filename** | `public/images/hospital/hero.jpg` |
| **Page** | Homepage (`/`) |
| **Section** | Hero — right column |
| **Aspect Ratio** | `3:4` (portrait) |
| **Minimum size** | 900 × 1200 px |
| **Recommended size** | 1200 × 1600 px |

### Compositional Direction
A tall portrait-orientation shot of the facility exterior or entrance. The image sits beside the headline on desktop and needs to feel grounded and calm.

**Works well:**
- Building facade or entrance, shot at golden hour or soft daylight
- A garden or courtyard with dappled light
- A covered walkway or entrance corridor

**Avoid:**
- People in the shot (unless naturally at a comfortable distance, not posed)
- Busy or cluttered backgrounds
- Harsh midday lighting with hard shadows
- Signage prominently in frame

---

## Image 2 — Residential Environment (Homepage)

| Field | Detail |
|---|---|
| **Filename** | `public/images/third-space/exterior/home-exterior.jpg` |
| **Page** | Homepage (`/`) |
| **Section** | "Integrated Care, Under One Roof" — right column |
| **Aspect Ratio** | `3:2` (landscape) |
| **Minimum size** | 1200 × 800 px |
| **Recommended size** | 1800 × 1200 px |

### Compositional Direction
A warm environmental shot showing the residential character of the facility. Should feel like a home, not a hospital.

**Works well:**
- A comfortable common area or sitting room with natural light
- An exterior shot showing the residential grounds or garden
- A veranda or outdoor seating area

**Avoid:**
- Medical equipment visible in frame
- Clinical or institutional aesthetics
- Harsh fluorescent lighting

---

## Image 3 — Common Area / Closing Visual (Homepage)

| Field | Detail |
|---|---|
| **Filename** | `public/images/third-space/gallery/common-area.jpg` |
| **Page** | Homepage (`/`) |
| **Section** | Closing visual — before the contact strip |
| **Aspect Ratio** | `21:9` (ultra-wide cinematic) |
| **Minimum size** | 2100 × 900 px |
| **Recommended size** | 3000 × 1286 px |

### Compositional Direction
A wide, cinematic shot that creates a sense of peaceful space. Needs to read well at full container width.

**Works well:**
- Wide interior of a common area, dining room, or lounge
- Exterior panoramic of the grounds or garden
- Long corridor or covered walkway with depth

**Avoid:**
- Tight crops — this needs to breathe at ultra-wide
- Dark or moody lighting
- People who appear posed or staged

---

## Image 4 — Our Environment (About Page)

| Field | Detail |
|---|---|
| **Filename** | `public/images/third-space/exterior/home-exterior.jpg` |
| **Page** | About (`/about`) |
| **Section** | "Our Story" — after the introductory paragraphs |
| **Aspect Ratio** | `21:9` (ultra-wide cinematic) |
| **Minimum size** | 2100 × 900 px |
| **Recommended size** | 3000 × 1286 px |

> **Note:** Can share the same file as Image 2 if the photo works at both aspect ratios, or use a wider crop.

### Compositional Direction
An establishing shot — the kind of image that says *this is a real place with a real atmosphere*.

**Works well:**
- Wide exterior showing the full building or grounds
- Gardens, pathways, or outdoor areas with natural framing
- Dawn or dusk exterior with warm tones

**Avoid:**
- Text or signage prominently visible
- Cars, roads, or industrial surroundings in frame

---

## Image 5 — Facility Environment (Services Page)

| Field | Detail |
|---|---|
| **Filename** | `public/images/hospital/facility-environment.jpg` |
| **Page** | Services (`/services`) |
| **Section** | "How It Works Together" — below body text |
| **Aspect Ratio** | `21:9` (ultra-wide cinematic) |
| **Minimum size** | 2100 × 900 px |
| **Recommended size** | 3000 × 1286 px |

### Compositional Direction
A wide environmental shot representing the integration of care and living. Not clinical, not purely residential.

**Works well:**
- A well-lit corridor connecting parts of the facility
- An outdoor garden or courtyard from a wider perspective
- A common area that feels both comfortable and professionally managed

**Avoid:**
- Anything implying a hospital or clinical setting
- Visible medical equipment, examination tables, IV drips
- Unverified medical claims visually implied through the image

---

## Summary Table

| # | Filename | Page | Aspect Ratio | Recommended Size |
|---|---|---|---|---|
| 1 | `hospital/hero.jpg` | Homepage hero | 3:4 portrait | 1200 × 1600 px |
| 2 | `third-space/exterior/home-exterior.jpg` | Homepage + About | 3:2 / 21:9 | 1800 × 1200 px |
| 3 | `third-space/gallery/common-area.jpg` | Homepage closing | 21:9 cinematic | 3000 × 1286 px |
| 4 | `third-space/exterior/home-exterior.jpg` | About — Our Story | 21:9 cinematic | shared with #2 |
| 5 | `hospital/facility-environment.jpg` | Services | 21:9 cinematic | 3000 × 1286 px |

**Total unique images required: 4**
(Image 2 and Image 4 can share one photo if the composition works at both ratios.)

---

## File Delivery Format

- **Format:** JPEG (`.jpg`) for photographs
- **Colour space:** sRGB
- **Quality:** 85–90% JPEG compression
- **Place all images in:** `public/images/`
  - `public/images/hospital/`
  - `public/images/third-space/`

Once images are placed at the correct paths, the placeholders will be replaced with no code changes required.

---

## Replacing a Placeholder with a Real Image

When a photograph is approved and placed at the correct path, replace the `<ImagePlaceholder />` component with a standard `<img>` tag:

```astro
{/* Replace this: */}
<ImagePlaceholder aspectRatio="21:9" label={"CANAAN THIRD SPACE\nCOMMON AREA"} />

{/* With this: */}
<img
  src="/images/third-space/gallery/common-area.jpg"
  alt="A calm, light-filled common area at Canaan Third Space Senior Care Home"
  class="editorial-photo"
  width="3000"
  height="1286"
  loading="lazy"
  decoding="async"
/>
```

Add this to `global.css` once if not already present:

```css
.editorial-photo {
  width: 100%;
  height: auto;
  display: block;
  border-radius: var(--radius-md);
  object-fit: cover;
}
```
