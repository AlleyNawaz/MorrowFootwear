# Known limitations and launch blockers

Updated 2026-09-09. This is a working interactive front-end commerce demo, not production commerce.

## Demo boundaries

- Payment is simulated; no card data is collected and no real purchase, shipment, refund or carrier label is created.
- Receipts and return requests are saved in the current tab's session storage. Lookup requires its matching reference and email; this is not server authentication.
- Account pages expose local demo history and preferences, not sign-in or cross-device synchronization.
- Cart persistence is validated, but browser storage is never authoritative inventory or order storage.
- Prices, stock and specifications are sample data. No live analytics or marketing tracking is enabled.

## Visual and catalog limitations

Real procedural WebGL supports separated construction groups, attached hotspots, keyboard inspection, visual configuration and scroll synchronization. The model is a concept, not a photoreal production scan. Visual configuration does not alter catalog SKUs. Approved geometry, measured specifications, color-accurate photos and macro assets remain necessary. Galleries honestly show available concept imagery.

Search, facets and pagination are URL-backed. Three collection pages and a four-question answer-aware finder are implemented. Advanced search ranking, large-catalog load testing, complete regional sizing and localization remain incomplete. Store, membership and gift-card surfaces are not live services.

## Missing production integrations

Authentication, authoritative catalog/pricing/inventory, order database, hosted payments, tax, shipping, email, CMS, reviews, maps, support, fraud tooling, administration, signed webhooks, monitoring and alert routing are not connected. Production idempotency, permissions and rate limits require server implementation.

## Verification and launch gates

Baseline response headers block framing and plugin objects, restrict form targets, disable camera/microphone/payment access, suppress referrers and MIME sniffing. This is not a complete nonce-based script CSP or a security audit. Demo routes are noindex; Product markup intentionally omits fabricated Offer and rating data. The public URL is validated at build time. Offline messaging does not imply service-worker caching or full offline support.

Chrome desktop/mobile-emulation tests, selected axe checks, unit tests, type checking, lint and build provide regression evidence, not full WCAG conformance. Physical devices, Safari/Firefox, full screen-reader journeys, high zoom, sustained slow-network/offline use, field Core Web Vitals and real provider failure/reconciliation paths remain unverified.

Before real sales: trademark clearance; qualified legal, privacy, security and accessibility review; approved data and licensed assets; operational owners; authoritative integrations; deployment and rollback rehearsal. No production launch is claimed.
