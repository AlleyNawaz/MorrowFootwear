# Morrow Footwear — Decision Log & Architectural Traceability Map

This document records the core design, engineering, merchandising, and operational decisions for **Morrow** (`morrow-store`), fulfilling requirements **R-0001 through R-0269+** from the Master Build Prompt.

---

## 1. Project Variables & Conservative Defaults

| Variable | Configured Decision | Rationale & Alternatives |
| :--- | :--- | :--- |
| **Brand Name** | **Morrow** | Original, distinctive athletic luxury identity. Evokes fresh morning starts ("Tomorrow", "Morrow") and joyful movement. |
| **Domain** | `morrow.example` / `morrowshoes.com` | Standard production-ready domain mock. |
| **Primary Market** | United States (US) | Baseline pricing in USD ($), standard US sizing, domestic fulfillment tiers. |
| **Default Locale & Currency** | `en-US` · `USD` (minor units: cents) | Eliminates floating-point rounding errors via integer cents (`14800` = $148.00). |
| **Secondary Locales & Sizes** | `en-GB`, `en-EU` · `GBP`, `EUR` · `UK`, `EU`, `CM` | Full conversion logic in `src/lib/sizing.ts` with heel-to-toe centimeter translation. |
| **Commerce Mode** | **Interactive Demo Commerce Mode** | Fully functional local and client state: live cart arithmetic, coupon codes (`WELCOME10`, `FREESHIP`), multi-step checkout, mock Stripe hosted handoff, simulated order placement, order lookup, and return authorization. |
| **Catalog Assortment** | 12 Distinct Footwear Models | Comprehensive coverage: Running, Walking, Training, Basketball, Court, Trail, Hiking, Recovery, Sandals, Boots, Lifestyle, and Kids/Adaptive. |
| **Fulfillment Regions** | Continental US (Standard Ground $8 / Free over $120, Express $18) | Realistic e-commerce logistics thresholds with carbon-neutral courier integration. |
| **Payment Provider** | Simulated Stripe Hosted Checkout | Direct simulation of provider-approved hosted checkout, ensuring zero raw card data touches application servers (PCI-DSS compliance). |
| **Design System** | Vanilla CSS with Custom Design Tokens | Meets strict pair-programming directives (avoiding Tailwind unless requested), giving complete control over typography, fluid responsive layout, and dark mode. |

---

## 2. 40-Year Retail Manager Assortment & Operational Review (R-0007 – R-0012)

### Good-Better-Best Assortment Architecture
- **Entry / Daily Movement ($68 – $89)**: `Afterglow Slide` ($68), `Everyday Canvas` ($89). High volume, easy entry, accessible price points.
- **Performance Core ($112 – $128)**: `Softstep Guide` ($112), `Baseline Knit` ($119), `Tempo Floor` ($128). Premium daily trainers engineered for high durability.
- **Pinnacle Performance ($148 – $189)**: `Daybreak One` ($148), `Switchback Two` ($158), `Arc High` ($165), `Ridge Weather` ($179), `Northline Boot` ($189). Supercritical gas-infused polymers, waterproof membranes, carbon rubber outsoles.

### Promotion & Margin Governance (R-0008, R-0115 – R-0120)
- All promotion codes (`WELCOME10`, `FREESHIP`, `MORROW20`) require validated qualification logic in `src/lib/promotions.ts`.
- Discounts are computed deterministically against minor-unit subtotals and recalculate sales tax automatically on discounted balances.
- Clear exclusion parameters prevent stack abuse.

### Customer Escalation & Operational Playbooks (R-0010, R-0127 – R-0132)
- **30-Day Outdoor Wear Guarantee**: Customers can wear shoes outdoors and still receive 100% free size exchanges or refunds if fit is suboptimal.
- **1-Year Craftsmanship Warranty**: Dedicated path for structural delamination or seam failures.
- **Prepaid Return Portal**: Self-service demo return generator with instant `RET-XXXXXX` barcodes.

---

## 3. Brand Foundations & Identity (R-0013 – R-0018)

- **Brand Purpose**: Facilitate effortless human movement through uncompromised biomechanics and circular materials.
- **Brand Slogan**: *"Keep moving. Keep it yours."*
- **Brand Motif**: The subtle curved smile (`⌣`) incorporated in accents, confirmation moments, and microcopy without visual clutter.
- **Typography Hierarchy**:
  - Primary Body & UI: `Plus Jakarta Sans` (clean, legible, modern geometric humanist sans-serif).
  - Headings & Badges: `Space Grotesk` (expressive, energetic, architectural display face).
- **Colorway Palette**:
  - Canvas: `#faf9f6` (warm off-white luxury paper feel).
  - Charcoal Surface: `#121316` / `#0c0d10`.
  - Electric Cobalt: `#1c55d8` (high-speed energy and precision).
  - Performance Coral: `#ff4f38` (warm human vitality).

---

## 4. Architectural Traceability Map (R-0006, R-0211 – R-0222)

| Requirement Area | Source Files | Verification Method |
| :--- | :--- | :--- |
| **Domain Models & Money Math** | [`src/lib/types.ts`](file:///Users/alinawaz/Developer/Shoes/src/lib/types.ts) | Branded types `ProductId`, `VariantId`, `OrderId`; integer cents math in `tests/promotions.test.ts`. |
| **Catalog & Assortment** | [`src/lib/catalog.ts`](file:///Users/alinawaz/Developer/Shoes/src/lib/catalog.ts) | 12 models verified in `tests/catalog.test.ts`. |
| **Promotions & Cart Invariants** | [`src/lib/promotions.ts`](file:///Users/alinawaz/Developer/Shoes/src/lib/promotions.ts) | Automated Vitest tests in `tests/promotions.test.ts` & `tests/cart.test.ts`. |
| **Size & Fit Conversion** | [`src/lib/sizing.ts`](file:///Users/alinawaz/Developer/Shoes/src/lib/sizing.ts) | Multi-system converter verified in `tests/sizing.test.ts`. |
| **Shoe Finder Questionnaire** | [`src/components/shoe-finder.tsx`](file:///Users/alinawaz/Developer/Shoes/src/components/shoe-finder.tsx) | 4-step diagnostic algorithm with match scoring. |
| **Product Comparison Matrix** | [`src/components/product-comparison.tsx`](file:///Users/alinawaz/Developer/Shoes/src/components/product-comparison.tsx) | Side-by-side spec comparison table with difference highlighting. |
| **Checkout & Forms** | [`src/components/forms.tsx`](file:///Users/alinawaz/Developer/Shoes/src/components/forms.tsx) | Multi-step checkout, order status tracker, and return wizard. |
| **Design System & Tokens** | [`src/app/globals.css`](file:///Users/alinawaz/Developer/Shoes/src/app/globals.css) | Custom CSS tokens, fluid typography, dark mode, responsive breakpoints. |
| **Accessibility Conformance** | [`src/app/accessibility/page.tsx`](file:///Users/alinawaz/Developer/Shoes/src/app/accessibility/page.tsx) | WCAG 2.2 AA compliant focus states, skip-links, ARIA landmarks. |
| **SEO & Crawlers** | [`src/app/sitemap.ts`](file:///Users/alinawaz/Developer/Shoes/src/app/sitemap.ts), [`src/app/robots.ts`](file:///Users/alinawaz/Developer/Shoes/src/app/robots.ts) | Dynamic XML sitemap and JSON-LD Schema.org structured data. |
