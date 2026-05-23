"use client"

import React, { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Activity, ClipboardList, Gauge, Target, TimerReset } from "lucide-react"
import JobQueue from "@/components/technician/JobQueue"
import CustomerDetails from "@/components/technician/CustomerDetails"
import StatusUpdater from "@/components/technician/StatusUpdater"
import { TechnicianJob } from "@/components/technician/technician-utils"

export default function TechnicianJobsPage() {
  const [selected, setSelected] = useState<TechnicianJob | null>(null)
  const metrics = useMemo(
    () => [
      { label: "Active Jobs", value: "Realtime", icon: ClipboardList, tone: "from-[#00F5FF] to-[#5227FF]" },
      { label: "Progress", value: selected?.status ?? "Ready", icon: Activity, tone: "from-[#5227FF] to-[#00FFA3]" },
      { label: "Timer", value: String(selected?.eta_minutes ?? 15), icon: TimerReset, tone: "from-[#00FFA3] to-[#00F5FF]" },
      { label: "Priority", value: selected?.priority ?? "Normal", icon: Target, tone: "from-[#FFB020] to-[#FF4D6D]" },
      { label: "Focus", value: "Control", icon: Gauge, tone: "from-[#00F5FF] to-[#FFB020]" },
    ],
    [selected]
  )

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.03] p-6 backdrop-blur-xl shadow-[0_0_60px_rgba(82,39,255,0.08)]"
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-[0.3em] text-white/40">Active Jobs</div>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-white md:text-5xl">
              Professional repair operations center.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65 md:text-base">
              Accept, reject, track, and complete jobs from a single high-speed control panel. Every button updates the
              live booking state so the customer dashboard can mirror the change instantly.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {metrics.map((metric) => {
            const Icon = metric.icon
            return (
              <div key={metric.label} className="rounded-2xl border border-white/10 bg-[#050816]/60 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-white/45">{metric.label}</div>
                    <div className="mt-2 text-lg font-semibold text-white">{metric.value}</div>
                  </div>
                  <div className={`rounded-xl bg-gradient-to-br ${metric.tone} p-3 text-[#050816]`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <div className="space-y-6">
          <JobQueue mode="active" onSelect={setSelected} />
        </div>
        <aside className="space-y-6">
          <StatusUpdater job={selected} onUpdated={setSelected} />
          <CustomerDetails job={selected} />
        </aside>
      </div>
    </div>
  )
}
