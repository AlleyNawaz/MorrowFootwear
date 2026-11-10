"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main-content" className="page container-narrow">
      <p className="eyebrow">A PAUSE, NOT A DEAD END</p>
      <h1>This view couldn’t open.</h1>
      <p role="alert">
        Please retry. Your locally saved bag has not been intentionally cleared.
      </p>
      <button className="btn btn-primary" onClick={reset}>
        Try again
      </button>
      <Link className="btn btn-secondary" href="/help">
        Open help
      </Link>
    </main>
  );
}
