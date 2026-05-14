"use client";

import React from "react";
import { motion } from "framer-motion";
import Antigravity from "@/components/Antigravity";
import TextPressure from "@/components/TextPressure";
import TextType from "@/components/TextType";
import FloatingCards from "./FloatingCards";

export default function Hero() {
  return (
    <section className="relative w-full h-screen min-h-[800px] flex flex-col items-center justify-center overflow-hidden bg-[#050816]">
      {/* Background Animation - React Bits Antigravity */}
      <div className="absolute inset-0 z-0">
        <Antigravity
          count={300}
          magnetRadius={6}
          ringRadius={7}
          waveSpeed={0.4}
          waveAmplitude={1}
          particleSize={1.5}
          lerpSpeed={0.05}
          color="#5227FF"
          autoAnimate
          particleVariance={1}
          rotationSpeed={0}
          depthFactor={1}
          pulseSpeed={3}
          particleShape="capsule"
          fieldStrength={10}
        />
        {/* Gradient overlays to blend the background and content */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#050816]/60 to-[#050816] z-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050816]/80 via-transparent to-[#050816] z-0" />
      </div>

      <FloatingCards />

      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center w-full max-w-7xl mx-auto px-6 mt-20">
        {/* Huge Animated Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-3xl flex justify-center mb-6"
        >
          <TextPressure
            text="RENOVA"
            flex
            alpha={false}
            stroke={false}
            width
            weight
            italic
            textColor="#ffffff"
            strokeColor="#5227FF"
            minFontSize={36}
          />
        </motion.div>

        {/* Headlines */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center space-y-6 max-w-3xl"
        >
          <div className="inline-block px-8 py-3 rounded-full bg-[#00F5FF]/10 border border-[#00F5FF]/30 backdrop-blur-md shadow-[0_0_20px_rgba(0,245,255,0.2)]">
            <h2 className="text-[#00F5FF] font-bold tracking-[0.2em] text-sm md:text-base uppercase drop-shadow-[0_0_8px_rgba(0,245,255,0.8)]">
              The Future of Repair Services
            </h2>
          </div>
          
          <div className="text-xl md:text-2xl lg:text-3xl text-white/90 font-light leading-relaxed h-[80px] md:h-auto flex items-center justify-center">
            <TextType
              text={[
                "The Future of Repair Services",
                "Trusted local technicians powered by real-time booking",
                "Live tracking and premium repair experiences"
              ]}
              typingSpeed={75}
              pauseDuration={1500}
              deletingSpeed={40}
              showCursor
              cursorCharacter="_"
              cursorBlinkDuration={0.5}
            />
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center gap-6 mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative px-8 py-4 rounded-full bg-[#5227FF] text-white font-semibold text-lg tracking-wide shadow-[0_0_30px_rgba(82,39,255,0.4)] overflow-hidden group border border-[#5227FF]/50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#5227FF] to-[#00F5FF] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -inset-1 bg-[#5227FF] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
            <span className="relative z-10">Book Repair</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 rounded-full border border-white/20 bg-white/[0.03] backdrop-blur-md text-white font-medium text-lg hover:bg-white/[0.08] transition-colors duration-300"
          >
            Explore Services
          </motion.button>
        </motion.div>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-10 z-20 w-full max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
      >
        <div className="flex flex-col items-center group">
          <span className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-[#5227FF] transition-colors">
            5000+
          </span>
          <span className="text-white/60 text-sm tracking-widest uppercase">Repairs</span>
        </div>
        <div className="flex flex-col items-center group">
          <span className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-[#00F5FF] transition-colors">
            1200+
          </span>
          <span className="text-white/60 text-sm tracking-widest uppercase">Technicians</span>
        </div>
        <div className="flex flex-col items-center group">
          <span className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-[#00FFA3] transition-colors">
            98%
          </span>
          <span className="text-white/60 text-sm tracking-widest uppercase">Satisfaction</span>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center z-20"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/0 via-white/50 to-white/0 overflow-hidden relative">
          <motion.div
            animate={{ y: [0, 48] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-full h-1/2 bg-[#00F5FF]"
          />
        </div>
      </motion.div>
    </section>
  );
}
