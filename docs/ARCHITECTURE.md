# Architecture and operating model

| Boundary | Prototype source | Production responsibility |
|---|---|---|
| Catalog, price, stock | `src/lib/catalog.ts` typed sample data | Commerce/PIM adapters, server validation |
| Cart, wishlist | Versioned localStorage keys | Session cart API and customer account merge |
| Checkout | Client demo boundary | Server action creates hosted Stripe Checkout |
| Orders and returns | Labeled simulation | Order management and returns providers |
| Content | Route-level typed records | Approved constrained CMS modules |
| Analytics | Typed union only | Consent-gated adapter and server purchase dedupe |

Product → variant → inventory is modeled separately. Money uses integer minor units. Inventory uses a discriminated union. Production order lifecycle: cart → validated checkout → provider pending → paid → created → allocated → packed → shipped/pickup-ready → delivered → closed, with explicit exception/cancel/refund branches. Return lifecycle: requested → approved → label issued → in transit → received → inspected → refunded/exchanged, with rejected and escalated branches.

Browser storage: `morrow.cart.v1` and `morrow.wishlist.v1`; essential prototype functionality; no expiry in this prototype; clear via browser site-data controls. A future migration must parse old versions and discard invalid data.

Deployment: source → type/lint/test/build gate → preview → stakeholder/accessibility/legal/security review → production. Rollback should redeploy the last passing immutable build.
