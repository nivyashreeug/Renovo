"use client";

import { motion } from "framer-motion";
import { Clock3, History, RotateCcw } from "lucide-react";
import PaymentStatusBadge from "./PaymentStatusBadge";
import type { PaymentRecord } from "./payment-types";

interface PaymentHistoryProps {
  records: PaymentRecord[];
  onDownload: (record: PaymentRecord) => void;
  onViewReceipt: (record: PaymentRecord) => void;
}

export default function PaymentHistory({ records, onDownload, onViewReceipt }: PaymentHistoryProps) {
  const history = [...records].sort((a, b) => new Date(b.paymentDate || b.bookingDate).getTime() - new Date(a.paymentDate || a.bookingDate).getTime());

  if (history.length === 0) {
    return (
      <div className="rounded-[30px] border border-white/10 bg-white/5 p-8 text-center backdrop-blur-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#00F5FF]">
          <History size={28} />
        </div>
        <h3 className="mt-5 text-xl font-semibold text-white">No payment history yet</h3>
        <p className="mt-2 text-sm text-white/60">Your completed repairs, invoices, and refunds will appear here once the payment lane is used.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((record, index) => (
        <motion.div
          key={record.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="relative overflow-hidden rounded-[26px] border border-white/10 bg-white/5 p-5 backdrop-blur-2xl"
        >
          <div className="absolute left-5 top-0 h-full w-px bg-linear-to-b from-[#00F5FF]/40 via-white/20 to-transparent" />
          <div className="flex flex-col gap-4 pl-3 sm:flex-row sm:items-center sm:justify-between sm:pl-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <PaymentStatusBadge status={record.paymentStatus} size="sm" />
                <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/20 px-2.5 py-1 text-[11px] uppercase tracking-[0.22em] text-white/45">
                  <Clock3 size={12} /> {new Date(record.paymentDate || record.bookingDate).toLocaleDateString()}
                </span>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">{record.serviceName}</h4>
                <p className="mt-1 text-sm text-white/60">{record.technicianName} • Booking #{record.bookingId}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-right">
                <div className="text-xs uppercase tracking-[0.24em] text-white/45">Invoice</div>
                <div className="mt-1 text-sm text-white">{record.invoiceNumber}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-right">
                <div className="text-xs uppercase tracking-[0.24em] text-white/45">Amount</div>
                <div className="mt-1 text-lg font-semibold text-[#00FFA3]">₹{record.total.toLocaleString("en-IN")}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onDownload(record)}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/75 transition hover:bg-white/10"
                >
                  Download
                </button>
                <button
                  type="button"
                  onClick={() => onViewReceipt(record)}
                  className="rounded-full bg-[#00F5FF] px-4 py-2 text-sm font-semibold text-[#02111f] shadow-[0_0_20px_rgba(0,245,255,0.18)] transition hover:scale-[1.01]"
                >
                  Receipt
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 pl-3 text-xs uppercase tracking-[0.22em] text-white/45 sm:pl-6">
            <RotateCcw size={12} /> Realtime transaction feed
          </div>
        </motion.div>
      ))}
    </div>
  );
}
