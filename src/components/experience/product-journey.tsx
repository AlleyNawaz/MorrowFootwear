"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  initialConfiguration,
  materialStories,
  type PartId,
} from "@/data/experience";

const Scene = dynamic(() => import("@/components/three/product-scene"), {
  ssr: false,
});
class SceneBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function ProductJourney() {
  const [view, setView] = useState({ yaw: 0, pitch: 0, zoom: 1 });
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const wake = useRef<() => void>(() => {});
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false),
    [failed, setFailed] = useState(false),
    [enabled, setEnabled] = useState(false),
    [active, setActive] = useState(true),
    [mobile, setMobile] = useState(false);
  const [configuration, setConfiguration] = useState(initialConfiguration),
    [selected, setSelected] = useState<PartId>("whole"),
    [exploded, setExploded] = useState(false),
    [inspect, setInspect] = useState(false),
    [reset, setReset] = useState(0);
  const detail = materialStories.find((p) => p.id === selected);
  useEffect(() => {
    const media = matchMedia("(max-width: 760px)");
    const update = () => setMobile(media.matches);
    update();
    media.addEventListener("change", update);
    const timer = setTimeout(() => {
      try {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("webgl2");
        if (!context) {
          setFailed(true);
          return;
        }
        context.getExtension("WEBGL_lose_context")?.loseContext();
        setEnabled(true);
      } catch {
        setFailed(true);
      }
    }, 0);
    return () => {
      clearTimeout(timer);
      media.removeEventListener("change", update);
    };
  }, []);
  useEffect(() => {
    if (!root.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const trigger = ScrollTrigger.create({
      trigger: root.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        progress.current = self.progress;
        wake.current();
      },
    });
    const observer = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting);
        if (entry.isIntersecting) wake.current();
      },
      { rootMargin: "100px" },
    );
    observer.observe(root.current);
    const visibility = () => {
      setActive(!document.hidden);
      if (!document.hidden) wake.current();
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      trigger.kill();
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  function focus(part: PartId) {
    setSelected(part);
    setInspect(true);
    wake.current();
  }
  function resetView() {
    setView({ yaw: 0, pitch: 0, zoom: 1 });
    setSelected("whole");
    setExploded(false);
    setReset((v) => v + 1);
    setConfiguration(initialConfiguration);
    wake.current();
  }
  return (
    <div className="motion-journey" ref={root}>
      <div className="motion-stage" ref={stage}>
        <div className="stage-axis" aria-hidden="true" />
        <div className="stage-floor" aria-hidden="true" />
        <div className={`stage-poster ${ready && !failed ? "is-ready" : ""}`}>
          <Image
            src="/images/morrow-cinematic.png"
            alt="Daybreak footwear concept in graphite and bone"
            fill
            priority
            sizes="100vw"
          />
        </div>
        <div className="stage-word" aria-hidden="true">
          DAYBREAK
        </div>
        {enabled && !failed && (
          <div className={`stage-canvas ${inspect ? "is-interactive" : ""}`}>
            <SceneBoundary onFailure={() => setFailed(true)}>
              <Scene
                progress={progress}
                wake={wake}
                configuration={configuration}
                selected={selected}
                exploded={exploded}
                inspect={inspect}
                reset={reset}
                view={view}
                reduced={Boolean(reduced)}
                active={active}
                mobile={mobile}
                onSelect={focus}
                onReady={() => setReady(true)}
                onFailure={() => setFailed(true)}
              />
            </SceneBoundary>
          </div>
        )}
        <div className="stage-status">
          <span className={ready && !failed ? "status-dot" : ""} />
          {failed
            ? "STILL VIEW / 3D UNAVAILABLE"
            : ready
              ? "DAYBREAK / LIVE PRODUCT STUDY"
              : "PREPARING THE PRODUCT STUDY"}
        </div>
        <button
          className="stage-inspect"
          onClick={() => setInspect((v) => !v)}
          aria-pressed={inspect}
          disabled={failed}
        >
          {inspect ? "Finish inspection ↗" : "Drag to inspect ↗"}
        </button>
        {inspect && !failed && (
          <div
            className="inspection-tools"
            role="group"
            aria-label="Product view controls"
          >
            <span>Inspect without dragging</span>
            <div>
              <button
                aria-label="Rotate product left"
                onClick={() => setView((v) => ({ ...v, yaw: v.yaw - 0.3 }))}
              >
                ←
              </button>
              <button
                aria-label="Rotate product right"
                onClick={() => setView((v) => ({ ...v, yaw: v.yaw + 0.3 }))}
              >
                →
              </button>
              <button
                aria-label="Tilt product"
                onClick={() =>
                  setView((v) => ({
                    ...v,
                    pitch: v.pitch >= 0.6 ? -0.3 : v.pitch + 0.3,
                  }))
                }
              >
                ↕
              </button>
              <button
                aria-label="Zoom product in"
                disabled={view.zoom >= 1.4}
                onClick={() =>
                  setView((v) => ({ ...v, zoom: Math.min(1.4, v.zoom + 0.1) }))
                }
              >
                ＋
              </button>
              <button
                aria-label="Zoom product out"
                disabled={view.zoom <= 0.7}
                onClick={() =>
                  setView((v) => ({ ...v, zoom: Math.max(0.7, v.zoom - 0.1) }))
                }
              >
                −
              </button>
              <button
                aria-label="Reset product orientation"
                onClick={() => {
                  setView({ yaw: 0, pitch: 0, zoom: 1 });
                  setReset((v) => v + 1);
                }}
              >
                ↺
              </button>
            </div>
          </div>
        )}
      </div>
      <section
        className="journey-chapter chapter-intro"
        aria-labelledby="motion-title"
      >
        <div className="intro-topline">
          <span>PERFORMANCE FOOTWEAR</span>
          <span>STUDY N° 001 — MORROW</span>
        </div>
        <h1 id="motion-title">
          A different
          <br />
          <em>state of motion.</em>
        </h1>
        <div className="intro-bottom">
          <p>
            Considered from every angle.
            <br />
            Ready for your next direction.
          </p>
          <a href="#construction" className="studio-button">
            Explore the construction <span>↓</span>
          </a>
          <span className="intro-index">
            SCROLL TO ENTER
            <br />
            01—06
          </span>
        </div>
      </section>
      <section
        className="journey-chapter chapter-motion"
        aria-labelledby="motion-statement"
      >
        <div className="chapter-label">01 / FORM IN MOTION</div>
        <h2 id="motion-statement">
          Nothing
          <br />
          in the way.
        </h2>
        <p className="chapter-copy">
          A quiet silhouette with a clear purpose. Follow the curve from first
          contact to the next step.
        </p>
        <span className="chapter-coordinate" aria-hidden="true">
          X 034° / Y 012°
        </span>
      </section>
      <section
        className="journey-chapter chapter-construction"
        id="construction"
        aria-labelledby="construction-title"
      >
        <div className="chapter-label">02 / OPEN THE ASSEMBLY</div>
        <h2 id="construction-title">
          Every layer.
          <br />A reason.
        </h2>
        <div className="part-controls" aria-label="Inspect construction">
          {materialStories.map((p) => (
            <button
              key={p.id}
              onClick={() => focus(p.id)}
              aria-pressed={selected === p.id}
            >
              <span>{p.label}</span>
              <strong>{p.id}</strong>
              <i>↗</i>
            </button>
          ))}
        </div>
        <button
          className="text-control"
          onClick={() => {
            setExploded((v) => !v);
            setInspect(true);
          }}
          aria-pressed={exploded}
        >
          {exploded ? "Reassemble product −" : "Separate the components +"}
        </button>
      </section>
      <section
        className="journey-chapter chapter-material"
        aria-labelledby="material-title"
      >
        <div className="chapter-label">03 / CLOSER TO THE SURFACE</div>
        <h2 id="material-title">
          From the
          <br />
          <em>fiber up.</em>
        </h2>
        <p className="chapter-copy">
          Textile, foam, rubber. Distinct surfaces, connected by one form.
        </p>
        <button className="studio-button" onClick={() => focus("upper")}>
          Inspect the textile <span>↗</span>
        </button>
      </section>
      <section
        className="journey-chapter chapter-metrics"
        aria-labelledby="metrics-title"
      >
        <div className="chapter-label">04 / THE DESIGN PARAMETERS</div>
        <h2 id="metrics-title">
          Measured.
          <br />
          Not overstated.
        </h2>
        <dl className="parameter-list">
          <div>
            <dt>INTENDED USE</dt>
            <dd>Daily running</dd>
          </div>
          <div>
            <dt>CONSTRUCTION</dt>
            <dd>Layered</dd>
          </div>
          <div>
            <dt>FEEL</dt>
            <dd>Responsive</dd>
          </div>
        </dl>
        <p className="technical-note">
          Concept specifications. Physical performance testing pending.
        </p>
      </section>
      <section
        className="journey-chapter chapter-configure"
        id="configure"
        aria-labelledby="configure-title"
      >
        <div className="chapter-label">05 / MAKE IT YOURS</div>
        <h2 id="configure-title">
          Your point
          <br />
          of view.
        </h2>
        <div className="configuration-panel" inert={failed}>
          <fieldset>
            <legend>
              Upper / {configuration.upper === "#d4cdbd" ? "Bone" : "Graphite"}
            </legend>
            {[
              ["Bone", "#d4cdbd"],
              ["Graphite", "#454541"],
            ].map(([label, color]) => (
              <button
                key={color}
                className="config-swatch"
                style={{ background: color }}
                aria-label={`${label} upper`}
                aria-pressed={configuration.upper === color}
                onClick={() => {
                  setInspect(true);
                  setConfiguration((c) => ({ ...c, upper: color }));
                }}
              />
            ))}
          </fieldset>
          <fieldset>
            <legend>Heel accent</legend>
            {[
              ["Signal red", "#c62c25"],
              ["Carbon", "#242424"],
              ["Chalk", "#dad5c7"],
            ].map(([label, color]) => (
              <button
                key={color}
                className="config-swatch"
                style={{ background: color }}
                aria-label={`${label} heel accent`}
                aria-pressed={configuration.accent === color}
                onClick={() => {
                  setInspect(true);
                  setConfiguration((c) => ({ ...c, accent: color }));
                }}
              />
            ))}
          </fieldset>
          <fieldset>
            <legend>Midsole</legend>
            <button
              aria-pressed={configuration.sole === "#e5dece"}
              onClick={() =>
                setConfiguration((c) => ({ ...c, sole: "#e5dece" }))
              }
            >
              Bone
            </button>
            <button
              aria-pressed={configuration.sole === "#41413d"}
              onClick={() =>
                setConfiguration((c) => ({ ...c, sole: "#41413d" }))
              }
            >
              Graphite
            </button>
          </fieldset>
          <fieldset>
            <legend>Lacing</legend>
            <button
              aria-pressed={configuration.laces === "cross"}
              onClick={() =>
                setConfiguration((c) => ({ ...c, laces: "cross" }))
              }
            >
              Cross
            </button>
            <button
              aria-pressed={configuration.laces === "straight"}
              onClick={() =>
                setConfiguration((c) => ({ ...c, laces: "straight" }))
              }
            >
              Straight
            </button>
          </fieldset>
          <button className="text-control" onClick={resetView}>
            Reset configuration ↺
          </button>
          <p className="technical-note">
            Visual study only. Shop available catalog variants below.
          </p>
        </div>
        <Link href="/products/daybreak-one" className="studio-button">
          Choose your size <span>↗</span>
        </Link>
      </section>
      <AnimatePresence>
        {detail && (
          <motion.aside
            className="material-panel"
            key={detail.id}
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="region"
            aria-label={`${detail.id} details`}
          >
            <button
              aria-label="Close material details"
              onClick={() => setSelected("whole")}
            >
              ×
            </button>
            <span>{detail.label}</span>
            <h3>{detail.title}</h3>
            <p>{detail.copy}</p>
            <button
              className="text-control"
              onClick={() => {
                setSelected("whole");
                setReset((v) => v + 1);
              }}
            >
              Return to full product ↗
            </button>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}
