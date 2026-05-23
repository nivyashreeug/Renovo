"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import BookingCard from "@/components/dashboard/BookingCard";
import { motion } from "framer-motion";
import { useAuth } from "@/providers/AuthProvider";
import { useCustomerRealtime } from "@/components/dashboard/CustomerRealtimeProvider";
import { Clock3, ShieldCheck, Wrench } from "lucide-react";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("bookings")
        .select("*")
        .eq("customer_id", user.id)
        .neq("status", "Completed")
        .order("created_at", { ascending: false });

      setRepairs(data || []);
      setLoading(false);
    };
    void fetch();
  }, [user, syncVersion]);

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#00F5FF]/20 bg-[#00F5FF]/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-[#00F5FF]">
          <Wrench size={12} /> Repair operations
        </div>
        <h1 className="mt-3 text-3xl font-bold">Active Repairs</h1>
        <p className="mt-2 text-white/60">Follow all ongoing repair jobs, assigned technicians, and live status checkpoints.</p>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <MetricCard label="Open Repairs" value={String(repairs.length)} icon={Wrench} accent="text-[#00F5FF]" />
          <MetricCard label="In Progress" value={String(repairs.filter((repair) => String(repair.status).toLowerCase() === "in progress").length)} icon={Clock3} accent="text-[#FFB020]" />
          <MetricCard label="Assigned" value={String(repairs.filter((repair) => !!repair.technician_name).length)} icon={ShieldCheck} accent="text-[#00FFA3]" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {loading ? (
          <div className="col-span-full rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white/60">Loading active repairs...</div>
        ) : repairs.length > 0 ? (
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
            className="col-span-full rounded-3xl border border-white/10 bg-white/5 p-8 text-center"
          >
            <p className="text-xl font-semibold text-white">No active repairs found.</p>
            <p className="mt-2 text-white/60">When a booking moves to active status, it will show here automatically.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/45">
        <Icon size={13} className={accent} /> {label}
      </div>
      <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
    </div>
  );
}
