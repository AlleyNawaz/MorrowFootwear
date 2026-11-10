# Morrow — cinematic footwear concept

Next.js, strict TypeScript and a real React Three Fiber product study. This is demo commerce: prices, inventory, orders and policies are sample data. Payment is simulated.

## Run

```sh
npm install
npm run dev -- --port 3001
```

Open http://localhost:3001. Another project on this machine uses port 3000.

## Verify

```sh
npm run check
npm run test:e2e
```

The check script runs TypeScript, ESLint, commerce unit tests and a production build. Browser tests use installed Google Chrome on desktop and mobile emulation. Screenshots are saved in test-results. To use bundled Chromium instead, remove the channel setting in playwright.config.ts and run npx playwright install chromium.

## Architecture

- src/app: preserved routes and server-rendered catalog.
- components/experience: six-chapter scroll journey, configuration and DOM controls.
- components/three: lazy-loaded scene, original procedural geometry, material interpolation and demand rendering.
- data/experience.ts: component stories, configuration and narrative keyframes.
- components/navigation: native-dialog search and bag connected to the original store provider.
- app/studio.css: controlled graphite/chalk/red visual system plus Tailwind utilities.
- lib/cart.ts and store-provider: validated storage, exact variant identity and cart editing.
- lib/demo-orders.ts: current-tab receipts and returns, without real payments.
- lib/search.ts and hooks/use-url-field.ts: typo-tolerant search and restorable filters.
- components/order-experience.tsx: receipt, lookup, return and account history.

GSAP synchronizes native scroll; Framer Motion handles detail transitions. No scroll hijacking or autoplay sound. Mobile uses lower rendering resolution and no contact shadows. Static imagery remains available when WebGL fails.

## Production boundary

Run npm run build then npm start -- --port 3001 for a local production server. No new credentials are needed. Do not enable real sales without authoritative catalog, inventory, payments, authentication, legal approval and operational integrations.

The 3D shoe is an original procedural design concept, not a photoreal scan or physically validated product. Configuration is visual-only; actual purchasable variants remain on product pages. Full screen-reader, cross-browser, physical-device and field-performance verification remain release gates.

The demo is intentionally noindex and does not publish Offer/rating structured data. Set NEXT_PUBLIC_SITE_URL to an HTTP(S) origin before building previews; it defaults to morrow.example. This does not enable real commerce. Baseline security headers are configured; no full script CSP or security audit is claimed.

See [scope](docs/COMPLETENESS.md), [verification](docs/VERIFICATION.md), [limitations](docs/KNOWN_LIMITATIONS.md), [decisions](docs/DECISIONS.md) and [launch checklist](docs/LAUNCH_CHECKLIST.md).
# shoes
