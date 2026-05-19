"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import BookingCard from "@/components/dashboard/BookingCard";
import { useAuth } from "@/providers/AuthProvider";
import { useCustomerRealtime } from "@/components/dashboard/CustomerRealtimeProvider";
import { Download } from "lucide-react";
import { toast } from "sonner";

type Booking = {
  id: string | number;
  service_name: string;
  technician_name?: string | null;
  booking_date: string;
  booking_time: string;
  status: string;
  price: number | string;
};

export default function BookingsPage() {
  const { user } = useAuth();
  const { syncVersion } = useCustomerRealtime();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase
        .from("bookings")
        .select("*")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });

      setBookings(data || []);
    };
    void fetch();
  }, [user, syncVersion]);

  const downloadInvoice = (booking: Booking) => {
    const content = [
      "Renovo Invoice",
      `Booking ID: ${booking.id}`,
      `Service: ${booking.service_name}`,
      `Technician: ${booking.technician_name || "Technician"}`,
      `Date: ${new Date(booking.booking_date).toLocaleString()}`,
      `Time: ${booking.booking_time}`,
      `Status: ${booking.status}`,
      `Amount: ₹${Number(booking.price || 0).toLocaleString("en-IN")}`,
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `invoice-${booking.id}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);

    toast.success("Invoice download started.");
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Bookings</h1>
          <p className="text-white/60">Track your service history and download invoices anytime.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bookings.map((b, i) => (
          <div key={b.id} className="space-y-3">
            <BookingCard
              type={b.service_name}
              device={b.technician_name || "Technician"}
              date={new Date(b.booking_date).toLocaleString()}
              time={b.booking_time}
              status={b.status}
              price={`₹${Number(b.price || 0).toLocaleString("en-IN")}`}
              delay={i * 0.05}
            />
            {(b.status === "Paid" || b.status === "Completed") && (
              <button
                type="button"
                onClick={() => downloadInvoice(b)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10"
              >
                <Download className="h-4 w-4 text-[#00F5FF]" />
                Download Invoice
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
