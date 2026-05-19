"use client";

import { motion } from "framer-motion";
import { PlusCircle, Search, MessageCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";

const actions = [
    { label: "Book New Repair", icon: PlusCircle, color: "from-[#5227FF] to-[#8B5CF6]", href: "/dashboard/customer/book" },
    { label: "Track Repair", icon: Search, color: "from-[#00F5FF] to-[#00A3FF]" },
    { label: "Contact Tech", icon: MessageCircle, color: "from-[#00FFA3] to-[#00CC88]" },
    { label: "Emergency", icon: AlertTriangle, color: "from-[#FF4D6D] to-[#D9002D]", pulse: true, href: "/dashboard/customer/book" },
];

export default function QuickActions() {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {actions.map((action, index) => {
                const ActionComponent: any = action.href ? Link : motion.button;
                const props = action.href ? { href: action.href } : { whileHover: { scale: 1.05, y: -5 }, whileTap: { scale: 0.95 } };

                return (
                    <ActionComponent
                        key={index}
                        {...props}
                        className="relative group p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 overflow-hidden flex flex-col items-center justify-center gap-3 h-32 transition-colors block w-full"
                    >
                        {action.href ? (
                            <motion.div 
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                className="absolute inset-0 flex flex-col items-center justify-center gap-3 w-full h-full"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br ${action.color} text-white shadow-lg relative`}>
                                    <action.icon size={20} />
                                    {action.pulse && (
                                        <span className="absolute inset-0 rounded-full border-2 border-[#FF4D6D] animate-ping opacity-50" />
                                    )}
                                </div>
                                <span className="font-medium text-white/80 group-hover:text-white text-sm z-10">{action.label}</span>
                            </motion.div>
                        ) : (
                            <>
                                <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br ${action.color} text-white shadow-lg relative z-10`}>
                                    <action.icon size={20} />
                                    {action.pulse && (
                                        <span className="absolute inset-0 rounded-full border-2 border-[#FF4D6D] animate-ping opacity-50" />
                                    )}
                                </div>
                                <span className="font-medium text-white/80 group-hover:text-white text-sm z-10">{action.label}</span>
                            </>
                        )}
                    </ActionComponent>
                );
            })}
        </div>
    );
}
