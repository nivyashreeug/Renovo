"use client";

import React, { useEffect, useMemo, useState } from "react";
import TrackingCard from "@/components/dashboard/TrackingCard";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";
import { Clock3, MapPinned, Route, Wrench } from "lucide-react";

type BookingRow = {
  id: string | number;
  service_name: string;
  technician_name?: string | null;
  status: string;
  booking_date: string;
};

export default function TrackingPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchTrackingSource = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("bookings")
        .select("id, service_name, technician_name, status, booking_date")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });

      setBookings((data || []) as BookingRow[]);
      setLoading(false);
    };

    void fetchTrackingSource();
  }, [user]);

  const activeBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const status = String(booking.status || "").toLowerCase();
      return status !== "completed" && status !== "cancelled" && status !== "refunded";
    });
  }, [bookings]);

  const latestActive = activeBookings[0];

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00F5FF]/20 bg-[#00F5FF]/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-[#00F5FF]">
              <Route size={12} /> Live mobility view
            </div>
            <h1 className="mt-3 text-3xl font-bold">Service Tracking</h1>
            <p className="mt-2 text-white/60">Monitor your technician route, current repair stage, and estimated arrival in realtime.</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <TrackingMetric label="Active Jobs" value={String(activeBookings.length)} icon={Wrench} accent="text-[#00F5FF]" />
          <TrackingMetric label="Latest Status" value={latestActive?.status || "No active job"} icon={MapPinned} accent="text-[#B8F3FF]" />
          <TrackingMetric label="Technician" value={latestActive?.technician_name || "Waiting assignment"} icon={Route} accent="text-[#00FFA3]" />
          <TrackingMetric label="Last Updated" value={latestActive ? new Date(latestActive.booking_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-"} icon={Clock3} accent="text-[#FFB020]" />
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white/60">Loading live tracking...</div>
      ) : activeBookings.length > 0 ? (
        <TrackingCard />
      ) : (
        <div className="rounded-3xl border border-dashed border-white/10 bg-white/5 p-10 text-center">
          <p className="text-2xl font-semibold text-white">No active repair to track</p>
          <p className="mt-2 text-white/60">Once a booking becomes active, live tracking and stage timeline will appear here.</p>
        </div>
      )}
    </div>
  );
}

function TrackingMetric({
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
      <div className="mt-2 text-lg font-semibold text-white">{value}</div>
    </div>
  );
}
