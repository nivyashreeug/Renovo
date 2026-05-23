"use client";

import React from "react";
import { motion } from "framer-motion";
import { Car, MonitorSmartphone, Smartphone, Snowflake } from "lucide-react";

const cards = [
  {
    title: "Mobile Repair",
    icon: <Smartphone className="w-6 h-6 text-[#00F5FF]" />,
    position: "top-[15%] left-[5%] md:left-[10%]",
    delay: 0.2,
    color: "from-[#00F5FF]/20 to-transparent",
    borderColor: "border-[#00F5FF]/30",
    shadow: "shadow-[0_0_30px_rgba(0,245,255,0.2)]",
  },
  {
    title: "AC Repair",
    icon: <Snowflake className="w-6 h-6 text-[#5227FF]" />,
    position: "top-[20%] right-[5%] md:right-[10%]",
    delay: 0.4,
    color: "from-[#5227FF]/20 to-transparent",
    borderColor: "border-[#5227FF]/30",
    shadow: "shadow-[0_0_30px_rgba(82,39,255,0.2)]",
  },
  {
    title: "Vehicle Repair",
    icon: <Car className="w-6 h-6 text-[#00FFA3]" />,
    position: "bottom-[20%] left-[8%] md:left-[15%]",
    delay: 0.6,
    color: "from-[#00FFA3]/20 to-transparent",
    borderColor: "border-[#00FFA3]/30",
    shadow: "shadow-[0_0_30px_rgba(0,255,163,0.2)]",
  },
  {
    title: "Electronics Repair",
    icon: <MonitorSmartphone className="w-6 h-6 text-[#8B5CF6]" />,
    position: "bottom-[15%] right-[8%] md:right-[15%]",
    delay: 0.8,
    color: "from-[#8B5CF6]/20 to-transparent",
    borderColor: "border-[#8B5CF6]/30",
    shadow: "shadow-[0_0_30px_rgba(139,92,246,0.2)]",
  },
];

export default function FloatingCards() {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 hidden md:block">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 1,
            delay: card.delay,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={`absolute ${card.position}`}
        >
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: [0, index % 2 === 0 ? 2 : -2, 0],
            }}
            transition={{
              duration: 5 + index,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`
              pointer-events-auto backdrop-blur-xl bg-white/[0.02] border ${card.borderColor} 
              p-4 rounded-2xl ${card.shadow} flex items-center gap-4 cursor-pointer group 
              hover:bg-white/[0.05] transition-all duration-300
            `}
          >
            <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl -z-10" style={{ backgroundImage: `var(--tw-gradient-stops)` }} />
            <div className={`p-3 rounded-xl bg-[#050816]/50 border ${card.borderColor} group-hover:scale-110 transition-transform duration-300`}>
              {card.icon}
            </div>
            <div className="pr-2">
              <h3 className="text-white font-medium text-sm tracking-wide group-hover:text-white/90 transition-colors">
                {card.title}
              </h3>
            </div>
            
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${card.color} blur-xl`} />
            </div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
