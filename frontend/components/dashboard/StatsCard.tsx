"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import CountUp from "react-countup";

interface StatsCardProps {
    title: string;
    value: number;
    icon: LucideIcon;
    color: string;
    delay?: number;
    suffix?: string;
    prefix?: string;
}

export default function StatsCard({ title, value, icon: Icon, color, delay = 0, suffix = "", prefix = "" }: StatsCardProps) {

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5, ease: "easeOut" }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="relative p-6 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl overflow-hidden group"
        >
            <div 
                className="absolute -right-12 -top-12 w-32 h-32 rounded-full blur-[50px] transition-all duration-500 group-hover:scale-150"
                style={{ backgroundColor: color, opacity: 0.15 }}
            />
            
            <div className="relative z-10 flex justify-between items-start mb-6">
                <div className="flex flex-col gap-1">
                    <span className="text-white/50 text-sm font-medium tracking-wider uppercase">{title}</span>
                    <h3 className="text-4xl font-bold text-white mt-2">
                        {prefix}
                        <CountUp end={value} duration={2.5} separator="," />
                        {suffix}
                    </h3>
                </div>
                <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg"
                    style={{ 
                        backgroundColor: `${color}15`, 
                        borderColor: `${color}30`,
                        boxShadow: `0 0 20px ${color}20` 
                    }}
                >
                    <Icon size={24} style={{ color }} />
                </div>
            </div>

            <div className="relative z-10 flex items-center gap-2 text-sm">
                <span className="text-[#00FFA3] flex items-center bg-[#00FFA3]/10 px-2 py-0.5 rounded-full">
                    ↑ 12%
                </span>
                <span className="text-white/40">vs last month</span>
            </div>
            
            {/* Sparkline decoration */}
            <svg className="absolute bottom-0 left-0 w-full h-12 opacity-30 group-hover:opacity-50 transition-opacity" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M0 100 Q 20 80, 40 90 T 80 60 T 100 40 L 100 100 Z" fill={`url(#gradient-${title.replace(/\s+/g, '')})`} />
                <defs>
                    <linearGradient id={`gradient-${title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.5" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>
        </motion.div>
    );
}
