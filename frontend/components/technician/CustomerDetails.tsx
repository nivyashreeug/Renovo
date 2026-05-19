"use client"
import React from "react"
import { motion } from "framer-motion"
import { Phone, MapPin, BadgeCheck, CreditCard, FileText, MessageSquare, Clock } from "lucide-react"
import { formatMoney, TechnicianJob, statusTone, formatRelativeTime } from "./technician-utils"

export default function CustomerDetails({ job }: { job: TechnicianJob | null }) {
  if (!job)
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[1.75rem] border border-dashed border-white/10 bg-white/5 p-6 text-center text-white/55 backdrop-blur-xl"
      >
        <MessageSquare className="w-8 h-8 mx-auto mb-3 text-white/30" />
        Select a job to view customer details
      </motion.div>
    )

  const tone = statusTone(String(job.status || "Assigned"))

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl shadow-[0_0_40px_rgba(82,39,255,0.08)]"
    >
      {/* Header with Customer Info */}
      <div className="flex items-start justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-4">
          <motion.img
            whileHover={{ scale: 1.05 }}
            src={String(job.customer_image ?? "/favicon.ico")}
            alt={String(job.customer_name ?? "customer")}
            className="h-16 w-16 rounded-2xl object-cover ring-2 ring-white/10 hover:ring-[#00F5FF]/30 transition cursor-pointer"
          />
          <div>
            <h4 className="text-lg font-semibold text-white">{String(job.customer_name || "Customer")}</h4>
            <p className="text-xs text-white/55 mt-1">{String(job.service_name || job.service_type || "Premium repair")}</p>
            <div className="text-xs text-white/45 mt-1">Booking ID: {String(job.id || "—")}</div>
          </div>
        </div>
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`rounded-full border px-3 py-1 text-xs font-semibold whitespace-nowrap ${tone.className}`}
        >
          {tone.label}
        </motion.span>
      </div>

      {/* Details Grid */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {[
          {
            icon: MapPin,
            label: "Address",
            value: String(job.address || "Address pending"),
            color: "text-[#00F5FF]",
          },
          {
            icon: Phone,
            label: "Phone",
            value: String(job.customer_phone || "Call via dashboard"),
            color: "text-[#00FFA3]",
          },
          {
            icon: Clock,
            label: "Booking Time",
            value: String(job.booking_time || job.booking_date || "ASAP"),
            color: "text-[#5227FF]",
          },
          {
            icon: CreditCard,
            label: "Payment",
            value: `${String(job.payment_status || "Pending")} - ${formatMoney(job.price ?? job.amount ?? 0)}`,
            color: "text-[#FFB020]",
          },
        ].map((detail, idx) => {
          const Icon = detail.icon
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-2xl border border-white/10 bg-[#050816]/60 p-3 hover:border-white/20 transition"
            >
              <div className="flex items-start gap-2">
                <Icon className={`mt-0.5 flex-shrink-0 ${detail.color}`} size={16} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-white/45 uppercase tracking-[0.15em]">{detail.label}</div>
                  <div className="text-sm text-white/80 mt-1 line-clamp-2">{detail.value}</div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Issue Description */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-4 rounded-2xl border border-white/10 bg-[#050816]/60 p-4"
      >
        <div className="flex items-center gap-2 text-white/75 text-sm font-semibold mb-2">
          <FileText size={16} className="text-[#5227FF]" />
          Issue Details
        </div>
        <p className="text-sm text-white/75 leading-relaxed">
          {String(job.issue || job.issue_description || "Issue description pending")}
        </p>
        {job.repair_notes && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 pt-3 border-t border-white/10"
          >
            <div className="text-xs text-white/55">Technician Notes</div>
            <p className="text-sm text-white/70 mt-1">{job.repair_notes}</p>
          </motion.div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <div className="mt-4 flex gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-[#00FFA3]/20 bg-[#00FFA3]/10 px-3 py-2 text-sm text-[#00FFA3] hover:border-[#00FFA3]/40 transition"
        >
          <Phone size={14} />
          Call
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-[#00F5FF]/20 bg-[#00F5FF]/10 px-3 py-2 text-sm text-[#00F5FF] hover:border-[#00F5FF]/40 transition"
        >
          <MessageSquare size={14} />
          Message
        </motion.button>
      </div>

      {/* Last Updated */}
      {(job.last_updated_at || job.created_at) && (
        <div className="mt-3 text-xs text-white/40 text-center">
          Updated {formatRelativeTime(String(job.last_updated_at || job.created_at))}
        </div>
      )}
    </motion.div>
  )
}
