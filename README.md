# Physcal

Track your muscle measures by month, see your evolution over the year and log blood pressure by day.
Responsive (browser, tablet, phone). Built with Vite + React + TypeScript.

## Features

- **Body** – month selector (current year), muscle map (front/back) with per-muscle callouts, a form to update values, and calculated info (BMI, healthy weight range, waist/hip, waist/height, BMR, lean mass, left/right symmetry).
- **Evolution** – monthly line chart of the muscles you pick, plus weight.
- **Pressure** – log blood pressure readings, daily-average chart and history with classification.
- Login/sign-up with gender choice (male frame is the anatomical map; female is a simple placeholder frame for now).

> Accounts and data are stored in the browser's `localStorage` (passwords hashed with PBKDF2). `src/lib/storage.ts` is the single persistence seam if you want to swap in a real backend.

## Development

```bash
npm install     # also installs the Husky git hooks
npm run dev
npm test
npm run build
```

## Conventional commits

Husky runs `commitlint` (`@commitlint/config-conventional`) on every commit message and `npm test` before each commit.
Example: `feat(body): add symmetry card`.

## Deploy (GitHub Pages)

`.github/workflows/deploy.yml` builds and deploys `dist/` on every push to `main`.
In the repo go to **Settings → Pages → Build and deployment → Source: GitHub Actions**.
The build uses a relative base, so it works under `https://<user>.github.io/<repo>/`.
