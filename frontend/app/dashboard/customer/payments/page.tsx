"use client";

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { useCustomerRealtime } from "@/components/dashboard/CustomerRealtimeProvider";
import { motion } from "framer-motion";
import { CheckCircle2, Download } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
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

export default function PaymentsPage() {
  const { user } = useAuth();
  const { syncVersion } = useCustomerRealtime();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal / processing state
  const [selected, setSelected] = useState<Booking | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("bookings")
        .select("*")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });

      if (!mounted) return;
      setBookings((data || []) as Booking[]);
      setLoading(false);
    };
    void fetch();
    return () => {
      mounted = false;
    };
  }, [user, syncVersion]);

  const pending = bookings.filter((b) => b.status !== "Paid" && b.status !== "Completed" && b.status !== "Cancelled");
  const completed = bookings.filter((b) => b.status === "Paid" || b.status === "Completed");

  const totalSpent = useMemo(() => completed.reduce((s, b) => s + Number(b.price || 0), 0), [completed]);
  const pendingTotal = useMemo(() => pending.reduce((s, b) => s + Number(b.price || 0), 0), [pending]);

  const chartData = useMemo(() => {
    // monthly mock series from bookings by date
    const map = new Map<string, number>();
    bookings.forEach((b) => {
      const d = new Date(b.booking_date);
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      map.set(key, (map.get(key) || 0) + Number(b.price || 0));
    });
    return Array.from(map.entries()).map(([k, v]) => ({ name: k, value: v }));
  }, [bookings]);

  const openPay = (b: Booking) => {
    setSelected(b);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelected(null);
  };

  const downloadInvoice = (booking: Booking) => {
    const content = `Invoice for ${booking.service_name}\nBooking ID: ${booking.id}\nTechnician: ${booking.technician_name || 'TBD'}\nAmount: ₹${booking.price}\nDate: ${new Date(booking.booking_date).toLocaleString()}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${booking.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const confirmPayment = async () => {
    if (!selected || !user) return;

    // Mock processing steps
    await new Promise((r) => setTimeout(r, 900));
    await new Promise((r) => setTimeout(r, 1200));

    // Optimistic UI update
    setBookings((cur) => cur.map((b) => (b.id === selected.id ? { ...b, status: "Paid" } : b)));
    setShowModal(false);
    setShowSuccess(true);

    // Persist to Supabase
    const { error } = await supabase.from("bookings").update({ status: "Paid", payment_status: "Paid" }).eq("id", selected.id);
    if (error) {
      toast.error("Failed to persist payment. Reverting.");
      // revert
      setBookings((cur) => cur.map((b) => (b.id === selected.id ? { ...b, status: selected.status } : b)));
      setShowSuccess(false);
      return;
    }

    toast.success("Payment successful — booking updated.");
    // auto-dismiss success after a delay
    setTimeout(() => setShowSuccess(false), 4500);
  };

  return (
    <div>
      <div className="mb-8">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-3xl font-bold">Payment Overview</h2>
              <p className="text-white/60 mt-1">Your billing snapshot and invoices</p>
            </div>
            <div className="flex gap-4 items-center">
              <div className="text-right">
                <div className="text-sm text-white/60">Total Spent</div>
                <div className="text-2xl font-bold">₹{totalSpent.toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-white/60">Pending</div>
                <div className="text-2xl font-bold text-[#FFB020]">₹{pendingTotal.toLocaleString()}</div>
              </div>
              <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                <div className="text-xs text-white/60">Transactions</div>
                <div className="font-bold">{bookings.length}</div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="col-span-2 rounded-2xl border border-white/10 bg-white/6 p-4">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData.length ? chartData : [{ name: "0", value: 0 }]}> 
                    <Line type="monotone" dataKey="value" stroke="#00F5FF" strokeWidth={3} dot={false} />
                    <Tooltip />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[{ name: "Pending", value: pendingTotal }, { name: "Completed", value: totalSpent }]} dataKey="value" innerRadius={36} outerRadius={70}>
                      <Cell fill="#FFB020" />
                      <Cell fill="#00FFA3" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-semibold">Pending Payments</h3>
          {loading ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">Loading...</div>
          ) : pending.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
              <CheckCircle2 size={36} className="mx-auto text-[#00FFA3] mb-3" />
              <p className="text-white/70">No pending payments. All clear.</p>
            </div>
          ) : (
            pending.map((p) => (
              <motion.div key={p.id} whileHover={{ y: -4 }} className="rounded-2xl border border-white/10 bg-white/6 p-5 flex items-center justify-between">
                <div>
                  <div className="text-sm text-white/60">{p.service_name}</div>
                  <div className="text-white font-semibold">{p.technician_name || "TBD"} — {new Date(p.booking_date).toLocaleDateString()}</div>
                  <div className="text-xs text-white/50">Invoice #{p.id} • {p.booking_time}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-white/60">Amount</div>
                    <div className="font-bold">₹{Number(p.price).toLocaleString()}</div>
                  </div>
                  <button onClick={() => openPay(p)} className="px-4 py-2 rounded-xl bg-[#00F5FF] text-[#050816] font-bold">Pay Now</button>
                </div>
              </motion.div>
            ))
          )}

          <h3 className="text-xl font-semibold mt-6">Payment History</h3>
          <div className="space-y-4">
            {completed.map((c) => (
              <div key={c.id} className="rounded-xl border border-white/10 bg-white/6 p-4 flex justify-between items-center">
                <div>
                  <div className="text-sm text-white/60">{c.service_name}</div>
                  <div className="font-semibold">{c.technician_name || "TBD"}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-white/60">Paid</div>
                    <div className="font-bold">₹{Number(c.price).toLocaleString()}</div>
                  </div>
                  <button onClick={() => downloadInvoice(c)} className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 flex items-center gap-2"><Download size={14} /> Download</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
            <div className="text-sm text-white/60">Quick Stats</div>
            <div className="mt-3">
              <div className="flex justify-between text-white/80"><span>Total Spent</span><span>₹{totalSpent.toLocaleString()}</span></div>
              <div className="flex justify-between text-white/80"><span>Pending</span><span className="text-[#FFB020]">₹{pendingTotal.toLocaleString()}</span></div>
              <div className="flex justify-between text-white/80"><span>Transactions</span><span>{bookings.length}</span></div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
            <div className="text-sm text-white/60">Invoices</div>
            <div className="mt-3 space-y-3">
              {bookings.slice(0, 5).map((b) => (
                <div key={b.id} className="flex items-center justify-between">
                  <div className="text-sm">#{b.id}</div>
                  <div className="text-sm text-white/60">₹{Number(b.price).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Pay Now Modal */}
      {showModal && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-2xl rounded-3xl border border-white/10 bg-[#050816] p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold">Pay Invoice</h3>
                <p className="text-white/60">{selected.service_name} — {selected.technician_name || 'TBD'}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-white/60">Amount</div>
                <div className="text-2xl font-bold">₹{Number(selected.price).toLocaleString()}</div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm text-white/60">Card Preview</div>
                <div className="mt-3 rounded-xl bg-gradient-to-r from-[#5227FF] to-[#00F5FF] p-4 text-white">
                  <div className="flex justify-between items-center">
                    <div className="font-bold">RENOVA •</div>
                    <div className="text-sm">•••• 4242</div>
                  </div>
                  <div className="mt-6 text-sm">John Doe</div>
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm text-white/60">Booking Details</div>
                <div className="mt-3 text-sm text-white/80">
                  <div>Booking ID: {selected.id}</div>
                  <div>Service: {selected.service_name}</div>
                  <div>Time: {new Date(selected.booking_date).toLocaleString()} • {selected.booking_time}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={closeModal} className="px-4 py-2 rounded-xl border border-white/10">Cancel</button>
              <button onClick={confirmPayment} className="px-6 py-2 rounded-xl bg-[#00F5FF] font-bold">Confirm Payment</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Success Screen */}
      {showSuccess && selected && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-[#050816]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00F5FF]/10 to-[#5227FF]/10 backdrop-blur-md" />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative z-10 mx-4 w-full max-w-3xl rounded-3xl border border-white/10 bg-white/6 p-10 text-center">
            <motion.div animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 1.6, repeat: Infinity }} className="mx-auto mb-6 w-28 h-28 rounded-full bg-[#00FFA3]/20 flex items-center justify-center">
              <CheckCircle2 size={48} className="text-[#00FFA3]" />
            </motion.div>
            <h2 className="text-3xl font-bold">Payment Successful</h2>
            <p className="text-white/70 mt-2">Your repair booking is confirmed — a technician is on the way.</p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm text-white/60">Booking ID</div>
                <div className="font-bold">{selected.id}</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm text-white/60">Amount</div>
                <div className="font-bold">₹{Number(selected.price).toLocaleString()}</div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm text-white/60">ETA</div>
                <div className="font-bold">20 min</div>
              </div>
            </div>

            <div className="mt-6 flex justify-center gap-4">
              <button onClick={() => downloadInvoice(selected)} className="px-5 py-3 rounded-xl border border-white/10 bg-white/5 flex items-center gap-2"> <Download size={16} /> Download Invoice</button>
              <button onClick={() => setShowSuccess(false)} className="px-5 py-3 rounded-xl bg-[#00F5FF] font-bold">Back to Dashboard</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
