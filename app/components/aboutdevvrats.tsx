"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";

/* ---------- content (edit here) ---------- */
const HEADLINE = "We bring curious minds together to build what comes next.";
const LEAD = "Devvrats.";
const BODY =
  "is a community built around the belief that great things happen when people learn, create, and grow together. We bring developers, designers, and thinkers into one space,";
const RESULT = "where ideas find direction and ambition finds its people. Because the future isn’t built alone.";

const SIDE_LEAD = "Meet Sabha.";
const SIDE =
  "A space within Devvrats where ideas come alive, voices find their place, and people come together to make meaningful things happen. More than a gathering, it’s where collaboration becomes creation.";
const CTA_LABEL = "Our Ecosystem";

const PURPLE = "#a78bfa";

/* ---------- motion config ---------- */
const EASE = [0.22, 1, 0.36, 1] as const; // CTA hover
const GENTLE = [0.22, 0.61, 0.36, 1] as const; // long, soft ease-out (no sudden start)

const WORDS = HEADLINE.split(" ");
const WORD_STAGGER = 0.07;
// paragraphs + CTA begin once most of the headline has resolved
const AFTER_H1 = WORDS.length * WORD_STAGGER * 0.6 + 0.9;

/* "hidden" is the starting state before the section first scrolls into view.
   The reveal plays once, in order: headline → paragraph 1 → paragraph 2 → CTA. */
const SNAP = { duration: 0 };

const section: Variants = { hidden: {}, show: {} };

const h1: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: WORD_STAGGER, delayChildren: 0.1 } },
};

/*
  Apple-style reveal: every word starts blurred, slightly low and tilted,
  then glides up, straightens and sharpens. All properties share one soft
  curve and run long (1.4–1.8s) with a tiny stagger, so neighbouring words
  overlap almost completely — the blur travels through the sentence as one
  continuous wave instead of word-by-word steps.
*/
const word: Variants = {
  hidden: { opacity: 0, filter: "blur(14px)", y: 20, rotate: 3, transition: SNAP },
  show: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    rotate: 0,
    transition: {
      opacity: { duration: 1.4, ease: GENTLE },
      filter: { duration: 1.8, ease: GENTLE },
      y: { duration: 1.8, ease: GENTLE },
      rotate: { duration: 1.8, ease: GENTLE },
    },
  },
};

/* P1, P2, CTA: pure fade-in, one after another (no movement, no blur) */
const reveal: Variants = {
  hidden: { opacity: 0, transition: SNAP },
  show: (order: number) => ({
    opacity: 1,
    transition: { duration: 1.4, ease: GENTLE, delay: AFTER_H1 + order * 0.16 },
  }),
};

/* ---------- CTA hover variants ---------- */
const HOVER = { duration: 0.5, ease: EASE };

const ctaRoot: Variants = {
  rest: { scale: 1, boxShadow: "0 0 0 0 rgba(167,139,250,0)", transition: HOVER },
  hover: { scale: 1, boxShadow: "0 10px 30px -8px rgba(167,139,250,0.55)", transition: HOVER },
};
const ctaFill: Variants = {
  rest: { y: "101%", transition: HOVER },
  hover: { y: "0%", transition: HOVER },
};
const ctaContent: Variants = {
  rest: { color: "#ffffff", transition: HOVER },
  hover: { color: "#000000", transition: HOVER },
};
const arrowOut: Variants = {
  rest: { x: "0%", y: "0%", transition: HOVER },
  hover: { x: "150%", y: "-150%", transition: HOVER },
};
const arrowIn: Variants = {
  rest: { x: "-150%", y: "150%", transition: HOVER },
  hover: { x: "0%", y: "0%", transition: HOVER },
};
const label: Variants = {
  rest: { x: 0, transition: HOVER },
  hover: { x: 3, transition: HOVER },
};

function ArrowIcon() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M2.5 9.5 9.5 2.5M3.5 2.5h6v6" />
    </svg>
  );
}

/* ---------- section ---------- */
export default function AboutDevvrats() {
  const ref = useRef<HTMLDivElement>(null);

  // Plays once, the first time the section is clearly on screen, and never resets.
  const reached = useInView(ref, { amount: 0.3, once: true });

  return (
    <section id="about" className="relative min-h-svh overflow-hidden bg-[#060606]">
      <motion.div
        ref={ref}
        variants={section}
        initial="hidden"
        animate={reached ? "show" : "hidden"}
        className="mx-auto flex min-h-svh w-full max-w-[665px] flex-col justify-center px-6 py-24 md:px-0 lg:max-w-[1000px]"
      >
        <motion.h1
          variants={h1}
          aria-label={HEADLINE}
          className="text-[44px] font-light leading-[0.95] tracking-[-0.05em] text-white sm:text-[52px] md:text-[64px] lg:text-[96px]"
        >
          {WORDS.map((w, i) => (
            <span key={i} aria-hidden>
              {/* padding + equal negative margin = bigger paint box, zero layout change.
                  Stops Safari/Chrome clipping descenders ("g", "p") and blur edges. */}
              <motion.span
                variants={word}
                className="-mx-[0.12em] -my-[0.2em] inline-block origin-bottom-left transform-gpu px-[0.12em] py-[0.2em] will-change-[transform,filter,opacity]"
              >
                {w}
              </motion.span>{" "}
            </span>
          ))}
        </motion.h1>

        {/* P1 + P2 */}
        <div className="mt-20 grid gap-10 md:grid-cols-[1fr_200px] md:gap-20 lg:mt-28 lg:grid-cols-[1fr_300px] lg:gap-32">
          <motion.p
            variants={reveal}
            custom={0}
            className="text-[22px] leading-[1.12] tracking-[-0.05em] text-[#6b6b6b] md:text-[18px] md:leading-[1.2] md:tracking-[-0.045em] lg:text-[27px]"
          >
            <span style={{ color: PURPLE }}>{LEAD}</span> {BODY}{" "}
            <span style={{ color: PURPLE }}>{RESULT}</span>
          </motion.p>

          <motion.p
            variants={reveal}
            custom={1}
            className="text-[18px] leading-[1.15] tracking-[-0.045em] text-[#6b6b6b] md:-mt-1 md:text-[14px] lg:text-[21px]"
          >
            <span style={{ color: PURPLE }}>{SIDE_LEAD}</span> {SIDE}
          </motion.p>
        </div>

        {/* CTA */}
        <motion.div variants={reveal} custom={2} className="mt-12 lg:mt-16">
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
            className="relative inline-flex overflow-hidden rounded-2xl bg-[#141414] px-5 py-3.5 lg:rounded-3xl lg:px-8 lg:py-5"
          >
            <motion.span aria-hidden variants={ctaFill} className="absolute inset-0 bg-[#a78bfa]" />

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
        </motion.div>
      </motion.div>
    </section>
  );
}