"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type PointerEvent } from "react";

export function CinematicHero() {
  const stage = useRef<HTMLElement>(null);

  function handlePointer(event: PointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    stage.current?.style.setProperty("--look-x", `${x * 10}deg`);
    stage.current?.style.setProperty("--look-y", `${y * -7}deg`);
    stage.current?.style.setProperty("--light-x", `${50 + x * 22}%`);
    stage.current?.style.setProperty("--light-y", `${50 + y * 18}%`);
  }

  function resetPointer() {
    stage.current?.style.setProperty("--look-x", "0deg");
    stage.current?.style.setProperty("--look-y", "0deg");
  }

  return (
    <section ref={stage} className="cinema-hero" onPointerMove={handlePointer} onPointerLeave={resetPointer} aria-labelledby="cinema-title">
      <div className="cinema-media" aria-hidden="true">
        <Image src="/images/morrow-cinematic.png" alt="" fill priority sizes="100vw" />
      </div>
      <div className="cinema-vignette" aria-hidden="true" />
      <div className="cinema-grain" aria-hidden="true" />
      <div className="cinema-orbit cinema-orbit-one" aria-hidden="true" />
      <div className="cinema-orbit cinema-orbit-two" aria-hidden="true" />
      <div className="cinema-copy">
        <p className="cinema-kicker"><span>01</span> DAYBREAK SERIES · DEMO CONCEPT</p>
        <h1 id="cinema-title"><span>OWN</span><span>THE NEXT</span><span>STEP.</span></h1>
        <p className="cinema-lede">A footwear concept for motion without noise. Precise. Grounded. Made for whatever comes after now.</p>
        <div className="cinema-actions">
          <Link href="/products/daybreak-one" className="cinema-primary">Enter Daybreak <span>↗</span></Link>
          <Link href="/new" className="cinema-secondary">Explore all shoes</Link>
        </div>
      </div>
      <div className="cinema-spec" aria-label="Sample product summary">
        <div><span>FEEL</span><strong>Responsive</strong></div>
        <div><span>USE</span><strong>Daily miles</strong></div>
        <div><span>STATUS</span><strong>Sample data</strong></div>
      </div>
      <div className="cinema-scroll" aria-hidden="true"><span /> SCROLL TO DISCOVER</div>
    </section>
  );
}
