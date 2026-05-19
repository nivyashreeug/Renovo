"use client";

import { motion } from "framer-motion";
import { UserPlus, Settings, CreditCard, CheckCircle, Smartphone } from "lucide-react";

type ActivityItem = {
    id: string | number;
    title: string;
    desc: string;
    time: string;
    icon: typeof UserPlus | typeof Settings | typeof CreditCard | typeof CheckCircle | typeof Smartphone;
    color: string;
    bg: string;
    border: string;
};

interface ActivityTimelineProps {
    activities?: ActivityItem[];
}

const defaultActivities: ActivityItem[] = [
    { id: 1, title: "Technician Assigned", desc: "Alex M. is assigned to your repair.", time: "10 mins ago", icon: UserPlus, color: "text-[#00F5FF]", bg: "bg-[#00F5FF]/10", border: "border-[#00F5FF]/30" },
    { id: 2, title: "Repair Started", desc: "Diagnostics phase initiated.", time: "2 hours ago", icon: Settings, color: "text-[#5227FF]", bg: "bg-[#5227FF]/10", border: "border-[#5227FF]/30" },
    { id: 3, title: "Payment Confirmed", desc: "₹12,499.00 processed successfully.", time: "Yesterday", icon: CreditCard, color: "text-[#00FFA3]", bg: "bg-[#00FFA3]/10", border: "border-[#00FFA3]/30" },
    { id: 4, title: "Service Completed", desc: "MacBook Pro battery replaced.", time: "2 days ago", icon: CheckCircle, color: "text-white/60", bg: "bg-white/5", border: "border-white/10" },
];

export default function ActivityTimeline({ activities = defaultActivities }: ActivityTimelineProps) {
    return (
        <div className="bg-[#050816]/50 rounded-3xl border border-white/10 p-6 backdrop-blur-xl relative overflow-hidden">
            <h3 className="text-xl font-bold text-white mb-6">Activity Feed</h3>
            <div className="relative">
                <div className="absolute left-6 top-2 bottom-2 w-px bg-gradient-to-b from-white/20 to-transparent" />
                
                <div className="space-y-6">
                    {activities.map((activity, index) => (
                        <motion.div 
                            key={activity.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative flex gap-4 group"
                        >
                            <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center shrink-0 border ${activity.bg} ${activity.border} ${activity.color} group-hover:scale-110 transition-transform`}>
                                <activity.icon size={18} />
                                {index === 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#00F5FF] rounded-full animate-ping" />}
                            </div>
                            <div className="flex-1 pt-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-semibold text-white/90">{activity.title}</h4>
                                    <span className="text-xs text-white/40 whitespace-nowrap">{activity.time}</span>
                                </div>
                                <p className="text-sm text-white/60">{activity.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
