"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { products, formatMoney } from "@/lib/catalog";
import { calculateOrderTotals } from "@/lib/promotions";
import {
  addressSchema,
  createDemoOrder,
  type DemoAddress,
} from "@/lib/demo-orders";
import { useStore } from "./store-provider";
export { OrderStatus, ReturnStart } from "./order-experience";

const sampleAddress: DemoAddress = {
  email: "guest@example.com",
  name: "Demo Guest",
  street: "123 Sample Street",
  city: "New York",
  state: "NY",
  postal: "10001",
};
export function Checkout() {
  const router = useRouter();
  const { lines, promoCode, clearCart } = useStore();
  const [step, setStep] = useState(0),
    [address, setAddress] = useState<DemoAddress | null>(null),
    [shipping, setShipping] = useState<"standard" | "express">("standard"),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const submissionRef = useRef<string | null>(null);
  const totals = calculateOrderTotals(lines, products, promoCode, shipping);
  function submitAddress(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const result = addressSchema.safeParse(data);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Check the address fields.");
      return;
    }
    setAddress(result.data);
    setError("");
    setStep(1);
  }
  function complete() {
    if (submissionRef.current || !address) return;
    const id = crypto.randomUUID();
    submissionRef.current = id;
    setBusy(true);
    setError("");
    try {
      createDemoOrder(lines, address, promoCode, shipping, id);
      clearCart();
      router.push(`/order-confirmation/${id}`);
    } catch (err) {
      submissionRef.current = null;
      setBusy(false);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save this sample order. Your bag has been preserved.",
      );
    }
  }
  if (!lines.length && !busy)
    return (
      <main id="main-content" className="page container-narrow">
        <h1>Your bag is empty</h1>
        <p>Add a size and color before checkout.</p>
        <Link href="/new" className="btn btn-primary">
          Explore the collection
        </Link>
      </main>
    );
  return (
    <main id="main-content" className="page container-narrow">
      <p className="eyebrow">GUEST CHECKOUT / DEMO ONLY</p>
      <h1>A considered next step.</h1>
      <p>
        No charge, email or shipment. Use sample details: information is stored
        only in this tab until it closes.
      </p>
      <ol className="checkout-steps" aria-label="Checkout progress">
        {["Contact & address", "Delivery", "Review & simulation"].map(
          (label, i) => (
            <li key={label} aria-current={i === step ? "step" : undefined}>
              {i + 1}. {label}
            </li>
          ),
        )}
      </ol>
      {error && (
        <p className="service-alert" role="alert">
          {error}
        </p>
      )}
      {step === 0 && (
        <form
          ref={formRef}
          onSubmit={submitAddress}
          className="service-surface"
        >
          <h2>Contact and address</h2>
          <p>US demo only. Manual entry is always available.</p>
          <button
            type="button"
            className="text-control"
            onClick={() => {
              const form = formRef.current;
              if (!form) return;
              Object.entries(sampleAddress).forEach(([key, value]) => {
                const input = form.elements.namedItem(key);
                if (input instanceof HTMLInputElement) input.value = value;
              });
            }}
          >
            Use sample details
          </button>
          {(
            [
              {
                key: "email",
                label: "Email address",
                type: "email",
                auto: "email",
              },
              {
                key: "name",
                label: "Recipient name",
                type: "text",
                auto: "name",
              },
              {
                key: "street",
                label: "Street address",
                type: "text",
                auto: "street-address",
              },
              {
                key: "city",
                label: "City",
                type: "text",
                auto: "address-level2",
              },
              {
                key: "state",
                label: "State",
                type: "text",
                auto: "address-level1",
              },
              {
                key: "postal",
                label: "ZIP code",
                type: "text",
                auto: "postal-code",
              },
            ] as const
          ).map((field) => (
            <div className="form-group" key={field.key}>
              <label htmlFor={field.key} className="form-label">
                {field.label}
              </label>
              <input
                id={field.key}
                name={field.key}
                type={field.type}
                autoComplete={field.auto}
                defaultValue={address?.[field.key] ?? ""}
                required
                maxLength={field.key === "email" ? 254 : 160}
                className="form-input"
              />
            </div>
          ))}
          <button className="btn btn-primary btn-wide">
            Continue to delivery
          </button>
        </form>
      )}
      {step === 1 && (
        <div className="service-surface">
          <h2>Delivery simulation</h2>
          <fieldset>
            <legend>Choose a sample method</legend>
            <label className="return-choice">
              <input
                type="radio"
                name="shipping"
                checked={shipping === "standard"}
                onChange={() => setShipping("standard")}
              />
              Standard — sample fee {totals.freeShippingQualified ? "$0" : "$8"}
            </label>
            <label className="return-choice">
              <input
                type="radio"
                name="shipping"
                checked={shipping === "express"}
                onChange={() => setShipping("express")}
              />
              Express — sample fee $18
            </label>
          </fieldset>
          <p>No carrier or delivery-date service is connected.</p>
          <button onClick={() => setStep(0)} className="btn btn-secondary">
            Edit address
          </button>
          <button onClick={() => setStep(2)} className="btn btn-primary">
            Review sample order
          </button>
        </div>
      )}
      {step === 2 && (
        <div className="service-surface">
          <h2>Review before simulation</h2>
          <p>
            {address?.name} · {address?.email}
            <br />
            {address?.street}, {address?.city}, {address?.state}{" "}
            {address?.postal}
          </p>
          {lines.map((line) => (
            <div className="receipt-line" key={JSON.stringify(line)}>
              <span>
                {products.find((p) => p.id === line.productId)?.name}
                <br />
                {line.color} / US {line.size} / {line.width}
              </span>
              <span>Quantity {line.quantity}</span>
            </div>
          ))}
          <dl className="service-facts">
            {(
              ["subtotal", "discount", "shipping", "tax", "total"] as const
            ).map((key) => (
              <div key={key}>
                <dt>{key === "tax" ? "Sample tax (8.25%)" : key}</dt>
                <dd>{formatMoney(totals[key])}</dd>
              </div>
            ))}
          </dl>
          <p>
            No card details are requested. This saves a sample receipt, not a
            real purchase.
          </p>
          <button
            onClick={() => setStep(1)}
            disabled={busy}
            className="btn btn-secondary"
          >
            Edit delivery
          </button>
          <button
            onClick={complete}
            disabled={busy}
            className="btn btn-primary"
          >
            {busy ? "Saving sample order…" : "Place demo order"}
          </button>
        </div>
      )}
    </main>
  );
}
