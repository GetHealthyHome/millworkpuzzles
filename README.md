# Millwork Puzzles site prototype

Domains: millworkpuzzles.com (canonical), millworkpuzzle.com (redirect).

Next.js 15 (App Router, JS). `npm i && npm run dev` → http://localhost:3000

- `/` pre-launch page with email signup (Supabase `waitlist`, see supabase/waitlist.sql and .env.example)
- `/preview/` store prototype homepage (removed from production builds; noindex)
- `/preview/editions/quiet-meridian/` product page (whimsy pull-out, feature pins, thickness inspector, spec matrix, cart drawer)

Swap points (stubs):
- `lib/data.js` — all editions, prices, add-ons, pins, whimsy shapes, quotes. Copy/commerce threads replace values here.
- `components/Art.js` — placeholder SVG artwork; replace with real photography/video.
- `components/MakersMark.js` — placeholder maker's mark.
- `components/Store.js` — in-memory cart; replace with the commerce provider's cart.
- Email capture (`components/Teaser.js`) and COA registry (`components/RegistryForm.js`) only validate format; no backend.

Brand tokens live at the top of `app/globals.css`. One typeface site-wide: Plus Jakarta Sans via next/font (Ande overrode the blueprint's three-font system on 2026-11-14). Edition numbers are sequential: `nextNumber()` in lib/data.js.

Preview build: `npm run build && node scripts/make-preview.mjs` makes `preview/`, a copy that works under any URL path (used for the claude.ai artifact).
