import type { CartLine, OrderTotals, Product } from "./types";

export const FREE_SHIPPING_THRESHOLD_CENTS = 12000; // $120.00
export const STANDARD_SHIPPING_CENTS = 800; // $8.00
export const EXPRESS_SHIPPING_CENTS = 1800; // $18.00
export const ESTIMATED_TAX_RATE = 0.0825; // 8.25% demo tax

export interface CouponRule {
  code: string;
  type: "percentage" | "free_shipping" | "fixed";
  value: number; // e.g., 10 for 10%, 1500 for $15.00
  description: string;
  minSubtotalCents?: number;
}

export const VALID_COUPONS: Record<string, CouponRule> = {
  WELCOME10: {
    code: "WELCOME10",
    type: "percentage",
    value: 10,
    description: "10% off your entire demo order",
  },
  FREESHIP: {
    code: "FREESHIP",
    type: "free_shipping",
    value: 0,
    description: "Free standard shipping on this order",
  },
  MORROW20: {
    code: "MORROW20",
    type: "percentage",
    value: 20,
    minSubtotalCents: 15000,
    description: "20% off orders over $150",
  },
};

export function validateCoupon(
  code: string,
  subtotalCents: number,
): { valid: boolean; message: string; rule?: CouponRule } {
  const normalized = code.trim().toUpperCase();
  if (!normalized) {
    return { valid: false, message: "Please enter a promotion code." };
  }
  const rule = Object.hasOwn(VALID_COUPONS, normalized)
    ? VALID_COUPONS[normalized]
    : undefined;
  if (!rule) {
    return {
      valid: false,
      message: `Code "${normalized}" is not recognized or has expired.`,
    };
  }
  if (rule.minSubtotalCents && subtotalCents < rule.minSubtotalCents) {
    const needed = (rule.minSubtotalCents - subtotalCents) / 100;
    return {
      valid: false,
      message: `Code "${normalized}" requires a minimum subtotal of $${(rule.minSubtotalCents / 100).toFixed(2)}. Add $${needed.toFixed(2)} more to qualify.`,
    };
  }
  return { valid: true, message: rule.description, rule };
}

export function calculateOrderTotals(
  lines: CartLine[],
  catalogProducts: Product[],
  promoCode?: string,
  shippingSpeed: "standard" | "express" = "standard",
): OrderTotals {
  let subtotalCents = 0;

  for (const line of lines) {
    const product = catalogProducts.find((p) => p.id === line.productId);
    if (product) {
      subtotalCents += product.price.amount * line.quantity;
    }
  }

  let discountCents = 0;
  let promoFreeShipping = false;

  if (promoCode) {
    const val = validateCoupon(promoCode, subtotalCents);
    if (val.valid && val.rule) {
      if (val.rule.type === "percentage") {
        discountCents = Math.round((subtotalCents * val.rule.value) / 100);
      } else if (val.rule.type === "fixed") {
        discountCents = Math.min(val.rule.value, subtotalCents);
      } else if (val.rule.type === "free_shipping") {
        promoFreeShipping = true;
      }
    }
  }

  const discountedSubtotal = Math.max(0, subtotalCents - discountCents);
  const freeShippingQualified =
    subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS || promoFreeShipping;
  const amountToFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD_CENTS - subtotalCents,
  );

  let shippingCents = 0;
  if (shippingSpeed === "express") {
    shippingCents = EXPRESS_SHIPPING_CENTS;
  } else {
    shippingCents = freeShippingQualified ? 0 : STANDARD_SHIPPING_CENTS;
  }

  if (subtotalCents === 0) shippingCents = 0;
  const taxCents = Math.round(discountedSubtotal * ESTIMATED_TAX_RATE);
  const totalCents = discountedSubtotal + shippingCents + taxCents;

  return {
    subtotal: { amount: subtotalCents, currency: "USD" },
    discount: { amount: discountCents, currency: "USD" },
    shipping: { amount: shippingCents, currency: "USD" },
    tax: { amount: taxCents, currency: "USD" },
    total: { amount: totalCents, currency: "USD" },
    freeShippingQualified,
    amountToFreeShipping,
  };
}
