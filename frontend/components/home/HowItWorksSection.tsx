"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { 
  CalendarCheck, UserCheck, MapPin, CheckCircle, 
  Clock, Star, FileText, Smartphone, Zap
} from "lucide-react";

const steps = [
  {
    id: "01",
    title: "Book Your Repair",
    desc: "Schedule repairs instantly with our intelligent booking platform.",
    icon: CalendarCheck,
    color: "#5227FF", // Primary
    VisualContent: () => (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute inset-0 bg-[#5227FF]/10 rounded-full blur-2xl animate-pulse" />
        <div className="relative z-10 w-40 h-48 bg-[#050816] rounded-2xl border border-[#5227FF]/30 p-4 shadow-[0_0_30px_rgba(82,39,255,0.2)] flex flex-col gap-3">
          <div className="w-full h-6 rounded bg-[#5227FF]/20 animate-pulse" />
          <div className="grid grid-cols-4 gap-2">
            {[...Array(12)].map((_, i) => (
              <div key={i} className={`h-6 rounded ${i === 5 ? 'bg-[#5227FF]' : 'bg-white/5'}`} />
            ))}
          </div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="mt-auto w-full py-2 rounded-lg bg-gradient-to-r from-[#5227FF] to-[#8B5CF6] flex items-center justify-center gap-2"
          >
            <span className="text-xs font-bold text-white">Book Now</span>
            <Zap className="w-3 h-3 text-white" />
          </motion.div>
        </div>
      </div>
    )
  },
  {
    id: "02",
    title: "Verified Technician Assigned",
    desc: "Get matched with trusted professionals based on expertise and availability.",
    icon: UserCheck,
    color: "#00F5FF", // Secondary
    VisualContent: () => (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute inset-0 bg-[#00F5FF]/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="relative z-10 w-48 bg-[#050816] rounded-2xl border border-[#00F5FF]/30 p-4 shadow-[0_0_30px_rgba(0,245,255,0.2)] flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00F5FF] to-[#5227FF] p-[2px]">
              <div className="w-full h-full rounded-full bg-[#050816] flex items-center justify-center">
                <UserCheck className="w-8 h-8 text-[#00F5FF]" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#00FFA3] border-2 border-[#050816] flex items-center justify-center">
              <CheckCircle className="w-3 h-3 text-[#050816]" />
            </div>
          </div>
          <div className="text-center">
            <div className="h-4 w-24 bg-white/20 rounded mx-auto mb-1" />
            <div className="h-3 w-16 bg-white/10 rounded mx-auto" />
          </div>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
        </div>
      </div>
    )
  },
  {
    id: "03",
    title: "Track in Real-Time",
    desc: "Monitor technician arrival and service progress with live tracking.",
    icon: MapPin,
    color: "#8B5CF6", // Accent
    VisualContent: () => (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#8B5CF6]/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "2s" }} />
        
        {/* Map UI */}
        <div className="relative z-10 w-full max-w-[200px] aspect-square rounded-full border border-[#8B5CF6]/30 bg-[#050816] overflow-hidden shadow-[0_0_30px_rgba(139,92,246,0.2)]">
          {/* Grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:1rem_1rem]" />
          
          {/* Animated Route */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <motion.path
              d="M 20 80 Q 40 40 80 20"
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="2"
              strokeDasharray="4 4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </svg>
          
          {/* Moving Marker */}
          <motion.div 
            className="absolute"
            animate={{ 
              x: ["20%", "80%"],
              y: ["80%", "20%"]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
          >
            <div className="w-6 h-6 -ml-3 -mt-3 rounded-full bg-[#8B5CF6]/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#8B5CF6] shadow-[0_0_10px_#8B5CF6]" />
            </div>
          </motion.div>
          
          {/* ETA Badge */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#050816]/80 backdrop-blur-md border border-[#8B5CF6]/30 flex items-center gap-2">
            <Clock className="w-3 h-3 text-[#8B5CF6]" />
            <span className="text-[10px] font-bold text-white tracking-widest">12 MIN</span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "04",
    title: "Repair Completed",
    desc: "Receive seamless service completion updates and digital invoices instantly.",
    icon: CheckCircle,
    color: "#00FFA3", // Success
    VisualContent: () => (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute inset-0 bg-[#00FFA3]/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "3s" }} />
        <div className="relative z-10 flex gap-4">
          {/* Device Card */}
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            className="w-24 h-36 bg-[#050816] rounded-xl border border-[#00FFA3]/30 shadow-[0_0_20px_rgba(0,255,163,0.15)] flex flex-col items-center justify-center gap-2"
          >
            <Smartphone className="w-8 h-8 text-[#00FFA3]" />
            <div className="px-2 py-0.5 rounded text-[8px] uppercase tracking-wider bg-[#00FFA3]/10 text-[#00FFA3] border border-[#00FFA3]/20">
              Fixed
            </div>
          </motion.div>
          
          {/* Invoice Card */}
          <motion.div 
            initial={{ y: -10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-24 h-32 mt-4 bg-white/[0.02] rounded-xl border border-white/10 backdrop-blur-md p-3 flex flex-col gap-2"
          >
            <div className="flex justify-between items-center border-b border-white/10 pb-1">
              <FileText className="w-4 h-4 text-white/50" />
              <div className="w-8 h-2 bg-white/10 rounded" />
            </div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="w-10 h-1.5 bg-white/5 rounded" />
                <div className="w-6 h-1.5 bg-white/10 rounded" />
              </div>
            ))}
            <div className="mt-auto flex justify-between items-center pt-1 border-t border-white/10">
              <div className="w-6 h-2 bg-white/20 rounded" />
              <div className="w-8 h-2 bg-[#00FFA3]/50 rounded" />
            </div>
          </motion.div>
        </div>
      </div>
    )
  }
];

export default function HowItWorksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const smoothLineHeight = useSpring(lineHeight, { stiffness: 50, damping: 20 });

  return (
    <section 
      ref={containerRef}
      className="relative w-full min-h-screen py-32 bg-[#050816] overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none mix-blend-overlay" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none" />
      
      {/* Ambient Lighting */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-[#5227FF]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-[#00F5FF]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
            <Zap className="w-4 h-4 text-[#00F5FF]" />
            <span className="text-xs font-semibold tracking-widest uppercase text-white/80">Workflow</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter text-white mb-6">
            How <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5227FF] via-[#00F5FF] to-[#8B5CF6] drop-shadow-[0_0_15px_rgba(0,245,255,0.3)]">RENOVA</span> Works
          </h2>
          <p className="text-lg md:text-xl text-white/60 font-light leading-relaxed max-w-2xl mx-auto">
            Experience seamless repair services powered by real-time tracking, verified technicians, and intelligent booking technology.
          </p>
        </motion.div>

        {/* Desktop Horizontal / Mobile Vertical Timeline */}
        <div className="relative hidden lg:block mb-32">
          {/* Horizontal Track line */}
          <div className="absolute top-[284px] left-[10%] right-[10%] h-0.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#5227FF] via-[#00F5FF] to-[#00FFA3] shadow-[0_0_15px_rgba(0,245,255,0.5)]"
              style={{ width: smoothLineHeight }}
            />
          </div>

          <div className="grid grid-cols-4 gap-8 relative z-10">
            {steps.map((step, idx) => (
              <motion.div 
                key={step.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="relative flex flex-col items-center group"
              >
                {/* Visual Card Above Node */}
                <div className="w-full h-64 mb-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-xl overflow-hidden group-hover:border-white/20 transition-colors duration-500 shadow-2xl relative">
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{ background: `radial-gradient(circle at 50% 100%, ${step.color}15, transparent 70%)` }}
                  />
                  <step.VisualContent />
                </div>

                {/* Timeline Node */}
                <div className="w-12 h-12 rounded-full bg-[#050816] border-[3px] border-white/20 flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                     style={{ borderColor: step.color }}>
                  <div className="absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300" style={{ backgroundColor: step.color }} />
                  <span className="text-white font-bold text-sm">{step.id}</span>
                </div>

                {/* Text Content Below Node */}
                <div className="mt-8 text-center px-4">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text transition-all duration-300"
                      style={{ backgroundImage: `linear-gradient(to right, white, ${step.color})` }}>
                    {step.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed group-hover:text-white/70 transition-colors duration-300">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile Vertical Timeline */}
        <div className="relative lg:hidden">
          {/* Vertical Track line */}
          <div className="absolute top-0 bottom-0 left-[28px] w-0.5 bg-white/10 rounded-full overflow-hidden">
             <motion.div 
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#5227FF] via-[#00F5FF] to-[#00FFA3] shadow-[0_0_15px_rgba(0,245,255,0.5)]"
              style={{ height: smoothLineHeight }}
            />
          </div>

          <div className="flex flex-col gap-16 relative z-10">
            {steps.map((step, idx) => (
              <motion.div 
                key={step.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative pl-20 group"
              >
                {/* Timeline Node */}
                <div className="absolute left-[8px] top-4 w-10 h-10 rounded-full bg-[#050816] border-[3px] flex items-center justify-center z-10 group-hover:scale-110 transition-transform duration-300"
                     style={{ borderColor: step.color }}>
                  <div className="absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300" style={{ backgroundColor: step.color }} />
                  <span className="text-white font-bold text-xs">{step.id}</span>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-6">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2" style={{ color: step.color }}>
                      {step.title}
                    </h3>
                    <p className="text-base text-white/60 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  {/* Visual Card */}
                  <div className="w-full h-56 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-xl overflow-hidden group-hover:border-white/20 transition-colors duration-500 relative">
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                      style={{ background: `radial-gradient(circle at 50% 100%, ${step.color}15, transparent 70%)` }}
                    />
                    <step.VisualContent />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
