"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Fundamentals() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1 1"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.6, 1]);

  return (
    <section className="relative w-full text-white font-inter">
      {/* Background stars */}
      <div className="absolute inset-0 bg-[url('/stars.png')] bg-cover bg-center opacity-20" />

      <div
        ref={ref}
        className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 py-16 lg:py-24 space-y-12"
      >
        {/* Main Feature Card */}
        <motion.div
          style={{ scale, opacity }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-900/20 via-orange-900/10 to-yellow-900/5 
                     backdrop-blur-xl border border-red-500/20 shadow-2xl"
        >
          {/* Red accent icon */}
          <div className="absolute top-6 left-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500 rounded-lg flex items-center justify-center text-white text-lg sm:text-xl font-bold">
              {"{}"}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row min-h-[400px]">
            {/* Left Content */}
            <div className="flex-1 p-6 sm:p-8 pt-20 lg:pt-16 lg:pl-24">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-white">
                Sharpen your coding skills
              </h2>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
                Challenge yourself on small coding exercises called{" "}
                <em className="text-orange-300">Pata</em>. Each Pata is crafted
                by the community to strengthen coding techniques. Master your
                favorite language or pick from 5+ others.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="/Train">
                  <button className="bg-transparent border-2 border-white/30 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl text-sm sm:text-base text-white 
                                 hover:bg-white/10 hover:border-white/50 transition-all duration-300 font-medium">
                    Join the Kutir
                  </button>
                </a>
              </div>
            </div>

            {/* Right Preview Card */}
            <div className="flex-1 p-6 sm:p-8 flex items-center justify-center lg:justify-end">
              <div className="w-full max-w-md bg-gray-800/40 backdrop-blur-lg rounded-xl border border-gray-600/50 p-4 sm:p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-gray-300 font-medium text-sm sm:text-base">
                    Your Next Challenge
                  </h4>
                  <div className="flex space-x-1">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <select className="w-full bg-gray-900/80 border border-gray-600/50 rounded-lg px-3 sm:px-4 py-2 text-white text-sm">
                    <option>JavaScript</option>
                    <option>Python</option>
                    <option>C, C++</option>
                  </select>
                  <select className="w-full bg-gray-900/80 border border-gray-600/50 rounded-lg px-3 sm:px-4 py-2 text-white text-sm">
                    <option>Fundamentals</option>
                    <option>Algorithms</option>
                    <option>Data Structures</option>
                  </select>
                </div>

                <div className="flex space-x-2 mb-4">
                  <button className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-md font-medium">
                    TRAIN
                  </button>
                  <button className="px-3 py-1.5 bg-gray-600 text-white text-xs rounded-md">
                    SKIP
                  </button>
                </div>

                <div className="bg-gray-900/90 rounded-lg p-4 border border-gray-700/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="bg-gray-700 text-white px-2 py-1 rounded text-xs font-medium">
                        8 kyu
                      </span>
                      <span className="text-white font-medium text-sm">
                        Reversed Strings
                      </span>
                    </div>
                  </div>
                  <div className="font-mono text-xs sm:text-sm text-gray-300 space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-400">world</span>
                      <span className="text-gray-500">→</span>
                      <span className="text-green-400">dlrow</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-400">word</span>
                      <span className="text-gray-500">→</span>
                      <span className="text-green-400">drow</span>
                    </div>
                  </div>
                  <div className="flex space-x-4 mt-3 text-xs text-gray-400">
                    <span>STRINGS</span>
                    <span>FUNDAMENTALS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Two Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Anu Assistant */}
          <motion.div
            style={{ scale, opacity }}
            className="bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 sm:p-8 shadow-xl min-h-[400px]"
          >
            <div className="mb-6">
              <motion.div
                className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full mb-4"
                animate={{ scale: [1, 1.4, 1] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                }}
              />
              <h3 className="text-2xl font-bold text-white mb-4">Anu</h3>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                Meet Anu - your personal assistant and the backbone of
                Devvrats. From guiding you through coding challenges to
                connecting with the community, Anu empowers every member.
              </p>
            </div>

            {/* Test Results Panel */}
            <div className="bg-gray-900/80 rounded-lg border border-gray-700 p-3 sm:p-4 font-mono text-xs sm:text-sm">
              <div className="text-gray-400 mb-3 flex flex-wrap items-center gap-2">
                <span className="text-blue-400">Time:</span>
                <span>842ms</span>
                <span className="text-green-400">Passed:</span>
                <span>1</span>
                <span className="text-red-400">Failed:</span>
                <span>4</span>
                <span className="text-yellow-400">Exit Code:</span>
                <span>1</span>
              </div>
              <div className="border-t border-gray-700 pt-3">
                <h5 className="text-red-400 mb-2">Test Results:</h5>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-400">✓</span>
                    <span className="text-gray-300">
                      should work with empty array
                    </span>
                  </div>
                  <div className="text-green-400 ml-4 text-xs">
                    Completed in 1ms
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-red-400">✗</span>
                    <span className="text-gray-300">
                      should remove duplicates
                    </span>
                  </div>
                  <div className="text-red-400 ml-4 text-xs">
                    <span className="text-gray-400">expected:</span> [] to
                    deeply equal [ A ]
                  </div>
                  <div className="text-gray-500 ml-4 text-xs">
                    Completed in 1ms
                  </div>
                </div>
              </div>
            </div>
            <a href="">
              <button
                className="mt-6 bg-transparent border-2 border-white/30 px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg text-white 
                               hover:bg-white/10 hover:border-white/50 transition-all duration-300 font-medium shadow-lg text-sm sm:text-base"
              >
                Talk to Anu
              </button>
            </a>
          </motion.div>

          {/* Earn Ranks */}
          <motion.div
            style={{ scale, opacity }}
            className="bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6 sm:p-8 shadow-xl min-h-[400px]"
          >
            <div className="mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Earn ranks and honor
              </h3>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                Kata code challenges are ranked from beginner to expert level.
                As you complete higher-ranked kata, you level up your profile
                and push your skills to the highest potential.
              </p>
            </div>

            {/* Rank visualization */}
            <div className="relative flex items-center justify-center mt-8 p-4 sm:p-6">
              <div className="grid grid-cols-6 gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-500 transform rotate-45"></div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-amber-600 transform rotate-45"></div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-500 transform rotate-45"></div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 transform rotate-45"></div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-600 transform rotate-45"></div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-600 transform rotate-45"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}