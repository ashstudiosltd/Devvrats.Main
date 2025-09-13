"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scale = useTransform(scrollY, [0, 400], [1, 1.2]);

  // 🌌 Starfield + Shooting Stars effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const stars: { x: number; y: number; size: number; speed: number }[] = [];
    const shootingStars: { x: number; y: number; len: number; speed: number; life: number }[] = [];

    // Create base stars
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2,
        speed: Math.random() * 0.5 + 0.2,
      });
    }

    function drawStars() {
      ctx.clearRect(0, 0, width, height);

      // Gradient background (Antarctica vibes ❄️)
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#0a0c2c");
      gradient.addColorStop(1, "#09131a");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Static stars
      ctx.fillStyle = "white";
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        star.y += star.speed;
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }
      });

      // Shooting stars
      shootingStars.forEach((s, i) => {
        ctx.strokeStyle = "rgba(255,255,255,0.8)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.len, s.y + s.len);
        ctx.stroke();

        s.x += s.speed;
        s.y -= s.speed;
        s.life--;

        if (s.life <= 0) shootingStars.splice(i, 1);
      });

      // Random shooting star
      if (Math.random() < 0.005) {
        shootingStars.push({
          x: Math.random() * width,
          y: Math.random() * height * 0.5,
          len: Math.random() * 80 + 50,
          speed: Math.random() * 4 + 2,
          life: 80,
        });
      }

      requestAnimationFrame(drawStars);
    }

    drawStars();

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-between text-white overflow-hidden font-inter">
      {/* 🌌 Starfield Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0"
      ></canvas>

      {/* Header Nav */}
      <header className="fixed top-0 left-0 w-full z-20 transition-all duration-500">
        <div
          className={`mx-auto flex items-center justify-between px-6 py-4 lg:px-16 
          max-w-6xl mt-4 rounded-2xl shadow-lg transition-all duration-500
          ${
            scrolled
              ? " backdrop-blur-lg border border-white/10"
              : "bg-transparent border-transparent"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg tracking-wide">DEVVRATS.</span>
          </div>
          <a
            href="https://t.me/+EiuR--gamdYjQ9"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white/30 rounded-full px-5 py-2 text-sm 
              hover:bg-white/20 transition backdrop-blur-sm"
          >
            Join Sabha-Free Forever 
          </a>
        </div>
      </header>

      {/* Hero Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6 lg:px-12 max-w-4xl mt-32 space-y-6"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl lg:text-6xl  leading-tight">
          <span className="block">Learning,Creating</span>
          <span className="block bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent font-bold">
            thriving together.
          </span>
        </h1>
        <p className="text-lg text-gray-300 max-w-3xl">
          Community of learners and creators, united by curiosity and collaboration.
          Ideas turn into action, skills transform into innovation, and together we
          shape the future of technology and beyond.
        </p>

        <a
          href="/sabha"
          className="mt-2 text-sm underline text-gray-400 hover:text-gray-200"
        >
          Read our Blogs
        </a>
      </motion.div>

      {/* Video Section */}
      <motion.div
        className="relative z-10 mt-12 lg:mt-16 mb-20 w-full flex justify-center px-4 sm:px-6"
        style={{ scale }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Landscape Video */}
        <div className="hidden sm:block relative w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-2xl border border-gray-800">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/RMpbzYjDIas"
            title="YouTube video landscape"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* Portrait Video */}
        <div className="block sm:hidden relative w-full max-w-xs aspect-[9/16] rounded-xl overflow-hidden shadow-2xl border border-gray-800">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/yourPortraitVideoID"
            title="YouTube video portrait"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </motion.div>
    </section>
  );
}