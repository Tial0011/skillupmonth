# UMSA Skill-Up Month — Phase 1

A modular, single-page Vanilla JavaScript website foundation for UMSA Skill-Up Month 2026.

## Technology
- HTML5
- CSS3
- Vanilla JavaScript ES modules
- Vite (development server and production build)

No React or frontend framework is used.

## Requirements
- Node.js 18+ recommended
- npm

## Install
```bash
npm install
```

## Run locally
```bash
npm run dev
```
Open the local URL printed by Vite (usually http://localhost:5173).

## Production build
```bash
npm run build
```
The production output is written to `dist/`.

## Preview production build
```bash
npm run preview
```

## Netlify deployment
1. Push this project to a Git repository or upload the project to Netlify.
2. Set the build command to `npm run build`.
3. Set the publish directory to `dist`.
4. Deploy.

## Updating the website

### Skills
Edit `src/data/skills.js`. Each entry has an `id`, `name`, `category` and `visual` description.

### Programme calendar
Edit `src/data/programme.js`. The supplied November 2026 calendar has been transcribed into four weekend groups. Preserve the concurrent-session notes and the note about Saturday, 28 November.

### Sponsors
Edit `src/data/sponsors.js`. Add the approved sponsor name, local logo path and tier. Put logo files in `public/logos/` and reference them with a path such as `/logos/example.svg`.

### Registration link
Edit `registrationUrl` in `src/config/siteConfig.js`. If it is empty, the CTA points visitors to the programme section and displays a note that the official link is pending.

### Social links and contact
Edit `socialLinks` and `contactEmail` in `src/config/siteConfig.js` when official details are available.

## Phase 1 scope
This phase establishes the full content structure, modular components, foundational styling and basic interactions. The advanced Three.js/WebGL hero, GSAP motion system and final visual effects are intentionally reserved for Phase 3.

## Source accuracy
Programme entries and dates are based on the supplied UMSA Skill-Up Month November 2026 programme calendar. No session times beyond the calendar's morning/afternoon/evening labels, venues, facilitators, sponsor identities or registration URL have been invented.
