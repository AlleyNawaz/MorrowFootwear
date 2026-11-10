"use client";
import Link from "next/link";
import { useState } from "react";
export function StudioFooter() {
  const [sent, setSent] = useState(false);
  return (
    <footer className="studio-footer">
      <div className="studio-footer-top">
        <div>
          <Link href="/" className="studio-logo">
            morrow
          </Link>
          <p className="mt-3 text-xs">A considered step forward.</p>
        </div>
        <nav aria-label="Footer">
          <Link href="/new">Shop</Link>
          <Link href="/running">Running</Link>
          <Link href="/walking">Walking</Link>
          <Link href="/collections/daily-motion">Daily motion</Link>
          <Link href="/collections/outside-lines">Outside the lines</Link>
          <Link href="/collections/court-and-studio">Court & studio</Link>
          <Link href="/#construction">Construction</Link>
          <Link href="/compare">Compare</Link>
          <Link href="/help">Support</Link>
          <Link href="/account">Account demo</Link>
          <Link href="/stores">Stores</Link>
        </nav>
        <div>
          <label htmlFor="dispatch-email">Occasional notes from Morrow</label>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <input
              id="dispatch-email"
              type="email"
              required
              placeholder="Your email"
              aria-describedby="dispatch-status"
            />
            <button type="submit" aria-label="Preview newsletter subscription">
              ↗
            </button>
          </form>
          <p id="dispatch-status" className="studio-footer-note" role="status">
            {sent
              ? "Demo preview complete. No email was stored or sent."
              : "Demo newsletter preview. No messages are sent."}
          </p>
        </div>
      </div>
      <div className="studio-footer-bottom">
        <span>© 2026 Morrow / Fictional concept store</span>
        <div className="flex gap-5 flex-wrap">
          <Link href="/privacy">Privacy</Link>
          <Link href="/cookies">Privacy controls</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/accessibility">Accessibility</Link>
          <Link href="/returns">Returns</Link>
          <Link href="/order-status">Order status</Link>
          <span>US / USD</span>
        </div>
      </div>
    </footer>
  );
}
