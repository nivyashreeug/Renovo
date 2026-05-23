"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Smartphone, Laptop, Snowflake, Car, Armchair, 
  Wrench, Tv, Settings, Refrigerator, Zap, Video, Home 
} from "lucide-react";

export const megaMenuServices = [
  { name: "Mobile Repair", icon: Smartphone, desc: "Screen, battery, and logic board fixes.", popular: true },
  { name: "Laptop Repair", icon: Laptop, desc: "Hardware upgrades and motherboard repair.", popular: false },
  { name: "AC Repair", icon: Snowflake, desc: "Cooling issues, gas refill, and servicing.", popular: true },
  { name: "Vehicle Repair", icon: Car, desc: "On-demand mechanic and diagnostics.", popular: true },
  { name: "Furniture Repair", icon: Armchair, desc: "Woodwork, upholstery, and polishing.", popular: false },
  { name: "Plumbing", icon: Wrench, desc: "Leakages, pipe fitting, and drainage.", popular: false },
  { name: "Smart TV Repair", icon: Tv, desc: "Display issues and motherboard repair.", popular: false },
  { name: "Washing Machine", icon: Settings, desc: "Motor repair, drum issues, and servicing.", popular: false },
  { name: "Refrigerator", icon: Refrigerator, desc: "Cooling issues and compressor repair.", popular: false },
  { name: "Electrical", icon: Zap, desc: "Wiring, switchboards, and appliances.", popular: false },
  { name: "CCTV Installation", icon: Video, desc: "Security camera setup and maintenance.", popular: false },
  { name: "Smart Home", icon: Home, desc: "Automation and IoT device setup.", popular: false },
];

export default function ServicesMegaMenu() {
  return (
    <div className="w-full max-w-[1200px] mx-auto z-10 relative mt-16 mb-16 px-6">
      {/* Mega Menu Container */}
      <div className="relative overflow-hidden rounded-3xl bg-[#050816]/80 backdrop-blur-2xl border border-[#00F5FF]/20 shadow-[0_20px_50px_rgba(0,245,255,0.1)] p-8">
        
        {/* Ambient Background Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#5227FF]/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00F5FF]/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {megaMenuServices.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.03, duration: 0.4, ease: "easeOut" }}
            >
              <a
                href={`#service-${idx}`}
                className="group relative flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-[#00F5FF]/40 transition-all duration-300 overflow-hidden"
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#00F5FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                <div className="p-3 rounded-xl bg-[#050816] border border-white/10 group-hover:border-[#00F5FF]/50 group-hover:shadow-[0_0_15px_rgba(0,245,255,0.3)] transition-all duration-300 shrink-0">
                  <service.icon className="w-5 h-5 text-white/70 group-hover:text-[#00F5FF] transition-colors" />
                </div>
                
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-semibold text-sm tracking-wide group-hover:text-[#00F5FF] transition-colors">
                      {service.name}
                    </span>
                    {service.popular && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#FF4D6D]/20 text-[#FF4D6D] border border-[#FF4D6D]/30 shadow-[0_0_10px_rgba(255,77,109,0.3)]">
                        Hot
                      </span>
                    )}
                  </div>
                  <span className="text-white/50 text-xs mt-1 leading-relaxed line-clamp-2">
                    {service.desc}
                  </span>
                </div>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
