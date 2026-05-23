"use client";

import { motion } from "framer-motion";
import { type LucideIcon } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  price: string;
  time: string;
  icon: LucideIcon;
  isSelected: boolean;
  onClick: () => void;
}

export function ServiceCard({
  title,
  description,
  price,
  time,
  icon: Icon,
  isSelected,
  onClick,
}: ServiceCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative cursor-pointer overflow-hidden rounded-2xl border bg-white/5 p-6 backdrop-blur-xl transition-all duration-300
        ${
          isSelected
            ? "border-[#5227FF] bg-[#5227FF]/10 shadow-[0_0_30px_rgba(82,39,255,0.3)]"
            : "border-white/10 hover:border-white/20 hover:bg-white/10"
        }
      `}
    >
      {/* Background Glow */}
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#5227FF]/20 to-transparent opacity-50 blur-2xl" />
      )}

      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-300
            ${isSelected ? "bg-[#5227FF] text-white" : "bg-white/10 text-white/70"}`}
          >
            <Icon className="h-6 w-6" />
          </div>
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex h-6 w-6 items-center justify-center rounded-full bg-[#00FFA3]"
            >
              <svg
                className="h-4 w-4 text-[#050816]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>
          )}
        </div>

        <h3 className="mb-2 text-xl font-bold text-white font-space-grotesk">{title}</h3>
        <p className="mb-4 text-sm text-white/60">{description}</p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex flex-col">
            <span className="text-white/40">Est. Price</span>
            <span className="font-semibold text-white">{price}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-white/40">Est. Time</span>
            <span className="font-semibold text-white">{time}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
