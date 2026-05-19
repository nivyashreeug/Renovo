"use client";

import { motion } from "framer-motion";
import { Star, CheckCircle, MapPin, Clock } from "lucide-react";
import Image from "next/image";

interface TechnicianCardProps {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  completedJobs: number;
  eta: string;
  price: string;
  imageUrl: string;
  isOnline: boolean;
  isSelected: boolean;
  onClick: () => void;
}

export function TechnicianCard({
  id,
  name,
  specialty,
  rating,
  completedJobs,
  eta,
  price,
  imageUrl,
  isOnline,
  isSelected,
  onClick,
}: TechnicianCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative cursor-pointer overflow-hidden rounded-2xl border bg-white/5 p-5 backdrop-blur-xl transition-all duration-300
        ${
          isSelected
            ? "border-[#00F5FF] bg-[#00F5FF]/10 shadow-[0_0_30px_rgba(0,245,255,0.3)]"
            : "border-white/10 hover:border-white/20 hover:bg-white/10"
        }
      `}
    >
      {/* Background Glow */}
      {isSelected && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#00F5FF]/20 to-transparent opacity-50 blur-2xl" />
      )}

      <div className="relative z-10">
        <div className="mb-4 flex items-start gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-white/10">
            {/* Fallback avatar if no image */}
            <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-xl font-bold text-white">
              {name.charAt(0)}
            </div>
            {isOnline && (
              <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-[#050816] bg-[#00FFA3] animate-pulse"></span>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-bold text-white font-space-grotesk">
                {name}
                <CheckCircle className="h-4 w-4 text-[#00F5FF]" />
              </h3>
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
            <p className="text-sm text-[#00F5FF]">{specialty}</p>
            <div className="mt-1 flex items-center gap-3 text-xs text-white/60">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-[#00F5FF] text-[#00F5FF]" />
                <span className="font-semibold text-white">{rating}</span>
              </div>
              <span>•</span>
              <span>{completedJobs} jobs</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-xl bg-white/5 p-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-white/40" />
            <div className="flex flex-col">
              <span className="text-xs text-white/40">ETA</span>
              <span className="text-sm font-semibold text-white">{eta}</span>
            </div>
          </div>
          <div className="text-right flex flex-col">
            <span className="text-xs text-white/40">Call-out fee</span>
            <span className="text-sm font-bold text-[#00FFA3]">{price}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
