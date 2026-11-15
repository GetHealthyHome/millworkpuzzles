// The store prototype in app/preview has placeholder editions and prices.
// On Vercel production builds (a throwaway clone) delete it so it can never be served.
import { rmSync } from 'node:fs';
if (process.env.VERCEL_ENV === 'production') {
  rmSync(new URL('../app/preview', import.meta.url), { recursive: true, force: true });
  console.log('Production build: store prototype (app/preview) removed.');
}
