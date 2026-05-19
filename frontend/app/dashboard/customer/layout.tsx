"use client";

import React from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import TopNavbar from "@/components/dashboard/TopNavbar";
import { CustomerRealtimeProvider } from "@/components/dashboard/CustomerRealtimeProvider";
import { motion } from "framer-motion";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <CustomerRealtimeProvider>
      <div className="min-h-screen bg-[#050816] text-white">
        <Sidebar />
        <div className="ml-0 md:ml-72 transition-all">
          <TopNavbar />
          <motion.main
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="p-6 md:p-10"
          >
            {children}
          </motion.main>
        </div>
      </div>
    </CustomerRealtimeProvider>
  );
}

