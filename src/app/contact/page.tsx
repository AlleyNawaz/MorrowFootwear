"use client";

import { useState, type FormEvent } from "react";
import { useToast } from "@/components/toast";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("Sizing & Fit Recommendation");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || !message.trim()) return;
    setSent(true);
    showToast("Message sent to Morrow Concierge. We respond within 4 hours. ⌣");
  };

  return (
    <main id="main-content" className="page container-narrow">
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <p className="eyebrow">DIRECT CONCIERGE</p>
        <h1>Contact Morrow Fit Specialists</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "8px" }}>
          Have a question about arch support, marathon training models, or international delivery? We&apos;re here.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
        <div style={{ padding: "24px", background: "var(--bg-surface)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)" }}>
          <strong style={{ fontSize: "1.1rem", display: "block", marginBottom: "6px" }}>Email Concierge</strong>
          <p style={{ fontSize: "0.9rem", color: "var(--brand-cobalt)", fontWeight: 600 }}>concierge@morrow.example</p>
          <span style={{ fontSize: "0.82rem", color: "var(--text-tertiary)" }}>Average response time: &lt; 4 hours</span>
        </div>

        <div style={{ padding: "24px", background: "var(--bg-surface)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)" }}>
          <strong style={{ fontSize: "1.1rem", display: "block", marginBottom: "6px" }}>Phone Support</strong>
          <p style={{ fontSize: "0.9rem", color: "var(--text-primary)", fontWeight: 600 }}>+1 (800) 555-0199</p>
          <span style={{ fontSize: "0.82rem", color: "var(--text-tertiary)" }}>Mon – Fri, 9am – 6pm EST</span>
        </div>
      </div>

      <div style={{ background: "var(--bg-surface)", padding: "36px", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-subtle)", boxShadow: "var(--shadow-sm)" }}>
        {sent ? (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <span style={{ fontSize: "2.5rem", color: "var(--brand-smile)", display: "block", marginBottom: "12px" }}>⌣</span>
            <h2>Message Received</h2>
            <p style={{ color: "var(--text-secondary)", maxWidth: "420px", margin: "8px auto 24px" }}>
              Thank you for reaching out, {name}. A Morrow fit advisor will email you at {email} promptly.
            </p>
            <button type="button" onClick={() => setSent(false)} className="btn btn-secondary btn-sm">
              Send Another Note
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2 style={{ fontSize: "1.3rem", marginBottom: "20px" }}>Send Us a Note</h2>

            <div className="form-group">
              <label className="form-label" htmlFor="contact-name">Your Full Name</label>
              <input
                id="contact-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="contact-email">Email Address</label>
              <input
                id="contact-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="contact-cat">Subject / Category</label>
              <select
                id="contact-cat"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-select"
              >
                <option>Sizing & Fit Recommendation</option>
                <option>Order Tracking & Shipping</option>
                <option>Returns & Exchanges</option>
                <option>Retail Store Fitting Appointment</option>
                <option>Wholesale or Media Inquiry</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="contact-msg">How can we assist you?</label>
              <textarea
                id="contact-msg"
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="form-textarea"
                placeholder="Include foot measurements, terrain types, or any order numbers..."
              />
            </div>

            <button type="submit" className="btn btn-primary btn-wide btn-lg">
              Send Message to Concierge →
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
