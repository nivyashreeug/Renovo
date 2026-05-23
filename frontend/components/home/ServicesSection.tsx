"use client";

import React, { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { 
  Smartphone, Laptop, Snowflake, Car, Armchair, 
  Wrench, Tv, Settings, Clock, CheckCircle2, ArrowRight
} from "lucide-react";

const bentoServices = [
  { 
    name: "Mobile Repair", 
    icon: Smartphone, 
    desc: "Premium logic board & screen replacement with original components.", 
    price: "From ₹499", 
    time: "30 mins",
    status: "Available Now",
    colSpan: "col-span-1 md:col-span-2 lg:col-span-2",
    color: "#00F5FF"
  },
  { 
    name: "Laptop Repair", 
    icon: Laptop, 
    desc: "Motherboard diagnostics and SSD upgrades.", 
    price: "From ₹899", 
    time: "2 hours",
    status: "High Demand",
    colSpan: "col-span-1 md:col-span-1 lg:col-span-1",
    color: "#5227FF"
  },
  { 
    name: "AC Repair", 
    icon: Snowflake, 
    desc: "Deep cleaning, gas recharge, and compressor fixes.", 
    price: "From ₹699", 
    time: "1.5 hours",
    status: "Available Now",
    colSpan: "col-span-1 md:col-span-1 lg:col-span-1",
    color: "#00FFA3"
  },
  { 
    name: "Vehicle Repair", 
    icon: Car, 
    desc: "On-site mechanic, scanning, and fast oil changes.", 
    price: "From ₹999", 
    time: "Same Day",
    status: "High Demand",
    colSpan: "col-span-1 md:col-span-1 lg:col-span-1",
    color: "#FF4D6D"
  },
  { 
    name: "Smart TV Repair", 
    icon: Tv, 
    desc: "Panel replacement and logic board servicing.", 
    price: "From ₹1299", 
    time: "2-3 hours",
    status: "Available Now",
    colSpan: "col-span-1 md:col-span-2 lg:col-span-2",
    color: "#8B5CF6"
  },
  { 
    name: "Washing Machine", 
    icon: Settings, 
    desc: "Motor issues, drum alignment, and blockages.", 
    price: "From ₹799", 
    time: "2 hours",
    status: "Available Now",
    colSpan: "col-span-1 md:col-span-1 lg:col-span-1",
    color: "#00F5FF"
  },
  { 
    name: "Plumbing", 
    icon: Wrench, 
    desc: "Pipe fitting, leakage repair, and deep unblocking.", 
    price: "From ₹499", 
    time: "1 hour",
    status: "High Demand",
    colSpan: "col-span-1 md:col-span-2 lg:col-span-2",
    color: "#00FFA3"
  },
  { 
    name: "Furniture Repair", 
    icon: Armchair, 
    desc: "Polishing, upholstery, and structural fixes.", 
    price: "From ₹899", 
    time: "Same Day",
    status: "Available",
    colSpan: "col-span-1 md:col-span-2 lg:col-span-2",
    color: "#5227FF"
  },
];

export default function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <section className="relative w-full min-h-screen py-32 bg-[#050816] overflow-hidden" id="services">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-[#5227FF]/10 to-transparent pointer-events-none" />
      <div className="absolute -left-[20%] top-[20%] w-[50%] h-[50%] bg-[#5227FF]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -right-[20%] bottom-[10%] w-[50%] h-[50%] bg-[#00F5FF]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_10%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-white mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            Services We Provide <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F5FF] to-[#5227FF]">You</span>
          </h2>
          <p className="text-lg md:text-xl text-white/60 font-light leading-relaxed">
            Fast, trusted, and professional repair experiences powered by verified technicians and real-time tracking.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div 
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-6 auto-rows-[minmax(280px,auto)]"
        >
          {bentoServices.map((service, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`group relative rounded-3xl overflow-hidden p-8 flex flex-col justify-between ${service.colSpan} border border-white/5 bg-white/[0.02] backdrop-blur-xl`}
            >
              {/* Card Background Gradients */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none blur-xl" 
                style={{ background: `radial-gradient(circle at 50% 50%, ${service.color}, transparent 70%)` }}
              />

              {/* Card Header: Icon & Status */}
              <div className="flex justify-between items-start mb-8 relative z-10 gap-4">
                <div 
                  className="w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center border border-white/10 bg-[#050816]/50 group-hover:scale-110 transition-transform duration-500 shadow-lg"
                >
                  <service.icon className="w-6 h-6 transition-colors duration-500" style={{ color: service.color }} />
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                    <CheckCircle2 className="w-3.5 h-3.5" style={{ color: service.color }} />
                    <span className="text-[11px] font-semibold tracking-wide uppercase text-white/80">{service.status}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                    <Clock className="w-3.5 h-3.5 text-white/50" />
                    <span className="text-[11px] font-semibold tracking-wide uppercase text-white/60">{service.time}</span>
                  </div>
                </div>
              </div>

              {/* Card Body: Title & Desc */}
              <div className="relative z-10 mb-8">
                <h3 className="text-2xl font-bold text-white mb-3 transition-colors duration-300">
                  {service.name}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed max-w-sm">
                  {service.desc}
                </p>
              </div>

              {/* Card Footer: Price & Action */}
              <div className="flex items-center justify-between mt-auto relative z-10 pt-6 border-t border-white/10">
                <div>
                  <span className="text-xs text-white/40 uppercase tracking-wider font-semibold block mb-1">Starting at</span>
                  <span className="text-lg font-bold text-white group-hover:text-[#00F5FF] transition-colors">{service.price}</span>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative group/btn flex items-center gap-2 px-5 py-2.5 rounded-full overflow-hidden border border-white/20 bg-white/5 hover:border-transparent transition-colors"
                >
                  <div 
                    className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(90deg, ${service.color}40, transparent)` }} 
                  />
                  <span className="relative z-10 text-sm font-semibold text-white tracking-wide">Book Now</span>
                  <ArrowRight className="w-4 h-4 relative z-10 text-white group-hover/btn:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
