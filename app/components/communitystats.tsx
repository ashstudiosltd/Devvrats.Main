"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const AnimatedCounter = ({ end, suffix = "", duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}{suffix}
    </span>
  );
};

export default function CommunityStats() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1 1"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

  return (
    <section className="relative w-full  text-white font-inter">
      {/* Background matching previous sections */}
      <div
        ref={ref}
        className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 py-24"
      >
        {/* Header */}
        <motion.div
          style={{ scale, opacity }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-light leading-tight text-white mb-8">
            An engaged software<br />
            development community
          </h2>
          <p className="text-gray-300 text-lg max-w-4xl mx-auto leading-relaxed">
            Devvrats is a collective effort by its users. They are creators—authoring challenges to 
            teach various techniques, solving problems with solutions that enlighten others, and 
            commenting with constructive feedback.
          </p>
        </motion.div>

        {/* Stats Card */}
        <motion.div
          style={{ scale, opacity }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-12 shadow-2xl border border-white/10"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {/* Stat 1 */}
            <div className="space-y-4">
              <div className="text-5xl lg:text-6xl font-bold text-white">
                <AnimatedCounter end={1} suffix="K+" />
              </div>
              <p className="text-white/90 text-lg font-medium">
                Community members added every month
              </p>
            </div>

            {/* Stat 2 */}
            <div className="space-y-4">
              <div className="text-5xl lg:text-6xl font-bold text-white">
                <AnimatedCounter end={100} suffix="+" />
              </div>
              <p className="text-white/90 text-lg font-medium">
                Challenges completed every month
              </p>
            </div>

            {/* Stat 3 */}
            <div className="space-y-4">
              <div className="text-5xl lg:text-6xl font-bold text-white">
                <AnimatedCounter end={1} suffix="K+" />
              </div>
              <p className="text-white/90 text-lg font-medium">
                Challenges created by our community Per year
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}