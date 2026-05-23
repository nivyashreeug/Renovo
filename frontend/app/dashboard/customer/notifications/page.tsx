"use client";

import React, { useEffect, useMemo, useState } from "react";
import NotificationPanel from "@/components/dashboard/NotificationPanel";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";
import { Bell, Car, CheckCircle, ShieldAlert } from "lucide-react";

type BookingRow = {
  id: string | number;
  service_name: string;
  technician_name?: string | null;
  status: string;
  booking_date: string;
  updated_at?: string | null;
};

type PanelNotification = {
  id: string | number;
  title: string;
  desc: string;
  time: string;
  icon: typeof Car | typeof CheckCircle | typeof ShieldAlert;
  color: string;
  bg: string;
  unread: boolean;
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchNotificationsSource = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("bookings")
        .select("id, service_name, technician_name, status, booking_date, updated_at")
        .eq("customer_id", user.id)
        .order("updated_at", { ascending: false });

      setBookings((data || []) as BookingRow[]);
      setLoading(false);
    };

    void fetchNotificationsSource();
  }, [user]);

  const notifications = useMemo(() => {
    return bookings.slice(0, 12).map((booking, index) => {
      const status = String(booking.status || "").toLowerCase();

      if (status === "completed") {
        return {
          id: `${booking.id}-completed`,
          title: "Repair Completed",
          desc: `${booking.service_name} is marked complete by ${booking.technician_name || "your technician"}.`,
          time: new Date(booking.updated_at || booking.booking_date).toLocaleString(),
          icon: CheckCircle,
          color: "text-[#00FFA3]",
          bg: "bg-[#00FFA3]/10",
          unread: index < 3,
        } as PanelNotification;
      }

      if (status === "cancelled" || status === "refunded") {
        return {
          id: `${booking.id}-attention`,
          title: "Action Required",
          desc: `${booking.service_name} needs attention due to ${booking.status.toLowerCase()} status.`,
          time: new Date(booking.updated_at || booking.booking_date).toLocaleString(),
          icon: ShieldAlert,
          color: "text-[#FF4D6D]",
          bg: "bg-[#FF4D6D]/10",
          unread: index < 3,
        } as PanelNotification;
      }

      return {
        id: `${booking.id}-tracking`,
        title: "Technician Progress Update",
        desc: `${booking.technician_name || "Technician"} is working on ${booking.service_name}. Current status: ${booking.status}.`,
        time: new Date(booking.updated_at || booking.booking_date).toLocaleString(),
        icon: Car,
        color: "text-[#00F5FF]",
        bg: "bg-[#00F5FF]/10",
        unread: index < 3,
      } as PanelNotification;
    });
  }, [bookings]);

  const unreadCount = notifications.filter((notification) => notification.unread).length;

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00F5FF]/20 bg-[#00F5FF]/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-[#00F5FF]">
              <Bell size={12} /> Notification hub
            </div>
            <h1 className="mt-3 text-3xl font-bold">Realtime Alerts & Activity</h1>
            <p className="mt-2 text-white/60">Keep track of status changes, completed jobs, and actions that need your approval.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-white/45">Unread</p>
            <p className="mt-1 text-2xl font-semibold text-[#00F5FF]">{unreadCount}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white/60">Loading notifications...</div>
      ) : (
        <NotificationPanel notifications={notifications} newCount={unreadCount} />
      )}
    </div>
  );
}
