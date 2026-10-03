"use client";

import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import styles from "./BottomProgressiveBlur.module.css";

type Props = {
  /** Number of stacked blur layers. 6–10 looks smooth; fewer is cheaper. */
  layers?: number;
  /** Approximate blur radius (px) at the very bottom edge. */
  maxBlur?: number;
  /** Subtly expand the blur while scrolling fast. */
  reactToScroll?: boolean;
  /** Optional colour wash that fades in with the blur, e.g. "#fff" or "#000". */
  tint?: string;
  tintOpacity?: number;
  className?: string;
};

/* ---------- static geometry (computed once, SSR-safe) ---------- */

const smoothstep = (t: number) => t * t * (3 - 2 * t);

/**
 * Mask that is transparent until `start`%, eases in to fully opaque at `end`%,
 * and stays opaque to the bottom. The eased stops avoid the visible "kink"
 * a plain two-stop gradient leaves at its edges.
 */
function buildMask(start: number, end: number, steps = 8) {
  const stops: string[] = [];
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    const pos = start + (end - start) * t;
    stops.push(`rgba(0,0,0,${smoothstep(t).toFixed(3)}) ${pos.toFixed(2)}%`);
  }
  return `linear-gradient(to bottom, transparent 0%, ${stops.join(", ")}, #000 100%)`;
}

function buildLayers(count: number, maxBlur: number) {
  // Blur doubles per layer (perceptually even steps). Stacked backdrop blurs
  // combine in quadrature, so normalise so the *total* at the bottom ≈ maxBlur.
  const raw = Array.from({ length: count }, (_, i) => 2 ** i);
  const norm = Math.sqrt(raw.reduce((sum, r) => sum + r * r, 0));

  const step = count > 1 ? 60 / (count - 1) : 0; // bands start between 4% and 64%
  return raw.map((r, i) => {
    const start = 4 + i * step;
    return {
      blur: ((r / norm) * maxBlur).toFixed(2),
      mask: buildMask(start, Math.min(start + 30, 100)),
      sat: i >= count - 3,
    };
  });
}

/* ---------- component ---------- */

export default function BottomProgressiveBlur({
  layers = 8,
  maxBlur = 24,
  reactToScroll = true,
  tint,
  tintOpacity = 0.5,
  className,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const data = useMemo(() => buildLayers(layers, maxBlur), [layers, maxBlur]);
  const fullMask = useMemo(() => buildMask(10, 100), []);

  /*
   * Scroll-velocity reaction. Zero work while idle: a passive scroll listener
   * measures speed, and a requestAnimationFrame loop only runs while the blur
   * is easing back to rest. It writes ONE css variable; CSS turns that into a
   * compositor-only transform.
   */
  useEffect(() => {
    const el = rootRef.current;
    if (!el || !reactToScroll) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let enabled = !mq.matches;
    const onMotionPref = () => {
      enabled = !mq.matches;
      if (!enabled) el.style.setProperty("--boost", "0");
    };
    mq.addEventListener("change", onMotionPref);

    const MAX_SPEED = 2.5; // px per ms (2500px/s) counts as "fast"
    let lastY = window.scrollY;
    let lastT = performance.now();
    let target = 0;
    let boost = 0;
    let raf = 0;

    const tick = () => {
      target *= 0.92; // decays once scroll events stop
      boost += (target - boost) * 0.1; // eases toward the target: no snapping
      if (boost < 0.002 && target < 0.002) {
        boost = target = 0;
        el.style.setProperty("--boost", "0");
        raf = 0;
        return;
      }
      el.style.setProperty("--boost", boost.toFixed(3));
      raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      if (!enabled) return;
      const now = performance.now();
      const y = window.scrollY;
      const speed = Math.abs(y - lastY) / Math.max(now - lastT, 1);
      lastY = y;
      lastT = now;
      target = Math.max(target, Math.min(speed / MAX_SPEED, 1));
      if (!raf) raf = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      mq.removeEventListener("change", onMotionPref);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reactToScroll]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={[styles.root, className].filter(Boolean).join(" ")}
    >
      {tint && (
        <div
          className={styles.tint}
          style={
            { "--tint": tint, "--tint-opacity": tintOpacity, "--mask": fullMask } as CSSProperties
          }
        />
      )}
      {data.map((l, i) => (
        <div
          key={i}
          className={styles.layer}
          data-sat={l.sat ? "" : undefined}
          style={{ "--blur": `${l.blur}px`, "--mask": l.mask } as CSSProperties}
        />
      ))}
    </div>
  );
}