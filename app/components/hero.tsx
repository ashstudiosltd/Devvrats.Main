"use client";

/**
 * DevvratsHero
 * -------------------------------------------------------------------------
 * - No autoplay. The transparent, square (1:1) logo video is scrubbed
 *   frame-by-frame by scroll position using a single GSAP ScrollTrigger.
 * - On top of the currentTime scrub, the SAME scroll progress also drives
 *   one deliberate, orchestrated visual reaction on the video itself:
 *   it rises slightly, grows from 94% -> 100% scale (anchored to the
 *   bottom, so it reads as "settling in" rather than just zooming), and
 *   fades from 82% -> 100% opacity. This is intentionally a single
 *   cohesive effect, not several scattered ones, per the "one orchestrated
 *   moment" principle — it should read as "the whole thing reacts to my
 *   scroll," not as a pile of independent animations.
 * - Everything is written directly to the DOM in one onUpdate callback
 *   (no per-frame tween creation, no React state), so it stays cheap.
 */

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ---------------------------------------------------------------------------
// SIZE TUNABLE — how much of the screen's bottom the video covers, at any
// screen size. Values are % of viewport height, so "50" always means "half
// the screen," regardless of device width.
// ---------------------------------------------------------------------------
const MASK_HEIGHT_CLASSES = [
  "h-[50vh]", // base (phones, <640px)
  "sm:h-[48vh]",
  "md:h-[55vh]",
  "lg:h-[60vh]",
  "xl:h-[62vh]",
  "min-h-[260px]",
].join(" ");

/** Distance (px) the page must scroll for the video to go from frame 0 to
 *  its final frame, and for the rise/scale/fade reaction to complete. */
const SCROLL_DISTANCE = 1400;

// Scroll-reaction range — tune the "how much" here, not inline below.
const REACTION = {
  scaleFrom: 0.94,
  scaleTo: 1,
  riseFromPct: 5, // % of the video's own height it starts pushed down by
  opacityFrom: 0.82,
  opacityTo: 1,
};

gsap.registerPlugin(ScrollTrigger);

export default function DevvratsHero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const video = videoRef.current;
    if (!hero || !video) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Settle immediately into the resting visual state so there's never a
    // flash of the "start" pose before JS/scroll kicks in.
    video.style.transform = prefersReducedMotion
      ? "translateY(0%) scale(1)"
      : `translateY(${REACTION.riseFromPct}%) scale(${REACTION.scaleFrom})`;
    video.style.opacity = prefersReducedMotion
      ? "1"
      : `${REACTION.opacityFrom}`;

    let scrollTrigger: ScrollTrigger | undefined;
    let cancelled = false;

    const createScrollTrigger = () => {
      if (cancelled || scrollTrigger) return; // guard: never create twice
      if (!video.duration || Number.isNaN(video.duration)) return;

      video.currentTime = 0; // deterministic starting frame

      if (prefersReducedMotion) return; // respect the OS preference, stay static

      scrollTrigger = ScrollTrigger.create({
        trigger: hero,
        start: "top top",
        end: `+=${SCROLL_DISTANCE}`,
        scrub: 0.4,
        pin: false,
        onUpdate: (self) => {
          const progress = self.progress;

          // Direct currentTime write — no React state, no re-render.
          video.currentTime = progress * video.duration;

          // The one orchestrated scroll reaction, same progress value.
          const scale =
            REACTION.scaleFrom +
            progress * (REACTION.scaleTo - REACTION.scaleFrom);
          const riseY = (1 - progress) * REACTION.riseFromPct;
          const opacity =
            REACTION.opacityFrom +
            progress * (REACTION.opacityTo - REACTION.opacityFrom);

          video.style.transform = `translateY(${riseY}%) scale(${scale})`;
          video.style.opacity = `${opacity}`;
        },
      });
    };

    if (video.readyState >= 1 && video.duration) {
      createScrollTrigger();
    } else {
      video.addEventListener("loadedmetadata", createScrollTrigger, {
        once: true,
      });
    }

    return () => {
      cancelled = true;
      video.removeEventListener("loadedmetadata", createScrollTrigger);
      scrollTrigger?.kill();
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full overflow-hidden bg-black min-h-[100svh]"
    >
     <div className="relative z-10 flex min-h-[50vh] flex-col items-center justify-center px-6 pt-6 text-center sm:min-h-[48vh] sm:pt-8 md:min-h-0 md:justify-start md:pt-[16vh]">
  <p className="mb-5 text-xs font-medium uppercase tracking-[0.24em] text-white/45 sm:text-sm">
    Devvrats · Developer Community
  </p>

  <h1 className="leading-[1.12] tracking-tight text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
    <span className="block">Learning, Creating</span>
    <span className="block bg-[linear-gradient(90deg,#6a7cf0_0%,#c063e0_30%,#f0653f_65%,#fbbf24_100%)] bg-clip-text text-transparent">
      thriving together.
    </span>
  </h1>

  <p className="mx-auto mt-6 max-w-xl text-balance text-base leading-relaxed text-white/55 sm:mt-8 sm:text-lg">
    Devvrats is a developer community where developers learn, build,
    collaborate, share knowledge, and grow together.
  </p>

  <a
    href="https://sabha.devvrats.in"
    target="_blank"
    rel="noopener noreferrer"
    className="mt-8 inline-flex items-center text-sm font-medium text-white/70 underline decoration-transparent underline-offset-4 transition-colors duration-300 hover:text-white hover:decoration-white sm:mt-10"
  >
    Explore Sabha
  </a>
</div>

      <div
        className={`absolute inset-x-0 bottom-0 w-full ${MASK_HEIGHT_CLASSES} overflow-hidden pointer-events-none`}
      >
        <video
          ref={videoRef}
          src="/0001-0250.MP4"
          className="absolute inset-0 h-full w-full origin-bottom object-cover object-top will-change-transform"
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          tabIndex={-1}
          controls={false}
        />

        {/* Bottom vignette — fades the video to black toward the very
            bottom of the viewport instead of ending on a hard clip line.
            Pure decoration, sits above the video, never intercepts input. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black via-black/50 to-transparent"
        />
      </div>
    </section>
  );
}