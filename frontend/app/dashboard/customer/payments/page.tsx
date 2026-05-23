"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Clock3, ReceiptText, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { useCustomerRealtime } from "@/components/dashboard/CustomerRealtimeProvider";

import PaymentAnalytics from "@/components/payments/PaymentAnalytics";
import PaymentCard from "@/components/payments/PaymentCard";
import PaymentHistory from "@/components/payments/PaymentHistory";
import PaymentLoader from "@/components/payments/PaymentLoader";
import PaymentModal from "@/components/payments/PaymentModal";
import PaymentSuccess from "@/components/payments/PaymentSuccess";
import InvoiceCard from "@/components/payments/InvoiceCard";
import type { PaymentRecord, PaymentStage } from "@/components/payments/payment-types";

type BookingRow = {
  id: string | number;
  service_name: string;
  technician_name?: string | null;
  booking_date: string;
  booking_time: string;
  status: string;
  payment_status?: string | null;
  price: number | string;
  customer_name?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  eta_minutes?: number | string | null;
};

const sleep = (duration: number) => new Promise((resolve) => setTimeout(resolve, duration));

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value);
}

function buildInvoiceNumber(id: string | number) {
  const cleaned = String(id).replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  return `INV-${cleaned.slice(-8).padStart(8, "0")}`;
}

function normalizePaymentStatus(booking: BookingRow): PaymentRecord["paymentStatus"] {
  const paymentStatus = String(booking.payment_status || "").trim().toLowerCase();
  const bookingStatus = String(booking.status || "").trim().toLowerCase();

  if (paymentStatus === "processing") return "Processing";
  if (paymentStatus === "paid" || bookingStatus === "completed" || bookingStatus === "paid") return "Paid";
  if (paymentStatus === "refunded" || bookingStatus === "refunded") return "Refunded";

  return "Pending";
}

function buildPaymentRecord(booking: BookingRow, customerName: string): PaymentRecord {
  const amount = Number(booking.price || 0);
  const tax = Number((amount * 0.18).toFixed(0));
  const platformFee = Number((amount * 0.015).toFixed(0));
  const total = amount + tax + platformFee;
  const paymentStatus = normalizePaymentStatus(booking);
  const etaMinutes = Number(booking.eta_minutes || 24);
  const invoiceNumber = buildInvoiceNumber(booking.id);
  const paymentDate = booking.updated_at || booking.created_at || booking.booking_date;

  return {
    id: String(booking.id),
    bookingId: booking.id,
    invoiceNumber,
    customerName,
    serviceName: booking.service_name,
    technicianName: booking.technician_name || "Assigned technician",
    bookingDate: booking.booking_date,
    bookingTime: booking.booking_time,
    bookingStatus: booking.status,
    paymentStatus,
    amount,
    tax,
    platformFee,
    total,
    etaMinutes,
    paymentDate,
  };
}

function createReceiptDocument(record: PaymentRecord) {
  return [
    "RENOVA PAYMENT RECEIPT",
    `Invoice: ${record.invoiceNumber}`,
    `Booking ID: ${record.bookingId}`,
    `Customer: ${record.customerName}`,
    `Service: ${record.serviceName}`,
    `Technician: ${record.technicianName}`,
    `Booking Date: ${new Date(record.bookingDate).toLocaleString()}`,
    `Payment Date: ${record.paymentDate ? new Date(record.paymentDate).toLocaleString() : "N/A"}`,
    `Base Amount: ₹${formatMoney(record.amount)}`,
    `Taxes: ₹${formatMoney(record.tax)}`,
    `Processing Fee: ₹${formatMoney(record.platformFee)}`,
    `Total: ₹${formatMoney(record.total)}`,
    `Status: ${record.paymentStatus}`,
  ].join("\n");
}

export default function PaymentsPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const { syncVersion, lastSyncedAt: sharedLastSyncedAt } = useCustomerRealtime();

  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastSyncedAt, setLastSyncedAt] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<BookingRow | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [processingStage, setProcessingStage] = useState<PaymentStage>(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successRecord, setSuccessRecord] = useState<PaymentRecord | null>(null);

  useEffect(() => {
    if (!user) return;

    let mounted = true;

    const fetchBookings = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });

      if (!mounted) return;

      if (error) {
        toast.error("We could not load your payment records.");
        setBookings([]);
      } else {
        setBookings((data || []) as BookingRow[]);
      }

      setLastSyncedAt(sharedLastSyncedAt || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      setLoading(false);
    };

    void fetchBookings();

    return () => {
      mounted = false;
    };
  }, [user, syncVersion, sharedLastSyncedAt]);

  const customerName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Customer";

  const paymentRecords = useMemo(() => {
    return [...bookings]
      .map((booking) => buildPaymentRecord(booking, customerName))
      .sort((a, b) => new Date(b.paymentDate || b.bookingDate).getTime() - new Date(a.paymentDate || a.bookingDate).getTime());
  }, [bookings, customerName]);

  const pendingRecords = useMemo(
    () => paymentRecords.filter((record) => String(record.paymentStatus) === "Pending"),
    [paymentRecords],
  );

  const invoiceRecords = useMemo(
    () => paymentRecords.filter((record) => String(record.paymentStatus) !== "Pending"),
    [paymentRecords],
  );

  const completedTransactions = useMemo(
    () => paymentRecords.filter((record) => String(record.paymentStatus) === "Paid"),
    [paymentRecords],
  );

  const totalSpent = useMemo(
    () => completedTransactions.reduce((sum, record) => sum + record.total, 0),
    [completedTransactions],
  );

  const pendingTotal = useMemo(
    () => pendingRecords.reduce((sum, record) => sum + record.total, 0),
    [pendingRecords],
  );

  const activeInvoiceCount = pendingRecords.length;

  const selectedRecord = useMemo(
    () => (selectedBooking ? buildPaymentRecord(selectedBooking, customerName) : null),
    [selectedBooking, customerName],
  );

  const updateBookingStatus = (bookingId: string | number, paymentStatus: string) => {
    setBookings((current) => current.map((booking) => (String(booking.id) === String(bookingId) ? { ...booking, payment_status: paymentStatus } : booking)));
  };

  const openPayment = (record: PaymentRecord) => {
    const booking = bookings.find((entry) => String(entry.id) === String(record.bookingId));
    if (!booking) {
      toast.error("We could not open that invoice.");
      return;
    }

    setSelectedBooking(booking);
    setProcessingStage(0);
    setShowModal(true);
  };

  const closePayment = () => {
    if (processingStage > 0) {
      return;
    }

    setShowModal(false);
    setSelectedBooking(null);
  };

  const downloadInvoice = (record: PaymentRecord) => {
    const blob = new Blob([createReceiptDocument(record)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `invoice-${record.invoiceNumber}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("Invoice download started.");
  };

  const viewReceipt = (record: PaymentRecord) => {
    const blob = new Blob([createReceiptDocument(record)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
    toast.success("Receipt opened in a new tab.");
  };

  const handleConfirmPayment = async () => {
    if (!selectedBooking || !user) return;

    const bookingId = selectedBooking.id;
    const originalPaymentStatus = selectedBooking.payment_status || normalizePaymentStatus(selectedBooking);

    try {
      setProcessingStage(1);
      updateBookingStatus(bookingId, "Processing");

      const processingUpdate = await supabase.from("bookings").update({ payment_status: "Processing" }).eq("id", bookingId);
      if (processingUpdate.error) {
        throw processingUpdate.error;
      }

      await sleep(850);
      setProcessingStage(2);
      await sleep(950);
      setProcessingStage(3);
      await sleep(900);

      const paidAt = new Date().toISOString();
      const paidUpdate = await supabase.from("bookings").update({ payment_status: "Paid" }).eq("id", bookingId);
      if (paidUpdate.error) {
        throw paidUpdate.error;
      }

      setBookings((current) =>
        current.map((booking) =>
          String(booking.id) === String(bookingId)
            ? {
                ...booking,
                payment_status: "Paid",
                updated_at: paidAt,
              }
            : booking,
        ),
      );

      const completed = buildPaymentRecord({ ...selectedBooking, payment_status: "Paid", updated_at: paidAt }, customerName);
      setSuccessRecord(completed);
      setShowModal(false);
      setSelectedBooking(null);
      setShowSuccess(true);
      setProcessingStage(0);
      toast.success("Payment successful. Your invoice is settled.");
    } catch (error) {
      setProcessingStage(0);
      updateBookingStatus(bookingId, originalPaymentStatus);
      toast.error(error instanceof Error ? error.message : "Payment failed. Please try again.");
    }
  };

  if (authLoading) {
    return <PaymentLoader />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="relative space-y-8">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-28 top-0 h-96 w-96 rounded-full bg-[#00F5FF]/10 blur-[140px]" />
        <div className="absolute right-0 top-24 h-[30rem] w-[30rem] rounded-full bg-[#5227FF]/10 blur-[150px]" />
        <div className="absolute bottom-0 left-1/2 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-[#00FFA3]/10 blur-[140px]" />
      </div>

      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl sm:p-8"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,245,255,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(82,39,255,0.14),transparent_32%)]" />
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[length:44px_44px]" />

        <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00F5FF]/20 bg-[#00F5FF]/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-[#00F5FF]">
              <Sparkles size={12} /> Payment gateway
            </div>
            <div>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">Cinematic Payment Ecosystem</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/60 sm:text-base">
                One payment lane for every repair: secure mock checkout, realtime status updates, premium invoices, and a dashboard that feels ready for production.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-white/65">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2">
                <Clock3 size={14} className="text-[#00F5FF]" /> Synced {lastSyncedAt || sharedLastSyncedAt || "just now"}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2">
                <ShieldCheck size={14} className="text-[#00FFA3]" /> Supabase realtime active
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2">
                <ReceiptText size={14} className="text-[#FFB020]" /> {paymentRecords.length} invoices loaded
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[22rem]">
            <HeroStat label="Total spent" value={`₹${totalSpent.toLocaleString("en-IN")}`} accent="text-[#00FFA3]" />
            <HeroStat label="Pending" value={`₹${pendingTotal.toLocaleString("en-IN")}`} accent="text-[#FFB020]" />
            <HeroStat label="Completed" value={String(completedTransactions.length)} />
            <HeroStat label="Active invoices" value={String(activeInvoiceCount)} />
          </div>
        </div>
      </motion.section>

      <PaymentAnalytics records={paymentRecords} />

      <div className="grid gap-8 xl:grid-cols-[1.12fr_0.88fr]">
        <section className="space-y-8">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-5 backdrop-blur-2xl sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-white/45">Pending payments</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Secure checkout lane</h2>
              </div>
              <div className="rounded-full border border-[#FFB020]/20 bg-[#FFB020]/10 px-3 py-2 text-xs uppercase tracking-[0.24em] text-[#FFB020]">
                {pendingRecords.length} pending
              </div>
            </div>

            <div className="mt-6">
              {loading ? (
                <PaymentLoader />
              ) : pendingRecords.length === 0 ? (
                <div className="rounded-[28px] border border-white/10 bg-black/20 p-8 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#00FFA3]/20 bg-[#00FFA3]/10 text-[#00FFA3]">
                    <ShieldCheck size={28} />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-white">No pending invoices</h3>
                  <p className="mt-2 text-sm text-white/60">All your repair services are currently settled or processing in realtime.</p>
                </div>
              ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                  {pendingRecords.map((record) => (
                    <PaymentCard key={record.id} record={record} onPay={openPayment} onDownload={downloadInvoice} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-5 backdrop-blur-2xl sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-white/45">Payment history</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Realtime transaction feed</h2>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/60">
                <Clock3 size={14} className="text-[#00F5FF]" /> Updated on booking changes
              </div>
            </div>
            <div className="mt-6">
              <PaymentHistory records={paymentRecords} onDownload={downloadInvoice} onViewReceipt={viewReceipt} />
            </div>
          </div>
        </section>

        <aside className="space-y-8">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-5 backdrop-blur-2xl sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-white/45">Invoice system</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Premium receipt cards</h2>
              </div>
              <ReceiptText size={18} className="text-[#00F5FF]" />
            </div>

            <div className="mt-6 space-y-4">
              {invoiceRecords.length === 0 ? (
                <div className="rounded-[26px] border border-white/10 bg-black/20 p-6 text-center text-white/60">
                  No invoices available yet.
                </div>
              ) : (
                invoiceRecords.slice(0, 4).map((record) => (
                  <InvoiceCard key={record.id} record={record} onDownload={downloadInvoice} onViewReceipt={viewReceipt} />
                ))
              )}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-white/5 p-5 backdrop-blur-2xl sm:p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">Error handling</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Premium recovery states</h2>
            <div className="mt-6 space-y-3 text-sm text-white/70">
              <AlertItem title="Failed payments" desc="The modal reverts the booking state and lets the customer retry instantly." />
              <AlertItem title="Connection errors" desc="Supabase update failures are surfaced with a red fintech toast." />
              <AlertItem title="Invalid transactions" desc="Unsupported states remain in the pending lane until corrected." />
            </div>
          </div>
        </aside>
      </div>

      <PaymentModal
        open={showModal}
        record={selectedRecord}
        stage={processingStage}
        onClose={closePayment}
        onConfirm={handleConfirmPayment}
        disabled={processingStage > 0}
      />

      <PaymentSuccess
        open={showSuccess}
        record={successRecord}
        onClose={() => setShowSuccess(false)}
        onDownload={downloadInvoice}
        onViewReceipt={viewReceipt}
      />
    </div>
  );
}

function HeroStat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-black/20 p-4 backdrop-blur-xl">
      <div className="text-xs uppercase tracking-[0.24em] text-white/45">{label}</div>
      <div className={`mt-3 text-2xl font-semibold ${accent || "text-white"}`}>{value}</div>
    </div>
  );
}

function AlertItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-full border border-[#FF4D6D]/20 bg-[#FF4D6D]/10 p-2 text-[#FF4D6D]">
          <AlertTriangle size={14} />
        </div>
        <div>
          <div className="font-medium text-white">{title}</div>
          <p className="mt-1 leading-6 text-white/60">{desc}</p>
        </div>
      </div>
    </div>
  );
}
