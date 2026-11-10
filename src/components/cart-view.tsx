"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { products, formatMoney } from "@/lib/catalog";
import {
  calculateOrderTotals,
  validateCoupon,
  FREE_SHIPPING_THRESHOLD_CENTS,
} from "@/lib/promotions";
import { useStore } from "./store-provider";
import { useToast } from "./toast";
import { quantityLimit } from "@/lib/cart";

export function CartView() {
  const {
    lines,
    updateQuantity,
    remove,
    editLine,
    toggleWish,
    wishlist,
    promoCode,
    setPromoCode,
  } = useStore();
  const { showToast } = useToast();
  const [couponInput, setCouponInput] = useState("");

  const enrichedLines = lines
    .map((l) => ({
      line: l,
      product: products.find((p) => p.id === l.productId),
    }))
    .filter(
      (x): x is { line: typeof x.line; product: (typeof products)[number] } =>
        x.product !== undefined,
    );

  const totals = calculateOrderTotals(lines, products, promoCode);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = validateCoupon(couponInput, totals.subtotal.amount);
    if (res.valid) {
      setPromoCode(couponInput);
      setCouponInput("");
      showToast(`Promo code "${couponInput.toUpperCase()}" applied ⌣`);
    } else {
      showToast(res.message, "error");
    }
  };

  const handleRemoveCoupon = () => {
    setPromoCode("");
    showToast("Promo code removed", "info");
  };

  if (!enrichedLines.length) {
    return (
      <main
        id="main-content"
        className="page container-narrow"
        style={{ textAlign: "center", padding: "80px 24px" }}
      >
        <span
          style={{
            fontSize: "3rem",
            display: "block",
            color: "var(--brand-smile)",
            marginBottom: "16px",
          }}
        >
          ⌣
        </span>
        <p className="eyebrow">YOUR SHOPPING BAG</p>
        <h1>Your bag is empty</h1>
        <p
          style={{
            maxWidth: "440px",
            margin: "12px auto 32px",
            color: "var(--text-secondary)",
          }}
        >
          Every long journey begins with the right pair underfoot. Explore our
          newly dropped road, trail, and comfort styles.
        </p>
        <Link href="/new" className="btn btn-primary btn-lg">
          Explore New Arrivals
        </Link>
      </main>
    );
  }

  const shippingProgressPct = Math.min(
    100,
    Math.round((totals.subtotal.amount / FREE_SHIPPING_THRESHOLD_CENTS) * 100),
  );

  return (
    <main id="main-content" className="page container">
      <div style={{ marginBottom: "28px" }}>
        <p className="eyebrow">CHECKOUT PATH · REVIEW</p>
        <h1>Your Shopping Bag</h1>
        <p style={{ color: "var(--text-secondary)" }}>
          {enrichedLines.length}{" "}
          {enrichedLines.length === 1 ? "style" : "styles"} selected
        </p>
      </div>

      <div className="cart-grid">
        {/* Left: Cart items */}
        <div className="cart-items-list">
          {/* Free shipping meter */}
          <div className="shipping-meter">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "0.88rem",
              }}
            >
              <span style={{ fontWeight: 600 }}>
                {totals.freeShippingQualified
                  ? "Sample standard shipping fee: $0. No real shipment occurs."
                  : `Sample threshold: ${formatMoney({ amount: totals.amountToFreeShipping, currency: "USD" })} below the demo shipping threshold.`}
              </span>
              <span style={{ color: "var(--text-tertiary)" }}>
                {shippingProgressPct}%
              </span>
            </div>
            <div className="meter-bar-track">
              <div
                className="meter-bar-fill"
                style={{ width: `${shippingProgressPct}%` }}
              />
            </div>
          </div>

          {enrichedLines.map(({ line, product }) => (
            <article
              key={`${line.variantId}-${line.size}-${line.width}-${line.color}`}
              className="cart-card"
            >
              <div className="cart-card-image">
                <Image
                  src={
                    product.colors.find((c) => c.name === line.color)?.image ??
                    product.colors[0].image
                  }
                  alt={product.name}
                  fill
                  sizes="120px"
                  style={{ objectFit: "cover" }}
                />
              </div>

              <div>
                <span className="product-card-category">
                  {product.category}
                </span>
                <Link href={`/products/${product.slug}`}>
                  <h2 style={{ fontSize: "1.2rem", marginBottom: "4px" }}>
                    {product.name}
                  </h2>
                </Link>
                <p
                  style={{
                    fontSize: "0.88rem",
                    color: "var(--text-secondary)",
                  }}
                >
                  Color: <strong>{line.color}</strong> · Size:{" "}
                  <strong>US {line.size}</strong> · Width:{" "}
                  <strong>{line.width}</strong>
                </p>

                <div className="cart-edit-fields">
                  <label>
                    Color
                    <select
                      aria-label={`Color for ${product.name}`}
                      value={line.color}
                      onChange={(e) =>
                        editLine(line, {
                          color: e.target.value,
                          size: line.size,
                          width: line.width,
                        })
                      }
                    >
                      {product.colors.map((c) => (
                        <option key={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    US size
                    <select
                      aria-label={`Size for ${product.name}`}
                      value={line.size}
                      onChange={(e) =>
                        editLine(line, {
                          color: line.color,
                          size: e.target.value,
                          width: line.width,
                        })
                      }
                    >
                      {product.variants
                        .find((v) => v.id === line.variantId)
                        ?.sizes.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                    </select>
                  </label>
                  <label>
                    Width
                    <select
                      aria-label={`Width for ${product.name}`}
                      value={line.width}
                      onChange={(e) =>
                        editLine(line, {
                          color: line.color,
                          size: line.size,
                          width: e.target.value,
                        })
                      }
                    >
                      {product.variants
                        .find((v) => v.id === line.variantId)
                        ?.widths.map((w) => (
                          <option key={w}>{w}</option>
                        ))}
                    </select>
                  </label>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    marginTop: "14px",
                  }}
                >
                  {/* Quantity controls */}
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      border: "1px solid var(--border-strong)",
                      borderRadius: "var(--radius-sm)",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => updateQuantity(line, line.quantity - 1)}
                      style={{
                        padding: "4px 10px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span
                      style={{
                        padding: "4px 10px",
                        fontSize: "0.9rem",
                        fontWeight: 700,
                      }}
                    >
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(line, line.quantity + 1)}
                      style={{
                        padding: "4px 10px",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: 700,
                      }}
                      aria-label="Increase quantity"
                      disabled={line.quantity >= quantityLimit(product, line.variantId)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => remove(line)}
                    className="btn btn-ghost btn-sm"
                    style={{
                      color: "var(--text-tertiary)",
                      padding: "4px 8px",
                    }}
                  >
                    Remove
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      if (!wishlist.includes(product.slug)) toggleWish(product);
                      remove(line);
                    }}
                  >
                    Move to saved
                  </button>
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <span
                  style={{
                    fontSize: "1.2rem",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    display: "block",
                  }}
                >
                  {formatMoney({
                    amount: product.price.amount * line.quantity,
                    currency: "USD",
                  })}
                </span>
                {line.quantity > 1 && (
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--text-tertiary)",
                    }}
                  >
                    {formatMoney(product.price)} each
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Right: Summary box */}
        <aside className="cart-summary-box">
          <h2 style={{ fontSize: "1.3rem", marginBottom: "20px" }}>
            Order Summary
          </h2>

          {/* Coupon form */}
          <div
            style={{
              marginBottom: "20px",
              paddingBottom: "20px",
              borderBottom: "1px solid var(--border-subtle)",
            }}
          >
            {promoCode ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "var(--bg-subtle)",
                  padding: "10px 14px",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: "0.82rem",
                      color: "var(--text-tertiary)",
                    }}
                  >
                    Coupon Applied:
                  </span>
                  <strong
                    style={{ display: "block", color: "var(--brand-cobalt)" }}
                  >
                    {promoCode}
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="btn btn-ghost btn-sm"
                  style={{ color: "var(--brand-coral)", padding: "2px 6px" }}
                >
                  Remove
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleApplyCoupon}
                style={{ display: "flex", gap: "8px" }}
              >
                <input
                  type="text"
                  placeholder="Promo code (try WELCOME10)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="form-input"
                  style={{ padding: "8px 12px", fontSize: "0.88rem" }}
                  aria-label="Promotion code"
                />
                <button type="submit" className="btn btn-secondary btn-sm">
                  Apply
                </button>
              </form>
            )}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              fontSize: "0.95rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Subtotal</span>
              <strong>{formatMoney(totals.subtotal)}</strong>
            </div>

            {totals.discount.amount > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "var(--brand-coral)",
                }}
              >
                <span>Promotion Savings</span>
                <strong>-{formatMoney(totals.discount)}</strong>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Estimated Shipping</span>
              <span>
                {totals.shipping.amount === 0
                  ? "FREE"
                  : formatMoney(totals.shipping)}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Estimated Sales Tax (8.25%)</span>
              <span>{formatMoney(totals.tax)}</span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: "14px",
                borderTop: "1px solid var(--border-subtle)",
                fontSize: "1.2rem",
                fontWeight: 700,
              }}
            >
              <span>Estimated Total</span>
              <span style={{ color: "var(--text-primary)" }}>
                {formatMoney(totals.total)}
              </span>
            </div>
          </div>

          <div style={{ marginTop: "24px" }}>
            <Link href="/checkout" className="btn btn-primary btn-wide btn-lg">
              Proceed to Demo Checkout →
            </Link>
          </div>

          <div
            style={{
              marginTop: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              fontSize: "0.78rem",
              color: "var(--text-tertiary)",
              textAlign: "center",
            }}
          >
            <span>Demo checkout — no payment collected</span>
            <span>Shipping, tax and return terms are sample data</span>
          </div>
        </aside>
      </div>
    </main>
  );
}
