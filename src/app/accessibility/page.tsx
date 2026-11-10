import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility Statement (WCAG 2.2 AA)",
  description: "Morrow commitment to universal digital accessibility, keyboard navigation, screen reader support, and color contrast compliance.",
};

export default function AccessibilityPage() {
  return (
    <main id="main-content" className="page container-narrow">
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <p className="eyebrow">DIGITAL INCLUSION</p>
        <h1>Accessibility Statement</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "8px" }}>
          We believe joyful movement and digital shopping should be universally accessible to all people.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "32px", fontSize: "1.05rem", lineHeight: 1.8, color: "var(--text-secondary)" }}>
        <section>
          <h2 style={{ color: "var(--text-primary)", fontSize: "1.4rem", marginBottom: "12px" }}>
            Conformance Standard: WCAG 2.2 Level AA
          </h2>
          <p>
            The Morrow website is engineered to conform with the Web Content Accessibility Guidelines (WCAG) 2.2 at Level AA. We evaluate our codebase continually using automated linting, keyboard-only tab testing, voice screen reader traversal (macOS VoiceOver and NVDA), and color contrast ratios of at least 4.5:1 for normal text and 3:1 for large display elements.
          </p>
        </section>

        <section style={{ background: "var(--bg-surface)", padding: "32px", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-subtle)" }}>
          <h2 style={{ color: "var(--text-primary)", fontSize: "1.3rem", marginBottom: "16px" }}>
            Implemented Accessibility Features
          </h2>
          <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <li>
              <strong>Skip Navigation:</strong> A visible &ldquo;Skip to main content&rdquo; link is accessible immediately on the first keyboard Tab press.
            </li>
            <li>
              <strong>Keyboard Operability:</strong> All interactive elements (menus, filter drawers, galleries, size selectors, cart items) are fully focusable and operable without mouse dependency.
            </li>
            <li>
              <strong>Visible Focus Rings:</strong> High-contrast focus rings (`:focus-visible`) ensure clear visual indicators without being obscured by sticky elements.
            </li>
            <li>
              <strong>Semantic Landmarks:</strong> Proper HTML5 landmark regions (`header`, `nav`, `main`, `footer`, `section`, `article`) facilitate structured screen reader traversal.
            </li>
            <li>
              <strong>Alternative Text:</strong> Descriptive, meaningful alternative text is provided for all product media; decorative elements utilize empty alt attributes (`alt=&quot;&quot;`) or `aria-hidden=&quot;true&quot;`.
            </li>
            <li>
              <strong>Reduced Motion Respect:</strong> We honor `prefers-reduced-motion` browser and OS settings by disabling non-essential transitions and animations.
            </li>
          </ul>
        </section>

        <section>
          <h2 style={{ color: "var(--text-primary)", fontSize: "1.4rem", marginBottom: "12px" }}>
            Feedback & Accessibility Assistance
          </h2>
          <p>
            If you encounter any barrier while browsing Morrow or require assistance completing an order, our accessibility team is ready to support you.
          </p>
          <p style={{ marginTop: "10px" }}>
            Email our coordinator directly at: <strong style={{ color: "var(--brand-cobalt)" }}>accessibility@morrow.example</strong>
          </p>
        </section>
      </div>
    </main>
  );
}
