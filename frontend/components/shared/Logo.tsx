"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";

export default function Logo({ className = "" }: { className?: string }) {
  const draw: Variants = {
    hidden: { pathLength: 0, opacity: 0, fill: "rgba(0, 245, 255, 0)" },
    visible: (i: number) => {
      return {
        pathLength: [0, 1, 1, 0],
        opacity: [0, 1, 1, 0],
        fill: [
          "rgba(0, 245, 255, 0)",
          "rgba(0, 245, 255, 0)",
          "rgba(0, 245, 255, 1)",
          "rgba(0, 245, 255, 0)",
        ],
        transition: {
          duration: 4,
          ease: "easeInOut",
          repeat: Infinity,
          times: [0, 0.4, 0.8, 1],
          delay: i * 0.15,
          repeatDelay: 0.5,
        },
      };
    },
  };

  const paths = [
    "M2495 2860 c-65 -3 61 -7 305 -10 l415 -5 68 -27 c168 -67 255 -173 279 -338 32 -217 -59 -398 -246 -486 l-75 -36 201 -249 c110 -137 202 -249 204 -249 11 0 0 19 -32 55 -19 22 -80 99 -136 170 -56 72 -127 160 -160 197 l-58 67 72 38 c162 85 247 223 248 404 1 233 -110 385 -330 454 -46 15 -102 18 -350 19 -162 1 -344 -1 -405 -4z",
    "M2405 2790 c16 -25 31 -47 35 -50 3 -3 16 -21 28 -41 12 -19 31 -44 44 -55 12 -10 -5 19 -37 66 -67 98 -113 150 -70 80z",
    "M2805 2629 c-78 -4 -71 -5 55 -6 80 0 138 1 130 3 -35 7 -101 9 -185 3z",
    "M2593 2623 c9 -2 25 -2 35 0 9 3 1 5 -18 5 -19 0 -27 -2 -17 -5z",
    "M3080 2618 c95 -11 155 -46 190 -108 32 -58 35 -175 6 -230 -51 -95 -127 -124 -328 -122 -80 1 -140 -3 -143 -8 -10 -16 274 -12 329 4 69 21 122 60 148 109 32 60 33 193 1 254 -39 72 -125 114 -227 112 -47 -1 -45 -2 24 -11z",
    "M2489 2154 c-10 -12 -13 -91 -13 -359 0 -268 3 -347 13 -359 12 -14 50 -16 276 -16 275 0 292 3 283 45 -4 20 -526 705 -537 705 -5 0 -14 -7 -22 -16z m121 -144 c160 -214 382 -504 409 -532 l25 -28 -272 0 -272 0 0 352 c0 196 4 348 9 343 4 -6 50 -66 101 -135z",
    "M2795 2120 c8 -14 113 -149 125 -160 3 -3 27 -32 53 -65 171 -217 349 -435 359 -441 7 -4 6 1 -3 12 -17 21 -174 219 -372 470 -114 144 -186 226 -162 184z",
    "M3393 1443 c15 -2 39 -2 55 0 15 2 2 4 -28 4 -30 0 -43 -2 -27 -4z",
    "M3513 1443 c20 -2 54 -2 75 0 20 2 3 4 -38 4 -41 0 -58 -2 -37 -4z"
  ];

  return (
    <motion.div
      className={`relative group flex items-center justify-center ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Subtle Cyan Hover Glow */}
      <div className="absolute inset-0 bg-[#00F5FF]/30 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <motion.svg
        viewBox="230 100 140 200" // Tighter bounding box for the 'R' logo
        className="w-14 h-14 md:w-20 md:h-20 drop-shadow-[0_0_8px_rgba(0,245,255,0.8)]"
        initial="hidden"
        animate="visible"
      >
        <g transform="translate(0,400) scale(0.1,-0.1)">
          {paths.map((d, i) => (
            <motion.path
              key={i}
              d={d}
              custom={i}
              variants={draw}
              stroke="#00F5FF"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </g>
      </motion.svg>
    </motion.div>
  );
}
