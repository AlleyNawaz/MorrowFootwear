"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { products, formatMoney } from "@/lib/catalog";
import { finderSchema, rankShoes, type FinderAnswers } from "@/lib/finder";
import { finderQuestions } from "@/data/finder";
import { useUrlField } from "./use-url-field";

export function ShoeFinder() {
  const [encoded, setEncoded] = useUrlField("answers", "");
  const [step, setStep] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);
  let answers: FinderAnswers = {};
  try {
    const result = finderSchema.safeParse(JSON.parse(encoded || "{}"));
    if (result.success) answers = result.data;
  } catch { /* Invalid shared answers safely restart the questionnaire. */ }
  const question = finderQuestions[step];
  const recommendations = rankShoes(products, answers);
  useEffect(() => {
    if (moved.current) heading.current?.focus();
  }, [step]);
  function go(next: number) { moved.current = true; setStep(next); }
  return (
    <main id="main-content" className="page container-narrow finder-experience">
      <Link href="/new">← Explore all styles</Link>
      <p className="eyebrow">MORROW / FIND YOUR DIRECTION</p>
      <h1>Shoes for your kind of day.</h1>
      <p className="lede">A few preferences. A smaller selection. Shopping guidance from sample catalog data—not medical advice or a fit guarantee.</p>
      <p role="status">{question ? `Question ${step + 1} of ${finderQuestions.length}` : "Your suggested styles are ready."}</p>
      {question ? (
        <section className="service-surface">
          <h2 ref={heading} tabIndex={-1}>{question.title}</h2>
          <p>{question.description}</p>
          <div className="finder-options" role="group" aria-label={question.title}>
            {question.options.map(option => (
              <button key={option} className="btn btn-secondary" aria-pressed={answers[question.key] === option}
                onClick={() => {
                  setEncoded(JSON.stringify({ ...answers, [question.key]: option }));
                  go(step + 1);
                }}>{option}</button>
            ))}
          </div>
          <nav className="service-nav" aria-label="Finder progress">
            <button className="btn btn-ghost" disabled={step === 0} onClick={() => go(step - 1)}>Back</button>
            <button className="btn btn-ghost" onClick={() => {
              const updated = { ...answers };
              delete updated[question.key];
              setEncoded(JSON.stringify(updated));
              go(step + 1);
            }}>Skip this question</button>
            <button className="btn btn-ghost" onClick={() => { setEncoded(""); go(0); }}>Restart</button>
          </nav>
        </section>
      ) : (
        <section aria-labelledby="finder-results">
          <h2 id="finder-results" ref={heading} tabIndex={-1}>A considered shortlist.</h2>
          <p>Ranked by your selected attributes. No invented match percentages. Only styles with sample availability are included.</p>
          <div className="service-nav">
            <button className="btn btn-secondary" onClick={() => go(0)}>Edit answers</button>
            <button className="btn btn-ghost" onClick={() => { setEncoded(""); go(0); }}>Restart</button>
            <Link className="btn btn-ghost" href="/compare">Compare saved models</Link>
          </div>
          {recommendations.length === 0 && <p>No available sample styles match this catalog. <Link href="/new">Browse all styles</Link>.</p>}
          {recommendations.map(({ product, matches, tradeoffs }) => (
            <article className="finder-result service-surface" key={product.slug}>
              <Image src={product.colors[0].image} alt={`${product.name} concept image`} width={480} height={360} sizes="(max-width: 600px) 100vw, 240px" />
              <div>
                <p className="eyebrow">{product.category} / SAMPLE STYLE</p>
                <h3>{product.name}</h3>
                <p>{matches.length ? `Matches: ${matches.join(", ")}.` : "An alternative to explore; no selected attributes matched."}</p>
                {tradeoffs.length > 0 && <p>Does not match: {tradeoffs.join(", ")}.</p>}
                <p>{product.cushioning} cushioning · {product.support} structure</p>
                <Link className="btn btn-primary" href={`/products/${product.slug}`}>Explore {product.name} — {formatMoney(product.price)}</Link>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
