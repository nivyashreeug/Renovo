"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Star, CheckCircle, ShieldCheck, Wrench, Zap, Clock, Smartphone, Cpu } from "lucide-react";
import gsap from "gsap";
import Image from "next/image";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Rahul Mehta",
    service: "AC Repair",
    text: "Absolutely incredible experience. The live tracking and technician professionalism felt futuristic.",
    rating: 5,
    status: "Completed",
    avatar: "https://i.pravatar.cc/150?img=11",
  },
  {
    id: 2,
    name: "Priya Sharma",
    service: "Mobile Repair",
    text: "RENOVA feels like the Tesla of repair platforms. Smooth, premium, and highly reliable.",
    rating: 5,
    status: "Completed",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 3,
    name: "Arjun Verma",
    service: "Vehicle Repair",
    text: "The realtime tracking and technician updates made the whole experience feel world-class.",
    rating: 5,
    status: "Completed",
    avatar: "https://i.pravatar.cc/150?img=8",
  },
  {
    id: 4,
    name: "Neha Gupta",
    service: "Laptop Repair",
    text: "I was blown away by the before/after results. The transparency is something no other service has.",
    rating: 5,
    status: "Completed",
    avatar: "https://i.pravatar.cc/150?img=9",
  },
  {
    id: 5,
    name: "Siddharth Rao",
    service: "Home Appliance",
    text: "Fastest repair service I've ever used. The glowing UI is just the cherry on top of great service.",
    rating: 5,
    status: "Completed",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
];

const ReviewCard = ({ testimonial }: { testimonial: typeof TESTIMONIALS[0] }) => {
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      className="relative w-[380px] shrink-0 rounded-3xl overflow-hidden group cursor-pointer"
    >
      {/* Animated Neon Border */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#5227FF] via-[#00F5FF] to-[#8B5CF6] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl p-[1px]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#5227FF] via-[#00F5FF] to-[#8B5CF6] blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
      </div>

      <div className="relative h-full bg-[#050816]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col gap-6 z-10 m-[1px]">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-14 h-14 rounded-full border-2 border-[#5227FF]/50"
              />
              <div className="absolute -bottom-1 -right-1 bg-[#00FFA3] rounded-full p-0.5 border-2 border-[#050816]">
                <ShieldCheck size={12} className="text-[#050816]" />
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold text-lg">{testimonial.name}</h4>
              <div className="flex items-center gap-2 text-[#00F5FF] text-sm">
                <Wrench size={14} />
                <span>{testimonial.service}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center bg-white/5 rounded-full px-3 py-1 border border-white/10">
            <CheckCircle size={14} className="text-[#00FFA3] mr-1.5" />
            <span className="text-white/80 text-xs">{testimonial.status}</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex gap-1">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} size={18} className="fill-[#00F5FF] text-[#00F5FF]" />
          ))}
        </div>

        {/* Review Text */}
        <p className="text-white/70 text-base leading-relaxed flex-grow">
          "{testimonial.text}"
        </p>

        {/* Footer / Before-After Indicator */}
        <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
          <div className="flex gap-2">
            <div className="text-xs bg-[#5227FF]/20 text-[#5227FF] px-2 py-1 rounded border border-[#5227FF]/30">
              Before: Damaged
            </div>
            <div className="text-xs bg-[#00FFA3]/20 text-[#00FFA3] px-2 py-1 rounded border border-[#00FFA3]/30">
              After: Restored
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const TrustMetrics = () => {
  const metrics = [
    { value: "5000+", label: "Repairs Completed", icon: Wrench, color: "#5227FF" },
    { value: "98%", label: "Customer Satisfaction", icon: Star, color: "#00F5FF" },
    { value: "1200+", label: "Verified Technicians", icon: ShieldCheck, color: "#00FFA3" },
    { value: "24/7", label: "Emergency Support", icon: Zap, color: "#FF4D6D" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-24 max-w-6xl mx-auto px-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="flex flex-col items-center justify-center p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm relative group overflow-hidden"
          >
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-2xl"
              style={{ backgroundColor: metric.color }}
            />
            <Icon size={32} className="mb-4" style={{ color: metric.color }} />
            <h3 className="text-4xl font-bold text-white mb-2 tracking-tight">
              {metric.value}
            </h3>
            <p className="text-white/60 text-sm text-center">{metric.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
};

const BeforeAfterSlider = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const position = ((x - rect.left) / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(position, 0), 100));
  };

  return (
    <div className="mt-32 max-w-5xl mx-auto px-6 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
          See the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5FF] to-[#5227FF]">Transformation</span>
        </h3>
        <p className="text-white/60 max-w-xl mx-auto">
          Drag the slider to see the dramatic difference our expert technicians can make.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative w-full aspect-video rounded-3xl overflow-hidden cursor-ew-resize border border-white/10 group"
        ref={containerRef}
        onMouseMove={handleDrag}
        onTouchMove={handleDrag}
      >
        {/* Glow behind */}
        <div className="absolute inset-0 bg-[#5227FF]/20 blur-[100px] -z-10" />

        {/* After Image (Background) */}
        <div className="absolute inset-0 bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
          {/* Abstract representation of "After" */}
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-[#050816] to-[#1a1040]">
             <Smartphone size={120} className="text-[#00F5FF] absolute top-1/2 left-[75%] -translate-x-1/2 -translate-y-1/2" strokeWidth={1} />
             <div className="absolute top-1/2 left-[75%] -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#00F5FF]/20 blur-3xl rounded-full" />
             <div className="absolute bottom-8 right-8 text-[#00F5FF] font-bold text-xl tracking-widest bg-black/50 px-4 py-2 rounded-xl backdrop-blur-md border border-[#00F5FF]/30">RESTORED</div>
          </div>
        </div>

        {/* Before Image (Foreground, clipped) */}
        <div
          className="absolute inset-0 bg-[#111] flex items-center justify-center overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          {/* Abstract representation of "Before" */}
          <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-[#050816] to-[#0a0a0a]">
             <Smartphone size={120} className="text-white/20 absolute top-1/2 left-[25%] -translate-x-1/2 -translate-y-1/2" strokeWidth={1} />
             <div className="absolute top-1/2 left-[25%] -translate-x-1/2 -translate-y-1/2 w-32 h-[2px] bg-white/20 rotate-45" />
             <div className="absolute bottom-8 left-8 text-white/50 font-bold text-xl tracking-widest bg-black/50 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">DAMAGED</div>
          </div>
        </div>

        {/* Slider Line */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[#00F5FF] to-transparent cursor-ew-resize flex items-center justify-center"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          <div className="w-8 h-8 rounded-full bg-[#050816] border-2 border-[#00F5FF] flex items-center justify-center shadow-[0_0_15px_rgba(0,245,255,0.5)]">
            <div className="w-4 h-4 text-[#00F5FF] flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-180"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function ReviewsSection() {
  return (
    <section id="reviews" className="relative py-32 bg-[#050816] overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#5227FF]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#00F5FF]/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="text-center relative z-10 px-6 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 mb-6"
        >
          <Star className="text-[#00F5FF] w-4 h-4" />
          <span className="text-white/80 text-sm font-medium tracking-wide uppercase">Community Trust</span>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
        >
          Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5227FF] via-[#00F5FF] to-[#8B5CF6] drop-shadow-[0_0_30px_rgba(0,245,255,0.3)]">Thousands</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto"
        >
          Real experiences from customers powered by RENOVA's premium repair ecosystem.
        </motion.p>
      </div>

      {/* Infinite Carousel */}
      <div className="relative flex overflow-hidden py-10">
        {/* Gradients for smooth fade out at edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#050816] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#050816] to-transparent z-10 pointer-events-none" />

        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 40,
            ease: "linear",
            repeat: Infinity,
          }}
          className="flex gap-8 px-4 w-max"
        >
          {/* Double the items for seamless loop */}
          {[...TESTIMONIALS, ...TESTIMONIALS].map((testimonial, i) => (
            <ReviewCard key={i} testimonial={testimonial} />
          ))}
        </motion.div>
      </div>

      {/* Before / After Showcase */}
      <BeforeAfterSlider />

      {/* Trust Metrics */}
      <TrustMetrics />
    </section>
  );
}
