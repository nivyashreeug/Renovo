"use client";

import { useAuth } from "@/providers/AuthProvider";
import { motion } from "framer-motion";
import { Search, Bell, Clock as ClockIcon, ChevronDown, User } from "lucide-react";
import { useState, useEffect } from "react";

export default function TopNavbar() {
    const { user, profile } = useAuth();
    const [time, setTime] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const fullName = profile?.full_name || user?.user_metadata?.full_name || "User";
    const firstName = fullName.split(' ')[0];

    return (
        <header className="sticky top-0 z-40 w-full backdrop-blur-3xl bg-[#050816]/60 border-b border-white/10 px-8 py-4 flex items-center justify-between">
            <div className="flex flex-col">
                <motion.h1 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-bold text-white flex items-center gap-2"
                >
                    Welcome back, {firstName}
                </motion.h1>
                <p className="text-white/50 text-sm">Your intelligent repair command center.</p>
            </div>

            <div className="flex items-center gap-6">
                <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/50">
                    <Search size={16} />
                    <input 
                        type="text" 
                        placeholder="Search repairs..." 
                        className="bg-transparent border-none outline-none text-white text-sm w-48 placeholder:text-white/30"
                    />
                </div>

                <div className="hidden md:flex items-center gap-2 text-white/70 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                    <ClockIcon size={16} className="text-[#00F5FF]" />
                    <span className="text-sm font-medium">{time}</span>
                </div>

                <button className="relative p-2 rounded-full hover:bg-white/10 transition-colors group">
                    <Bell size={20} className="text-white/70 group-hover:text-white" />
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FF4D6D] rounded-full border border-[#050816] animate-pulse"></span>
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-white/10 cursor-pointer group">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5227FF] to-[#8B5CF6] p-[2px]">
                            <div className="w-full h-full rounded-full bg-[#050816] flex items-center justify-center overflow-hidden">
                                {user?.user_metadata?.avatar_url ? (
                                    <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={20} className="text-white/70" />
                                )}
                            </div>
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#00FFA3] rounded-full border-2 border-[#050816] shadow-[0_0_10px_#00FFA3]"></div>
                    </div>
                    <ChevronDown size={16} className="text-white/50 group-hover:text-white transition-colors" />
                </div>
            </div>
        </header>
    );
}
