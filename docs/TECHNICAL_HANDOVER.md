# IRON VAULT — Technical Handover

## 1. Project overview

- Repository: `Ptamitk/Iron-Vault`
- Working branch: `feature/real-product-imagery`
- Frontend: React + Vite
- Language: JavaScript (ES modules)
- Styling: project CSS and Tailwind CSS tooling
- Animation / visual libraries: GSAP, ScrollTrigger, @gsap/react, Lenis, Framer Motion, Three.js
- Icons: lucide-react

This document records the current frontend project state so another developer can understand and preserve the existing work. It is not a specification for commerce, product promotion, or transaction functionality.

## 2. Local setup

Prerequisites:
- Node.js version compatible with the installed Vite release
- npm
- Git

From the repository root:

```bash
npm install
npm run dev
```

Vite normally serves the development site at:

```
http://localhost:5173
```

For a production build check:

```bash
npm run build
```

Other available scripts:

```bash
npm run lint
npm run preview
```

On Windows PowerShell, if script execution blocks `npm`, use `npm.cmd` (for example, `npm.cmd run build`) or allow scripts for the current terminal process only.

## 3. Main source structure

- `src/main.jsx` — application entry point
- `src/App.jsx` — primary page composition and global interaction setup
- `src/App.css` — primary page styling
- `src/components/sections/ProductExperience.jsx` — Three.js visual experience component
- Related component styles are stored alongside their components.

The former apparel page and its route files were removed from the current working branch. The app entry now renders the main `App` component directly.

## 4. Existing visual work to preserve

The current frontend contains a dark, high-contrast visual direction, responsive navigation, hero composition, editorial sections, animated visual elements, FAQ interactions, and footer content.

Animation and interaction work includes:
- GSAP timelines and ScrollTrigger-based scroll effects
- Lenis smooth scrolling
- Pointer-based depth / tilt effects
- Three.js-generated 3D visual elements
- Responsive navigation and keyboard Escape handling for open overlays

Do not replace the existing visual system wholesale. Before changing layout, typography, spacing, animation timing, or component structure, review the current implementation and preserve the established visual language.

## 5. Accessibility and motion preference

The main application checks the operating-system `prefers-reduced-motion` setting. When reduced motion is requested:
- Lenis smooth scrolling is not initialized
- Pointer tilt effects are disabled
- Motion animations are restricted through GSAP match-media handling

Keep this behavior intact when refactoring animation code. Also preserve keyboard dismissal and appropriate accessible labels on interactive controls.

## 6. Current implementation status

- The frontend is a Vite/React application.
- The current branch includes the reduced-motion accessibility adjustment.
- The demo contains client-side visual interactions and placeholder states.
- No production backend, persistent database, server authentication, or verified external service integration is established by the frontend files inspected for this handover.
- A successful local `npm run build` was reported on this branch on 20 November 2026.
- The last reported build emitted a large JavaScript chunk warning (approximately 893 kB before gzip). This was a warning, not a build failure.

Do not treat a successful Vite build as proof that a production service, database, or external integration is operational. Verify each system independently before release.

## 7. Safe handover checklist

- Confirm the checked-out branch before making changes.
- Pull the latest branch before starting.
- Install dependencies and run the build.
- Review the current page and component styles before editing.
- Test desktop, tablet, and mobile layouts.
- Test keyboard navigation and reduced-motion behavior.
- Keep secrets and private credentials out of source control.
- Record every code change in a focused commit.
- Run the build again after changes and document any warnings or failures.

## 8. Git commands

```bash
git status
git branch --show-current
git pull origin feature/real-product-imagery
npm install
npm run build
npm run dev
```

## 9. Important project hygiene

- Do not commit `.env` files, API secrets, passwords, private keys, or customer data.
- Use environment variables for any future configuration that genuinely requires secrets.
- Keep dependency changes deliberate and review the lockfile diff.
- Test on a separate branch before merging substantial refactors.
- Keep a backup branch or tag before major visual changes.
