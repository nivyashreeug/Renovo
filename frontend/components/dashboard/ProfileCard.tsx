"use client";

import { motion } from "framer-motion";
import { Award, Shield, Star, ChevronRight } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

export default function ProfileCard() {
    const { user, profile } = useAuth();
    
    const fullName = profile?.full_name || user?.user_metadata?.full_name || "Premium User";
    
    return (
        <div className="bg-white/[0.02] rounded-3xl border border-white/[0.08] p-6 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-[#5227FF]/20 to-transparent" />
            
            <div className="relative z-10 flex flex-col items-center text-center mt-4">
                <div className="relative mb-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00F5FF] to-[#5227FF] p-[3px]">
                        <div className="w-full h-full rounded-full bg-[#050816] flex items-center justify-center overflow-hidden">
                            {user?.user_metadata?.avatar_url ? (
                                <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-3xl font-bold text-white/50">
                                    {fullName.charAt(0)}
                                </span>
                            )}
                        </div>
                    </div>
                    <motion.div 
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute bottom-0 right-0 w-5 h-5 bg-[#00FFA3] rounded-full border-[3px] border-[#050816] shadow-[0_0_15px_#00FFA3]" 
                    />
                </div>

                <h2 className="text-xl font-bold text-white mb-1">{fullName}</h2>
                <div className="flex items-center gap-2 text-sm text-[#00F5FF] mb-6">
                    <Shield size={14} />
                    <span>Pro Member</span>
                </div>

                <div className="w-full grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.08]">
                        <div className="flex justify-center text-[#5227FF] mb-1"><Star size={16} /></div>
                        <div className="text-xl font-bold text-white">4.9</div>
                        <div className="text-[10px] text-white/50 uppercase tracking-wider">Rating</div>
                    </div>
                    <div className="bg-white/[0.04] rounded-xl p-3 border border-white/[0.08]">
                        <div className="flex justify-center text-[#00FFA3] mb-1"><Award size={16} /></div>
                        <div className="text-xl font-bold text-white">12</div>
                        <div className="text-[10px] text-white/50 uppercase tracking-wider">Repairs</div>
                    </div>
                </div>

                <button className="w-full flex items-center justify-between px-4 py-3 bg-white/[0.02] hover:bg-white/[0.06] rounded-xl border border-white/[0.08] transition-colors group/btn">
                    <span className="text-sm font-medium text-white/80 group-hover/btn:text-white">View Profile Details</span>
                    <ChevronRight size={16} className="text-white/50 group-hover/btn:text-white group-hover/btn:translate-x-1 transition-all" />
                </button>
            </div>
        </div>
    );
}
