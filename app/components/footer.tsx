"use client";

import React from "react";
import { FaInstagram, FaTelegram, FaGithub, FaFacebook, FaTwitter, FaReddit } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white/5 backdrop-blur-md border-t border-white/10 text-white p-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">
        
        {/* Left section: Logo + Description */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-semibold">DEVVRATS.</span>
          </div>
          <p className="text-gray-300 max-w-sm">
            Devvrats — Your ultimate learning and community platform for developers.
          </p>
          <div className="flex gap-3 mt-2">
            <a href="#" className="hover:text-gray-300 transition ">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="hover:text-gray-300 transition ">
              <FaTelegram size={20} />
            </a>
            <a href="#" className="hover:text-gray-300 transition ">
              <FaGithub size={20} />
            </a>
            <a href="#" className="hover:text-gray-300 transition ">
              <FaTwitter size={20} />
            </a>
            <a href="#" className="hover:text-gray-300 transition ">
              <FaFacebook size={20} />
            </a>
            <a href="#" className="hover:text-gray-300 transition ">
              <FaReddit size={20} />
            </a>
          </div>
        </div>

        {/* Middle section: Site map */}
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold text-lg">Site Map</h3>
          <a href="#Home" className="hover:text-gray-300 transition text-white">Home</a>
          <a href="#fundamentals" className="hover:text-gray-300 transition text-white">Our Fundamentals</a>
          <a href="#subscription" className="hover:text-gray-300 transition text-white">Be a Member</a>
        </div>

        {/* Right section: Actions */}
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-lg">Community</h3>
          <a href="/registration"><button className="text-black px-2 hover:text-gray-300 transition text-white">
            Login
          </button></a>
          <a href=""><button className="hover:text-gray-300 transition text-white px-2  ">
            Sabha
          </button></a>
        </div>

      </div>

      <div className="text-gray-500 text-sm mt-8 text-center">
        © 2022 Ashstudios. All Rights Reserved.
      </div>
    </footer>
  );
}