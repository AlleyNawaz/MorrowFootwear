"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { useStore } from "@/components/store-provider";
import { products, formatMoney } from "@/lib/catalog";

import { searchProducts } from "@/lib/search";
import { quantityLimit } from "@/lib/cart";

type Panel = "search" | "bag" | "menu";
export function StudioHeader() {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const [panel, setPanel] = useState<Panel>("search");
  const [query, setQuery] = useState("");
  const { lines, wishlist, updateQuantity, remove } = useStore();
  const count = lines.reduce((sum, l) => sum + l.quantity, 0);
  const results = searchProducts(products, query);
  const total = lines.reduce(
    (sum, l) =>
      sum +
      (products.find((p) => p.id === l.productId)?.price.amount ?? 0) *
        l.quantity,
    0,
  );
  useEffect(() => {
    dialog.current?.close();
    document.body.style.overflow = "";
  }, [pathname]);
  useEffect(
    () => () => {
      document.body.style.overflow = "";
    },
    [],
  );
  function open(next: Panel) {
    setPanel(next);
    dialog.current?.showModal();
    document.body.style.overflow = "hidden";
    if (next === "search")
      requestAnimationFrame(() =>
        document.getElementById("studio-query")?.focus(),
      );
  }
  function close() {
    dialog.current?.close();
    document.body.style.overflow = "";
  }
  return (
    <>
      <header className="studio-nav" data-home={pathname === "/"}>
        <Link href="/" className="studio-logo" aria-label="Morrow home">
          <span aria-hidden="true">⌣</span>morrow
        </Link>
        <nav className="studio-links" aria-label="Primary">
          <Link href="/new">Collection</Link>
          <Link href="/#construction">Construction</Link>
          <Link href="/finder">Find your fit</Link>
          <Link href="/journal">Journal</Link>
        </nav>
        <div className="studio-actions">
          <button onClick={() => open("search")} aria-label="Open search">
            <Icon name="search" size={18} />
          </button>
          <Link
            href="/wishlist"
            aria-label={`Wishlist, ${wishlist.length} saved`}
          >
            <Icon name="heart" size={18} />
          </Link>
          <button
            onClick={() => open("bag")}
            aria-label={`Open bag, ${count} items`}
          >
            <Icon name="bag" size={18} />
            <span>{String(count).padStart(2, "0")}</span>
          </button>
          <button
            className="studio-menu-trigger"
            onClick={() => open("menu")}
            aria-label="Open navigation"
          >
            <Icon name="menu" size={18} />
          </button>
        </div>
      </header>
      <dialog
        ref={dialog}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            close();
          }
        }}
        className="studio-dialog"
        data-type={panel}
        onClose={() => {
          document.body.style.overflow = "";
        }}
        onClick={(event) => {
          if (
            event.target === event.currentTarget &&
            event.clientX < event.currentTarget.getBoundingClientRect().left
          )
            close();
        }}
        aria-label={
          panel === "bag"
            ? "Shopping bag"
            : panel === "search"
              ? "Search catalog"
              : "Navigation"
        }
      >
        <div className="studio-dialog-head">
          <h2>
            {panel === "bag"
              ? `Your bag / ${String(count).padStart(2, "0")}`
              : panel === "search"
                ? "Find your next direction."
                : "Explore Morrow"}
          </h2>
          <button onClick={close} aria-label="Close panel">
            ×
          </button>
        </div>
        {panel === "search" && (
          <>
            <label htmlFor="studio-query" className="sr-only">
              Search products or activities
            </label>
            <input
              id="studio-query"
              className="studio-search-input"
              type="search"
              placeholder="A model. A movement."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <p className="mt-5 text-xs" role="status">
              {query ? `${results.length} matching styles` : "The current edit"}
            </p>
            <div className="studio-results">
              {results.map((p) => (
                <Link
                  key={p.slug}
                  href={`/products/${p.slug}`}
                  onClick={close}
                  className="studio-result"
                >
                  <Image
                    src={p.colors[0].image}
                    alt={p.name}
                    width={420}
                    height={320}
                  />
                  <h3>{p.name}</h3>
                  <p>
                    {p.category} / {formatMoney(p.price)}
                  </p>
                </Link>
              ))}
            </div>
            {!results.length && (
              <div className="py-16">
                <p>
                  No styles match that search. Try running, walking, or
                  Daybreak.
                </p>
                <button className="text-control" onClick={() => setQuery("")}>
                  Clear search
                </button>
              </div>
            )}
            <Link
              className="text-control inline-block mt-8"
              href={`/search?q=${encodeURIComponent(query)}`}
              onClick={close}
            >
              Open full search →
            </Link>
          </>
        )}
        {panel === "bag" && (
          <>
            {lines.length ? (
              lines.map((line) => {
                const p = products.find((item) => item.id === line.productId);
                return (
                  p && (
                    <article
                      className="bag-line"
                      key={`${line.variantId}-${line.size}-${line.width}-${line.color}`}
                    >
                      <Image
                        src={
                          p.colors.find((color) => color.name === line.color)
                            ?.image ?? p.colors[0].image
                        }
                        alt=""
                        width={110}
                        height={110}
                      />
                      <div>
                        <Link href={`/products/${p.slug}`} onClick={close}>
                          <h3>{p.name}</h3>
                        </Link>
                        <p>
                          {line.color} / US {line.size} / {line.width}
                        </p>
                        <p>{formatMoney(p.price)}</p>
                        <div aria-label={`Quantity for ${p.name}`}>
                          <button
                            onClick={() =>
                              updateQuantity(
                                line,
                                Math.max(1, line.quantity - 1),
                              )
                            }
                            disabled={line.quantity <= 1}
                            aria-label={`Decrease ${p.name} quantity`}
                          >
                            −
                          </button>
                          <span className="px-3">{line.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                line,
                                Math.min(quantityLimit(p, line.variantId), line.quantity + 1),
                              )
                            }
                            disabled={line.quantity >= quantityLimit(p, line.variantId)}
                            aria-label={`Increase ${p.name} quantity`}
                          >
                            +
                          </button>
                          <button
                            onClick={() => remove(line)}
                            aria-label={`Remove ${p.name}`}
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                );
              })
            ) : (
              <div className="py-16">
                <h3>A little room for possibility.</h3>
                <p className="mt-4">Your bag is empty.</p>
                <Link
                  className="studio-button mt-8"
                  href="/new"
                  onClick={close}
                >
                  Explore the collection ↗
                </Link>
              </div>
            )}
            {lines.length > 0 && (
              <div className="bag-summary">
                <div>
                  <span>Subtotal</span>
                  <strong>
                    {formatMoney({ amount: total, currency: "USD" })}
                  </strong>
                </div>
                <p className="text-xs">
                  Sample pricing. Shipping and taxes shown at demo checkout.
                </p>
                <Link
                  href="/checkout"
                  onClick={close}
                  className="studio-button"
                >
                  Continue to checkout <span>↗</span>
                </Link>
                <Link href="/cart" onClick={close} className="text-control">
                  Edit full bag
                </Link>
              </div>
            )}
          </>
        )}
        {panel === "menu" && (
          <nav className="studio-menu-links" aria-label="All destinations">
            {[
              ["Collection", "/new"],
              ["Running", "/running"],
              ["Walking", "/walking"],
              ["Lifestyle", "/lifestyle"],
              ["Women", "/women"],
              ["Men", "/men"],
              ["Kids", "/kids"],
              ["Find your fit", "/finder"],
              ["Compare", "/compare"],
              ["Journal", "/journal"],
              ["Help", "/help"],
              ["Account", "/account"],
            ].map(([title, href]) => (
              <Link key={href} href={href} onClick={close}>
                {title} ↗
              </Link>
            ))}
          </nav>
        )}
      </dialog>
    </>
  );
}
