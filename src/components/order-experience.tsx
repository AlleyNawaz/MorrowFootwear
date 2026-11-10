"use client";
import Link from "next/link";
import { useMemo, useState, useSyncExternalStore, type FormEvent } from "react";
import {
  ORDER_EVENT,
  orderSnapshot,
  parseOrders,
  findDemoOrder,
  requestDemoReturn,
  saveOrders,
  type DemoOrder,
} from "@/lib/demo-orders";
import { formatMoney } from "@/lib/catalog";

function subscribe(callback: () => void) {
  window.addEventListener(ORDER_EVENT, callback);
  return () => window.removeEventListener(ORDER_EVENT, callback);
}
function snapshot() {
  try {
    return orderSnapshot();
  } catch {
    return null;
  }
}
export function useDemoOrders() {
  const raw = useSyncExternalStore(subscribe, snapshot, () => null);
  return useMemo(() => parseOrders(raw), [raw]);
}
export function OrderReceipt({ order }: { order: DemoOrder }) {
  return (
    <div className="service-surface">
      <p className="eyebrow">SAMPLE ORDER / {order.number}</p>
      <h2>Saved in this tab.</h2>
      <p>
        No payment, email or shipment was created. Closing this tab ends this
        demo session.
      </p>
      <dl className="service-facts">
        <div>
          <dt>Contact</dt>
          <dd>{order.address.email}</dd>
        </div>
        <div>
          <dt>Recipient</dt>
          <dd>{order.address.name}</dd>
        </div>
        <div>
          <dt>Delivery address</dt>
          <dd>
            {order.address.street}, {order.address.city}, {order.address.state}{" "}
            {order.address.postal}
          </dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>
            {order.returnRequest
              ? "Demo return requested"
              : "Demo order recorded — not fulfilled"}
          </dd>
        </div>
      </dl>
      {order.lines.map((line) => (
        <div className="receipt-line" key={line.key}>
          <div>
            <Link href={`/products/${line.slug}`}>{line.name}</Link>
            <p>
              {line.color} · US {line.size} · {line.width} · Quantity{" "}
              {line.quantity}
            </p>
          </div>
          <strong>
            {formatMoney({
              amount: line.unitPrice * line.quantity,
              currency: "USD",
            })}
          </strong>
        </div>
      ))}
      <dl className="service-facts">
        {Object.entries(order.totals).map(([label, value]) => (
          <div key={label}>
            <dt>
              {label === "tax"
                ? "Sample tax"
                : label === "shipping"
                  ? "Sample shipping"
                  : label}
            </dt>
            <dd>{formatMoney(value)}</dd>
          </div>
        ))}
      </dl>
      <Link href="/returns/start" className="text-control">
        Start a demo return →
      </Link>
    </div>
  );
}
export function Confirmation({ id }: { id: string }) {
  const order = useDemoOrders().find((o) => o.id === id);
  return (
    <main id="main-content" className="page container-narrow">
      <p className="eyebrow">DEMO CHECKOUT</p>
      <h1>
        {order ? "Your sample order is saved." : "No order found in this tab."}
      </h1>
      {order ? (
        <OrderReceipt order={order} />
      ) : (
        <p>
          This reference does not match this browser session. No payment was
          taken. Return to your bag to try again.
        </p>
      )}
      <Link href="/account/orders" className="btn btn-secondary">
        View demo orders
      </Link>
      <Link href="/new" className="btn btn-primary">
        Continue exploring
      </Link>
    </main>
  );
}
export function OrderLookup({
  onFound,
}: {
  onFound: (order: DemoOrder) => void;
}) {
  const [error, setError] = useState("");
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const order = findDemoOrder(
      String(data.get("number")),
      String(data.get("email")),
    );
    if (order) {
      setError("");
      onFound(order);
    } else
      setError(
        "No matching order in this tab. Check both fields or complete demo checkout first.",
      );
  }
  return (
    <form onSubmit={submit} className="service-surface">
      <p>
        Use the reference and email from a demo order created in this tab. This
        is not real customer authentication.
      </p>
      <label className="form-label" htmlFor="order-number">
        Order number
      </label>
      <input
        id="order-number"
        name="number"
        required
        className="form-input"
        placeholder="MOR-XXXXXXXX"
      />
      <label className="form-label" htmlFor="order-email">
        Order email
      </label>
      <input
        id="order-email"
        name="email"
        type="email"
        required
        className="form-input"
      />
      {error && <p role="alert">{error}</p>}
      <button className="btn btn-primary">Find demo order</button>
    </form>
  );
}
export function OrderStatus() {
  const [order, setOrder] = useState<DemoOrder | null>(null);
  return (
    <main id="main-content" className="page container-narrow">
      <p className="eyebrow">AFTER YOUR NEXT STEP</p>
      <h1>Order status</h1>
      <OrderLookup onFound={setOrder} />
      {order && <OrderReceipt order={order} />}
      <Link href="/account/orders">View this tab’s demo history →</Link>
    </main>
  );
}
export function ReturnStart() {
  const [order, setOrder] = useState<DemoOrder | null>(null);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!order) return;
    const data = new FormData(e.currentTarget);
    const resolution = data.get("resolution");
    if (
      resolution !== "refund" &&
      resolution !== "exchange_size" &&
      resolution !== "exchange_color"
    )
      return;
    try {
      requestDemoReturn(
        order.id,
        data.getAll("item").map(String),
        String(data.get("reason")),
        resolution,
      );
      setDone(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save. Please try again.",
      );
    }
  }
  return (
    <main id="main-content" className="page container-narrow">
      <p className="eyebrow">DEMO RETURNS / NO PARCEL REQUIRED</p>
      <h1>{done ? "Demo return requested." : "Find the right resolution."}</h1>
      <p>
        No real return, refund, exchange or shipping label is created. Do not
        send any products.
      </p>
      {done ? (
        <div className="service-surface" role="status">
          <h2>Request saved in this tab.</h2>
          <p>
            The sample status is “requested”, not approved. You can review it in
            your demo history.
          </p>
          <Link href="/account/returns" className="btn btn-primary">
            View return history
          </Link>
        </div>
      ) : !order ? (
        <OrderLookup onFound={setOrder} />
      ) : (
        <form className="service-surface" onSubmit={submit}>
          <h2>{order.number}</h2>
          <fieldset>
            <legend>Select items</legend>
            {order.lines.map((line) => (
              <label className="return-choice" key={line.key}>
                <input name="item" type="checkbox" value={line.key} />
                {line.name} · {line.color} · US {line.size} · {line.width}
              </label>
            ))}
          </fieldset>
          <label className="form-label" htmlFor="reason">
            Reason
          </label>
          <select id="reason" name="reason" className="form-select">
            <option>Size feels too small</option>
            <option>Size feels too large</option>
            <option>Color or style</option>
            <option>Damaged item</option>
            <option>Other</option>
          </select>
          <label className="form-label" htmlFor="resolution">
            Preferred resolution (demo)
          </label>
          <select id="resolution" name="resolution" className="form-select">
            <option value="refund">Refund</option>
            <option value="exchange_size">Size exchange</option>
            <option value="exchange_color">Color exchange</option>
          </select>
          {error && <p role="alert">{error}</p>}
          <button className="btn btn-primary">Save demo return request</button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setOrder(null)}
          >
            Change order
          </button>
        </form>
      )}
    </main>
  );
}
export function DemoAccount({
  returnsOnly = false,
}: {
  returnsOnly?: boolean;
}) {
  const orders = useDemoOrders();
  const [message, setMessage] = useState("");
  const items = returnsOnly ? orders.filter((o) => o.returnRequest) : orders;
  return (
    <main id="main-content" className="page container-narrow">
      <p className="eyebrow">YOUR MORROW SPACE / LOCAL DEMO</p>
      <h1>{returnsOnly ? "Return history" : "Your demo account"}</h1>
      <p>
        No login credentials are collected. This workspace shows only orders
        stored in the current tab; it is not a secure customer account.
      </p>
      <nav className="service-nav" aria-label="Account">
        <Link href="/account">Overview</Link>
        <Link href="/account/orders">Orders</Link>
        <Link href="/account/returns">Returns</Link>
        <Link href="/account/profile">Profile & export</Link>
        <Link href="/account/addresses">Addresses</Link>
        <Link href="/account/preferences">Preferences</Link>
        <Link href="/wishlist">Saved items</Link>
        <Link href="/cookies">Privacy controls</Link>
      </nav>
      <p role="status">{message}</p>
      {items.length ? (
        items.map((o) => <OrderReceipt key={o.id} order={o} />)
      ) : (
        <div className="service-surface">
          <h2>
            {returnsOnly
              ? "No return requests yet."
              : "Your story starts with a pair."}
          </h2>
          <p>Complete a demo checkout to see an order here.</p>
          <Link href="/new" className="btn btn-primary">
            Explore the collection
          </Link>
        </div>
      )}
      {orders.length > 0 && (
        <button
          className="btn btn-secondary"
          onClick={() => {
            try {
              saveOrders([]);
              setMessage("Demo order and return history cleared.");
            } catch {
              setMessage(
                "Storage unavailable. Close this tab to end the session.",
              );
            }
          }}
        >
          Clear demo order history
        </button>
      )}
    </main>
  );
}
