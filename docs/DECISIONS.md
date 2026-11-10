# Decision log

| Date | Decision | Rationale | Alternatives | Owner | Reversal cost |
|---|---|---|---|---|---|
| 2026-09-08 | Name the fictional brand Morrow | Ownable tone; supports optimistic direction | Daykind, Elsewhere | Product | Medium |
| 2026-09-08 | Build demo commerce | No business, payments, inventory, policy, or customer systems supplied | Live Stripe build | Product | Medium |
| 2026-09-08 | US / en-US / USD default | Conservative ecommerce prototype baseline | Pakistan / en-PK / PKR | Product | Low |
| 2026-09-08 | Next.js App Router + strict TypeScript | Requested architecture; SSR metadata and routing | SPA | Engineering | Medium |
| 2026-09-08 | Local typed catalog and browser cart/wishlist | Functional, reversible, no false backend claims | CMS/database | Engineering | Medium |
| 2026-09-08 | “Fresh Box Energy” territory | Best blend of premium calm and joyful energy | Quiet Utility; Trail Signal | Design | Medium |
| 2026-09-08 | Replace the landing direction with “Obsidian Motion” | User requested a significantly stronger cinematic 3D experience and disliked the shifting palette | Continue polishing Fresh Box Energy | Design | Medium |

## Facts, assumptions, questions, risks

### Discovery and release-integrity update — 2026-09-09

Owner: engineering/design. Replace the diagnostic-style finder with a pure, tested attribute ranking and explicit tradeoffs; no match percentages or health claims. Add three typed collections, six honest editorial samples, fit/price filters and URL pagination. Alternatives: preserve the old score or connect production recommendation/search vendors. Rationale: make the available demo coherent without pretending to have clinical or sales evidence. Reversal cost: low for content, medium for replacing the ranking adapter.

Keep this fictional storefront noindex and omit Offer/rating structured data. Configure the canonical origin through a validated environment variable. Restrict known product/collection/journal slugs to their static catalog to avoid streamed HTTP-200 not-found responses. Baseline headers are implemented without claiming a complete script CSP. Real providers, policies, legal review, physical assets and full cross-browser/device testing remain separate release gates.

The root loading boundary still flushed HTTP 200 before unknown-slug rejection, despite static slug restrictions. Scope that loading UI to account routes instead. The scene keeps its own progressive placeholder, while catalog 404s can resolve before headers are sent. This also removes the unnecessary whole-page streamed duplicate during initial catalog/home rendering.

### Cinematic implementation decision — 2026-09-08

Owner: frontend engineering/design. Replace the homepage and global shell with a persistent original procedural WebGL product study, retaining all commerce routes and business logic. Use native scroll synchronized by GSAP, demand-driven R3F rendering, Drei controls and Framer Motion panels. The graphite/chalk/red palette is fixed across operating-system themes. Reversal cost: medium; original route logic is unchanged.

No approved GLB or production model exists. The procedural model is a design concept, not a photoreal scan. Customization changes only the visual study, never silently maps to a purchasable SKU. Production model replacement should retain independently addressable part groups. Audio, custom cursor, heavy postprocessing and Lenis were omitted because they add cost without necessary shopping utility. No numerical performance claims were added.

- Confirmed: repository was empty; no brand kit, assets, policies, integrations, or hosting configuration existed.
- Assumed: Morrow, `morrow.example`, United States, en-US, USD, 12 products, demo commerce, local adapters, no analytics/email/support provider.
- Open: legal entity, actual market, policies, tax, fulfillment, vendor choices, brand clearance, accessibility feedback contact, support hours, launch date.
- Risks: generated imagery is concept-only; sample catalog repeats the hero image; browser storage is not account sync; unvalidated brand name; no real stock or delivery estimates.
- Out of scope: live payments, authentication, CMS, database, email, maps, reviews, fraud tooling, admin, production observability.

## Creative territories

### Commerce integrity update — 2026-09-09

Owner: engineering. Preserve routes and demo scope; replace unvalidated browser storage and fabricated order/return responses with validated local records. Account history is explicitly local, not authentication. Alternative: real commerce backend; requires approved vendors and policies. Reversal cost: medium, replacing the demo-order boundary with server adapters.

Cart identity now includes color, size and width. Search and filters are URL-backed. No analytics is transmitted. Fake gallery angles and unapproved delivery promises were removed from purchase surfaces. Production imagery and business policies remain launch dependencies.

1. Fresh Box Energy — warm neutral canvas, cobalt, coral, editorial serif, crisp grid, smile curve. Selected for balance and distinctiveness.
2. Quiet Utility — stone, moss, compact grotesk, product-first restraint. Clear but less joyful.
3. Trackside Sun — cream, marigold, racing red, condensed type. Energetic but more campaign-led and less calm.
