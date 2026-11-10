export default function AccountLoading() {
  return (
    <main id="main-content" className="page container-narrow" aria-busy="true">
      <p className="eyebrow">MORROW / PREPARING YOUR VIEW</p>
      <p role="status">Opening the next part of your visit.</p>
      <div
        className="service-surface"
        style={{ minHeight: 320 }}
        aria-hidden="true"
      />
    </main>
  );
}
