"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Icon } from "./icons";
import { useStore } from "./store-provider";

const NAV_LINKS = [
  { label: "New Arrivals", href: "/new" },
  { label: "Running", href: "/running" },
  { label: "Walking", href: "/walking" },
  { label: "Lifestyle", href: "/lifestyle" },
  { label: "Women", href: "/women" },
  { label: "Men", href: "/men" },
  { label: "Shoe Finder", href: "/finder" },
  { label: "Compare", href: "/compare" },
] as const;

export function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const { lines, wishlist, comparisonSlugs } = useStore();

  const totalCartCount = lines.reduce((sum, item) => sum + item.quantity, 0);

  // Close drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      {showAnnouncement && (
        <div className="announcement-bar" role="region" aria-label="Store Announcement">
          <span>
            Complimentary shipping on orders over $120. Code <strong>WELCOME10</strong> for 10% off.
          </span>
          <button
            className="announcement-close"
            onClick={() => setShowAnnouncement(false)}
            aria-label="Dismiss announcement bar"
          >
            ×
          </button>
        </div>
      )}

      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand-logo" href="/" aria-label="Morrow home">
            <span className="brand-mark">⌣</span>
            <span>MORROW</span>
          </Link>

          <nav className="desktop-nav" aria-label="Primary navigation">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="nav-link">
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <Link href="/search" className="action-btn" aria-label="Search shoes and activities">
              <Icon name="search" size={20} />
            </Link>

            <Link href="/compare" className="action-btn" aria-label={`Compare ${comparisonSlugs.length} shoes`}>
              <Icon name="sliders" size={20} />
              {comparisonSlugs.length > 0 && <span className="action-counter">{comparisonSlugs.length}</span>}
            </Link>

            <Link href="/wishlist" className="action-btn" aria-label={`Saved items (${wishlist.length})`}>
              <Icon name="heart" size={20} />
              {wishlist.length > 0 && <span className="action-counter">{wishlist.length}</span>}
            </Link>

            <Link href="/cart" className="action-btn" aria-label={`Shopping bag with ${totalCartCount} items`}>
              <Icon name="bag" size={20} />
              {totalCartCount > 0 && <span className="action-counter">{totalCartCount}</span>}
            </Link>

            <button
              className="action-btn mobile-menu-toggle"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open mobile navigation menu"
              aria-expanded={drawerOpen}
            >
              <Icon name="menu" size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`drawer-backdrop ${drawerOpen ? "open" : ""}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden={!drawerOpen}
      >
        <div
          className="drawer-panel"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          <div className="drawer-header">
            <Link className="brand-logo" href="/" onClick={() => setDrawerOpen(false)}>
              <span className="brand-mark">⌣</span>
              <span>MORROW</span>
            </Link>
            <button
              className="action-btn"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close navigation menu"
            >
              <Icon name="close" size={22} />
            </button>
          </div>

          <p className="eyebrow">EXPLORE FOOTWEAR</p>
          <nav className="drawer-nav">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setDrawerOpen(false)}>
                <span>{link.label}</span>
                <Icon name="arrow" size={18} />
              </Link>
            ))}
          </nav>

          <div style={{ marginTop: "auto", paddingTop: "32px", borderTop: "1px solid var(--border-subtle)" }}>
            <p className="eyebrow">CUSTOMER CARE</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.95rem" }}>
              <Link href="/order-status" onClick={() => setDrawerOpen(false)}>Track an Order</Link>
              <Link href="/returns" onClick={() => setDrawerOpen(false)}>Returns & Exchanges</Link>
              <Link href="/size-guide" onClick={() => setDrawerOpen(false)}>Size & Fit Guide</Link>
              <Link href="/stores" onClick={() => setDrawerOpen(false)}>Store Locator</Link>
              <Link href="/help" onClick={() => setDrawerOpen(false)}>Help Center</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
