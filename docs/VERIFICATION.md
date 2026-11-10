# Verification evidence

## Latest pass — 2026-09-09

| Check | Observed result |
| --- | --- |
| Type generation and TypeScript | Passed via npm run check |
| ESLint | Passed, zero warnings |
| Unit tests | 44 passed across 8 files |
| Production build | Passed; 67 static pages generated |
| Production browser suite | 41 passed in 47.0 seconds; 1 intentional skip for the duplicate mobile HTTP-link audit; Chrome desktop and iPhone 13 emulation |
| Selected axe audits | No reported violations on homepage, checkout, help, account, cookie controls and finder results under the configured tags |
| Link/asset integrity | Sitemap destinations and their discovered internal links returned expected success statuses; catalog images exist and are under the configured 2 MB per-image budget |
| Narrow/offline/failure checks | 320px catalog, finder, account, help and collection layouts pass; offline status recovers; failed order storage preserves the bag |
| Console smoke | No console errors or page errors across home, preferences, product, search, help and cookie routes |

Browser coverage: stable theme; WebGL unavailable fallback; live scene; exploded view; visual configuration/reset; keyboard rotation/zoom/reset; search/dialog Escape; bag interactions; exact color/width identity and reload; invalid storage recovery; typo search and filter restoration; size dialog; address/review flow; stored receipt; order lookup; return initiation; account preferences/export; privacy clearing.

Tests run against the production server at localhost:3001. Screenshots in test-results include desktop/mobile hero, construction, configuration and checkout. The mobile checkout capture was visually inspected; earlier cinematic captures were also reviewed.

The latest finder mobile full-page capture was visually inspected at 390px. Added browser coverage verifies skip/edit/restart, answer persistence in the URL, match/tradeoff results, exact width filtering, pagination reload, collection navigation, real 404 responses, noindex/Offer omission and baseline response headers. The single skipped test repeats a viewport-independent HTTP route audit already run on desktop; no interaction test was skipped.

## Failures found and addressed

- Variant/color and width collisions: exact line keys, catalog variant normalization and pure tested edits.
- Invalid persisted state: runtime schemas, migration and unavailable-variant rejection.
- Lost preference on early interaction/reload: disabled pre-hydration selection and immediate persistence.
- Fabricated confirmation/tracking/labels: saved current-tab receipts, validated lookup and explicitly simulated return records.
- Hidden streamed homepage copies causing strict test-locator failures: tests assert one visible stage before inspecting it.
- Product-card image positioning warning: positioned its direct link container.
- Catalog toolbar overflow at 320px: allowed control wrapping.
- Finder ignored terrain/maximum structure and used fabricated scores: all four inputs now feed a pure tested ranking with explicit tradeoffs.
- Unknown catalog routes returned streamed HTTP 200: static slug restrictions plus moving the root loading boundary into account routes restore HTTP 404 responses.
- Broken /recovery breadcrumb exposed by real status auditing: implemented its category page.
- Comparison lacked a main-content skip target and selected model controls still said Add: added a focusable main landmark and pressed/remove states.
- Bag quantity controls remained enabled above low-stock limits: drawer and cart now use the shared inventory quantity limit.
- Unsupported regional size conversions were displayed without their source system: retain an explicit US label for uncharted adult/kids sizes.
- Out-of-chart measurement inputs silently selected an endpoint size: now return no recommendation with an explanatory state.
- Product detail is keyed by product slug so local size/width selection does not leak between different product routes.
- Legacy editorial contained fabricated experts, environmental statistics and health claims: replaced with six explicitly sample articles and corrected unsupported catalog certification/therapeutic claims.

An intermittent development-mode hydration warning appeared in an earlier cold-streamed navigation pass. The unnecessary root loading boundary has now been scoped to accounts; broader development-mode investigation remains advisable. Three.js Clock deprecation, reduced-motion notices and Next.js NoFallbackError server diagnostics on rejected static slugs are dependency diagnostics, not claimed resolved. Rejected URLs return HTTP 404 in the browser tests.

## Limits of this evidence

These are not full WCAG conformance, field Core Web Vitals or production integration results. No complete manual VoiceOver pass, physical-device testing, Safari/Firefox matrix, 200% zoom suite, Lighthouse baseline, sustained offline/slow-network test or real payment/provider failure test was completed. Bundle/geometry design budgets do not establish field speed. No deployment or stakeholder launch approval is claimed.

Run npm run check, then npm run start -- --port 3001 and npm run test:e2e. If the port is unused, Playwright otherwise starts a development server automatically. Test artifacts are regenerated, not committed.
