"use client";

import { motion } from "framer-motion";
import { Download, Eye, FileText, Sparkles } from "lucide-react";
import PaymentStatusBadge from "./PaymentStatusBadge";
import type { PaymentRecord } from "./payment-types";

interface InvoiceCardProps {
  record: PaymentRecord;
  onDownload: (record: PaymentRecord) => void;
  onViewReceipt: (record: PaymentRecord) => void;
}

export default function InvoiceCard({ record, onDownload, onViewReceipt }: InvoiceCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-[1px]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,245,255,0.12),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(82,39,255,0.14),transparent_30%)]" />
      <div className="relative rounded-[27px] border border-white/10 bg-[#09121f]/92 p-5 backdrop-blur-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.26em] text-white/45">
              <FileText size={14} /> Invoice
            </div>
            <div className="mt-2 text-lg font-semibold text-white">{record.invoiceNumber}</div>
            <div className="mt-1 text-sm text-white/60">{record.customerName}</div>
          </div>
          <PaymentStatusBadge status={record.paymentStatus} />
        </div>

        <div className="mt-5 grid gap-3 text-sm text-white/70">
          <MetaRow label="Service" value={record.serviceName} />
          <MetaRow label="Technician" value={record.technicianName} />
          <MetaRow label="Payment date" value={record.paymentDate ? new Date(record.paymentDate).toLocaleString() : new Date(record.bookingDate).toLocaleString()} />
          <MetaRow label="Taxes" value={`₹${record.tax.toLocaleString("en-IN")}`} />
          <MetaRow label="Platform fee" value={`₹${record.platformFee.toLocaleString("en-IN")}`} />
        </div>

        <div className="mt-5 rounded-[24px] border border-white/10 bg-black/20 p-4">
          <div className="flex items-center justify-between text-sm text-white/55">
            <span>Total amount</span>
            <span>Secure receipt</span>
          </div>
          <div className="mt-2 text-3xl font-semibold text-[#00FFA3]">₹{record.total.toLocaleString("en-IN")}</div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onDownload(record)}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10"
          >
            <Download size={14} />
            Download Invoice
          </button>
          <button
            type="button"
            onClick={() => onViewReceipt(record)}
            className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#00F5FF] via-[#00FFA3] to-[#B8F3FF] px-4 py-2 text-sm font-semibold text-[#02111f] shadow-[0_0_24px_rgba(0,245,255,0.2)] transition hover:scale-[1.01]"
          >
            <Eye size={14} />
            View Receipt
          </button>
        </div>

        <div className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-white/45">
          <Sparkles size={12} className="text-[#00F5FF]" /> Holographic invoice layout
        </div>
      </div>
    </motion.div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/5 px-3 py-2">
      <span className="text-white/45">{label}</span>
      <span className="text-right text-white">{value}</span>
    </div>
  );
}
