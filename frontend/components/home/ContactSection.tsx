"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Cpu, Smartphone, Wrench, Zap, MessageSquare } from "lucide-react";
import gsap from "gsap";

const PARTICLE_COUNT = 20;

const createSeededRandom = (seed: number) => {
  let value = seed;

  return () => {
    value += 0x6D2B79F5;
    let result = Math.imul(value ^ (value >>> 15), value | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
};

const PARTICLE_STYLES = Array.from({ length: PARTICLE_COUNT }, (_, index) => {
  const random = createSeededRandom(1337 + index);

  return {
    left: `${random() * 100}%`,
    opacity: random(),
  };
});

const ContactForm = () => {
  return (
    <div className="relative group">
      {/* Ambient Form Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#5227FF] via-[#00F5FF] to-[#8B5CF6] blur-xl opacity-20 transition-opacity duration-500 group-hover:opacity-40 rounded-3xl" />
      
      <div className="relative bg-[#050816]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 lg:p-12 z-10">
        <h3 className="text-2xl font-semibold text-white mb-8">Send us a Message</h3>
        
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input fields */}
            <div className="relative group/input">
              <input
                type="text"
                id="name"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 pt-6 pb-2 text-white focus:outline-none focus:border-[#00F5FF] transition-colors peer placeholder-transparent"
                placeholder="Name"
                required
              />
              <label
                htmlFor="name"
                className="absolute left-4 top-4 text-white/50 text-xs transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#00F5FF]"
              >
                Full Name
              </label>
              <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-[#5227FF] to-[#00F5FF] scale-x-0 peer-focus:scale-x-100 transition-transform origin-left rounded-b-xl" />
            </div>

            <div className="relative group/input">
              <input
                type="email"
                id="email"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 pt-6 pb-2 text-white focus:outline-none focus:border-[#00F5FF] transition-colors peer placeholder-transparent"
                placeholder="Email"
                required
              />
              <label
                htmlFor="email"
                className="absolute left-4 top-4 text-white/50 text-xs transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#00F5FF]"
              >
                Email Address
              </label>
              <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-[#5227FF] to-[#00F5FF] scale-x-0 peer-focus:scale-x-100 transition-transform origin-left rounded-b-xl" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative group/input">
              <input
                type="tel"
                id="phone"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 pt-6 pb-2 text-white focus:outline-none focus:border-[#00F5FF] transition-colors peer placeholder-transparent"
                placeholder="Phone"
              />
              <label
                htmlFor="phone"
                className="absolute left-4 top-4 text-white/50 text-xs transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#00F5FF]"
              >
                Phone Number
              </label>
              <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-[#5227FF] to-[#00F5FF] scale-x-0 peer-focus:scale-x-100 transition-transform origin-left rounded-b-xl" />
            </div>

            <div className="relative group/input">
              <select
                id="service"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 pt-6 pb-2 text-white focus:outline-none focus:border-[#00F5FF] transition-colors peer appearance-none"
                defaultValue=""
              >
                <option value="" disabled className="bg-[#050816] text-white/50">Select Service</option>
                <option value="smartphone" className="bg-[#050816]">Smartphone Repair</option>
                <option value="laptop" className="bg-[#050816]">Laptop Repair</option>
                <option value="appliance" className="bg-[#050816]">Home Appliance</option>
                <option value="other" className="bg-[#050816]">Other</option>
              </select>
              <label
                htmlFor="service"
                className="absolute left-4 top-2 text-white/50 text-xs peer-focus:text-[#00F5FF] transition-colors"
              >
                Service Type
              </label>
            </div>
          </div>

          <div className="relative group/input">
            <textarea
              id="message"
              rows={4}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 pt-6 pb-2 text-white focus:outline-none focus:border-[#00F5FF] transition-colors peer placeholder-transparent resize-none"
              placeholder="Message"
              required
            />
            <label
              htmlFor="message"
              className="absolute left-4 top-4 text-white/50 text-xs transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#00F5FF]"
            >
              How can we help you?
            </label>
            <div className="absolute inset-x-0 bottom-1 h-[2px] bg-gradient-to-r from-[#5227FF] to-[#00F5FF] scale-x-0 peer-focus:scale-x-100 transition-transform origin-left rounded-b-xl" />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full relative group/btn overflow-hidden rounded-xl p-[1px]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#5227FF] via-[#00F5FF] to-[#8B5CF6] rounded-xl opacity-70 group-hover/btn:opacity-100 transition-opacity duration-300" />
            <div className="relative bg-[#050816] hover:bg-transparent transition-colors duration-300 rounded-xl px-6 py-4 flex items-center justify-center gap-2">
              <span className="font-semibold text-white tracking-wide">Send Message</span>
              <Send size={18} className="text-[#00F5FF] group-hover/btn:translate-x-1 transition-transform" />
            </div>
          </motion.button>
        </form>
      </div>
    </div>
  );
};

const HolographicVisual = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // GSAP Floating Animation for Icons
    const icons = containerRef.current.querySelectorAll('.float-icon');
    icons.forEach((icon, i) => {
      gsap.to(icon, {
        y: `random(-20, 20)`,
        x: `random(-20, 20)`,
        rotation: `random(-15, 15)`,
        duration: `random(3, 6)`,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.2,
      });
    });

    // Particle Animation
    const particles = containerRef.current.querySelectorAll('.particle');
    particles.forEach((particle) => {
      gsap.to(particle, {
        y: -200,
        x: `random(-50, 50)`,
        opacity: 0,
        duration: `random(2, 5)`,
        repeat: -1,
        ease: "none",
        stagger: {
          each: 0.1,
          repeat: -1,
        }
      });
    });
  }, []);

  return (
    <div className="relative w-full h-[600px] flex items-center justify-center perspective-1000" ref={containerRef}>
      {/* Central Hologram Core */}
      <motion.div
        animate={{ rotateY: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="relative w-64 h-64 transform-style-3d"
      >
        <div className="absolute inset-0 border-2 border-[#00F5FF]/30 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute inset-4 border border-[#5227FF]/50 rounded-full" />
        <div className="absolute inset-8 border border-dashed border-[#8B5CF6]/40 rounded-full animate-spin-slow" />
        
        {/* Core Glowing Orb */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 bg-gradient-to-br from-[#5227FF] to-[#00F5FF] rounded-full blur-xl opacity-50" />
          <div className="w-24 h-24 bg-gradient-to-br from-[#5227FF] to-[#00F5FF] rounded-full mix-blend-screen" />
          <Cpu className="absolute text-white w-10 h-10 z-10" />
        </div>

        {/* Floating Rings */}
        <motion.div
          animate={{ rotateX: 360, rotateY: 180 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border border-[#00F5FF]/40 rounded-full rounded-[40%_60%_70%_30%]"
        />
        <motion.div
          animate={{ rotateX: -360, rotateZ: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-20px] border border-[#5227FF]/40 rounded-full rounded-[60%_40%_30%_70%]"
        />
      </motion.div>

      {/* Floating Icons */}
      <div className="absolute top-1/4 left-1/4 float-icon bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(82,39,255,0.2)]">
        <Smartphone className="text-[#00F5FF]" size={24} />
      </div>
      <div className="absolute bottom-1/4 right-1/4 float-icon bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(0,245,255,0.2)]">
        <Wrench className="text-[#5227FF]" size={24} />
      </div>
      <div className="absolute top-1/3 right-1/4 float-icon bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(139,92,246,0.2)]">
        <Zap className="text-[#8B5CF6]" size={24} />
      </div>

      {/* Particles */}
      {PARTICLE_STYLES.map((style, i) => (
        <div
          key={i}
          className="particle absolute bottom-0 w-1 h-1 bg-[#00F5FF] rounded-full blur-[1px]"
          style={style}
        />
      ))}

      {/* Floating Support Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        viewport={{ once: true }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:-right-10 bg-[#050816]/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-center gap-4 shadow-[0_0_40px_rgba(82,39,255,0.3)] z-20 w-[280px]"
      >
        <div className="relative">
          <div className="w-10 h-10 bg-[#00FFA3]/20 rounded-full flex items-center justify-center">
            <MessageSquare size={20} className="text-[#00FFA3]" />
          </div>
          <div className="absolute top-0 right-0 w-3 h-3 bg-[#00FFA3] rounded-full border-2 border-[#050816] animate-pulse" />
        </div>
        <div>
          <h4 className="text-white text-sm font-semibold flex items-center gap-2">
            Support Online
          </h4>
          <p className="text-white/50 text-xs">Avg Response: 2 mins</p>
        </div>
      </motion.div>
    </div>
  );
};

export default function ContactSection() {
  return (
    <section id="contacts" className="relative py-32 bg-[#050816] overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/2 right-0 w-[800px] h-[800px] bg-gradient-to-b from-[#5227FF]/10 to-[#00F5FF]/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5 pointer-events-none" style={{ backgroundSize: '40px 40px' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 mb-6"
          >
            <Zap className="text-[#8B5CF6] w-4 h-4" />
            <span className="text-white/80 text-sm font-medium tracking-wide uppercase">Get In Touch</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight max-w-3xl"
          >
            Let&apos;s Build Better <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5227FF] via-[#00F5FF] to-[#8B5CF6]">Repair Experiences</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/60 max-w-2xl"
          >
            Connect with RENOVA and experience the future of intelligent repair services.
          </motion.p>
        </div>

        {/* Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <ContactForm />
          </motion.div>

          {/* Right: Holographic Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <HolographicVisual />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
