"use client";

import { motion } from "framer-motion";
import { Inter_Tight } from "next/font/google";

const font = Inter_Tight({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

/* ---------- content (edit these) ---------- */
const BRAND = "Devvrats";
const WORDMARK = "DEVVRATS";
const TAGLINE = "Your ultimate learning and community platform for developers.";
const SLOTS = "1/5 slots for September";
const EXPLORE = [
  { label: "Home", href: "/" },
  { label: "Our Fundamentals", href: "#pricing" },
  { label: "Flagship", href: "#pricing" },
  { label: "Sabha", href: "#process" },
];
const SOCIALS = [
  { label: "LinkedIn", href: "#" },
  { label: "X", href: "#" },
];

/* wordmark sizing: 1 = natural height, higher = taller letters */
const WORDMARK_STRETCH = 1.5;

const ease = [0.22, 1, 0.36, 1] as const;

/* ---------- icons ---------- */
function Sparkle({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2c.6 5.4 4.6 9.4 10 10-5.4.6-9.4 4.6-10 10-.6-5.4-4.6-9.4-10-10 5.4-.6 9.4-4.6 10-10z" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg viewBox="0 0 12 12" className="h-3 w-3" fill="currentColor" aria-hidden>
      <rect x="0" y="0" width="5" height="5" rx="1" />
      <rect x="7" y="0" width="5" height="5" rx="1" />
      <rect x="0" y="7" width="5" height="5" rx="1" />
      <rect x="7" y="7" width="5" height="5" rx="1" />
    </svg>
  );
}

/* ---------- dark pill button ---------- */
function PillButton({ children, href = "#contact" }: { children: React.ReactNode; href?: string }) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.3, ease }}
      className="inline-flex items-center gap-3 rounded-[1.25rem] bg-[#0a0a0a] px-5 py-3 text-lg font-medium tracking-[-0.04em] text-white md:px-6 md:py-4 md:text-xl"
    >
      <Sparkle className="h-4 w-4" />
      {children}
    </motion.a>
  );
}

/* ---------- link column ---------- */
function LinkColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div className="min-w-[8rem]">
      <p className="text-base text-[#7a7a7a]">{title}</p>
      <ul className="mt-3 flex flex-col gap-0.5">
        {links.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              className="text-lg leading-tight text-[#0a0a0a] transition-opacity hover:opacity-60"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- wordmark (always fully visible, violet to grey) ---------- */
const FONT_SIZE = 190;
const BASELINE = 140;
const VIEW_H = (BASELINE + 6) * WORDMARK_STRETCH;

function Wordmark() {
  return (
    <svg
      viewBox={`0 0 1000 ${VIEW_H}`}
      className="block h-auto w-full"
      role="img"
      aria-label={WORDMARK}
    >
      <defs>
        <linearGradient
          id="wordmark-fade"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1="0"
          x2="0"
          y2={BASELINE}
        >
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="50%" stopColor="#a092ca" />
          <stop offset="100%" stopColor="#9a9a9a" />
        </linearGradient>
      </defs>
      <g transform={`scale(1 ${WORDMARK_STRETCH})`}>
        <text
          x="0"
          y={BASELINE}
          textLength="1000"
          lengthAdjust="spacingAndGlyphs"
          fill="url(#wordmark-fade)"
          className={font.className}
          fontSize={FONT_SIZE}
          fontWeight={700}
        >
          {WORDMARK}
        </text>
      </g>
    </svg>
  );
}

export default function Hero() {
  return (
    <section
      id="hero"
      style={{ backgroundColor: "#e6e6e6", color: "#0a0a0a" }}
      className={`${font.className} relative w-full overflow-hidden tracking-[-0.04em] antialiased`}
    >

      {/* ---------- info row ---------- */}
      <div className="relative z-10 flex flex-col gap-8 px-5 pt-28 md:flex-row md:justify-between md:px-8 md:pt-32">
        <div className="flex flex-col">
          <h1 className="max-w-[26rem] text-[1.6rem] font-medium leading-[1.1] tracking-[-0.05em] md:text-[1.9rem]">
            {TAGLINE}
          </h1>
        </div>

        <div className="flex gap-14 md:gap-20 md:pr-6 lg:pr-12">
          <LinkColumn title="Explore" links={EXPLORE} />
          <LinkColumn title="Socials" links={SOCIALS} />
        </div>
      </div>

      {/* ---------- legal row ---------- */}
      <div className="relative z-10 mt-6 flex items-end justify-between px-5 text-xs uppercase leading-snug tracking-[-0.02em] text-[#7a7a7a] md:px-8">
        <p>
          {new Date().getFullYear()} {BRAND} 
          <br />
          All rights reserved
        </p>
        <p className="text-right">
          <a href="#terms" className="transition-opacity hover:opacity-60">Terms</a>
          <br />
          <a href="#privacy" className="transition-opacity hover:opacity-60">Privacy Policy</a>
        </p>
      </div>

      {/* ---------- wordmark, edge to edge ---------- */}
      <div className="mt-4 w-full">
        <Wordmark />
      </div>
    </section>
  );
}