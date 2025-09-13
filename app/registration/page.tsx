"use client";

import Image from "next/image";
import { Mail } from "lucide-react"; // Email icon

export default function LoginPage() {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Background with fade */}
      <div className="absolute inset-0">
        <Image
          src="/login-bg.jpg" // ✅ must be in /public
          alt="Background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
      </div>

      {/* Main layout */}
      <div className="relative z-10 flex h-full">
        {/* Sidebar */}
        <div className="flex flex-col justify-between w-full max-w-md relative text-white p-8">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent pointer-events-none" />

          {/* Top content */}
          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-8">
              <Image
                src="/devvrats-logo.png"
                alt="Devvrats Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="text-xl font-bold">devvrats.</span>
            </div>

            {/* Heading */}
            <h1 className="mb-4 leading-tight">
              <span className="block text-2xl lg:text-4xl leading-tight">
                Learning, Creating
              </span>
              <span className="block bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent font-bold text-2xl lg:text-4xl">
                Thriving Together.
              </span>
            </h1>

            {/* Subtext */}
            <p className="mb-8 text-gray-300 text-sm">
              We know how hard it is to be a developer. It doesn't have to be.
              Personalized news feed, dev community and search, much better
              than what's out there. Maybe ;)
            </p>

            {/* Login buttons */}
            <div className="space-y-3">
              {/* Google */}
              <button className="w-full flex items-center justify-center gap-2 bg-white text-black py-2 rounded-md hover:bg-gray-200 transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  className="w-5 h-5"
                >
                  <path
                    fill="#FFC107"
                    d="M43.6 20.5H42V20H24v8h11.3C33.6 32.4 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.6 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 20-9 20-20 0-1.3-.1-2.5-.4-3.5z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.3 14.7l6.6 4.8C14.4 16.1 18.8 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.1 6.6 29.4 4 24 4c-7.9 0-14.7 4.6-17.7 11.3z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24 44c5.2 0 10.1-2 13.7-5.2l-6.3-5.4C29.3 35.6 26.8 36.6 24 36c-5.2 0-9.6-3.6-11.2-8.4l-6.6 5C9.3 39.4 16.1 44 24 44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.4-3.5 6.3-6.6 7.9l6.3 5.4c-1.8 1.7 7-5.1 8-12.9.1-1.3.2-2.5.2-3.9z"
                  />
                </svg>
                Continue with Google
              </button>

              {/* GitHub */}
              <button className="w-full flex items-center justify-center gap-2 bg-white text-black py-2 rounded-md hover:bg-gray-200 transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 .297c-6.63 0-12 5.373-12 12 
                       0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 
                       0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61
                       -.546-1.387-1.333-1.756-1.333-1.756
                       -1.089-.745.083-.73.083-.73
                       1.205.085 1.84 1.236 1.84 1.236
                       1.07 1.834 2.807 1.304 3.492.997
                       .108-.776.418-1.305.762-1.605
                       -2.665-.305-5.466-1.334-5.466-5.93 
                       0-1.31.469-2.38 1.236-3.22
                       -.124-.303-.536-1.524.117-3.176 
                       0 0 1.008-.322 3.3 1.23
                       a11.52 11.52 0 013.003-.404
                       c1.018.005 2.043.138 3.003.404 
                       2.291-1.552 3.297-1.23 3.297-1.23
                       .655 1.652.243 2.873.119 3.176
                       .77.84 1.235 1.91 1.235 3.22 
                       0 4.61-2.803 5.624-5.475 5.92
                       .43.372.823 1.102.823 2.222 
                       0 1.606-.015 2.896-.015 3.286 
                       0 .319.218.694.825.576 
                       C20.565 22.092 24 17.592 24 12.297
                       c0-6.627-5.373-12-12-12z"
                  />
                </svg>
                Continue with GitHub
              </button>

              {/* Divider */}
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <div className="flex-1 h-px bg-gray-600" />
                OR
                <div className="flex-1 h-px bg-gray-600" />
              </div>

              {/* Email */}
              <button className="w-full flex items-center justify-center gap-2 bg-gray-800 py-2 rounded-md hover:bg-gray-700 transition">
                <Mail className="w-5 h-5" />
                Continue with Email
              </button>

              {/* Already have account */}
              <p className="text-sm text-gray-400">
                Already have an account?{" "}
                <a href="/login" className="underline">
                  Log in
                </a>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 text-xs text-gray-400 text-center">
            <div className="space-x-3 mb-2">
              <a href="#" className="hover:text-white transition">
                Guidelines
              </a>
              <a href="#" className="hover:text-white transition">
                Explore
              </a>
              <a href="#" className="hover:text-white transition">
                Tags
              </a>
              <a href="#" className="hover:text-white transition">
                Sources
              </a>
              <a href="#" className="hover:text-white transition">
                Squads
              </a>
              <a href="#" className="hover:text-white transition">
                Leaderboard
              </a>
            </div>
            <p>© 2025 Devvrats Ltd.</p>
          </div>
        </div>

        {/* Right side background only visible on large screens */}
        <div className="hidden lg:block flex-1" />
      </div>
    </div>
  );
}