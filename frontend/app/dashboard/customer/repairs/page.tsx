"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import BookingCard from "@/components/dashboard/BookingCard";
import { motion } from "framer-motion";
import { useAuth } from "@/providers/AuthProvider";
import { useCustomerRealtime } from "@/components/dashboard/CustomerRealtimeProvider";

type Booking = {
  id: string | number;
  service_name: string;
  technician_name?: string | null;
  booking_date: string;
  booking_time: string;
  status: string;
  price: number | string;
};

export default function RepairsPage() {
  const { user } = useAuth();
  const { syncVersion } = useCustomerRealtime();
  const [repairs, setRepairs] = useState<Booking[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("bookings")
        .select("*")
        .eq("customer_id", user.id)
        .neq("status", "Completed")
        .order("created_at", { ascending: false });

      setRepairs(data || []);
    };
    void fetch();
  }, [user, syncVersion]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Active Repairs</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {repairs.length > 0 ? (
          repairs.map((r, i) => (
            <BookingCard
              key={r.id}
              type={r.service_name}
              device={r.technician_name || "Technician"}
              date={new Date(r.booking_date).toLocaleString()}
              time={r.booking_time}
              status={r.status}
              price={`₹${r.price}`}
              delay={i * 0.05}
            />
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center"
          >
            <p className="text-white/60">No active repairs found.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
