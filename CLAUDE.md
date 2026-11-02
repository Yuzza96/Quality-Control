# QC Dashboard

Quality Control dashboard for manufacturing staff: record inspections and nonconformances (NCs), search/filter/export them, and watch quality trends. React 18 + Vite + Recharts. Runs on dummy data; Supabase is planned.

## Commands
- `npm run dev` — dev server at http://localhost:5173/Quality-Control/ (Vite `base` is `/Quality-Control/` for GitHub Pages)
- `npm run build` / `npm run preview`
- Pushing to `main` deploys to GitHub Pages via `.github/workflows/deploy.yml`.

## Pages (sidebar)
- **Overview** — stat cards (total inspections, pass rate with trend arrow vs last month, open NCs), monthly pass-rate line chart, inspection-status donut. All computed from the records.
- **Inspection Report** — two-section table (grouped header). *Route Card Information*: Date IN (`date`), sender, route card, part name, part ID, PO, RFM, model, quantity, next process, status (Pending / In Progress / Completed). *Inspection Record*: inspection date, inspected by, inspection status (`status`: Accepted / On Hold / Rejected — drives the filter and Overview), qty OK, qty NG, short, NCR, NCR status, rejected, status (Open / Closed), IGT no., remark. `RecordsPage` takes an optional `groups` prop for the grouped header; `RecordForm` supports `type: 'heading'` section titles.
- **NC Report** — NCR no., date, part, defect, qty NG, status (Open / In Progress / Closed), remark.
- **Equipment** — QC equipment inventory (asset tag, name, category, serial, location, last calibrated, next due, status In Service / Due Soon / Out of Service). Dummy status is derived from the due date; `date` holds last-calibrated so the shared date filter works.
- **Internal Good Transfer Record** — parts moved between departments (transfer no., date, part, qty, from → to, transferred by, status Pending / In Transit / Received / Rejected, remark).
- **Coming soon** — Incoming QC, Calibration, Supplier Quality, Audits (placeholder pages).

## Structure
- `src/App.jsx` — shell; `NAV` list defines pages; holds records in state (no router), theme, global search.
- `src/data/data.js` — **all dummy data**, status lists, status→badge-tone map, ID helpers. Swap for Supabase here; keep record shapes.
- `src/components/RecordsPage.jsx` — shared list page (search, status + date-range filters, CSV export, add dialog). Rows are clickable (mouse or Enter/Space) and open the record read-only; "Edit record" unlocks the same form pre-filled; pages pass `onUpdate(id, values)` from `App.jsx`. Report pages only supply columns, form fields and an `onAdd`.
- `src/components/` — `Modal` (native `<dialog>`), `RecordForm` (validation), `Sidebar`, `Topbar`, `StatCard`.
- `src/utils.js` — CSV export, `today()`.
- `src/styles.css` — single stylesheet; theme via CSS variables with `data-theme="dark|light"` on `<html>`.

## Conventions
- One accent color: teal sampled from the MIT Technologies logo (`#0a7471` light, `#2bb5b0` dark). Green/amber/red are reserved for status badges and chart status colors, so teal ≠ "success".
- Branding assets live in `public/`: `Logo.png` (original), `logo-tight.png` (cropped, light-mode sidebar), `logo-tight-dark.png` (same logo recolored for dark mode: light wordmark, `#2bb5b0` teal, transparent), `favicon.png`. If the logo changes, regenerate both tight versions.
- **Workflow: commit and push to `main` after every set of changes** (this deploys to GitHub Pages).
- Recharts needs literal colors, so `Overview.jsx` has a light/dark `COLORS` map that mirrors `styles.css` — update both together.
- To add a module: add a `NAV` entry in `App.jsx` (`soon: true` shows the placeholder), then render its page.
- Breakpoints: 1100px (charts stack), 800px (sidebar becomes a drawer), 520px (single-column form).
- New records are kept in memory only (lost on reload) until the database is connected.

## Motion
- Easing tokens in `styles.css` (`--ease-out`, `--ease-spring`); the motion block is at the end of the file. Use them for any new interactive element instead of ad-hoc durations.
- Every button/tab has smooth hover + springy press (`scale(.95)`); sidebar uses one sliding highlight pill (`.nav-pill`, measured in `Sidebar.jsx`); pages replay a staggered rise-in (`.page` is keyed by route in `App.jsx`); dialog and profile menu animate out before unmounting (`Modal.jsx`, `Topbar.jsx`).
- `prefers-reduced-motion` disables all animation. Animate only `transform`/`opacity`/colors.
- Theme toggle uses a circular reveal from the button (View Transitions API + animated `clip-path`, ~900ms) in both directions. `html.theme-switching` disables per-element transitions while it runs; unsupported browsers / reduced motion switch instantly.
