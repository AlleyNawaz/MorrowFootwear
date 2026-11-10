import Link from "next/link";
export const metadata = { title: "Demo privacy notice" };
export default function Page() {
  return (
    <main id="main-content" className="page container-narrow">
      <p className="eyebrow">DEMO NOTICE / LEGAL REVIEW REQUIRED</p>
      <h1>Your information stays in context.</h1>
      <div className="service-surface">
        <h2>Browser storage</h2>
        <p>
          The bag, saved products, searches, comparisons and size preference
          stay in local storage until cleared. Checkout details and sample
          receipts are saved in session storage for this tab. Use fictional
          sample details rather than real personal information.
        </p>
        <h2>No live payments or messages</h2>
        <p>
          No card data is collected. No payment, fulfillment, email, advertising
          or external analytics provider is connected. This notice describes the
          prototype; it is not an approved production privacy policy.
        </p>
        <h2>Clear your data</h2>
        <p>
          Privacy controls clear Morrow’s local shopping data and this tab’s
          demo order and return history. Browser storage controls provide
          another way to remove it.
        </p>
        <Link className="btn btn-primary" href="/cookies">
          Open privacy controls →
        </Link>
      </div>
    </main>
  );
}
