"use client";
import Link from "next/link";
import { useRef } from "react";
export function FitDialog() {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button
        type="button"
        className="text-control"
        onClick={() => ref.current?.showModal()}
      >
        Size guide
      </button>
      <dialog ref={ref} className="fit-dialog" aria-labelledby="fit-title">
        <button
          className="btn btn-secondary"
          onClick={() => ref.current?.close()}
          aria-label="Close size guide"
        >
          Close ×
        </button>
        <h2 id="fit-title">Measure before you choose.</h2>
        <p>
          Wear your intended socks. Mark the heel and longest toe on paper,
          measure both feet, and use the longer measurement.
        </p>
        <p>
          US size labels on this sample product use the men’s/unisex scale.
          Width and volume matter as well as length. No fit or medical outcome
          is guaranteed.
        </p>
        <Link href="/size-guide" className="btn btn-primary">
          Open measurement guide →
        </Link>
      </dialog>
    </>
  );
}
