"use client";

import { motion } from "framer-motion";
import { 
    LayoutDashboard, Wrench, CalendarCheck, Map, 
    Bell, CreditCard, User, Settings, LogOut 
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";

const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/customer" },
    { icon: Wrench, label: "Active Repairs", href: "/dashboard/customer/repairs" },
    { icon: CalendarCheck, label: "Bookings", href: "/dashboard/customer/bookings" },
    { icon: Map, label: "Tracking", href: "/dashboard/customer/tracking" },
    { icon: Bell, label: "Notifications", href: "/dashboard/customer/notifications" },
    { icon: CreditCard, label: "Payments", href: "/dashboard/customer/payments" },
    { icon: User, label: "Profile", href: "/dashboard/customer/profile" },
    { icon: Settings, label: "Settings", href: "/dashboard/customer/settings" },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <motion.aside 
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            className="w-72 h-screen fixed left-0 top-0 border-r border-white/10 bg-[#050816]/60 backdrop-blur-3xl z-50 flex flex-col hidden md:flex"
        >
            <div className="p-8 pb-4">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#5227FF] to-[#00F5FF] flex items-center justify-center shadow-[0_0_20px_rgba(0,245,255,0.4)]">
                        <Wrench className="text-white" size={20} />
                    </div>
                    <span className="text-2xl font-bold tracking-wider text-white">RENOVA</span>
                </div>

                <div className="space-y-2">
                    {menuItems.map((item, index) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={index} href={item.href}>
                                <motion.div 
                                    whileHover={{ x: 5 }}
                                    className={`relative flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 group ${
                                        isActive 
                                            ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
                                            : "text-white/50 hover:text-white hover:bg-white/5"
                                    }`}
                                >
                                    {isActive && (
                                        <motion.div 
                                            layoutId="activeTab"
                                            className="absolute left-0 w-1 h-8 bg-[#00F5FF] rounded-r-full shadow-[0_0_10px_#00F5FF]"
                                        />
                                    )}
                                    <item.icon size={20} className={isActive ? "text-[#00F5FF]" : "group-hover:text-[#00F5FF] transition-colors"} />
                                    <span className="font-medium">{item.label}</span>
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            <div className="mt-auto p-8 pt-4 border-t border-white/10">
                <button 
                    onClick={() => logout()}
                    className="flex items-center gap-4 px-4 py-3 w-full rounded-2xl text-white/50 hover:text-[#FF4D6D] hover:bg-[#FF4D6D]/10 transition-all duration-300 group"
                >
                    <LogOut size={20} className="group-hover:text-[#FF4D6D]" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </motion.aside>
    );
}
