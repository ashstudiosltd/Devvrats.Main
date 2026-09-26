"use client";

import { useEffect, useState } from "react";
import Logo from "./logo";

export default function Navbar() {
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");

    // fallback if no #hero element exists yet
    if (!hero) {
      const onScroll = () =>
        setPastHero(window.scrollY > window.innerHeight * 0.8);
      onScroll();
      window.addEventListener("scroll", onScroll);
      return () => window.removeEventListener("scroll", onScroll);
    }

    const observer = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { rootMargin: "-72px 0px 0px 0px", threshold: 0 } // -72px ≈ navbar height offset
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-20 text-white">
      <div
        className={`relative mx-auto flex items-center justify-between px-6 py-4 lg:px-16
        max-w-6xl mt-4 rounded-2xl overflow-hidden
        transition-[background-color,backdrop-filter,box-shadow] duration-700 ease-out
        ${
          pastHero
            ? "bg-black/25 backdrop-blur-xl backdrop-saturate-150 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.45)]"
            : "bg-transparent shadow-none"
        }`}
      >
        {/* reactive edge — gradient border blended with the content behind the glass,
            not a fixed white line. brightens over light bg, darkens over dark bg. */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 rounded-2xl mix-blend-overlay
            transition-opacity duration-700 ${pastHero ? "opacity-90" : "opacity-0"}`}
          style={{
            padding: 1,
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.05) 35%, rgba(255,255,255,0.02) 65%, rgba(255,255,255,0.4) 100%)",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />

        {/* film grain, also overlay-blended so it reads as texture on the glass, not a flat png */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 mix-blend-overlay transition-opacity duration-700
            ${pastHero ? "opacity-[0.1]" : "opacity-0"}`}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        <div className="relative flex items-center gap-2">
          {/* fixed slot — reserves the logo's space always, so text never shifts when it appears */}
          <span
            className={`grid place-items-center h-7 w-7 shrink-0
              transition-all duration-700 ease-out will-change-[filter,opacity,transform]
              ${
                pastHero
                  ? "opacity-100 blur-0 scale-100"
                  : "opacity-0 blur-md scale-90 pointer-events-none"
              }`}
          >
            <Logo className="h-7 w-7 text-white" />
          </span>

          <span className="font-semibold text-lg tracking-wide">
            Devvrats.
          </span>
        </div>

        <a
          href="https:/sabha.devvrats.in"
          target="_blank"
          rel="noopener noreferrer"
          className="relative border border-white/20 rounded-full px-5 py-2 text-sm
            hover:bg-white/10 hover:border-white/30 transition-all duration-300 backdrop-blur-sm"
        >
          Join Sabha-Free Forever
        </a>
      </div>
    </header>
  );
}