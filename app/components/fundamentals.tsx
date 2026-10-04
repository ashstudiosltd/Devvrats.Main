"use client";

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type Variants,
} from "framer-motion";

/* ---------- content (edit here) ---------- */
const HEADLINE_PARTS = [
  { text: "Made by", tone: "muted" },
  { text: "Devvrats.",  tone: "light" },
] as const;

const LEAD = "We bring Devvrats together to build ideas, tools, and initiatives that ";
const BODY = "strengthen our community and create lasting impact. ";
const SIDE = "Explore the innovations built by Devvrats, for Devvrats, and the wider community around us.";

const PURPLE = "#a78bfa";
// cursor label: flat purple, 10% translucent (90% opaque), white text — same on every card
const CURSOR_TONE = "bg-[#a78bfa]/90 text-white";

/* ---------- motion config ---------- */
const GENTLE = [0.22, 0.61, 0.36, 1] as const;
const SNAP = { duration: 0 };

const WORDS = HEADLINE_PARTS.flatMap((part) =>
  part.text.split(" ").map((w) => ({ w, tone: part.tone })),
);
const WORD_STAGGER = 0.07;
const AFTER_H1 = WORDS.length * WORD_STAGGER * 0.6 + 0.9;

const block: Variants = { hidden: {}, show: {} };

const h1: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: WORD_STAGGER, delayChildren: 0.1 } },
};

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

const reveal: Variants = {
  hidden: { opacity: 0, transition: SNAP },
  show: (order: number) => ({
    opacity: 1,
    transition: { duration: 1.4, ease: GENTLE, delay: AFTER_H1 + order * 0.16 },
  }),
};

type Project = {
  title: string;
  desc: ReactNode;
  cta: string; // replaces the title on hover (and is the real link)
  href: string;
  tags: string[];
  cursor: string; // text that trails the cursor inside the card
  cursorTone: string; // its colours (flat purple, white text)
  icon?: ReactNode;
  ui: ReactNode;
  wide?: boolean;
  bg: string;
  text: string;
  sub: string;
  chip: string;
};

/* =====================================================================
   Shared: the progressive word effect, tuned for hover.
   hidden → words leave quickly, last word first
   show   → words glide up, untilt and sharpen one after another
   `delay` makes the incoming text wait until the outgoing text is gone.
   ===================================================================== */

const SOFT = { duration: 0.3, ease: GENTLE };

const pWord: Variants = {
  hidden: {
    opacity: 0,
    filter: "blur(8px)",
    y: 10,
    rotate: 2,
    transition: { duration: 0.26, ease: GENTLE },
    transitionEnd: { visibility: "hidden" },
  },
  show: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    rotate: 0,
    visibility: "visible",
    transition: {
      opacity: { duration: 0.5, ease: GENTLE },
      filter: { duration: 0.6, ease: GENTLE },
      y: { duration: 0.6, ease: GENTLE },
      rotate: { duration: 0.6, ease: GENTLE },
    },
  },
};

function ProgressiveText({
  text,
  show,
  delay = 0,
  stagger = 0.035,
}: {
  text: string;
  show: boolean;
  delay?: number;
  stagger?: number;
}) {
  const group: Variants = {
    hidden: { transition: { staggerChildren: 0.018, staggerDirection: -1 } },
    show: { transition: { staggerChildren: stagger, delayChildren: delay } },
  };
  return (
    <motion.span
      variants={group}
      initial={show ? "show" : "hidden"}
      animate={show ? "show" : "hidden"}
    >
      {text.split(" ").map((w, i) => (
        <span key={i}>
          <motion.span
            variants={pWord}
            className="-mx-[0.12em] -my-[0.2em] inline-block origin-bottom-left px-[0.12em] py-[0.2em]"
          >
            {w}
          </motion.span>{" "}
        </span>
      ))}
    </motion.span>
  );
}

/* words that fade in once (chat replies) — switches to plain text when done */
const replyWord: Variants = {
  hidden: { opacity: 0, filter: "blur(5px)", y: 4 },
  show: { opacity: 1, filter: "blur(0px)", y: 0, transition: { duration: 0.5, ease: GENTLE } },
};

function RevealWords({ text }: { text: string }) {
  const words = text.split(" ");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), words.length * 24 + 700);
    return () => clearTimeout(t);
  }, [words.length]);

  if (done) return <>{text}</>;

  return (
    <motion.span
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.024 } } }}
    >
      {words.map((w, i) => (
        <span key={i}>
          <motion.span variants={replyWord} className="inline-block">
            {w}
          </motion.span>{" "}
        </span>
      ))}
    </motion.span>
  );
}

const swapIn = { opacity: 0, filter: "blur(6px)", y: 6 };
const swapShow = { opacity: 1, filter: "blur(0px)", y: 0 };

/* =====================================================================
   1. PATA
   ===================================================================== */

type Challenge = { kyu: string; name: string; fn: string; examples: [string, string][]; tags: [string, string] };

const LANGUAGES = ["JavaScript", "Python", "C, C++", "Go", "Rust"];
const EXT: Record<string, string> = { JavaScript: "js", Python: "py", "C, C++": "cpp", Go: "go", Rust: "rs" };
const TOPICS = ["Fundamentals", "Algorithms", "Data Structures"] as const;
type Topic = (typeof TOPICS)[number];

const CHALLENGES: Record<Topic, Challenge[]> = {
  Fundamentals: [
    { kyu: "8 kyu", name: "Reversed Strings", fn: "reverse", examples: [["world", "dlrow"], ["word", "drow"]], tags: ["STRINGS", "FUNDAMENTALS"] },
    { kyu: "8 kyu", name: "Sum of Positives", fn: "sumPositive", examples: [["[1, -4, 7, 12]", "20"], ["[-1, -2]", "0"]], tags: ["ARRAYS", "FUNDAMENTALS"] },
    { kyu: "7 kyu", name: "Vowel Count", fn: "countVowels", examples: [["devvrats", "2"], ["sabha", "2"]], tags: ["STRINGS", "FUNDAMENTALS"] },
  ],
  Algorithms: [
    { kyu: "6 kyu", name: "Two Sum", fn: "twoSum", examples: [["[2, 7, 11], 9", "[0, 1]"], ["[3, 3], 6", "[0, 1]"]], tags: ["ARRAYS", "ALGORITHMS"] },
    { kyu: "5 kyu", name: "Binary Search", fn: "search", examples: [["[1, 3, 5, 7], 5", "2"], ["[1, 3], 4", "-1"]], tags: ["SEARCH", "ALGORITHMS"] },
  ],
  "Data Structures": [
    { kyu: "6 kyu", name: "Remove Duplicates", fn: "dedupe", examples: [["[1, 1, 2]", "[1, 2]"], ["[A, A, B]", "[A, B]"]], tags: ["SETS", "DATA STRUCTURES"] },
    { kyu: "5 kyu", name: "Valid Parentheses", fn: "isValid", examples: [["()[]{}", "true"], ["(]", "false"]], tags: ["STACKS", "DATA STRUCTURES"] },
  ],
};

function starter(lang: string, fn: string) {
  switch (lang) {
    case "Python":
      return `def ${fn}(value):\n    # your code here\n    pass`;
    case "C, C++":
      return `auto ${fn}(auto value) {\n  // your code here\n}`;
    case "Go":
      return `func ${fn}(value any) any {\n\t// your code here\n}`;
    case "Rust":
      return `fn ${fn}(value: &str) -> String {\n    // your code here\n}`;
    default:
      return `function ${fn}(value) {\n  // your code here\n}`;
  }
}

/* hover effects only exist on devices that can really hover (not on touch screens) */
function useCanHover() {
  const [can, setCan] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const f = () => setCan(mq.matches);
    f();
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, []);
  return can;
}

/* ---------- simple, Apple-style line icons (currentColor, round caps) ---------- */
type IconProps = { className?: string };
const line = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

const Icon = {
  Chevron: ({ className = "h-3 w-3" }: IconProps) => (
    <svg viewBox="0 0 12 12" className={className} {...line}>
      <path d="M4.5 2.5L8 6l-3.5 3.5" />
    </svg>
  ),
  ChevronDown: ({ className = "h-3 w-3" }: IconProps) => (
    <svg viewBox="0 0 12 12" className={className} {...line}>
      <path d="M2.5 4.5L6 8l3.5-3.5" />
    </svg>
  ),
  Check: ({ className = "h-3 w-3" }: IconProps) => (
    <svg viewBox="0 0 12 12" className={className} {...line}>
      <path d="M2.5 6.5l2.5 2.5 4.5-5.5" />
    </svg>
  ),
  XMark: ({ className = "h-3 w-3" }: IconProps) => (
    <svg viewBox="0 0 12 12" className={className} {...line}>
      <path d="M3 3l6 6M9 3l-6 6" />
    </svg>
  ),
  Play: ({ className = "h-2.5 w-2.5" }: IconProps) => (
    <svg viewBox="0 0 12 12" className={className} fill="currentColor" aria-hidden>
      <path d="M3.4 2.1v7.8c0 .3.3.5.6.3l6.2-3.9c.2-.2.2-.5 0-.6L4 1.8c-.3-.2-.6 0-.6.3z" />
    </svg>
  ),
  ArrowUp: ({ className = "h-3.5 w-3.5" }: IconProps) => (
    <svg viewBox="0 0 12 12" className={className} {...line} strokeWidth={1.9}>
      <path d="M6 10V2.6M2.9 5.5L6 2.4l3.1 3.1" />
    </svg>
  ),
  Reload: ({ className = "h-3.5 w-3.5" }: IconProps) => (
    <svg viewBox="0 0 12 12" className={className} {...line}>
      <path d="M10 6a4 4 0 11-1.2-2.85" />
      <path d="M9.9 1.6v2.3H7.6" />
    </svg>
  ),
};

function StatusIcon({ st }: { st: "running" | "pass" | "fail" }) {
  if (st === "pass") return <Icon.Check className="h-3.5 w-3.5" />;
  if (st === "fail") return <Icon.XMark className="h-3.5 w-3.5" />;
  return <span className="h-1.5 w-1.5 rounded-full bg-current" />;
}

function Dropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const canHover = useCanHover();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: globalThis.MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation(); // don't also shrink the full-card view
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <motion.button
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        whileHover={canHover ? { borderColor: "rgba(255,255,255,0.28)" } : undefined}
        whileTap={{ scale: 0.99 }}
        transition={SOFT}
        className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/40 px-3.5 py-2.5 text-left text-[13px] text-white outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      >
        {value}
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={SOFT} className="text-white/50">
          <Icon.ChevronDown />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: GENTLE }}
            className="absolute inset-x-0 top-[calc(100%+6px)] z-30 rounded-xl border border-white/10 bg-[#242424] p-1 shadow-2xl"
          >
            {options.map((o) => (
              <li key={o} role="option" aria-selected={o === value}>
                <motion.button
                  type="button"
                  onClick={() => {
                    onChange(o);
                    setOpen(false);
                  }}
                  whileHover={canHover ? { backgroundColor: "rgba(255,255,255,0.08)" } : undefined}
                  transition={{ duration: 0.18 }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-[13px] ${
                    o === value ? "text-white" : "text-white/65"
                  }`}
                >
                  {o}
                  {o === value && <Icon.Check className="h-3 w-3 text-orange-300" />}
                </motion.button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

type Mode = "normal" | "min" | "full" | "closed";

/* macOS-style window controls: coloured dots, glyphs appear when the group is hovered */
const glyphVariants = { rest: { opacity: 0 }, hover: { opacity: 1 } };

const Glyph = {
  close: (
    <svg viewBox="0 0 8 8" className="h-[7px] w-[7px]" fill="none" stroke="rgba(60,0,0,0.6)" strokeWidth="1.3" strokeLinecap="round" aria-hidden>
      <path d="M1.6 1.6l4.8 4.8M6.4 1.6L1.6 6.4" />
    </svg>
  ),
  min: (
    <svg viewBox="0 0 8 8" className="h-[7px] w-[7px]" fill="none" stroke="rgba(90,50,0,0.65)" strokeWidth="1.3" strokeLinecap="round" aria-hidden>
      <path d="M1.2 4h5.6" />
    </svg>
  ),
  expand: (
    <svg viewBox="0 0 8 8" className="h-[7px] w-[7px]" fill="none" stroke="rgba(0,60,10,0.65)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4.6 1.2h2.2v2.2M6.8 1.2L4.5 3.5M3.4 6.8H1.2V4.6M1.2 6.8l2.3-2.3" />
    </svg>
  ),
  shrink: (
    <svg viewBox="0 0 8 8" className="h-[7px] w-[7px]" fill="none" stroke="rgba(0,60,10,0.65)" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6.8 3.4H4.6V1.2M4.6 3.4l2.2-2.2M1.2 4.6h2.2v2.2M3.4 4.6L1.2 6.8" />
    </svg>
  ),
};

function Dot({ color, label, glyph, onClick }: { color: string; label: string; glyph: ReactNode; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      whileTap={{ scale: 0.86 }}
      transition={{ duration: 0.12 }}
      style={{ backgroundColor: color, boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.28)" }}
      className="relative flex h-3 w-3 items-center justify-center rounded-full outline-none before:absolute before:-inset-1 before:content-[''] focus-visible:ring-2 focus-visible:ring-white/60"
    >
      <motion.span variants={glyphVariants} transition={{ duration: 0.14 }} className="flex items-center justify-center">
        {glyph}
      </motion.span>
    </motion.button>
  );
}

function TrafficLights({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  const canHover = useCanHover();
  return (
    <motion.div initial="rest" whileHover={canHover ? "hover" : undefined} className="flex items-center gap-2">
      <Dot color="#ff5f57" label="Close" glyph={Glyph.close} onClick={() => setMode("closed")} />
      <Dot
        color="#febc2e"
        label={mode === "min" ? "Restore" : "Minimise"}
        glyph={Glyph.min}
        onClick={() => setMode(mode === "min" ? "normal" : "min")}
      />
      <Dot
        color="#28c840"
        label={mode === "full" ? "Back to normal size" : "Fill the whole card"}
        glyph={mode === "full" ? Glyph.shrink : Glyph.expand}
        onClick={() => setMode(mode === "full" ? "normal" : "full")}
      />
    </motion.div>
  );
}

/*
  How the Pata window reforms (no cross-fades)
  - One real window ("shell") sits over an invisible slot that holds its place in the card.
  - Every traffic light just moves the shell's rectangle with a soft, critically damped spring:
      yellow → the window shades up to its title bar
      red    → the window shrinks into a small "Reopen" pill
      green  → the window grows to the card's own rectangle (and back)
  - On green, the layout inside reforms as it grows: the controls column narrows while the editor
    column is revealed like a drawer (grid columns animate 1fr/0fr → 3fr/7fr), then the code lines
    are wiped in one after another. On narrow screens the same happens vertically (rows).
  - Everything stays inside the Pata card (`isolate` + `overflow-hidden`); nothing else moves.
*/
const PILL = { w: 152, h: 44 };
const SHELL_SHADOW = "0 30px 60px -20px rgba(0,0,0,0.7)";
const NO_SHADOW = "0 0 0 0 rgba(0,0,0,0)";
const SHELL_SPRING = { type: "spring", stiffness: 210, damping: 27, mass: 0.9 } as const;

/* interactive zones show a plain arrow; the rest of the card shows a hand */
const ZONE = "cursor-default [&_button]:cursor-default";

const editorV: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.32 } },
};
const lineV: Variants = {
  hidden: { clipPath: "inset(0 100% 0 0)", transition: { duration: 0.12 } },
  show: { clipPath: "inset(0 0% 0 0)", transition: { duration: 0.4, ease: GENTLE } },
};

type SlotGeo = { x: number; y: number; w: number; cw: number; ch: number };

function PataPanel() {
  const [lang, setLang] = useState(LANGUAGES[0]);
  const [topic, setTopic] = useState<Topic>("Fundamentals");
  const [idx, setIdx] = useState(0);
  const [mode, setMode] = useState<Mode>("normal");
  const reduce = useReducedMotion();
  const canHover = useCanHover();

  const slotRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const modeRef = useRef(mode);
  modeRef.current = mode;

  const [geo, setGeo] = useState<SlotGeo | null>(null);
  const [dims, setDims] = useState<{ headerH: number; controlsH: number } | null>(null);
  const [narrow, setNarrow] = useState(false);

  const full = mode === "full";
  const closed = mode === "closed";

  // closing from the resting size freezes the window's layout, so it is simply clipped while it shrinks
  const [freeze, setFreeze] = useState(false);
  const go = (m: Mode) => {
    if (m === "closed") setFreeze(mode !== "full");
    setMode(m);
  };

  // phones stack the two columns, so the same reform runs vertically
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const f = () => setNarrow(mq.matches);
    f();
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, []);

  // where the slot sits inside the card, and how big the card is (all relative to the card)
  useEffect(() => {
    const slot = slotRef.current;
    const card = slot?.closest("article");
    if (!slot || !card) return;
    const measure = () => {
      const s = slot.getBoundingClientRect();
      const c = card.getBoundingClientRect();
      const n = { x: s.left - c.left, y: s.top - c.top, w: s.width, cw: c.width, ch: c.height };
      setGeo((g) =>
        g && [g.x - n.x, g.y - n.y, g.w - n.w, g.cw - n.cw, g.ch - n.ch].every((d) => Math.abs(d) < 0.5) ? g : n,
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(slot);
    ro.observe(card);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // natural height of the title bar and the controls (the window's resting size comes from these)
  const hasGeo = geo !== null;
  useEffect(() => {
    const h = headerRef.current;
    const c = controlsRef.current;
    if (!h || !c) return;
    const m = () => {
      if (modeRef.current === "full") return;
      setDims((d) => {
        const n = { headerH: h.offsetHeight, controlsH: c.offsetHeight };
        return d && d.headerH === n.headerH && d.controlsH === n.controlsH ? d : n;
      });
    };
    m();
    const ro = new ResizeObserver(m);
    ro.observe(h);
    ro.observe(c);
    return () => ro.disconnect();
  }, [hasGeo]);

  // hidden content can't be tabbed to
  useEffect(() => {
    const set = (el: HTMLElement | null, v: boolean) => el && ((el as HTMLElement & { inert: boolean }).inert = v);
    set(bodyRef.current, mode === "min" || mode === "closed");
    set(headerRef.current, mode === "closed");
  }, [mode, hasGeo]);

  // Esc goes back from the full view
  useEffect(() => {
    if (mode !== "full") return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMode("normal");
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mode]);

  const list = CHALLENGES[topic];
  const ch = list[idx % list.length];

  const P = narrow ? 16 : 20; // resting padding
  const FP = narrow ? 20 : 28; // padding in the full view = the card's own padding
  const headerH = dims?.headerH ?? 24;
  const controlsH = dims?.controlsH ?? 330;
  const contentH = 2 * P + headerH + 16 + controlsH + 2;
  const minH = 2 * P + headerH + 2;

  // closing: the window shrinks into the reopen tab (its contents stay as they are, just clipped)
  const rest = { opacity: 1, scale: 1 };
  let target = { left: 0, top: 0, width: 0, height: 0, borderRadius: 18, boxShadow: SHELL_SHADOW, ...rest };
  if (geo) {
    const { x, y, w } = geo;
    if (mode === "full") target = { left: 0, top: 0, width: geo.cw, height: geo.ch, borderRadius: 28, boxShadow: NO_SHADOW, ...rest };
    else if (mode === "min") target = { left: x, top: y, width: w, height: minH, borderRadius: 18, boxShadow: SHELL_SHADOW, ...rest };
    else if (mode === "closed")
      target = {
        left: x + (w - PILL.w) / 2,
        top: y + (contentH - PILL.h) / 2,
        width: PILL.w,
        height: PILL.h,
        borderRadius: 16,
        boxShadow: NO_SHADOW,
        ...rest,
      };
    else target = { left: x, top: y, width: w, height: contentH, borderRadius: 18, boxShadow: SHELL_SHADOW, ...rest };
  }

  const folded = mode === "min";
  const padTop = folded ? 0 : full ? 20 : 16;
  const bodyAnim = narrow
    ? {
        gridTemplateColumns: "1fr",
        gridTemplateRows: full ? "5fr 4fr" : "5fr 0fr",
        rowGap: full ? 16 : 0,
        columnGap: 0,
        paddingTop: padTop,
      }
    : {
        gridTemplateRows: "1fr",
        gridTemplateColumns: full ? "3fr 7fr" : "1fr 0fr",
        columnGap: full ? 20 : 0,
        rowGap: 0,
        paddingTop: padTop,
      };

  const spring = reduce || !dims ? { duration: 0 } : SHELL_SPRING;

  const controls = (
    <div>
      <div className="space-y-2.5">
        <Dropdown label="Language" value={lang} options={LANGUAGES} onChange={setLang} />
        <Dropdown
          label="Topic"
          value={topic}
          options={TOPICS}
          onChange={(v) => {
            setTopic(v as Topic);
            setIdx(0);
          }}
        />
      </div>

      <div className="mt-3.5 flex items-center gap-3">
        <motion.button
          type="button"
          onClick={() => setIdx((i) => i + 1)}
          whileHover={canHover ? { backgroundColor: "#3b82f6" } : undefined}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.25 }}
          className="flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-[11px] font-medium tracking-wide text-white outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        >
          <Icon.Play />
          TRAIN
        </motion.button>
        <span className="text-[12px] text-white/40">
          {lang} · {topic}
        </span>
      </div>

      <div className="mt-3.5 min-h-[132px] rounded-xl border border-white/10 bg-black/50 p-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${topic}-${ch.name}`}
            initial={swapIn}
            animate={swapShow}
            exit={{ opacity: 0, filter: "blur(6px)" }}
            transition={{ duration: 0.38, ease: GENTLE }}
          >
            <div className="mb-3 flex items-center gap-2.5">
              <span className="rounded bg-white/15 px-2 py-1 text-[11px] font-medium text-white">{ch.kyu}</span>
              <span className="text-[14px] font-medium tracking-[-0.02em] text-white">{ch.name}</span>
            </div>
            <div className="space-y-1 font-mono text-[13px]">
              {ch.examples.map(([a, b]) => (
                <div key={a} className="flex items-center gap-2">
                  <span className="text-yellow-400">{a}</span>
                  <Icon.Chevron className="h-3 w-3 text-white/35" />
                  <span className="text-green-400">{b}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-4 text-[11px] tracking-wide text-white/40">
              <span>{ch.tags[0]}</span>
              <span>{ch.tags[1]}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <>
      {/* invisible slot: keeps the window's place (and the card's size) whatever the window does */}
      <div ref={slotRef} style={{ height: contentH }} className="w-full max-w-[430px]" aria-hidden />

      {geo && (
        <motion.div
          data-zone
          role={full ? "dialog" : undefined}
          aria-label={full ? "Pata, full view" : undefined}
          initial={false}
          animate={target}
          transition={spring}
          style={{ visibility: dims ? "visible" : "hidden" }}
          className={`absolute left-0 top-0 z-40 overflow-hidden border border-white/10 bg-[#1d1d1d] ${ZONE}`}
        >
          {/* the window itself */}
          <motion.div
            ref={contentRef}
            initial={false}
            animate={{ padding: full ? FP : P }}
            transition={spring}
            aria-hidden={closed}
            style={freeze && closed ? { width: geo.w - 2, height: contentH - 2 } : { width: "100%", height: "100%" }}
            className="absolute left-0 top-0 flex flex-col"
          >
            <div ref={headerRef} className="flex items-center justify-between">
              <TrafficLights mode={mode} setMode={go} />
              <span className="text-[14px] font-medium tracking-[-0.02em] text-white/70">Your Next Challenge</span>
            </div>

            <motion.div ref={bodyRef} initial={false} animate={bodyAnim} transition={spring} className="grid min-h-0 flex-1 overflow-hidden">
              {/* data-lenis-prevent: lets this area scroll with the wheel (phones) */}
              <div
                ref={controlsRef}
                data-lenis-prevent
                className="min-w-0 max-h-full self-start overflow-y-auto md:overflow-visible"
              >
                {controls}
              </div>

              {/* editor: a drawer that is revealed as the window grows */}
              <div className="relative min-h-0 min-w-0 overflow-hidden rounded-xl">
                <motion.div
                  variants={editorV}
                  initial={false}
                  animate={full ? "show" : "hidden"}
                  className="absolute inset-0 flex flex-col rounded-xl border border-white/10 bg-black/50 font-mono text-[13px] md:min-w-[320px]"
                >
                  <div className="flex items-center gap-3 border-b border-white/10 px-4 py-2.5 text-[11px] text-white/45">
                    <span>solution.{EXT[lang]}</span>
                    <span className="ml-auto truncate">{ch.name}</span>
                  </div>
                  <div data-lenis-prevent className="min-h-0 flex-1 overflow-auto p-4 leading-6 text-white/80">
                    {starter(lang, ch.fn)
                      .split("\n")
                      .map((ln, i) => (
                        <motion.div key={`${lang}-${i}`} variants={lineV} className="flex gap-4">
                          <span className="w-4 select-none text-right text-white/25">{i + 1}</span>
                          <span className="whitespace-pre">{ln}</span>
                        </motion.div>
                      ))}
                  </div>
                  <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3 font-sans text-[12px] text-white/40">
                    <span>Hit TRAIN for another challenge</span>
                    <span className="hidden sm:inline">Esc or green to go back</span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* reopen tab: solid, and what the window shrinks into */}
          <motion.button
            type="button"
            aria-label="Reopen Pata"
            tabIndex={closed ? 0 : -1}
            onClick={() => setMode("normal")}
            initial={false}
            animate={{ opacity: closed ? 1 : 0 }}
            transition={{ duration: 0.12, delay: closed && !reduce ? 0.28 : 0 }}
            style={{ pointerEvents: closed ? "auto" : "none" }}
            className="absolute inset-0 z-10 flex items-center justify-center gap-2 bg-[#262626] text-[14px] text-white/85 outline-none transition-colors [@media(hover:hover)]:hover:bg-[#303030] focus-visible:ring-2 focus-visible:ring-white/50"
          >
            <Icon.Reload />
            Reopen Pata
          </motion.button>
        </motion.div>
      )}
    </>
  );
}

/* =====================================================================
   2. ANU — tests + a small chat
   ===================================================================== */

type TestDef = { name: string; pass: boolean; detail?: string; hint?: string };
type TestStatus = "running" | "pass" | "fail";

const TESTS: TestDef[] = [
  { name: "should work with empty array", pass: true },
  { name: "should remove duplicates", pass: false, detail: "[] to deeply equal [ A ]", hint: "Track what you've already seen with a Set." },
  { name: "should keep the original order", pass: false, detail: "[ B, A ] to deeply equal [ A, B ]", hint: "A Set keeps insertion order — spread it back into an array." },
  { name: "should ignore letter case", pass: false, detail: "[ a, A ] to deeply equal [ a ]", hint: "Normalise with toLowerCase() before comparing." },
  { name: "should handle null values", pass: false, detail: "[ null, null ] to deeply equal [ null ]", hint: "null is a valid Set value — make sure your filter doesn't drop it." },
];
const FINAL: TestStatus[] = TESTS.map((t) => (t.pass ? "pass" : "fail"));

type Msg = { id: number; role: "user" | "anu"; text: string; fresh?: boolean };
const PROMPTS = ["What is Pata?", "How do ranks work?", "What is Sabha?", "Review my approach"];

function answer(q: string): string {
  const s = q.toLowerCase();
  if (/pata|kata|challenge|practice/.test(s))
    return "Pata are small coding exercises crafted by the community. Pick a language and a topic, hit TRAIN, and solve one at a time — each one sharpens a single technique.";
  if (/rank|honor|kyu|level/.test(s))
    return "Every Pata carries a kyu rank. Solve higher-ranked ones to earn honor, and your profile climbs from Novice all the way to Grandmaster.";
  if (/sabha|community|event/.test(s))
    return "Sabha is the space within Devvrats where ideas come alive — developers, designers and thinkers gathering to build meaningful things together.";
  if (/review|approach|solution|stuck|help|bug|fail/.test(s))
    return "Walk me through your approach. A good start: write the smallest failing test, make it pass, then refactor — I can hint at each step without spoiling it.";
  if (/\b(hi|hello|hey)\b|who are you|\banu\b/.test(s))
    return "I'm Anu, your assistant at Devvrats. I can explain Pata, ranks and Sabha, or help you debug a failing test.";
  return "I'm still learning that one. Try asking about Pata, ranks, Sabha, or a failing test.";
}

function AnuPanel() {
  const canHover = useCanHover();
  const [tab, setTab] = useState<"tests" | "chat">("tests");
  const [status, setStatus] = useState<TestStatus[]>(FINAL);
  const [time, setTime] = useState(842);
  const [running, setRunning] = useState(false);
  const [open, setOpen] = useState<number | null>(1);

  const [msgs, setMsgs] = useState<Msg[]>([
    { id: 0, role: "anu", text: "Hi, I'm Anu. Ask me about Devvrats, Pata or your next rank." },
  ]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const idRef = useRef(1);
  const listRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [msgs, typing, tab]);

  const run = () => {
    if (running) return;
    setRunning(true);
    setStatus(TESTS.map(() => "running"));
    TESTS.forEach((t, i) => {
      timers.current.push(
        setTimeout(() => {
          setStatus((s) => s.map((v, j) => (j === i ? (t.pass ? "pass" : "fail") : v)));
          if (i === TESTS.length - 1) {
            setTime(Math.round(600 + Math.random() * 380));
            setRunning(false);
          }
        }, 300 + i * 240),
      );
    });
  };

  const send = (text: string, forced?: string) => {
    const q = text.trim();
    if (!q || typing) return;
    setMsgs((m) => [...m, { id: idRef.current++, role: "user", text: q }]);
    setInput("");
    setTyping(true);
    timers.current.push(
      setTimeout(() => {
        setMsgs((m) => [...m, { id: idRef.current++, role: "anu", text: forced ?? answer(q), fresh: true }]);
        setTyping(false);
      }, 750),
    );
  };

  const askAbout = (t: TestDef) => {
    setTab("chat");
    send(`Why is "${t.name}" failing?`, `${t.hint} The failure says: expected ${t.detail}.`);
  };

  const passed = status.filter((s) => s === "pass").length;
  const failed = status.filter((s) => s === "fail").length;

  return (
    <div
      data-zone
      className={`flex h-[400px] w-full max-w-[460px] flex-col rounded-2xl bg-[#121212] p-4 text-[12px] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)] md:p-5 md:text-[13px] ${ZONE}`}
    >
      {/* tabs */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="relative flex rounded-xl bg-white/[0.06] p-1">
          {(["tests", "chat"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className="relative z-10 rounded-lg px-3.5 py-1.5 text-[12px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              {tab === t && (
                <motion.span
                  layoutId="anu-tab"
                  transition={{ duration: 0.35, ease: GENTLE }}
                  className="absolute inset-0 -z-10 rounded-lg bg-white/[0.12]"
                />
              )}
              <span className={tab === t ? "text-white" : "text-white/50"}>{t === "tests" ? "Tests" : "Ask Anu"}</span>
            </button>
          ))}
        </div>

        {tab === "tests" && (
          <motion.button
            type="button"
            onClick={run}
            disabled={running}
            whileHover={running || !canHover ? undefined : { backgroundColor: "rgba(255,255,255,0.14)" }}
            whileTap={running ? undefined : { scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="shrink-0 rounded-lg bg-white/[0.08] px-3 py-1.5 text-[11px] font-medium text-white outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:opacity-50"
          >
            {running ? "Running…" : "Run tests"}
          </motion.button>
        )}
      </div>

      <div className="relative min-h-0 flex-1">
        <AnimatePresence mode="wait" initial={false}>
          {tab === "tests" ? (
            <motion.div
              key="tests"
              initial={swapIn}
              animate={swapShow}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.26, ease: GENTLE }}
              className="flex h-full flex-col"
            >
              <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-white/55">
                <span className="text-blue-400">Time:</span>
                <span className="tabular-nums">{running ? "…" : `${time}ms`}</span>
                <span className="ml-1 text-green-400">Passed:</span>
                <span className="tabular-nums">{passed}</span>
                <span className="ml-1 text-red-400">Failed:</span>
                <span className="tabular-nums">{failed}</span>
                <span className="ml-1 text-yellow-400">Exit Code:</span>
                <span>{running ? "…" : failed > 0 ? 1 : 0}</span>
              </div>

              <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto border-t border-white/10 pt-3">
                <div className="mb-2 text-red-400">Test Results:</div>
                <ul className="space-y-0.5 font-mono text-[11.5px] md:text-[12px]">
                  {TESTS.map((t, i) => {
                    const st = status[i];
                    const isOpen = open === i && st === "fail";
                    return (
                      <li key={t.name}>
                        <motion.button
                          type="button"
                          aria-expanded={t.pass ? undefined : isOpen}
                          onClick={() => !t.pass && st !== "running" && setOpen(isOpen ? null : i)}
                          whileHover={canHover ? { backgroundColor: "rgba(255,255,255,0.05)" } : undefined}
                          transition={{ duration: 0.18 }}
                          className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-white/30 ${
                            t.pass ? "cursor-default" : "cursor-pointer"
                          }`}
                        >
                          <span className="flex h-4 w-4 items-center justify-center">
                            <AnimatePresence mode="wait" initial={false}>
                              <motion.span
                                key={st}
                                initial={{ opacity: 0, scale: 0.6 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.6 }}
                                transition={{ duration: 0.16 }}
                                className={st === "pass" ? "text-green-400" : st === "fail" ? "text-red-400" : "text-white/40"}
                              >
                                <StatusIcon st={st} />
                              </motion.span>
                            </AnimatePresence>
                          </span>
                          <span className="text-white/75">{t.name}</span>
                          {!t.pass && st === "fail" && (
                            <motion.span animate={{ rotate: isOpen ? 90 : 0 }} transition={SOFT} className="ml-auto text-white/30">
                              <Icon.Chevron />
                            </motion.span>
                          )}
                        </motion.button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: GENTLE }}
                              className="overflow-hidden"
                            >
                              <div className="ml-8 space-y-1.5 pb-2 pt-1">
                                <div className="text-red-400">
                                  <span className="text-white/45">expected:</span> {t.detail}
                                </div>
                                <div className="rounded-md bg-[#a78bfa]/10 px-2.5 py-2 font-sans text-[12px] text-[#c4b5fd]">
                                  <span className="font-medium">Anu:</span> {t.hint}
                                </div>
                                <motion.button
                                  type="button"
                                  onClick={() => askAbout(t)}
                                  whileHover={canHover ? { backgroundColor: "rgba(167,139,250,0.22)" } : undefined}
                                  whileTap={{ scale: 0.97 }}
                                  transition={{ duration: 0.18 }}
                                  className="rounded-md bg-[#a78bfa]/10 px-2.5 py-1.5 font-sans text-[11.5px] text-[#c4b5fd] outline-none focus-visible:ring-2 focus-visible:ring-[#a78bfa]/60"
                                >
                                  Ask Anu to explain →
                                </motion.button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {t.pass && st === "pass" && <div className="ml-8 pb-1 text-green-400/80">Completed in 1ms</div>}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={swapIn}
              animate={swapShow}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.26, ease: GENTLE }}
              className="flex h-full flex-col"
            >
              <div ref={listRef} data-lenis-prevent className="min-h-0 flex-1 space-y-2.5 overflow-y-auto pr-1">
                {msgs.map((m) => (
                  <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                    <div
                      className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-[1.35] ${
                        m.role === "user" ? "bg-white/[0.12] text-white" : "bg-[#a78bfa]/10 text-[#ddd6fe]"
                      }`}
                    >
                      {m.fresh ? <RevealWords text={m.text} /> : m.text}
                    </div>
                  </div>
                ))}
                {typing && (
                  <div className="flex justify-start">
                    <div className="flex gap-1 rounded-2xl bg-[#a78bfa]/10 px-3.5 py-3">
                      {[0, 1, 2].map((d) => (
                        <motion.i
                          key={d}
                          animate={{ opacity: [0.25, 1, 0.25] }}
                          transition={{ duration: 0.9, repeat: Infinity, delay: d * 0.16 }}
                          className="h-1.5 w-1.5 rounded-full bg-[#c4b5fd]"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {PROMPTS.map((p) => (
                  <motion.button
                    key={p}
                    type="button"
                    onClick={() => send(p)}
                    whileHover={canHover ? { backgroundColor: "rgba(255,255,255,0.12)" } : undefined}
                    whileTap={{ scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="rounded-full bg-white/[0.06] px-3 py-1.5 text-[11.5px] text-white/70 outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  >
                    {p}
                  </motion.button>
                ))}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send(input);
                }}
                className="mt-2.5 flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 py-1.5 pl-3.5 pr-1.5"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask Anu anything…"
                  aria-label="Ask Anu"
                  className="min-w-0 flex-1 cursor-text bg-transparent text-[13px] text-white outline-none placeholder:text-white/30"
                />
                <motion.button
                  type="submit"
                  whileHover={canHover ? { backgroundColor: "rgba(255,255,255,0.9)" } : undefined}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  aria-label="Send"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  <Icon.ArrowUp />
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* =====================================================================
   3. RANKS — static diamonds, no hover logic. Pure SVG so it scales
   cleanly. 90px diamonds, 80px apart → slight overlap like the design.
   ===================================================================== */

const RANKS = [
  { name: "Novice", color: "#6b7280" },
  { name: "Apprentice", color: "#d97706" },
  { name: "Adept", color: "#eab308" },
  { name: "Expert", color: "#3b82f6" },
  { name: "Master", color: "#9333ea" },
  { name: "Grandmaster", color: "#dc2626" },
] as const;

function RanksPanel() {
  return (
    <svg
      viewBox="0 0 490 90"
      role="img"
      aria-label={`Six ranks: ${RANKS.map((r) => r.name).join(", ")}`}
      className="w-full max-w-[460px]"
    >
      {RANKS.map((r, i) => {
        const cx = 45 + i * 80;
        return <polygon key={r.name} fill={r.color} points={`${cx},0 ${cx + 45},45 ${cx},90 ${cx - 45},45`} />;
      })}
    </svg>
  );
}

/* ===================================================================== */

const PROJECTS: Project[] = [
  {
    title: "Sharpen your coding skills",
    desc: (
      <>
        Challenge yourself on small coding exercises called <em className="text-orange-300">Pata</em>. Each Pata is
        crafted by the community to strengthen coding techniques. Master your favorite language or pick from 5+ others.
      </>
    ),
    cta: "Try Pata",
    href: "/Train",
    tags: ["Practice", "Core languages",],
    cursor: "Explore Pata",
    cursorTone: CURSOR_TONE,
    icon: (
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500 text-[17px] font-bold text-white md:h-[52px] md:w-[52px]">
        {"{}"}
      </span>
    ),
    ui: <PataPanel />,
    wide: true,
    bg: "bg-[#161616] bg-[radial-gradient(60%_80%_at_85%_35%,rgba(167,139,250,0.20),transparent_70%)]",
    text: "text-white",
    sub: "text-white/60",
    chip: "bg-white/[0.07] text-white/90",
  },
  {
    title: "Anu",
    desc: "Meet Anu - your personal assistant and the backbone of Devvrats. From guiding you through coding challenges to connecting with the community, Anu empowers every member.",
    cta: "Talk to Anu",
    href: "#",
    tags: ["AI assistant", "Core member",],
    cursor: "Meet Anu",
    cursorTone: CURSOR_TONE,
    ui: <AnuPanel />,
    bg: "bg-[#e7e7e7]",
    text: "text-[#111]",
    sub: "text-black/60",
    chip: "bg-black/[0.08] text-black/60",
  },
  {
    title: "Earn ranks and honor",
    desc: "Kata code challenges are ranked from beginner to expert level. As you complete higher-ranked kata, you level up your profile and push your skills to the highest potential.",
    cta: "Powered by DID",
    href: "#",
    tags: ["Progression", "Devvrats. ID"],
    cursor: "Climb the ranks",
    cursorTone: CURSOR_TONE,
    icon: (
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-yellow-400 md:h-[52px] md:w-[52px]">
        <svg className="h-5 w-5 md:h-6 md:w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" />
        </svg>
      </span>
    ),
    ui: <RanksPanel />,
    bg: "bg-[#161616]",
    text: "text-white",
    sub: "text-white/60",
    chip: "bg-white/[0.07] text-white/90",
  },
];

/* ---------- card ---------- */
const CURSOR_GAP = 18;
const SPRING = { stiffness: 240, damping: 28, mass: 0.5 };

function ProjectCard({ p }: { p: Project }) {
  const canHover = useCanHover();
  const [hovered, setHovered] = useState(false);
  const [ctaFocused, setCtaFocused] = useState(false);
  const active = hovered || ctaFocused;

  /* cursor-following label */
  const labelRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, SPRING);
  const y = useSpring(my, SPRING);
  const [inside, setInside] = useState(false);
  const [overUi, setOverUi] = useState(false);
  const labelOn = inside && !overUi;

  // follows the pointer; flips to the other side of it near the card's right / bottom edge
  const track = (e: MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const w = labelRef.current?.offsetWidth ?? 140;
    const h = labelRef.current?.offsetHeight ?? 36;
    const px = e.clientX - r.left;
    const py = e.clientY - r.top;
    mx.set(px + CURSOR_GAP + w > r.width - 12 ? px - CURSOR_GAP - w : px + CURSOR_GAP);
    my.set(py + CURSOR_GAP + h > r.height - 12 ? py - CURSOR_GAP - h : py + CURSOR_GAP);
    // the label steps aside only when the pointer is actually over an interactive panel, not when it is near one
    setOverUi(!!(e.target as Element).closest?.("[data-zone]"));
  };

  // tiny hover-intent delay so quickly passing the cursor over a card doesn't swap the heading
  const intent = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const enter = (e: MouseEvent<HTMLElement>) => {
    if (!canHover) return; // touch: no hover swap, no trailing label (the CTA button is always visible)
    track(e);
    x.jump(mx.get()); // snap to the entry point so it doesn't fly in from 0,0
    y.jump(my.get());
    setInside(true);
    clearTimeout(intent.current);
    intent.current = setTimeout(() => setHovered(true), 60);
  };
  const leave = () => {
    clearTimeout(intent.current);
    setHovered(false);
    setInside(false);
    setOverUi(false);
  };
  useEffect(() => () => clearTimeout(intent.current), []);

  return (
    <article
      data-slow
      onMouseEnter={enter}
      onMouseMove={track}
      onMouseLeave={leave}
      className={`relative isolate flex cursor-pointer min-h-[560px] w-full flex-col overflow-hidden rounded-[28px] p-5 md:p-7 ${
        p.wide ? "md:col-span-2 md:min-h-[640px]" : "md:min-h-[690px]"
      } ${p.bg}`}
    >
      {/* trailing cursor label — fades out over the card's interactive zone */}
      <motion.div
        ref={labelRef}
        aria-hidden
        style={{ x, y }}
        className="pointer-events-none absolute left-0 top-0 z-50 hidden will-change-transform [@media(hover:hover)]:block"
      >
        <motion.span
          initial={false}
          animate={{
            opacity: labelOn ? 1 : 0,
            filter: labelOn ? "blur(0px)" : "blur(6px)",
            scale: labelOn ? 1 : 0.85,
          }}
          transition={{ duration: 0.2, ease: GENTLE }}
          className={`block origin-top-left whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-medium ${p.cursorTone}`}
        >
          {p.cursor}
        </motion.span>
      </motion.div>

      {/* top row: icon badge + tags */}
      <div className="flex items-start justify-between gap-3">
        <div>{p.icon}</div>
        <div className="flex flex-wrap justify-end gap-2">
          {p.tags.map((t) => (
            <span key={t} className={`rounded-2xl px-4 py-2.5 text-[13px] tracking-[-0.02em] md:text-[15px] ${p.chip}`}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* live, interactive UI */}
      <div
        className={`flex flex-1 items-center py-8 ${
          p.wide ? "justify-center md:justify-end md:pr-[7%]" : "justify-center"
        }`}
      >
        {p.ui}
      </div>

      {/* title + description */}
      <div className="max-w-[520px]">
        <div className="grid pb-1">
          <h3
            className={`col-start-1 row-start-1 text-[26px] font-medium leading-[1.1] tracking-[-0.04em] md:text-[34px] ${p.text}`}
          >
            <ProgressiveText text={p.title} show={!active} delay={0.28} />
          </h3>
          <a
            href={p.href}
            onFocus={() => setCtaFocused(true)}
            onBlur={() => setCtaFocused(false)}
            style={{ pointerEvents: active ? "auto" : "none" }}
            className={`col-start-1 row-start-1 w-fit text-[26px] font-medium leading-[1.1] tracking-[-0.04em] outline-none md:text-[34px] ${p.text}`}
          >
            <ProgressiveText text={p.cta} show={active} delay={0.28} />
          </a>
        </div>

        <p className={`mt-2 text-[15px] leading-[1.3] tracking-[-0.02em] md:text-[17px] ${p.sub}`}>{p.desc}</p>

        {/* touch devices have no hover, so they get a visible button */}
        <a
          href={p.href}
          className={`mt-4 hidden w-fit rounded-2xl px-4 py-2.5 text-[15px] [@media(hover:none)]:inline-flex ${p.chip}`}
        >
          {p.cta}
        </a>
      </div>
    </article>
  );
}

/* ---------- section ---------- */
export default function Fundamentals() {
  const ref = useRef<HTMLDivElement>(null);
  // plays once, the first time the intro scrolls into view, and never resets
  const reached = useInView(ref, { amount: 0.3, once: true });

  const headline = HEADLINE_PARTS.map((p) => p.text).join(" ");

  return (
    <MotionConfig reducedMotion="user">
      <section id="work" className="relative overflow-hidden bg-[#060606] pb-16 pt-24 md:pb-20 lg:pt-36">
        {/* intro — blur/tilt headline + fading paragraphs */}
        <motion.div
          ref={ref}
          variants={block}
          initial="hidden"
          animate={reached ? "show" : "hidden"}
          className="mx-auto w-full max-w-[665px] px-6 md:px-0 lg:max-w-[1000px]"
        >
          <motion.h1
            variants={h1}
            aria-label={headline}
            className="text-[44px] font-light leading-[0.95] tracking-[-0.05em] sm:text-[52px] md:text-[64px] lg:text-[96px]"
          >
            {WORDS.map(({ w, tone }, i) => (
              <span key={i} aria-hidden>
                <motion.span
                  variants={word}
                  className={`-mx-[0.12em] -my-[0.2em] inline-block origin-bottom-left px-[0.12em] py-[0.2em] ${
                    tone === "light" ? "text-white" : "text-[#7d7d7d]"
                  }`}
                >
                  {w}
                </motion.span>{" "}
              </span>
            ))}
          </motion.h1>

          <div className="mt-7 grid gap-4 md:mt-9 md:grid-cols-[1fr_220px] md:gap-10 lg:mt-12 lg:grid-cols-[1fr_320px] lg:gap-20">
            <motion.p
              variants={reveal}
              custom={0}
              className="text-[22px] leading-[1.12] tracking-[-0.05em] text-[#6b6b6b] md:text-[18px] md:leading-[1.2] md:tracking-[-0.045em] lg:text-[27px]"
            >
              <span style={{ color: PURPLE }}>{LEAD}</span> {BODY}
            </motion.p>

            <motion.p
              variants={reveal}
              custom={1}
              className="text-[18px] leading-[1.15] tracking-[-0.045em] text-[#6b6b6b] md:-mt-1 md:text-[14px] lg:text-[21px]"
            >
              {SIDE}
            </motion.p>
          </div>
        </motion.div>

        {/* cards — Pata spans the full row, Anu + Ranks sit side by side */}
        <div className="mt-12 grid grid-cols-1 gap-4 px-6 md:mt-16 md:grid-cols-2 md:gap-3.5 md:px-3.5 lg:mt-20">
          {PROJECTS.map((p) => (
            <ProjectCard key={p.title} p={p} />
          ))}
        </div>
      </section>
    </MotionConfig>
  );
}