"use client";

import { motion } from "framer-motion";
import { Bell, ShieldAlert, CheckCircle, Car } from "lucide-react";

type NotificationItem = {
    id: string | number;
    title: string;
    desc: string;
    time: string;
    icon: typeof Car | typeof CheckCircle | typeof ShieldAlert;
    color: string;
    bg: string;
    unread: boolean;
};

interface NotificationPanelProps {
    notifications?: NotificationItem[];
    newCount?: number;
}

const defaultNotifications: NotificationItem[] = [
    { id: 1, title: "Technician Arriving Soon", desc: "Alex is 5 mins away from your location.", time: "Just now", icon: Car, color: "text-[#00F5FF]", bg: "bg-[#00F5FF]/10", unread: true },
    { id: 2, title: "Payment Successful", desc: "Invoice #INV-2049 paid.", time: "2h ago", icon: CheckCircle, color: "text-[#00FFA3]", bg: "bg-[#00FFA3]/10", unread: false },
    { id: 3, title: "Action Required", desc: "Please approve the diagnostic quote.", time: "5h ago", icon: ShieldAlert, color: "text-[#FF4D6D]", bg: "bg-[#FF4D6D]/10", unread: true },
];

export default function NotificationPanel({ notifications = defaultNotifications, newCount }: NotificationPanelProps) {
    return (
        <div className="bg-white/5 rounded-3xl border border-white/10 p-6 backdrop-blur-md relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Bell size={20} className="text-[#00F5FF]" />
                    Alerts
                </h3>
                <span className="text-xs text-[#00F5FF] bg-[#00F5FF]/10 px-2 py-1 rounded-full">{newCount ?? notifications.filter((notification) => notification.unread).length} New</span>
            </div>

            <div className="space-y-4">
                {notifications.map((notif, index) => (
                    <motion.div 
                        key={notif.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-2xl flex gap-4 transition-colors cursor-pointer group ${
                            notif.unread ? "bg-white/10 border border-white/20 hover:bg-white/15" : "bg-transparent hover:bg-white/5"
                        }`}
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notif.bg} ${notif.color}`}>
                            <notif.icon size={18} />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-1">
                                <h4 className={`text-sm font-semibold ${notif.unread ? "text-white" : "text-white/80"}`}>
                                    {notif.title}
                                </h4>
                                <span className="text-xs text-white/40">{notif.time}</span>
                            </div>
                            <p className="text-xs text-white/60">{notif.desc}</p>
                        </div>
                        {notif.unread && (
                            <div className="w-2 h-2 rounded-full bg-[#00F5FF] mt-1 shadow-[0_0_8px_#00F5FF]" />
                        )}
                    </motion.div>
                ))}
            </div>
            
            <button className="w-full mt-4 py-2 text-sm text-white/50 hover:text-white transition-colors">
                View All Notifications
            </button>
        </div>
    );
}
