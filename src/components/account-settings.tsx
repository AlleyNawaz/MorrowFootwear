"use client";
import Link from "next/link";
import { useState } from "react";
import { useStore } from "./store-provider";
import { useDemoOrders } from "./order-experience";
export function AccountSettings({
  section,
}: {
  section: "profile" | "addresses" | "preferences";
}) {
  const { hydrated, sizeSystem, setSizeSystem } = useStore();
  const orders = useDemoOrders();
  const [message, setMessage] = useState("");
  return (
    <main id="main-content" className="page container-narrow">
      <Link href="/account">← Account demo</Link>
      <p className="eyebrow">LOCAL WORKSPACE / NO AUTHENTICATION</p>
      <h1>
        {section === "addresses"
          ? "Demo addresses"
          : section === "preferences"
            ? "Your preferences"
            : "Profile and data"}
      </h1>
      <div className="service-surface">
        {section === "addresses" ? (
          <>
            <p>
              Addresses below belong to sample receipts in this tab. Edit
              delivery details during each checkout; no server address book is
              connected.
            </p>
            {orders.length ? (
              orders.map((o) => (
                <p key={o.id}>
                  {o.address.name}
                  <br />
                  {o.address.street}, {o.address.city}, {o.address.state}{" "}
                  {o.address.postal}
                </p>
              ))
            ) : (
              <p>No sample addresses yet.</p>
            )}
          </>
        ) : (
          <>
            <label className="form-label" htmlFor="preferred-size">
              Preferred size system
            </label>
            <select
              className="form-select"
              id="preferred-size"
              disabled={!hydrated}
              value={sizeSystem}
              onChange={(e) => {
                const value = e.target.value;
                if (
                  value === "US" ||
                  value === "UK" ||
                  value === "EU" ||
                  value === "CM"
                ) {
                  setSizeSystem(value);
                  setMessage("Size preference saved in this browser.");
                }
              }}
            >
              {["US", "UK", "EU", "CM"].map((system) => (
                <option key={system}>{system}</option>
              ))}
            </select>
            <p>
              Catalog transactions use US sizes internally. Product selection
              uses your display preference.
            </p>
            <button
              className="btn btn-secondary"
              onClick={() => {
                const blob = new Blob(
                  [JSON.stringify({ sizeSystem, orders }, null, 2)],
                  { type: "application/json" },
                );
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "morrow-demo-data.json";
                link.click();
                setTimeout(() => URL.revokeObjectURL(url), 1000);
                setMessage("Demo data export prepared.");
              }}
            >
              Export this tab’s demo data
            </button>
            <p role="status">{message}</p>
            <Link href="/cookies">Delete local demo data →</Link>
          </>
        )}
      </div>
    </main>
  );
}
