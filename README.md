# UMSA Skill-Up Month

A responsive, immersive single-page Vanilla JavaScript website for UMSA Skill-Up Month 2026. The experience combines an original procedural Three.js hero sculpture with GSAP and ScrollTrigger motion while preserving the original modular component and editable data architecture.

## Technology

- HTML5, CSS3 and Vanilla JavaScript ES modules
- Three.js / WebGL for one visibility-aware procedural hero scene
- GSAP and ScrollTrigger for section reveals, scroll-linked scene movement and interactions
- Vite for development and production builds
- No React or frontend framework

The hero sculpture uses generated geometry and built-in lighting; no external 3D assets are required. If WebGL is unavailable or its context is lost, the CSS hero artwork remains visible. Motion is reduced when the operating system requests reduced motion, and the scene pauses when off screen or when the document is hidden.

## Requirements

- Node.js 18 or newer
- npm
- A modern browser with WebGL for the 3D hero (the rest of the site works without WebGL)

## 1. Installation

From the project directory:

```bash
npm install
```

## 2. Development server

```bash
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

## 3. Production build

```bash
npm run build
```

The optimized site is written to `dist/`.

## 4. Production preview

```bash
npm run preview
```

Open the local URL printed by Vite to check the production build.

## 5. Netlify deployment

Deploy the repository to Netlify with:

- **Build command:** `npm run build`
- **Publish directory:** `dist`

Netlify installs the dependencies from `package-lock.json` before running the build.

## 6. Updating skills

Edit `src/data/skills.js`. Each entry has an `id`, `name`, `category` and `visual` description. Clicking a skill opens its group-information dialog. When a group's WhatsApp invite is ready, add its URL as `whatsappUrl` on that skill entry; until then the dialog clearly says the link is coming soon. The skills component and category-accent styling use these entries; preserve unique IDs for stable in-page anchors.

## 7. Editing the programme

Edit `src/data/programme.js`. Keep each session in its correct weekend/day and preserve the `note` field for concurrent or combined sessions. `programmeNote` contains the calendar-wide note.

## 8. Adding sponsor logos

There are no confirmed sponsors yet, so the partner gallery displays an announcement placeholder rather than invented sponsor marks. When sponsors are confirmed, place approved logo assets in `public/logos/`, then add entries to `src/data/sponsors.js` with the sponsor `name`, relative public path (for example `/logos/example.svg`) and optional `tier`. Logos render with `object-fit: contain` to preserve their original proportions.

## 9. Updating registration links

Set `registrationUrl` in `src/config/siteConfig.js` to the official registration URL. Until then, the CTA directs visitors to the programme and retains its pending-link note.

## 10. Updating social links

The supplied Instagram, Snapchat, TikTok, YouTube and X profiles are configured in `socialLinks` in `src/config/siteConfig.js`. Update those values if the official accounts change; the footer displays a linked icon for each populated profile. The supplied UMSA, UNIMED and TLA logos are in `public/logos/` and appear together in the footer community strip. `contactEmail` is available for approved contact information.

## Project structure

- `src/components/` — page sections and navigation
- `src/data/` — editable skills, programme and sponsor content
- `src/experience/heroScene.js` — procedural Three.js sculpture and resource lifecycle
- `src/experience/motion.js` — GSAP, ScrollTrigger, skill tilt, cursor and sponsor motion
- `src/styles/` — design tokens and modular section styles
- `public/` — static assets

The hero scene mounts at `#hero-3d-scene`. It uses generated geometry, capped pixel ratio, visibility-aware rendering, context-loss fallback, and disposal on page exit. On mobile and lower-core devices it keeps the interactive 3D sculpture while reducing resolution, frame rate, geometry detail, particle count, environment-map generation, and material cost.

The Three.js runtime is split into its own asynchronous production chunk. It is approximately 137 kB gzipped and is loaded with the hero experience.

## Source accuracy

The November 2026 dates, sessions and skill entries remain in the supplied data files. No session times beyond the existing morning/afternoon/evening labels, venues, facilitators, sponsor identities, registration URL or social accounts have been invented.
