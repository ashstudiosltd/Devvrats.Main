"use client";

import { useEffect, useRef, useState } from "react";
import Logo from "./logo";

const NAV_HEIGHT = 72;
const FADE_START = 300; // Sabha top (px from viewport top) where the glide begins
const FADE_END = 80;    // Sabha top where the navbar is fully gone
const SMOOTHING = 0.12; // lower = floatier, higher = snappier

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export default function Navbar() {
  const headerRef = useRef<HTMLElement>(null);
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    let raf = 0;
    let running = false;
    let target = 0;  // where the navbar should be (0 = visible, 1 = gone)
    let current = 0; // where it currently is, chases the target

    const apply = () => {
      const header = headerRef.current;
      if (!header) return;
      // extra 8px so the rounded edge and shadow fully clear the screen
      header.style.transform = `translate3d(0, calc(${-current * 100}% - ${current * 8}px), 0)`;
      header.style.opacity = String(1 - Math.pow(current, 1.4));
      header.style.pointerEvents = current > 0.6 ? "none" : "auto";
    };

    // each frame, move a fraction of the remaining distance (inertia-style easing)
    const tick = () => {
      const diff = target - current;
      if (Math.abs(diff) < 0.0005) {
        current = target;
        apply();
        running = false;
        return;
      }
      current += diff * SMOOTHING;
      apply();
      raf = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      const hero = document.getElementById("hero");
      const sabha = document.getElementById("sabha");

      setPastHero(
        hero
          ? hero.getBoundingClientRect().bottom <= NAV_HEIGHT
          : window.scrollY > window.innerHeight * 0.8
      );

      if (sabha) {
        const top = sabha.getBoundingClientRect().top;
        const raw = clamp((FADE_START - top) / (FADE_START - FADE_END));
        target = easeInOutCubic(raw);
        if (!running) {
          running = true;
          raf = requestAnimationFrame(tick);
        }
      }
    };

    onScroll();
    current = target; // no animation on first load
    apply();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className={`fixed left-0 top-0 z-20 w-full rounded-b-3xl text-white will-change-transform
        transition-[background-color,backdrop-filter,box-shadow,border-color] duration-500 ease-out
        border-b
        ${
          pastHero
            ? "border-white/10 bg-black/55 backdrop-blur-2xl backdrop-saturate-150 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]"
            : "border-transparent bg-transparent backdrop-blur-0 shadow-none"
        }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 pb-4 pt-8 lg:px-16">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 shrink-0 place-items-center">
            <Logo className="h-7 w-7 text-white" />
          </span>

          <span
            className={`text-lg font-semibold tracking-wide transition-opacity duration-500 ease-out
              ${pastHero ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            Devvrats.
          </span>
        </div>

        <a
          href="https://sabha.devvrats.in"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-white/20 px-5 py-2 text-sm
            transition-all duration-300 hover:border-white/30 hover:bg-white/10"
        >
          Join Sabha-Free Forever
        </a>
      </div>
    </header>
  );
}