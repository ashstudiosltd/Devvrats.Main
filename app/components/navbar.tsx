"use client";

import { useEffect, useState } from "react";
import Logo from "./logo";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-20 transition-all duration-500 text-black">
      <div
        className={`mx-auto flex items-center justify-between px-6 py-4 lg:px-16 
        max-w-6xl mt-4 rounded-2xl shadow-lg transition-all duration-500
        ${
          scrolled
            ? "backdrop-blur-lg border border-black/10"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="flex items-center gap-2">
          <Logo className="h-7 w-7 text-black" />
          <span className="font-semibold text-lg tracking-wide">
            DEVVRATS.
          </span>
        </div>

        <a
          href="https://t.me/+EiuR--gamdYjQ9"
          target="_blank"
          rel="noopener noreferrer"
          className="border border-black/30 rounded-full px-5 py-2 text-sm 
            hover:bg-black/10 transition backdrop-blur-sm"
        >
          Join Sabha-Free Forever
        </a>
      </div>
    </header>
  );
}