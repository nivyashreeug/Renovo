"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Navigation, User, Star, ShieldCheck, 
  Clock, CheckCircle2, ChevronRight, Activity
} from "lucide-react";

const trackingStages = [
  { id: 1, title: "Booking Confirmed", time: "10:00 AM", status: "completed" },
  { id: 2, title: "Technician Assigned", time: "10:15 AM", status: "completed" },
  { id: 3, title: "On The Way", time: "10:30 AM", status: "active" },
  { id: 4, title: "Repair In Progress", time: "Pending", status: "upcoming" },
  { id: 5, title: "Completed", time: "Pending", status: "upcoming" },
];

const liveUpdates = [
  "Technician is nearby",
  "Arriving in 5 minutes",
  "Traffic is clear",
  "Approaching location"
];

export default function LiveTrackingSection() {
  const [currentUpdate, setCurrentUpdate] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentUpdate((prev) => (prev + 1) % liveUpdates.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full min-h-screen py-32 bg-[#050816] overflow-hidden" id="tracking">
      {/* Background Ambient Effects */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none" />
      
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#5227FF]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00F5FF]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00F5FF]/10 border border-[#00F5FF]/30 backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(0,245,255,0.2)]">
            <Activity className="w-4 h-4 text-[#00F5FF] animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase text-[#00F5FF]">Live Status</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter text-white mb-6">
            Track Repairs in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5FF] to-[#5227FF] drop-shadow-[0_0_20px_rgba(0,245,255,0.4)]">Real-Time</span>
          </h2>
          <p className="text-lg md:text-xl text-white/60 font-light leading-relaxed max-w-2xl mx-auto">
            Monitor technician arrival, repair progress, and live service updates through RENOVA’s intelligent tracking system.
          </p>
        </motion.div>

        {/* Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:h-[700px]">
          
          {/* Main Map Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-8 relative rounded-3xl overflow-hidden bg-[#050816]/80 border border-white/10 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] group h-[500px] lg:h-full"
          >
            {/* Map Grid overlay */}
            <div className="absolute inset-0 bg-[#0A0D1F]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(82,39,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(82,39,255,0.05)_1px,transparent_1px)] bg-[size:2rem_2rem]" />
            
            {/* Cinematic Map Lighting */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-transparent to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050816] via-transparent to-[#050816] z-10 pointer-events-none" />
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[#00F5FF]/5 rounded-full blur-[80px]" />

            {/* SVG Animated Route */}
            <svg className="absolute inset-0 w-full h-full z-0" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#5227FF" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#00F5FF" stopOpacity="1" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <motion.path
                d="M 100 600 Q 250 400 400 500 T 700 200 T 900 100"
                fill="none"
                stroke="url(#routeGrad)"
                strokeWidth="4"
                strokeDasharray="10 10"
                filter="url(#glow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
            </svg>

            {/* Moving Technician Dot */}
            <motion.div 
              className="absolute z-20"
              animate={{ 
                x: ["10%", "90%"],
                y: ["85%", "15%"]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", repeatType: "reverse" }}
            >
              <div className="relative -ml-4 -mt-4">
                <div className="absolute inset-0 w-8 h-8 rounded-full bg-[#00F5FF] opacity-30 animate-ping" />
                <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-[#00F5FF] flex items-center justify-center shadow-[0_0_20px_#00F5FF]">
                  <Navigation className="w-4 h-4 text-[#00F5FF] drop-shadow-[0_0_5px_#00F5FF]" />
                </div>
              </div>
            </motion.div>

            {/* Destination Marker */}
            <div className="absolute z-10 right-[10%] top-[15%]">
              <div className="relative -ml-4 -mt-8 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[#00FFA3]/20 flex items-center justify-center mb-1">
                  <MapPin className="w-5 h-5 text-[#00FFA3] drop-shadow-[0_0_8px_#00FFA3]" />
                </div>
                <div className="w-2 h-2 rounded-full bg-[#00FFA3] shadow-[0_0_10px_#00FFA3]" />
              </div>
            </div>

            {/* UI Overlays on Map */}
            <div className="absolute inset-x-6 top-6 z-30 flex justify-between items-start pointer-events-none">
              {/* ETA Card */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="pointer-events-auto bg-[#050816]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 border border-[#00F5FF]/30 flex items-center justify-center group-hover:border-[#00F5FF] transition-colors relative">
                  <svg className="absolute inset-0 w-full h-full -rotate-90">
                    <circle cx="24" cy="24" r="22" fill="none" stroke="#ffffff10" strokeWidth="2" />
                    <motion.circle 
                      cx="24" cy="24" r="22" fill="none" stroke="#00F5FF" strokeWidth="2"
                      strokeDasharray="138"
                      animate={{ strokeDashoffset: [138, 0] }}
                      transition={{ duration: 60, ease: "linear", repeat: Infinity }}
                    />
                  </svg>
                  <Clock className="w-5 h-5 text-[#00F5FF]" />
                </div>
                <div>
                  <p className="text-xs text-white/50 uppercase tracking-widest font-semibold mb-0.5">Arriving In</p>
                  <p className="text-2xl font-bold text-white tracking-tight">08<span className="text-white/50 animate-pulse">:</span>24</p>
                </div>
              </motion.div>

              {/* Live Status Toasts */}
              <div className="pointer-events-auto flex flex-col items-end gap-3">
                <AnimatePresence mode="popLayout">
                  <motion.div 
                    key={currentUpdate}
                    initial={{ opacity: 0, x: 20, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="bg-[#050816]/90 backdrop-blur-xl border border-[#5227FF]/30 rounded-xl py-2 px-4 shadow-[0_4px_20px_rgba(82,39,255,0.15)] flex items-center gap-3"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#5227FF] shadow-[0_0_8px_#5227FF] animate-pulse" />
                    <span className="text-sm text-white/90 font-medium">{liveUpdates[currentUpdate]}</span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Technician Card (Bottom Left) */}
            <div className="absolute left-6 bottom-6 z-30 w-full max-w-[320px]">
              <motion.div 
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-[#050816]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-[#5227FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="flex items-center gap-4 relative z-10">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00F5FF] to-[#5227FF] p-[2px]">
                      <div className="w-full h-full rounded-[14px] bg-[#050816] flex items-center justify-center overflow-hidden">
                        <User className="w-8 h-8 text-white/50" />
                      </div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-[#00FFA3] rounded-full border-[3px] border-[#050816] flex items-center justify-center shadow-[0_0_10px_rgba(0,255,163,0.4)]">
                      <ShieldCheck className="w-3 h-3 text-[#050816]" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">Alex Mercer</h3>
                    <p className="text-xs text-[#00F5FF] font-medium tracking-wide uppercase mb-2">Senior Technician</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded text-xs text-white/80">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        <span>4.9</span>
                      </div>
                      <span className="text-xs text-white/40 border-l border-white/10 pl-3">432 Jobs</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

          </motion.div>

          {/* Vertical Tracking Progress Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="lg:col-span-4 bg-white/[0.02] border border-white/10 backdrop-blur-2xl rounded-3xl p-8 relative overflow-hidden flex flex-col"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#8B5CF6]/10 rounded-full blur-[80px] pointer-events-none" />
            
            <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#8B5CF6]" />
              Service Status
            </h3>

            <div className="flex-1 relative">
              {/* Connector Line Base */}
              <div className="absolute left-[19px] top-4 bottom-8 w-0.5 bg-white/5 rounded-full" />
              
              {/* Connector Line Active */}
              <div className="absolute left-[19px] top-4 h-[50%] w-0.5 bg-gradient-to-b from-[#00FFA3] via-[#00F5FF] to-transparent rounded-full" />

              <div className="flex flex-col gap-8 relative z-10">
                {trackingStages.map((stage, idx) => {
                  const isActive = stage.status === "active";
                  const isCompleted = stage.status === "completed";
                  const isUpcoming = stage.status === "upcoming";

                  return (
                    <motion.div 
                      key={stage.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                      className={`flex gap-6 group ${isUpcoming ? 'opacity-40' : 'opacity-100'}`}
                    >
                      {/* Node */}
                      <div className="relative mt-1">
                        <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center bg-[#050816] transition-colors duration-300
                          ${isCompleted ? 'border-[#00FFA3]' : isActive ? 'border-[#00F5FF] shadow-[0_0_15px_rgba(0,245,255,0.4)]' : 'border-white/20'}`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-[#00FFA3]" />
                          ) : isActive ? (
                            <div className="w-3 h-3 rounded-full bg-[#00F5FF] animate-ping" />
                          ) : (
                            <div className="w-2 h-2 rounded-full bg-white/20" />
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-2">
                        <h4 className={`text-base font-bold mb-1 transition-colors duration-300 
                          ${isCompleted ? 'text-white' : isActive ? 'text-[#00F5FF]' : 'text-white/60'}`}
                        >
                          {stage.title}
                        </h4>
                        <p className="text-sm text-white/40 font-medium tracking-wide">
                          {stage.time}
                        </p>
                        
                        {isActive && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            className="mt-3 bg-[#00F5FF]/10 border border-[#00F5FF]/20 rounded-lg p-3 flex items-start gap-2"
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-[#00F5FF] mt-1.5 animate-pulse" />
                            <p className="text-xs text-[#00F5FF]/80 leading-relaxed">
                              Technician is en route to your location. Expected to arrive exactly on time.
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8 w-full py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              View Full Details
              <ChevronRight className="w-4 h-4 text-white/50" />
            </motion.button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
