"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import BookingCard from "@/components/dashboard/BookingCard";
import { useAuth } from "@/providers/AuthProvider";
import { useCustomerRealtime } from "@/components/dashboard/CustomerRealtimeProvider";
import { CalendarCheck, Download, FileText, Filter, History, IndianRupee, ReceiptText } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

type Booking = {
  id: string | number;
  service_name: string;
  technician_name?: string | null;
  booking_date: string;
  booking_time: string;
  status: string;
  payment_status?: string | null;
  price: number | string;
  created_at?: string | null;
};

type BookingFilter = "all" | "active" | "completed" | "cancelled";

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);
}

function isCompletedBooking(status: string, paymentStatus?: string | null) {
  const normalizedStatus = String(status || "").toLowerCase();
  const normalizedPayment = String(paymentStatus || "").toLowerCase();
  return normalizedStatus === "completed" || normalizedStatus === "paid" || normalizedPayment === "paid";
}

function isCancelledBooking(status: string) {
  const normalizedStatus = String(status || "").toLowerCase();
  return normalizedStatus === "cancelled" || normalizedStatus === "refunded";
}

export default function BookingsPage() {
  const { user } = useAuth();
  const { syncVersion } = useCustomerRealtime();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<BookingFilter>("all");

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("bookings")
        .select("*")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });

      setBookings(data || []);
      setLoading(false);
    };
    void fetch();
  }, [user, syncVersion]);

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "all") return true;
    if (filter === "active") return !isCompletedBooking(booking.status, booking.payment_status) && !isCancelledBooking(booking.status);
    if (filter === "completed") return isCompletedBooking(booking.status, booking.payment_status);
    return isCancelledBooking(booking.status);
  });

  const invoiceEligibleBookings = bookings.filter((booking) => isCompletedBooking(booking.status, booking.payment_status));

  const totalSpend = bookings.reduce((sum, booking) => {
    if (!isCompletedBooking(booking.status, booking.payment_status)) {
      return sum;
    }
    return sum + Number(booking.price || 0);
  }, 0);

  const downloadInvoice = (booking: Booking) => {
    const amount = Number(booking.price || 0);
    const tax = Number((amount * 0.18).toFixed(0));
    const total = amount + tax;

    const content = [
      "Renovo Invoice",
      `Invoice ID: INV-${String(booking.id).replace(/[^a-zA-Z0-9]/g, "").slice(-8).toUpperCase()}`,
      `Booking ID: ${booking.id}`,
      `Service: ${booking.service_name}`,
      `Technician: ${booking.technician_name || "Technician"}`,
      `Date: ${new Date(booking.booking_date).toLocaleString()}`,
      `Time: ${booking.booking_time}`,
      `Status: ${booking.status}`,
      `Base Amount: ₹${formatMoney(amount)}`,
      `Tax (18%): ₹${formatMoney(tax)}`,
      `Total: ₹${formatMoney(total)}`,
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
    <div className="space-y-8">
      <div className="rounded-[30px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00F5FF]/20 bg-[#00F5FF]/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-[#00F5FF]">
              <History size={12} /> Booking command center
            </div>
            <h1 className="mt-3 text-3xl font-bold">Bookings & Invoice History</h1>
            <p className="mt-2 text-white/60">Track every request, monitor statuses, and download invoices for completed repairs.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <SummaryCard title="Total Bookings" value={String(bookings.length)} icon={CalendarCheck} accent="text-[#00F5FF]" />
          <SummaryCard title="Active" value={String(bookings.filter((booking) => !isCompletedBooking(booking.status, booking.payment_status) && !isCancelledBooking(booking.status)).length)} icon={Filter} accent="text-[#FFB020]" />
          <SummaryCard title="Invoices" value={String(invoiceEligibleBookings.length)} icon={ReceiptText} accent="text-[#00FFA3]" />
          <SummaryCard title="Total Spend" value={`₹${formatMoney(totalSpend)}`} icon={IndianRupee} accent="text-[#B8F3FF]" />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {(["all", "active", "completed", "cancelled"] as BookingFilter[]).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFilter(option)}
            className={`rounded-full border px-4 py-2 text-sm capitalize transition ${
              filter === option
                ? "border-[#00F5FF]/40 bg-[#00F5FF]/10 text-[#00F5FF]"
                : "border-white/10 bg-white/5 text-white/65 hover:bg-white/10"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white/60">Loading booking history...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {filteredBookings.map((b, i) => (
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
              {isCompletedBooking(b.status, b.payment_status) && (
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
          {!filteredBookings.length && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-full rounded-3xl border border-white/10 bg-white/5 p-10 text-center"
            >
              <p className="text-xl font-semibold text-white">No bookings in this view</p>
              <p className="mt-2 text-white/60">Switch filters to review a different booking segment.</p>
            </motion.div>
          )}
        </div>
      )}

      <section className="rounded-[30px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
        <div className="flex items-center gap-2 text-sm uppercase tracking-[0.24em] text-white/45">
          <FileText size={14} /> Invoice Archive
        </div>
        <h2 className="mt-2 text-2xl font-semibold text-white">Generated Invoices</h2>
        <div className="mt-4 space-y-3">
          {invoiceEligibleBookings.length > 0 ? (
            invoiceEligibleBookings.map((booking) => (
              <div key={`invoice-${booking.id}`} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div>
                  <p className="font-semibold text-white">INV-{String(booking.id).replace(/[^a-zA-Z0-9]/g, "").slice(-8).toUpperCase()}</p>
                  <p className="mt-1 text-sm text-white/60">{booking.service_name} • {booking.technician_name || "Technician"}</p>
                  <p className="text-xs text-white/45">{new Date(booking.booking_date).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-[#00FFA3]">₹{formatMoney(Number(booking.price || 0))}</p>
                  <button
                    type="button"
                    onClick={() => downloadInvoice(booking)}
                    className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/10"
                  >
                    <Download size={13} /> Export
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-6 text-center text-white/50">
              Complete a paid booking to generate your first invoice.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  icon: Icon,
  accent,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-white/45">
        <Icon size={14} className={accent} /> {title}
      </div>
      <div className="mt-3 text-2xl font-semibold text-white">{value}</div>
    </div>
  );
}
