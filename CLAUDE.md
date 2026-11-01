# Quality Control Dashboard

SaaS-style admin dashboard built with React 18 + Vite and Recharts. Currently runs entirely on dummy data.

## Commands
- `npm run dev` — start Vite dev server (http://localhost:5173)
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the production build

## Structure
- `src/App.jsx` — app shell; holds page state (no router), theme state, global search query
- `src/components/` — `Sidebar`, `Topbar` (search, theme toggle, profile menu), `StatCard`
- `src/pages/` — `Overview` (stat cards, line + donut charts, activity table with search/filter), `Customers`, `Placeholder` (Reports, Settings)
- `src/data/mock.js` — all dummy data; replace with API calls later
- `src/styles.css` — single stylesheet; theming via CSS variables, `data-theme="dark|light"` on `<html>`

## Conventions
- One accent color (`--accent`); use the CSS variables, not hard-coded colors, in components.
- Theme persists in `localStorage` and defaults to the OS preference.
- Responsive breakpoints: 1100px (charts stack), 800px (sidebar becomes a drawer), 520px (single-column stats).
- Navigation is state-based; add react-router if real URLs are needed.

## Next steps
Real data layer, Reports and Settings pages, Customers search/detail, tests.
