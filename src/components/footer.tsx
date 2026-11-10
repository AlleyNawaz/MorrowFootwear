"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Icon } from "./icons";
import { useToast } from "./toast";

const FOOTER_GROUPS = {
  Shop: [
    { label: "New Arrivals", href: "/new" },
    { label: "Running Shoes", href: "/running" },
    { label: "Walking & Comfort", href: "/walking" },
    { label: "Lifestyle & Casual", href: "/lifestyle" },
    { label: "Women's Range", href: "/women" },
    { label: "Men's Range", href: "/men" },
    { label: "Shoe Finder Quiz", href: "/finder" },
    { label: "Model Comparison", href: "/compare" },
  ],
  Services: [
    { label: "Track Your Order", href: "/order-status" },
    { label: "Returns & Exchanges", href: "/returns" },
    { label: "Size & Fit Guide", href: "/size-guide" },
    { label: "Flagship Stores", href: "/stores" },
    { label: "Help & FAQ Center", href: "/help" },
    { label: "Contact Concierge", href: "/contact" },
  ],
  Editorial: [
    { label: "About Morrow", href: "/about" },
    { label: "The Journal", href: "/journal" },
    { label: "Shoe Rotation Guide", href: "/journal/daily-rotation-guide" },
    { label: "Midsole Foam Science", href: "/journal/midsole-foam-anatomy" },
    { label: "2026 Material Report", href: "/responsibility" },
  ],
  Legal: [
    { label: "Accessibility Policy", href: "/accessibility" },
    { label: "Privacy Notice", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const { showToast } = useToast();

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSubscribed(true);
    showToast("Welcome to Morrow Dispatch. We send good notes, occasionally. ⌣");
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-mission">
            <Link className="brand-logo" href="/" style={{ color: "#fff" }}>
              <span className="brand-mark">⌣</span>
              <span>MORROW</span>
            </Link>
            <h2>Keep moving. Keep it yours.</h2>
            <p>
              Original fictional performance and daily footwear concepts,
              anatomical arches, and circular material commitments.
            </p>
          </div>

          <div className="footer-newsletter">
            <h3 style={{ color: "#fff", fontSize: "1.1rem", fontFamily: "var(--font-display)" }}>
              The Morrow Dispatch
            </h3>
            <p style={{ fontSize: "0.9rem", marginTop: "6px" }}>
              Thoughtful footwear research, new drops, and community run stories. No spam.
            </p>

            {subscribed ? (
              <div
                style={{
                  background: "rgba(255,255,255,0.1)",
                  padding: "12px 18px",
                  borderRadius: "var(--radius-md)",
                  marginTop: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "#fff",
                }}
              >
                <Icon name="check" size={18} />
                <span>You’re on the list! Welcome to Morrow.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe}>
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  style={{
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    color: "#fff",
                  }}
                  aria-label="Email address for newsletter"
                />
                <button type="submit" className="btn btn-coral">
                  Join
                </button>
              </form>
            )}
            <p style={{ fontSize: "0.75rem", marginTop: "8px", color: "#6d7180" }}>
              Demo store. By submitting, you simulate joining our community list.
            </p>
          </div>
        </div>

        <div className="footer-links-grid">
          {Object.entries(FOOTER_GROUPS).map(([category, links]) => (
            <div key={category} className="footer-column">
              <h3>{category}</h3>
              <ul>
                {links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <p>© 2026 Morrow Footwear Co. All rights reserved. Designed for joyful movement.</p>
          <div style={{ display: "flex", gap: "20px" }}>
            <span>United States · USD ($)</span>
            <span>English (US)</span>
            <span>WCAG 2.2 AA Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
