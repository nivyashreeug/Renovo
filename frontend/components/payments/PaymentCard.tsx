"use client";

import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, CreditCard, FileText, MapPin, ShieldCheck } from "lucide-react";
import PaymentStatusBadge from "./PaymentStatusBadge";
import type { PaymentRecord } from "./payment-types";

interface PaymentCardProps {
  record: PaymentRecord;
  onPay: (record: PaymentRecord) => void;
  onDownload: (record: PaymentRecord) => void;
}

export default function PaymentCard({ record, onPay, onDownload }: PaymentCardProps) {
  const canPay = String(record.paymentStatus) === "Pending";

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-[1px] shadow-[0_0_40px_rgba(82,39,255,0.08)]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,245,255,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(82,39,255,0.16),transparent_32%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative rounded-[27px] border border-white/10 bg-[#08111f]/90 p-5 backdrop-blur-2xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <PaymentStatusBadge status={record.paymentStatus} />
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/55">
                {record.invoiceNumber}
              </span>
            </div>

            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-white/45">{record.serviceName}</p>
              <h3 className="mt-1 text-xl font-semibold text-white">{record.technicianName}</h3>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
                Booking #{record.bookingId} is ready inside the Renovo payment lane with a cinematic one-tap checkout.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-white/8 bg-white/5 p-3">
                <div className="flex items-center gap-2 text-xs text-white/45">
                  <CalendarDays size={14} /> Booking Date
                </div>
                <div className="mt-2 text-sm text-white">{new Date(record.bookingDate).toLocaleDateString()}</div>
                <div className="text-xs text-white/45">{record.bookingTime}</div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/5 p-3">
                <div className="flex items-center gap-2 text-xs text-white/45">
                  <MapPin size={14} /> Technician
                </div>
                <div className="mt-2 text-sm text-white">{record.technicianName}</div>
                <div className="text-xs text-white/45">ETA {record.etaMinutes} min</div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/5 p-3">
                <div className="flex items-center gap-2 text-xs text-white/45">
                  <FileText size={14} /> Booking ID
                </div>
                <div className="mt-2 text-sm text-white">{record.bookingId}</div>
                <div className="text-xs text-white/45">Ref {record.invoiceNumber}</div>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/5 p-3">
                <div className="flex items-center gap-2 text-xs text-white/45">
                  <ShieldCheck size={14} /> Secure Total
                </div>
                <div className="mt-2 text-sm text-[#00FFA3]">₹{record.total.toLocaleString("en-IN")}</div>
                <div className="text-xs text-white/45">Incl. taxes and service fee</div>
              </div>
            </div>
          </div>

          <div className="flex min-w-[220px] flex-col gap-3 rounded-[24px] border border-white/10 bg-black/20 p-4">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-white/45">
              <span>Payment Card</span>
              <CreditCard size={15} className="text-[#00F5FF]" />
            </div>
            <div className="rounded-[20px] border border-white/10 bg-gradient-to-br from-[#00F5FF]/20 via-[#5227FF]/20 to-[#00FFA3]/15 p-4 shadow-[0_0_30px_rgba(0,245,255,0.12)]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-white/60">Amount Due</p>
                  <p className="mt-2 text-2xl font-semibold text-white">₹{record.total.toLocaleString("en-IN")}</p>
                </div>
                <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] text-white/75">
                  Secure lane
                </div>
              </div>
              <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[72%] rounded-full bg-linear-to-r from-[#00F5FF] via-[#5227FF] to-[#00FFA3]" />
              </div>
            </div>

            <div className="space-y-2 text-sm text-white/65">
              <div className="flex items-center justify-between">
                <span>Base</span>
                <span>₹{record.amount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tax</span>
                <span>₹{record.tax.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Fee</span>
                <span>₹{record.platformFee.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
          <div className="text-sm text-white/55">Premium repair invoice ready for one-tap settlement.</div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onDownload(record)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:border-white/20 hover:bg-white/10"
            >
              <FileText size={14} />
              Download Invoice
            </button>
            <button
              type="button"
              onClick={() => onPay(record)}
              disabled={!canPay}
              className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#00F5FF] via-[#00FFA3] to-[#B8F3FF] px-5 py-2.5 text-sm font-semibold text-[#02111f] shadow-[0_0_28px_rgba(0,245,255,0.24)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {canPay ? "Pay Now" : "View Status"}
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
