"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Star, ShieldCheck, MapPin, CheckCircle2, 
  ChevronRight, Wrench, Snowflake, Smartphone, Zap, Activity, Clock, Briefcase, TrendingUp, Users
} from "lucide-react";

const technicians = [
  {
    name: "Arjun Mehta",
    role: "AC Repair Specialist",
    rating: 4.9,
    jobs: "1200+",
    verified: true,
    status: "Available Now",
    statusColor: "#00FFA3",
    image: "https://i.pravatar.cc/150?u=a042581f4e29026704d", // Random avatar placeholder
  },
  {
    name: "Priya Sharma",
    role: "Mobile Repair Expert",
    rating: 4.8,
    jobs: "980+",
    verified: true,
    status: "Emergency Ready",
    statusColor: "#FF4D6D",
    image: "https://i.pravatar.cc/150?u=a04258a2462d826712d",
  },
  {
    name: "Vikram Rao",
    role: "Electrical Systems Specialist",
    rating: 5.0,
    jobs: "1500+",
    verified: true,
    status: "Busy",
    statusColor: "#FFD700",
    image: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  }
];

const categories = [
  { name: "AC Specialists", icon: Snowflake, count: "142 Active" },
  { name: "Mobile Experts", icon: Smartphone, count: "89 Active" },
  { name: "Electronics", icon: Zap, count: "215 Active" },
  { name: "Plumbing", icon: Wrench, count: "104 Active" },
];

export default function TechnicianSection() {
  return (
    <section className="relative w-full min-h-screen py-32 bg-[#050816] overflow-hidden" id="technicians">
      {/* Background Ambient Effects */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none" />
      
      <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] bg-[#5227FF]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-[#00F5FF]/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 space-y-32">
        
        {/* Section 1: Hero Technician Showcase */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
            <ShieldCheck className="w-4 h-4 text-[#00FFA3]" />
            <span className="text-xs font-bold tracking-widest uppercase text-white/80">Premium Professionals</span>
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-white mb-6">
            Meet RENOVA <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5FF] via-[#5227FF] to-[#8B5CF6] drop-shadow-[0_0_20px_rgba(82,39,255,0.4)]">Professionals</span>
          </h2>
          <p className="text-lg md:text-xl text-white/60 font-light leading-relaxed max-w-3xl mx-auto">
            Verified experts delivering premium repair experiences with realtime tracking and intelligent service management.
          </p>
        </motion.div>

        {/* Section 2: Featured Technician Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {technicians.map((tech, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative group rounded-[2rem] bg-[#050816]/60 border border-white/10 backdrop-blur-xl overflow-hidden p-6 shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
            >
              {/* Card Ambient Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#5227FF]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl pointer-events-none" />
              
              {/* Header */}
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  <div className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: tech.statusColor, color: tech.statusColor }} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">{tech.status}</span>
                </div>
                {tech.verified && (
                  <div className="w-8 h-8 rounded-full bg-[#00FFA3]/10 border border-[#00FFA3]/30 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,163,0.2)]">
                    <ShieldCheck className="w-4 h-4 text-[#00FFA3]" />
                  </div>
                )}
              </div>

              {/* Profile */}
              <div className="flex flex-col items-center text-center relative z-10 mb-8">
                <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-[#00F5FF] to-[#5227FF] mb-4 group-hover:scale-105 transition-transform duration-500 shadow-[0_0_30px_rgba(0,245,255,0.3)]">
                  <div className="w-full h-full rounded-full overflow-hidden bg-[#050816]">
                    {/* Placeholder image, assuming tech.image is accessible */}
                    <img src={tech.image} alt={tech.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-[#00F5FF] transition-colors">{tech.name}</h3>
                <p className="text-sm text-[#8B5CF6] font-medium tracking-wide">{tech.role}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-lg font-bold text-white">{tech.rating}</span>
                  </div>
                  <span className="text-xs text-white/40 uppercase tracking-widest font-semibold">Rating</span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-lg font-bold text-white mb-1">{tech.jobs}</span>
                  <span className="text-xs text-white/40 uppercase tracking-widest font-semibold">Repairs</span>
                </div>
              </div>

              {/* CTA */}
              <motion.button 
                whileTap={{ scale: 0.95 }}
                className="relative w-full py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold tracking-wide flex items-center justify-center gap-2 overflow-hidden group/btn transition-colors z-10"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#5227FF]/40 to-[#00F5FF]/40 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10">Book Technician</span>
                <ChevronRight className="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Section 3: Service-Based Categories & Booking Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Specialized <span className="text-[#00F5FF]">Experts</span></h3>
              <p className="text-white/60 leading-relaxed">Instantly match with certified technicians across multiple disciplines. Our marketplace ensures you get the exact expertise required.</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((cat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.03, x: 5 }}
                  className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#8B5CF6]/50 flex items-center gap-4 transition-all duration-300 group cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#050816] border border-white/10 flex items-center justify-center group-hover:border-[#8B5CF6] group-hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all">
                    <cat.icon className="w-5 h-5 text-white/50 group-hover:text-[#8B5CF6] transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold group-hover:text-[#00F5FF] transition-colors">{cat.name}</h4>
                    <p className="text-xs text-white/40">{cat.count}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Section 4: Booking Preview UI */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-6 relative"
          >
            <div className="absolute inset-0 bg-[#00F5FF]/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="relative bg-[#050816]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.6)]">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
                <div>
                  <h4 className="text-white font-bold text-lg">Booking Confirmed</h4>
                  <p className="text-xs text-[#00FFA3] mt-1 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00FFA3] animate-pulse" />
                    Connecting to technician
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/40 uppercase">Arrival ETA</p>
                  <p className="text-2xl font-bold text-white">14 <span className="text-white/50 text-base">MIN</span></p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white/5 rounded-2xl p-4 border border-white/5">
                <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Arjun" className="w-14 h-14 rounded-xl object-cover border border-[#5227FF]" />
                <div className="flex-1">
                  <h5 className="text-white font-bold flex items-center gap-2">
                    Arjun Mehta
                    <ShieldCheck className="w-4 h-4 text-[#00FFA3]" />
                  </h5>
                  <div className="flex items-center gap-2 text-xs text-white/60 mt-1">
                    <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-400" /> 4.9</span>
                    <span>•</span>
                    <span>1200+ Jobs</span>
                  </div>
                </div>
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 rounded-full border-2 border-[#5227FF] border-t-transparent flex-shrink-0"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Section 5 & 6: Live Tracking & Dashboard Preview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Dashboard Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-[2rem] bg-[#050816]/80 border border-white/10 p-8 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-6 flex justify-end w-full bg-gradient-to-b from-[#050816] to-transparent z-10 pointer-events-none">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-white/5 text-white/50 border border-white/10">Partner Portal</span>
            </div>
            
            <div className="flex items-center justify-between mb-8 relative z-10 mt-4">
              <h4 className="text-white font-bold text-2xl flex items-center gap-3">
                <Briefcase className="w-6 h-6 text-[#5227FF]" />
                Dashboard
              </h4>
              <div className="w-12 h-6 rounded-full bg-[#00FFA3]/20 border border-[#00FFA3]/40 flex items-center p-1 cursor-pointer">
                <div className="w-4 h-4 rounded-full bg-[#00FFA3] ml-auto shadow-[0_0_10px_#00FFA3]" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5 hover:border-[#00F5FF]/30 transition-colors">
                <p className="text-white/40 text-xs font-semibold mb-2">Today's Earnings</p>
                <p className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                  ₹4,250
                  <TrendingUp className="w-4 h-4 text-[#00FFA3]" />
                </p>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/5 hover:border-[#5227FF]/30 transition-colors">
                <p className="text-white/40 text-xs font-semibold mb-2">Completed Jobs</p>
                <p className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                  08
                  <CheckCircle2 className="w-4 h-4 text-[#00F5FF]" />
                </p>
              </div>
            </div>

            <div className="mt-4 bg-white/5 rounded-2xl p-4 border border-white/5 relative z-10 flex items-center justify-between">
               <div>
                 <p className="text-sm font-bold text-white mb-1">Incoming Request</p>
                 <p className="text-xs text-white/50">AC Servicing • 2.4km away</p>
               </div>
               <motion.button 
                 whileHover={{ scale: 1.05 }}
                 className="px-4 py-2 rounded-lg bg-[#5227FF] text-white text-xs font-bold shadow-[0_0_15px_rgba(82,39,255,0.4)]"
               >
                 Accept
               </motion.button>
            </div>
            
            {/* Ambient Background */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#5227FF]/5 to-transparent pointer-events-none" />
          </motion.div>

          {/* Tracking Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="rounded-[2rem] bg-[#0A0D1F] border border-white/10 p-0 relative overflow-hidden group shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
          >
            {/* Map Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,245,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,245,255,0.05)_1px,transparent_1px)] bg-[size:2rem_2rem]" />
            
            <div className="absolute top-6 left-6 z-10 flex items-center gap-2 bg-[#050816]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <Activity className="w-3 h-3 text-[#FF4D6D] animate-pulse" />
              <span className="text-xs text-white font-bold tracking-widest uppercase">Live Tracking</span>
            </div>

            {/* SVG Animated Route */}
            <svg className="absolute inset-0 w-full h-full z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
              <motion.path
                d="M 20 80 Q 50 20 80 50"
                fill="none"
                stroke="#00F5FF"
                strokeWidth="0.5"
                strokeDasharray="2 2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </svg>

            {/* Moving Marker */}
            <motion.div 
              className="absolute z-10"
              animate={{ 
                x: ["20%", "80%"],
                y: ["80%", "50%"]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatType: "reverse" }}
            >
              <div className="w-12 h-12 -ml-6 -mt-6 rounded-full bg-[#00F5FF]/10 border border-[#00F5FF]/30 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-[#00F5FF] shadow-[0_0_15px_#00F5FF]" />
              </div>
            </motion.div>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-transparent to-transparent pointer-events-none" />

            {/* Bottom Status Card */}
            <div className="absolute bottom-6 left-6 right-6 bg-[#050816]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <MapPin className="w-4 h-4 text-[#8B5CF6]" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-white/50 mb-0.5">Technician is 2.4km away</p>
                  <p className="text-white font-bold">Arriving in <span className="text-[#00F5FF]">8 mins</span></p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#5227FF]/20 flex items-center justify-center cursor-pointer hover:bg-[#5227FF]/40 transition-colors border border-[#5227FF]/50">
                  <ChevronRight className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
