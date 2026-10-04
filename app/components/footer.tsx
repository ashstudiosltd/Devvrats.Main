"use client";
import { Inter_Tight } from "next/font/google";

const font = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// ---------- content ----------

const BRAND = "Devvrats";
const WORDMARK = "DEVVRATS";
const TAGLINE =
  "Your ultimate learning and community platform for developers.";

const EXPLORE = [
  { label: "Home", href: "/" },
  { label: "Sabha", href: "https://sabha.devvrats.in" },
];

// ---------- wordmark sizing ----------

const WORDMARK_STRETCH = 1.5;


// ---------- link column ----------

function LinkColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div className="min-w-[8rem]">
      <p className="text-base text-[#7a7a7a]">{title}</p>

      <ul className="mt-3 flex flex-col gap-0.5">
        {links.map((link) => {
          const isExternal = link.href.startsWith("http");

          return (
            <li key={link.label}>
              <a
                href={link.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="text-lg leading-tight text-[#0a0a0a] transition-opacity hover:opacity-60"
              >
                {link.label}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ---------- wordmark ----------

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

// ---------- footer ----------

export default function Footer() {
  return (
    <section
      id="hero"
      style={{
        backgroundColor: "#e6e6e6",
        color: "#0a0a0a",
      }}
      className={`${font.className} relative w-full overflow-hidden tracking-[-0.04em] antialiased`}
    >
      {/* ---------- info row ---------- */}

      <div className="relative z-10 flex flex-col gap-8 px-5 pt-28 md:flex-row md:justify-between md:px-8 md:pt-32">
        <div className="flex flex-col">
          <h2 className="max-w-[26rem] text-[1.6rem] font-medium leading-[1.1] tracking-[-0.05em] md:text-[1.9rem]">
            {TAGLINE}
          </h2>
        </div>

        <div className="flex gap-14 md:gap-20 md:pr-6 lg:pr-12">
          <LinkColumn title="Explore" links={EXPLORE} />
        </div>
      </div>

      {/* ---------- legal row ---------- */}

      <div className="relative z-10 mt-6 flex items-end justify-between px-5 text-xs uppercase leading-snug tracking-[-0.02em] text-[#7a7a7a] md:px-8">
        <p>
          {new Date().getFullYear()} {BRAND}
          <br />
          All rights reserved
        </p>
      </div>

      {/* ---------- wordmark, edge to edge ---------- */}

      <div className="mt-4 w-full">
        <Wordmark />
      </div>
    </section>
  );
}