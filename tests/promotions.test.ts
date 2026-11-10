import { describe, it, expect } from "vitest";
import { validateCoupon, calculateOrderTotals } from "../src/lib/promotions";
import { products } from "../src/lib/catalog";
import type { CartLine } from "../src/lib/types";

describe("Promotions & Totals Engine", () => {
  it("validates WELCOME10 coupon correctly", () => {
    const res = validateCoupon("welcome10", 10000);
    expect(res.valid).toBe(true);
    expect(res.rule?.value).toBe(10);
  });

  it("rejects invalid coupon codes gracefully", () => {
    const res = validateCoupon("FAKECODE123", 10000);
    expect(res.valid).toBe(false);
    expect(res.message).toContain("not recognized");
  });

  it("enforces minimum spend requirement for tiered coupon", () => {
    const res = validateCoupon("MORROW20", 10000); // needs 15000
    expect(res.valid).toBe(false);
    expect(res.message).toContain("requires a minimum subtotal of $150.00");

    const validRes = validateCoupon("MORROW20", 16000);
    expect(validRes.valid).toBe(true);
  });

  it("calculates totals with standard shipping when below threshold", () => {
    // Single item below $120 ($68.00 = Afterglow slide)
    const slide = products.find((p) => p.slug === "afterglow-slide")!;
    const lines: CartLine[] = [
      {
        productId: slide.id,
        variantId: slide.variants[0].id,
        color: "Bone",
        size: "9",
        width: "Standard",
        quantity: 1,
      },
    ];

    const totals = calculateOrderTotals(lines, products);
    expect(totals.subtotal.amount).toBe(6800);
    expect(totals.discount.amount).toBe(0);
    expect(totals.freeShippingQualified).toBe(false);
    expect(totals.shipping.amount).toBe(800); // $8 standard shipping
    expect(totals.amountToFreeShipping).toBe(12000 - 6800);
    expect(totals.tax.amount).toBe(Math.round(6800 * 0.0825));
    expect(totals.total.amount).toBe(6800 + 800 + totals.tax.amount);
  });

  it("applies free shipping automatically when subtotal >= $120", () => {
    // Daybreak One = $148.00
    const daybreak = products.find((p) => p.slug === "daybreak-one")!;
    const lines: CartLine[] = [
      {
        productId: daybreak.id,
        variantId: daybreak.variants[0].id,
        color: "Cobalt",
        size: "10",
        width: "Standard",
        quantity: 1,
      },
    ];

    const totals = calculateOrderTotals(lines, products);
    expect(totals.subtotal.amount).toBe(14800);
    expect(totals.freeShippingQualified).toBe(true);
    expect(totals.shipping.amount).toBe(0);
    expect(totals.amountToFreeShipping).toBe(0);
  });

  it("applies 10% discount and recalculates tax on discounted subtotal", () => {
    const daybreak = products.find((p) => p.slug === "daybreak-one")!;
    const lines: CartLine[] = [
      {
        productId: daybreak.id,
        variantId: daybreak.variants[0].id,
        color: "Cobalt",
        size: "10",
        width: "Standard",
        quantity: 1,
      },
    ];

    const totals = calculateOrderTotals(lines, products, "WELCOME10");
    expect(totals.subtotal.amount).toBe(14800);
    expect(totals.discount.amount).toBe(1480); // 10% of 14800
    const discounted = 14800 - 1480; // 13320
    expect(totals.tax.amount).toBe(Math.round(discounted * 0.0825));
    expect(totals.shipping.amount).toBe(0);
    expect(totals.total.amount).toBe(discounted + totals.tax.amount);
  });
});
