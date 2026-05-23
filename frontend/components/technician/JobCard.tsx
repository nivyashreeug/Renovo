"use client"
import React from "react"
import { motion } from "framer-motion"
import { CheckCircle2, XCircle, Clock, MapPin, MessageSquare, PhoneCall, BadgeAlert } from "lucide-react"
import { priorityTone, statusTone, formatMoney, formatRelativeTime, TechnicianJob } from "./technician-utils"

type Props = {
  job: TechnicianJob
  onAccept?: (job: TechnicianJob) => void
  onReject?: (job: TechnicianJob) => void
  onSelect?: (job: TechnicianJob) => void
  busy?: boolean
  mode?: "pending" | "active"
}

function JobCard({ job, onAccept, onReject, onSelect, busy = false, mode = "pending" }: Props) {
  const tone = statusTone(String(job.status || "Assigned"))
  const urgency = String(job.priority || "Normal")
  const showDecisionActions = mode === "pending"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateX: -8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      whileHover={{ y: -6, scale: 1.01, rotateX: -2, rotateY: 2 }}
      exit={{ opacity: 0, y: 8 }}
      className={`group relative overflow-hidden rounded-[1.75rem] border p-5 backdrop-blur-xl transition-all duration-300 ${tone.className} ${tone.glow}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${priorityTone(String(job.priority || "normal"))} opacity-[0.05]`} />

      <div className="flex items-start gap-4">
        <div
          aria-hidden="true"
          className="h-16 w-16 rounded-2xl bg-cover bg-center ring-1 ring-[#5227FF]/30"
          style={{ backgroundImage: `url('${String(job.customer_image || "/favicon.ico")}')` }}
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-white">{String(job.customer_name || "Customer")}</div>
              <div className="mt-1 text-xs text-white/55">Booking ID: {String(job.id || "—")}</div>
            </div>
            <div className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${tone.className}`}>{tone.label}</div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-white/65">
            <div className="flex items-center gap-1"><Clock size={14} /> {String(job.booking_time || formatRelativeTime(String(job.booking_date || "")))}</div>
            <div className="flex items-center gap-1"><MapPin size={14} /> {String(job.address || "Remote address")}</div>
            <div className="ml-auto rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-white/55">ETA {String(job.eta_minutes || 20)} min</div>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2 text-xs text-white/65">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="text-white/35">Issue</div>
              <div className="mt-1 line-clamp-2 text-white">{String(job.issue || job.issue_description || "Repair diagnostics will appear here after the request is triaged.")}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="text-white/35">Payment</div>
              <div className="mt-1 text-white">{String(job.payment_status || "Pending")}</div>
              <div className="mt-1 text-[#00F5FF]">{formatMoney(job.price ?? job.amount ?? 0)}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="text-white/35">Service</div>
              <div className="mt-1 text-white">{String(job.service_name || job.service_type || "Repair request")}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="text-white/35">Urgency</div>
              <div className="mt-1 text-white">{urgency}</div>
              <div className="mt-1 text-white/55">{String(job.technician_name || "Unassigned queue")}</div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {showDecisionActions ? (
              <>
                <motion.button
                  disabled={busy}
                  whileHover={busy ? undefined : { scale: 1.03, y: -1 }}
                  whileTap={busy ? undefined : { scale: 0.98 }}
                  onClick={() => onAccept?.(job)}
                  className="relative flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#5227FF] via-[#00F5FF] to-[#7DF9FF] px-4 py-2.5 font-medium text-[#050816] shadow-[0_0_24px_rgba(0,245,255,0.24)] transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="absolute inset-0 bg-white/15 opacity-0 transition group-hover:opacity-100" />
                  {busy ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#050816]/30 border-t-[#050816]" /> : <CheckCircle2 size={16} />}
                  {busy ? "Processing..." : "Accept Repair"}
                </motion.button>
                <motion.button
                  disabled={busy}
                  whileHover={busy ? undefined : { scale: 1.03, y: -1 }}
                  whileTap={busy ? undefined : { scale: 0.98 }}
                  onClick={() => onReject?.(job)}
                  className="flex items-center gap-2 rounded-xl border border-[#FF4D6D]/25 bg-[#FF4D6D]/12 px-4 py-2.5 text-white/85 shadow-[0_0_24px_rgba(255,77,109,0.12)] transition hover:bg-[#FF4D6D]/18 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {busy ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white" /> : <XCircle size={16} />}
                  {busy ? "Processing..." : "Reject Repair"}
                </motion.button>
              </>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-xl border border-[#00F5FF]/20 bg-[#00F5FF]/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#00F5FF]">
                <CheckCircle2 size={14} />
                Active Job
              </div>
            )}
            <button onClick={() => onSelect?.(job)} className="ml-auto inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white/65 transition hover:border-[#00F5FF]/30 hover:text-white">
              <BadgeAlert size={14} /> Details
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white/65 transition hover:border-[#00FFA3]/30 hover:text-white">
              <PhoneCall size={14} /> Call
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white/65 transition hover:border-[#00FFA3]/30 hover:text-white">
              <MessageSquare size={14} /> Message
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default React.memo(JobCard)
