"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, MessageSquare, Car, Wrench, CheckCircle, Clock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type TrackingBooking = {
    id: string | number;
    service_name: string;
    technician_name?: string | null;
    status?: string;
    booking_time?: string;
    eta_minutes?: number | string | null;
    urgency_level?: string | null;
};

interface TrackingCardProps {
    booking?: TrackingBooking | null;
    isConnected?: boolean;
}

const STAGES = [
    { id: 1, label: "Pending", icon: Clock },
    { id: 2, label: "Assigned", icon: UserIcon },
    { id: 3, label: "On The Way", icon: Car },
    { id: 4, label: "Repairing", icon: Wrench },
    { id: 5, label: "Completed", icon: CheckCircle },
];

function resolveStage(status?: string) {
    const normalized = String(status || "").toLowerCase();

    if (normalized === "completed") return 5;
    if (normalized === "repairing") return 4;
    if (normalized === "on the way") return 3;
    if (normalized === "assigned" || normalized === "rescheduled") return 2;
    return 1;
}

export default function TrackingCard({ booking, isConnected = true }: TrackingCardProps) {
    const currentStage = useMemo(() => resolveStage(booking?.status), [booking?.status]);
    const [eta, setEta] = useState(() => {
        const fallback = currentStage >= 4 ? 0 : 24;
        const source = Number(booking?.eta_minutes ?? fallback);
        return Number.isFinite(source) ? Math.max(0, source) : fallback;
    });

    useEffect(() => {
        const timeout = setTimeout(() => {
            const fallback = currentStage >= 4 ? 0 : 24;
            const source = Number(booking?.eta_minutes ?? fallback);
            setEta(Number.isFinite(source) ? Math.max(0, source) : fallback);
        }, 0);

        return () => clearTimeout(timeout);
    }, [booking?.id, booking?.eta_minutes, currentStage]);

    useEffect(() => {
        const timer = setInterval(() => {
            setEta((prev) => (prev > 0 ? prev - 1 : 0));
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    const liveDistanceText = useMemo(() => {
        if (currentStage >= 4) return "Technician has started work";
        if (currentStage === 3) {
            const miles = Math.max(0.8, eta / 7.5).toFixed(1);
            return `Technician is ${miles} miles away`;
        }
        if (currentStage === 2) return "Technician assigned and preparing route";
        if (currentStage === 1) return "Awaiting technician assignment";
        return "Repair completed";
    }, [currentStage, eta]);

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-[#050816] rounded-3xl border border-white/10 p-8 relative overflow-hidden"
        >
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#5227FF]/15 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row gap-12">
                {/* Left Side: Info & Timeline */}
                <div className="flex-1">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-3 py-1 bg-[#00F5FF]/10 text-[#00F5FF] rounded-full text-xs font-bold uppercase tracking-wider border border-[#00F5FF]/20 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#00F5FF] animate-pulse"></span>
                                    Live Tracking
                                </span>
                                <span className="text-white/50 text-sm font-medium">ID: #{String(booking?.id || "---")}</span>
                                <span className={`text-[10px] uppercase tracking-[0.2em] rounded-full border px-2 py-1 ${isConnected ? "text-[#00FFA3] border-[#00FFA3]/30 bg-[#00FFA3]/10" : "text-[#FFB020] border-[#FFB020]/30 bg-[#FFB020]/10"}`}>
                                    {isConnected ? "Realtime" : "Reconnect"}
                                </span>
                            </div>
                            <h2 className="text-3xl font-bold text-white">{booking?.service_name || "No active repair selected"}</h2>
                        </div>
                        <div className="text-right">
                            <p className="text-white/50 text-sm font-medium uppercase tracking-wider mb-1">ETA</p>
                            <div className="text-4xl font-bold text-[#00FFA3] drop-shadow-[0_0_15px_rgba(0,255,163,0.5)]">
                                {eta} <span className="text-xl">min</span>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="relative mt-12 mb-8 pl-4">
                        <div className="absolute left-6.75 top-4 bottom-4 w-1 bg-white/5 rounded-full" />
                        <motion.div 
                            className="absolute left-6.75 top-4 w-1 bg-linear-to-b from-[#00F5FF] to-[#5227FF] rounded-full shadow-[0_0_15px_#00F5FF]"
                            initial={{ height: 0 }}
                            animate={{ height: `${((currentStage - 1) / (STAGES.length - 1)) * 100}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />

                        <div className="space-y-10">
                            {STAGES.map((stage, index) => {
                                const isCompleted = index + 1 < currentStage;
                                const isCurrent = index + 1 === currentStage;
                                const isUpcoming = index + 1 > currentStage;

                                return (
                                    <div key={stage.id} className="relative flex items-center gap-8 group">
                                        <div className={`
                                            relative z-10 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500
                                            ${isCompleted ? "bg-[#00FFA3]/20 border border-[#00FFA3]/50 text-[#00FFA3]" : ""}
                                            ${isCurrent ? "bg-[#00F5FF]/20 border-2 border-[#00F5FF] text-[#00F5FF] shadow-[0_0_20px_rgba(0,245,255,0.4)] scale-110" : ""}
                                            ${isUpcoming ? "bg-white/2 border border-white/5 text-white/30" : ""}
                                        `}>
                                            <stage.icon size={20} />
                                            {isCurrent && (
                                                <span className="absolute -inset-2 rounded-xl border border-[#00F5FF]/30 animate-ping" />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className={`text-lg font-bold ${isCurrent ? "text-white" : isCompleted ? "text-white/80" : "text-white/40"}`}>
                                                {stage.label}
                                            </h4>
                                            {isCurrent && <p className="text-[#00F5FF] text-sm mt-1">{liveDistanceText}</p>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Side: Map & Tech Info */}
                <div className="w-full lg:w-100 flex flex-col gap-6">
                    {/* Animated Map Preview */}
                    <div className="w-full h-48 bg-white/2 rounded-2xl border border-white/8 overflow-hidden relative group cursor-pointer">
                        <div className="absolute inset-0 bg-[url('https://i.imgur.com/kQBb6gO.png')] bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity grayscale group-hover:grayscale-0 duration-500" />
                        
                        {/* Radar Sweep Effect */}
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-[#00F5FF]/20 to-transparent w-[200%] animate-[shimmer_3s_infinite] -translate-x-full" />
                        
                        {/* Moving Dot */}
                        <motion.div 
                            className="absolute top-1/2 left-1/3 w-4 h-4 bg-[#00F5FF] rounded-full shadow-[0_0_20px_#00F5FF]"
                            animate={{ 
                                x: [0, 20, 40, 60],
                                y: [0, -10, 5, 0]
                            }}
                            transition={{ duration: 10, repeat: Infinity, repeatType: "mirror" }}
                        >
                            <span className="absolute inset-0 rounded-full border border-[#00F5FF] animate-ping" />
                        </motion.div>
                        
                        {/* Destination */}
                        <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-[#FF4D6D] rounded-full shadow-[0_0_20px_#FF4D6D] translate-y-4" />
                        
                        {/* Path Line */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                            <path d="M 130 96 Q 180 70 250 112" fill="none" stroke="rgba(0,245,255,0.3)" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_20s_linear_infinite]" />
                        </svg>

                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-[#050816]/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white/8">
                            <div className="flex items-center gap-2">
                                <MapPin size={14} className="text-[#00F5FF]" />
                                <span className="text-xs text-white font-medium">Live Location</span>
                            </div>
                            <span className={`text-xs ${isConnected ? "text-[#00FFA3]" : "text-[#FFB020]"}`}>{isConnected ? "Connected" : "Retrying"}</span>
                        </div>
                    </div>

                    {/* Tech Profile */}
                    <div className="p-6 rounded-2xl bg-linear-to-br from-white/4 to-white/1 border border-white/8 backdrop-blur-md relative overflow-hidden group">
                        <div className="absolute inset-0 bg-linear-to-br from-[#5227FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="relative">
                                <img src="https://i.pravatar.cc/150?img=11" alt="Technician" className="w-16 h-16 rounded-full border-2 border-[#00F5FF] object-cover" />
                                <div className="absolute -bottom-1 -right-1 bg-[#00FFA3] w-4 h-4 rounded-full border-2 border-[#050816]"></div>
                            </div>
                            <div className="flex-1">
                                <h4 className="text-lg font-bold text-white">{booking?.technician_name || "Assigning Technician"}</h4>
                                <div className="flex items-center gap-2 text-sm text-white/60">
                                    <span className="text-[#00F5FF]">★ 4.9</span>
                                    <span>•</span>
                                    <span>{booking?.urgency_level || "Priority lane"}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6 relative z-10">
                            <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/2 hover:bg-white/6 rounded-xl border border-white/8 text-white font-medium transition-all group-hover:border-[#00F5FF]/30">
                                <Phone size={18} /> Call
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#5227FF] hover:bg-[#6039FF] rounded-xl text-white font-medium shadow-[0_0_20px_rgba(82,39,255,0.3)] transition-all">
                                <MessageSquare size={18} /> Message
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}
