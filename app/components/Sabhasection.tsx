"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { Inter_Tight } from "next/font/google";

const font = Inter_Tight({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/* ---------- CTA hover ---------- */
const CTA_LABEL = "Join Sabha";
const hoverEase = [0.22, 1, 0.36, 1] as const;

const ctaRoot: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.03, transition: { type: "spring", stiffness: 300, damping: 22 } },
};
const ctaFill: Variants = {
  rest: { y: "101%" },
  hover: { y: "0%", transition: { duration: 0.45, ease: hoverEase } },
};
const ctaContent: Variants = {
  rest: { color: "#ffffff" },
  hover: { color: "#0a0a0a", transition: { duration: 0.3 } },
};
const arrowOut: Variants = {
  rest: { x: "0%", y: "0%" },
  hover: { x: "100%", y: "-100%", transition: { duration: 0.35, ease: hoverEase } },
};
const arrowIn: Variants = {
  rest: { x: "-100%", y: "100%" },
  hover: { x: "0%", y: "0%", transition: { duration: 0.35, ease: hoverEase } },
};
const label: Variants = {
  rest: { x: 0 },
  hover: { x: 4, transition: { duration: 0.35, ease: hoverEase } },
};

function ArrowIcon() {
  return (
    <svg viewBox="0 0 12 12" fill="none" className="h-full w-full" aria-hidden>
      <path
        d="M2 10L10 2M10 2H3.5M10 2V8.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------- data ---------- */
type Service = { title: string; text: string; order: string };
const left: Service[] = [
  {
    title: "Blogs.",
    text: "Explore perspectives, lessons, and stories from people who love to learn and create.",
    order: "order-1",
  },
  {
    title: "Feed",
    text: "Share what you're thinking, ask questions, and be part of conversations that move ideas forward.",
    order: "order-3",
  },
];
const right: Service[] = [
  {
    title: "Projects",
    text: "Show what you're building, discover work from others, and find opportunities to create together.",
    order: "order-2",
  },
  {
    title: "DID",
    text: "Bring your skills, contributions, projects, and developer journey into one unified identity.",
    order: "order-4",
  },
];

/* ---------- service card: hover scale ---------- */
// Hover is a pointer-triggered response, so it always works
// (it is NOT switched off by the "reduce motion" setting, which is what hid it before).
function ServiceCard({ s, inset }: { s: Service; inset?: boolean }) {
  return (
    <div className={`${s.order} md:order-none ${inset ? "md:mx-3" : ""}`}>
      <motion.article
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        style={{ backgroundColor: "#ffffff", color: "#0a0a0a" }}
        className="relative flex h-full cursor-pointer flex-col rounded-[2rem] p-6 md:rounded-[2.25rem] md:p-8"
      >
        <h2 className="border-b border-[#e4e4e4] pb-6 text-3xl font-semibold leading-none tracking-[-0.06em] md:pb-8 md:text-[2rem]">
          {s.title}
        </h2>
        <p className="mt-5 pr-12 text-lg font-medium leading-tight md:text-xl">{s.text}</p>
        <span
          aria-hidden
          className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-xl bg-[#f0f0f0] text-[#0a0a0a] lg:h-12 lg:w-12"
        >
          <span className="block h-4 w-4 lg:h-5 lg:w-5">
            <ArrowIcon />
          </span>
        </span>
      </motion.article>
    </div>
  );
}

export default function SabhaSection() {
  const reduce = useReducedMotion() ?? false;
  const ref = useRef<HTMLElement>(null);

  // 0 as the section's top edge enters the screen, 1 once it has settled near the top
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.1"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  const p = useTransform(smooth, (v) => easeInOutCubic(clamp(v)));

  // the whole section (background + content) grows and settles together, nothing is clipped
  const y = useTransform(p, (v) => lerp(56, 0, v));
  const scale = useTransform(p, (v) => lerp(0.9, 1, v));

  return (
    // own grey background so it never inherits a dark layout background
    <motion.section
      ref={ref}
      id="sabha"
      style={{
        backgroundColor: "#e6e6e6",
        color: "#0a0a0a",
        ...(reduce ? {} : { y, scale, transformOrigin: "50% 0%" }),
      }}
      className={`${font.className} w-full rounded-t-[2rem] rounded-b-none tracking-[-0.03em] antialiased will-change-transform sm:rounded-t-[2.5rem] lg:rounded-t-[3rem]`}
    >
      {/* one even padding all round, one even gap between blocks */}
      <div className="mx-auto flex w-full max-w-[52rem] flex-col gap-10 p-5 sm:p-8 lg:gap-12 lg:p-10">
        {/* ---------- hero ---------- */}
        <div>
          <h1 className="relative z-10 text-left text-[clamp(1.75rem,5.5vw,3.5rem)] font-medium leading-none tracking-[-0.06em]">
            Our spaces &amp;
          </h1>

          <p
            aria-label="SABHA"
            className="-my-[0.06em] text-center text-[clamp(5rem,19vw,11.5rem)] font-bold leading-[0.9] tracking-[-0.06em]"
          >
            Sabha.
          </p>

          <h1 className="relative z-10 text-right text-[clamp(1.75rem,5.5vw,3.5rem)] font-medium leading-none tracking-[-0.06em]">
            your Community
          </h1>
        </div>

        {/* intro + button */}
        <div className="flex flex-col items-start gap-6 sm:pl-[5%]">
          <p className="max-w-[21rem] text-lg leading-snug text-[#5d5d5d]">
             A space where the Devvrats community comes together to share ideas, start conversations, build projects, and learn from one another. Sabha brings people and knowledge into one place, turning everyday interactions into something worth building on.
          </p>

          <motion.a
            href="https://sabha.devvrats.in"
            target="_blank"
            rel="noopener noreferrer"
            variants={ctaRoot}
            initial="rest"
            animate="rest"
            whileHover="hover"
            whileFocus="hover"
            whileTap={{ scale: 0.96 }}
            className="relative inline-flex overflow-hidden rounded-2xl bg-[#86868B] px-5 py-3.5 lg:rounded-3xl lg:px-8 lg:py-5"
          >
            <motion.span aria-hidden variants={ctaFill} className="absolute inset-0 bg-[#B0B0B5]" />

            <motion.span
              variants={ctaContent}
              className="relative z-10 flex items-center gap-3 text-[17px] tracking-[-0.03em] md:text-[15px] lg:gap-4 lg:text-[22px]"
            >
              <span className="relative block h-3 w-3 overflow-hidden lg:h-[18px] lg:w-[18px]">
                <motion.span variants={arrowOut} className="absolute inset-0 block">
                  <ArrowIcon />
                </motion.span>
                <motion.span variants={arrowIn} className="absolute inset-0 block">
                  <ArrowIcon />
                </motion.span>
              </span>

              <motion.span variants={label} className="block">
                {CTA_LABEL}
              </motion.span>
            </motion.span>
          </motion.a>
        </div>

        {/* ---------- services ---------- */}
        <div
          id="services"
          data-slow
          className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-start md:gap-5"
        >
          <div className="contents md:flex md:flex-col md:gap-5 md:pt-12">
            {left.map((s) => (
              <ServiceCard key={s.title} s={s} />
            ))}
          </div>
          <div className="contents md:flex md:flex-col md:gap-5">
            {right.map((s, i) => (
              <ServiceCard key={s.title} s={s} inset={i === right.length - 1} />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}