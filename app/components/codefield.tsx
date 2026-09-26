"use client";

import { useEffect, useState, useCallback } from "react";

const SYMBOLS = [
  "{ }", "</>", "=>", "&&", "||", "::", ";", "=",
  "const", "function", "return", "0x", "[]", "()",
  "!==", "...", "import", "null", "( ) => grow",
];

type Fragment = {
  id: number;
  text: string;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
};

let uid = 0;
function makeFragment(): Fragment {
  return {
    id: uid++,
    text: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    x: 3 + Math.random() * 94,
    y: 3 + Math.random() * 94,
    size: 11 + Math.random() * 6,
    delay: Math.random() * 5,
    duration: 4 + Math.random() * 4.5,
  };
}

/**
 * Renders sparse, softly-fading programming fragments across an absolutely
 * positioned overlay. Fade in -> hold -> fade out -> replaced with a new
 * random fragment at a new position. No rotation, drift, or matrix-style motion.
 */
export default function CodeField({ density = 16 }: { density?: number }) {
  const [fragments, setFragments] = useState<Fragment[]>([]);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    const count = isMobile ? Math.max(4, Math.round(density * 0.4)) : density;
    setFragments(Array.from({ length: count }, () => makeFragment()));
  }, [density]);

  const handleEnd = useCallback((id: number) => {
    setFragments((prev) =>
      prev.map((f) =>
        f.id === id ? { ...makeFragment(), delay: 0.2 + Math.random() * 2 } : f
      )
    );
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {fragments.map((f) => (
        <span
          key={f.id}
          onAnimationEnd={() => handleEnd(f.id)}
          className="absolute select-none whitespace-nowrap  text-white/[0.14] animate-code-fade"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            fontSize: `${f.size}px`,
            animationDelay: `${f.delay}s`,
            animationDuration: `${f.duration}s`,
          }}
        >
          {f.text}
        </span>
      ))}
    </div>
  );
}