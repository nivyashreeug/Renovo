"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Download, Sparkles } from "lucide-react";
import type { PaymentRecord } from "./payment-types";

interface PaymentSuccessProps {
  open: boolean;
  record: PaymentRecord | null;
  onClose: () => void;
  onDownload: (record: PaymentRecord) => void;
  onViewReceipt: (record: PaymentRecord) => void;
}

export default function PaymentSuccess({ open, record, onClose, onDownload, onViewReceipt }: PaymentSuccessProps) {
  const ambientRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open || !ambientRef.current) {
      return;
    }

    const tween = gsap.to(ambientRef.current, {
      y: -14,
      duration: 3.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    return () => {
      tween.kill();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && record ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center overflow-hidden bg-[#03060d] px-4 py-6 backdrop-blur-2xl"
        >
          <div ref={ambientRef} className="absolute inset-0">
            <div className="absolute left-1/2 top-0 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-[#00F5FF]/15 blur-[120px]" />
            <div className="absolute right-[12%] top-[18%] h-72 w-72 rounded-full bg-[#5227FF]/18 blur-[140px]" />
            <div className="absolute bottom-[10%] left-[10%] h-72 w-72 rounded-full bg-[#00FFA3]/12 blur-[140px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_40%)]" />
          </div>

          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 18 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.96, opacity: 0, y: 18 }}
            transition={{ type: "spring", stiffness: 200, damping: 24 }}
            className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[36px] border border-white/10 bg-white/6 p-6 text-center shadow-[0_0_90px_rgba(0,245,255,0.16)] backdrop-blur-3xl sm:p-8 lg:p-10"
          >
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,245,255,0.08),transparent_35%,rgba(82,39,255,0.1))]" />

            <div className="relative z-10">
              <motion.div
                animate={{ scale: [1, 1.06, 1], boxShadow: ["0 0 0 rgba(0,255,163,0)", "0 0 60px rgba(0,255,163,0.26)", "0 0 0 rgba(0,255,163,0)"] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border border-[#00FFA3]/30 bg-[#00FFA3]/10"
              >
                <CheckCircle2 size={54} className="text-[#00FFA3]" />
              </motion.div>

              <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#00FFA3]/20 bg-[#00FFA3]/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-[#00FFA3]">
                <Sparkles size={12} /> Payment Successful
              </div>

              <h2 className="mt-5 text-4xl font-semibold text-white sm:text-5xl">Repair Service Confirmed</h2>
              <p className="mt-4 text-lg text-white/70">Your superhero technician is now on the way.</p>

              <div className="mt-8 grid gap-4 text-left sm:grid-cols-2 xl:grid-cols-4">
                <InfoCard label="Service" value={record.serviceName} />
                <InfoCard label="Technician" value={record.technicianName} />
                <InfoCard label="Booking / Invoice" value={`${record.bookingId} • ${record.invoiceNumber}`} />
                <InfoCard label="Amount Paid" value={`₹${record.total.toLocaleString("en-IN")}`} />
                <InfoCard label="ETA" value={`${record.etaMinutes} min`} />
                <InfoCard label="Booked For" value={new Date(record.bookingDate).toLocaleString()} />
                <InfoCard label="Payment Lane" value="Supabase realtime synced" />
                <InfoCard label="Status" value="Technician assigned" />
              </div>

              <div className="mt-8 rounded-[30px] border border-white/10 bg-black/20 p-5 text-left shadow-[0_0_40px_rgba(82,39,255,0.12)]">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.28em] text-white/45">Transaction Receipt</div>
                    <div className="mt-2 text-2xl font-semibold text-white">Invoice {record.invoiceNumber}</div>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70">
                    Ambient fintech confirmation complete
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <ReceiptMetric label="Base" value={`₹${record.amount.toLocaleString("en-IN")}`} />
                  <ReceiptMetric label="Taxes + fee" value={`₹${(record.tax + record.platformFee).toLocaleString("en-IN")}`} />
                  <ReceiptMetric label="Total" value={`₹${record.total.toLocaleString("en-IN")}`} accent />
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => onDownload(record)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/80 transition hover:bg-white/10"
                >
                  <Download size={15} />
                  Download Invoice
                </button>
                <button
                  type="button"
                  onClick={() => onViewReceipt(record)}
                  className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#00F5FF] via-[#00FFA3] to-[#B8F3FF] px-6 py-3 text-sm font-semibold text-[#02111f] shadow-[0_0_28px_rgba(0,245,255,0.22)] transition hover:scale-[1.01]"
                >
                  View Receipt
                  <ArrowRight size={15} />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/75 transition hover:bg-white/10"
                >
                  Return to Payments
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
      <div className="text-xs uppercase tracking-[0.24em] text-white/45">{label}</div>
      <div className="mt-2 text-sm font-medium leading-6 text-white">{value}</div>
    </div>
  );
}

function ReceiptMetric({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-3xl border p-4 ${accent ? "border-[#00FFA3]/30 bg-[#00FFA3]/10" : "border-white/10 bg-white/5"}`}>
      <div className="text-xs uppercase tracking-[0.24em] text-white/45">{label}</div>
      <div className={`mt-2 text-lg font-semibold ${accent ? "text-[#00FFA3]" : "text-white"}`}>{value}</div>
    </div>
  );
}
