"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Navbar from "./navbar";

const Orb = dynamic(() => import("./orb"), {
  ssr: false,
});

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // ☀️ Soft rising light-mote effect (sunrise theme)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const motes: {
      x: number;
      y: number;
      size: number;
      speed: number;
      alpha: number;
    }[] = [];

    for (let i = 0; i < 60; i++) {
      motes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.5 + 0.5,
        speed: Math.random() * 0.4 + 0.15,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    let frameId: number;

    function drawMotes() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      motes.forEach((m) => {
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 196, 120, ${m.alpha})`;
        ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
        ctx.fill();

        m.y -= m.speed;

        if (m.y < 0) {
          m.y = height;
          m.x = Math.random() * width;
        }
      });

      frameId = requestAnimationFrame(drawMotes);
    }

    drawMotes();

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-between overflow-hidden font-inter bg-gradient-to-b from-[#FFF6E9] via-[#FFE7D2] to-[#FDEEE0]">
      <Navbar />

      {/* Soft sunrise glow near the horizon */}
      <div
        className="pointer-events-none absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[900px] max-h-[900px] rounded-full blur-3xl opacity-60 z-0"
        style={{
          background:
            "radial-gradient(circle, rgba(255,214,138,0.9) 0%, rgba(255,155,113,0.35) 45%, rgba(255,155,113,0) 75%)",
        }}
      />

      {/* Rising light motes */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0"
      />

      {/* Hero Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6 lg:px-12 max-w-4xl mt-32 sm:mt-36 space-y-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-3xl sm:text-4xl lg:text-6xl leading-tight text-neutral-900">
          <span className="block">Learning,Creating</span>

          <span className="block bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 bg-clip-text text-transparent font-bold">
            thriving together.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-neutral-700 max-w-3xl">
          Community of learners and creators, united by curiosity and
          collaboration. Ideas turn into action, skills transform into
          innovation, and together we shape the future of technology and
          beyond.
        </p>

        <a
          href="https://devvrats-blog.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 text-sm underline text-neutral-600 hover:text-neutral-900"
        >
          Read our Blogs
        </a>
      </motion.div>

      {/* Orb + "Meet Anu." intro */}
      <motion.div
        className="relative z-10 mt-4 sm:mt-4 md:mt-10 lg:mt-4 mb-6 sm:mb-8 lg:mb-2 w-full flex flex-col lg:flex-row items-center justify-center gap-2 sm:gap-3 lg:gap-8 px-4 sm:px-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Desktop: "Meet" sits before the orb */}
        <span className="anu-label hidden lg:block text-4xl xl:text-5xl 2xl:text-6xl">
          Meet
        </span>

        <div className="relative w-full max-w-[50rem] h-[44vh] sm:h-[48vh] min-h-[320px] lg:h-[56vh]">
          <Orb
            hue={0}
            hoverIntensity={0.3}
            rotateOnHover
            forceHoverState={false}
          />
        </div>

        {/* Desktop: "Anu." sits after the orb */}
        <span className="anu-label hidden lg:block text-4xl xl:text-5xl 2xl:text-6xl">
          Anu.
        </span>

        {/* Mobile/tablet: single line pulled up against the orb, no dead space */}
        <span className="anu-label mobile-anu-label lg:hidden -mt-6 sm:-mt-8 text-4xl sm:text-5xl">
          Meet Anu.
        </span>
      </motion.div>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700&display=swap");
      `}</style>

      <style jsx>{`
        .anu-label {
          font-family: "Bricolage Grotesque", sans-serif;
          font-weight: 700;
          letter-spacing: -0.01em;
          background-image: linear-gradient(
            100deg,
            #9c43fe 0%,
            #4cc2e9 35%,
            #1014b3 65%,
            #9c43fe 100%
          );
          background-size: 300% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
          animation: anu-flow 9s linear infinite;
          transition: filter 0.4s ease, letter-spacing 0.4s ease;
          cursor: default;
        }

        .anu-label:hover {
          animation-duration: 2.5s;
          filter: brightness(1.18) saturate(1.25);
          letter-spacing: 0.01em;
        }

        .mobile-anu-label {
          font-weight: 600;
        }

        @keyframes anu-flow {
          0% {
            background-position: 0% 50%;
          }

          100% {
            background-position: 300% 50%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .anu-label {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}