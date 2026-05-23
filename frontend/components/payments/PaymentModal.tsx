"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Clock3, Shield, Sparkles, X } from "lucide-react";
import type { PaymentRecord, PaymentStage } from "./payment-types";
import PaymentStatusBadge from "./PaymentStatusBadge";

interface PaymentModalProps {
  open: boolean;
  record: PaymentRecord | null;
  stage: PaymentStage;
  onClose: () => void;
  onConfirm: () => void;
  disabled?: boolean;
}

const STAGE_LABELS = [
  "Connecting to Secure Gateway...",
  "Verifying Payment Credentials...",
  "Processing Secure Transaction...",
  "Payment Successful",
] as const;

export default function PaymentModal({ open, record, stage, onClose, onConfirm, disabled }: PaymentModalProps) {
  return (
    <AnimatePresence>
      {open && record ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[#02040b]/80 px-4 py-6 backdrop-blur-2xl"
        >
          <motion.div
            initial={{ scale: 0.96, y: 18, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.97, y: 18, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="relative w-full max-w-4xl overflow-hidden rounded-[34px] border border-white/10 bg-[#08111f]/96 shadow-[0_0_80px_rgba(0,245,255,0.12)]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,245,255,0.12),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(82,39,255,0.18),transparent_30%)]" />
            <div className="absolute inset-0 opacity-25 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:48px_48px]" />

            <div className="relative z-10 border-b border-white/10 px-5 py-4 sm:px-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/45">Renova Secure Checkout</p>
                  <h3 className="mt-1 text-2xl font-semibold text-white">Pay Invoice {record.invoiceNumber}</h3>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="relative z-10 grid gap-6 px-5 py-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-7">
              <div className="space-y-5">
                <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <PaymentStatusBadge status={stage > 0 ? "Processing" : record.paymentStatus} />
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/55">
                      Booking #{record.bookingId}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="text-xs uppercase tracking-[0.24em] text-white/45">Service</div>
                      <div className="mt-2 text-lg font-semibold text-white">{record.serviceName}</div>
                      <div className="mt-1 text-sm text-white/60">{record.technicianName}</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="text-xs uppercase tracking-[0.24em] text-white/45">Repair ETA</div>
                      <div className="mt-2 text-lg font-semibold text-white">{record.etaMinutes} min</div>
                      <div className="mt-1 text-sm text-white/60">{new Date(record.bookingDate).toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="mt-5 rounded-[26px] border border-white/10 bg-gradient-to-br from-[#00F5FF]/15 via-[#5227FF]/15 to-[#00FFA3]/12 p-5 shadow-[0_0_36px_rgba(82,39,255,0.12)]">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-white/50">Fintech Payment Card</p>
                        <div className="mt-2 text-3xl font-semibold text-white">₹{record.total.toLocaleString("en-IN")}</div>
                      </div>
                      <div className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs text-white/75">
                        Holographic wallet lane
                      </div>
                    </div>

                    <div className="mt-6 grid gap-3 text-sm text-white/70 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                        <div className="text-white/45">Base amount</div>
                        <div className="mt-1 text-white">₹{record.amount.toLocaleString("en-IN")}</div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
                        <div className="text-white/45">Taxes + fee</div>
                        <div className="mt-1 text-white">₹{(record.tax + record.platformFee).toLocaleString("en-IN")}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Shield size={14} className="text-[#00FFA3]" /> Secure Payment Sequence
                  </div>
                  <div className="mt-4 space-y-3">
                    {STAGE_LABELS.map((label, index) => {
                      const done = stage > index + 1;
                      const active = stage === index + 1;

                      return (
                        <div key={label} className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${done || active ? "border-white/15 bg-white/8" : "border-white/5 bg-black/10"}`}>
                          <div className={`flex h-9 w-9 items-center justify-center rounded-full ${done ? "bg-[#00FFA3]/20 text-[#00FFA3]" : active ? "bg-[#00F5FF]/20 text-[#00F5FF]" : "bg-white/8 text-white/45"}`}>
                            {done ? <CheckCircle2 size={16} /> : active ? <Sparkles size={16} className="animate-pulse" /> : <Clock3 size={16} />}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-white">{label}</div>
                            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                              <div className={`h-full rounded-full bg-linear-to-r from-[#00F5FF] via-[#5227FF] to-[#00FFA3] transition-all duration-500 ${done ? "w-full" : active ? "w-3/4" : "w-0"}`} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-[28px] border border-white/10 bg-black/25 p-5 backdrop-blur-xl">
                  <div className="text-sm uppercase tracking-[0.25em] text-white/45">Payment Breakdown</div>
                  <div className="mt-4 space-y-3 text-sm text-white/70">
                    <div className="flex items-center justify-between"><span>Service total</span><span>₹{record.amount.toLocaleString("en-IN")}</span></div>
                    <div className="flex items-center justify-between"><span>Taxes</span><span>₹{record.tax.toLocaleString("en-IN")}</span></div>
                    <div className="flex items-center justify-between"><span>Processing fee</span><span>₹{record.platformFee.toLocaleString("en-IN")}</span></div>
                    <div className="h-px bg-white/10" />
                    <div className="flex items-center justify-between text-lg font-semibold text-white"><span>Total payable</span><span>₹{record.total.toLocaleString("en-IN")}</span></div>
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
                  <div className="text-sm uppercase tracking-[0.25em] text-white/45">Booking Snapshot</div>
                  <div className="mt-4 space-y-3 text-sm text-white/70">
                    <div className="flex items-center justify-between"><span>Booking date</span><span>{new Date(record.bookingDate).toLocaleDateString()}</span></div>
                    <div className="flex items-center justify-between"><span>Booking time</span><span>{record.bookingTime}</span></div>
                    <div className="flex items-center justify-between"><span>Technician</span><span>{record.technicianName}</span></div>
                    <div className="flex items-center justify-between"><span>Invoice</span><span>{record.invoiceNumber}</span></div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/70 transition hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={onConfirm}
                    disabled={disabled}
                    className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-[#00F5FF] via-[#00FFA3] to-[#B8F3FF] px-6 py-3 text-sm font-semibold text-[#02111f] shadow-[0_0_32px_rgba(0,245,255,0.24)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {disabled ? (
                      <>
                        <Sparkles size={15} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Confirm Payment
                        <Sparkles size={15} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
