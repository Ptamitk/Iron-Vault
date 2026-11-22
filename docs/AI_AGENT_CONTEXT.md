# IRON VAULT — AI Agent Project Context

> Purpose: help an incoming coding agent understand the existing repository, preserve the work already completed, and continue with non-commercial engineering/documentation tasks. This file describes the current codebase; it is not an instruction to implement supplement sales, product promotion, or transactions.

## First message to the incoming agent

You are being given an existing React/Vite project named IRON VAULT. Do not scaffold a replacement app. First inspect the repository and current branch, read this document and `docs/TECHNICAL_HANDOVER.md`, run the app, and map the existing components/styles. Preserve the approved visual design and animation language. Do not delete or rewrite working sections just to simplify the code. Before any edits, report the files you intend to change and why. Make small, reviewable commits and run `npm run build` after changes.

## 1. Repository and branch

- GitHub repository: https://github.com/Ptamitk/Iron-Vault
- Current working branch at handover: `feature/real-product-imagery`
- Main frontend entry: `src/main.jsx`
- Root page: `src/App.jsx`
- Main stylesheet: `src/App.css`
- 3D section: `src/components/sections/ProductExperience.jsx`
- Vite config: `vite.config.js`
- Package manifest: `package.json`

Always verify the latest remote branch state before editing; this handover reflects the repository inspected on 22 November 2026 and may become stale.

## 2. Product and design background

IRON VAULT began as a premium, dark-themed fitness/performance brand website demo. The client approved the existing visual direction. The owner's strongest requirement is to preserve the current design, typography, layout, colours, transitions, hover states, and scroll animations rather than replace the site with a generic template.

The current demo includes fitness/nutrition-themed artwork and copy. Some visual elements are CSS-generated illustrations rather than licensed photography or real 3D product assets. Do not assume any third-party brand image is licensed for commercial use; obtain documented permission or use appropriately licensed assets before any permitted use.

## 3. Existing visual structure

The main page is composed in `src/App.jsx`. Current source inspection shows these areas:

1. Announcement strip and primary header / navigation.
2. Hero section with large headline, explanatory copy, calls to action, and CSS-built hero illustration.
3. Moving brand-values ticker.
4. Brand philosophy / manifesto section.
5. `ProductExperience` 3D scroll experience.
6. Editorial visual and text section.
7. Collection/category presentation area.
8. Additional themed sections, FAQ interaction, and footer (inspect the remainder of `App.jsx` for exact current markup).

The site uses a near-black background, warm off-white text, muted olive/sage accent, high-contrast editorial typography, thin borders, oversized headings, layered visual depth, and generous spacing. The CSS contains responsive breakpoints; inspect the complete stylesheet before changing layout rules.

## 4. Animation and interaction inventory

`src/App.jsx` currently imports and uses:
- GSAP
- GSAP ScrollTrigger
- `@gsap/react` / `useGSAP`
- Lenis smooth scrolling
- Lucide icons
- React state/effects/refs

Observed motion patterns include:
- Hero text and artwork entrance
- Scroll-linked hero movement and orbit rotation
- Manifesto line reveals
- Editorial image/copy reveals and layered parallax
- Category-card reveal and art parallax
- Standards and FAQ entrance effects
- Scroll progress indicator
- Pointer-based tilt/depth on selected elements

The page also contains responsive navigation, an overlay/drawer state, Escape-key dismissal, FAQ state, and a newsletter UI state. Inspect whether each interaction is demo-only before treating it as connected to any service.

`src/components/sections/ProductExperience.jsx` uses Three.js and CanvasTexture to create procedural 3D artwork. It creates a container-like model, lighting, a lid assembly, and smaller canister visuals; it also uses a ResizeObserver and GSAP/ScrollTrigger for the scroll sequence. It is not a downloaded GLB model and is not proof of real product assets or a commerce integration.

## 5. Accessibility already present

The main app checks `prefers-reduced-motion`:
- Lenis is not initialized when reduced motion is requested.
- Pointer tilt is disabled for reduced-motion users.
- GSAP motion is scoped to the no-preference media query.
- Lenis event/ticker cleanup is guarded.

Preserve these safeguards. Keep keyboard focus visible, accessible labels, Escape dismissal, semantic landmarks, and responsive navigation behavior intact.

## 6. Stack and commands

- React 19
- Vite 8
- JavaScript ES modules
- CSS and Tailwind Vite plugin
- GSAP / ScrollTrigger / @gsap/react
- Lenis
- Three.js
- Framer Motion
- lucide-react

Commands from repository root:

```bash
npm install
npm run dev
npm run build
npm run lint
npm run preview
```

For Windows PowerShell, if the npm PowerShell shim is blocked, use `npm.cmd` (for example, `npm.cmd run build`).

## 7. Known project state and cautions

- `src/main.jsx` renders `App` directly.
- The former apparel route/page files were removed from the working branch because apparel is not part of the client's described business.
- The UI includes demo/placeholder interactions; do not describe them as production-connected services.
- No verified production backend, persistent database, authentication service, payment gateway, shipping provider, or deployed order system was established by the frontend source inspected for this handover.
- A successful local Vite production build was reported on 20 November 2026.
- That build emitted a large JavaScript chunk warning (roughly 893 kB uncompressed). It was a warning, not a build failure.
- The owner has not purchased hosting. The domain is registered with GoDaddy, but hosting choice and runtime compatibility must be checked independently before deployment.
- Do not put API keys, credentials, payment secrets, customer information, or private configuration into Git.

## 8. Working agreement for future changes

1. Start by checking `git status` and `git branch --show-current`.
2. Pull the latest remote branch before work.
3. Read the full relevant source file and its stylesheet before editing.
4. Do not make sweeping redesigns or replace the animation system without approval.
5. Do not assume demo buttons are functional backend integrations.
6. Use small commits with descriptive messages.
7. Test desktop and mobile layouts and reduced-motion behavior.
8. Run `npm run build` and report the actual result.
9. Clearly separate verified functionality from mock/demo UI.
10. Do not claim that a feature is deployed or production-ready unless it has been tested in the actual environment.

## 9. Useful first-run commands

```bash
git status
git branch --show-current
git pull origin feature/real-product-imagery
npm install
npm run dev
```

Then inspect:
- `src/App.jsx`
- `src/App.css`
- `src/components/sections/ProductExperience.jsx`
- `src/components/sections/ProductExperience.css`
- `src/index.css`
- `package.json`
- `vite.config.js`

## 10. Handover boundary

This document is a factual codebase/design handover and preservation brief. It does not provide instructions for implementing supplement product listings, product promotion, checkout, payment collection, shipping, or other supplement sales operations. Do not treat a different AI agent, prompt, account, or paid tier as a way to bypass that boundary.
