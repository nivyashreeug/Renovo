"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, Clock3, MapPin, ShieldAlert, Sparkles, Workflow } from "lucide-react";
import JobQueue from "@/components/technician/JobQueue";
import StatusUpdater from "@/components/technician/StatusUpdater";
import CustomerDetails from "@/components/technician/CustomerDetails";
import { TechnicianJob } from "@/components/technician/technician-utils";

export default function TechnicianQueuePage() {
  const [selected, setSelected] = useState<TechnicianJob | null>(null);

  const queueCards = useMemo(
    () => [
      { label: "Pending Repairs", value: "Realtime", icon: Workflow, tone: "from-[#00F5FF] to-[#5227FF]" },
      { label: "Emergency Bookings", value: "Priority", icon: AlertTriangle, tone: "from-[#FF4D6D] to-[#FFB020]" },
      { label: "Scheduled Services", value: "Queued", icon: Clock3, tone: "from-[#00FFA3] to-[#00F5FF]" },
      { label: "Dispatch Coverage", value: "Live", icon: ShieldAlert, tone: "from-[#5227FF] to-[#00FFA3]" },
    ],
    []
  );

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.03] p-6 backdrop-blur-xl shadow-[0_0_60px_rgba(82,39,255,0.08)]"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00F5FF]/20 bg-[#00F5FF]/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-[#00F5FF]">
              <Sparkles className="h-3.5 w-3.5" />
              Repair Queue
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-white md:text-5xl">
              Priority queue for incoming repair requests.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65 md:text-base">
              New bookings, emergency dispatches, and scheduled services appear here in realtime. Accept or reject
              jobs instantly, then hand off into tracking and status control.
            </p>
          </div>

          <Link
            href="/dashboard/technician/jobs"
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 transition hover:border-[#00F5FF]/30 hover:text-white"
          >
            Open Active Jobs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {queueCards.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-[#050816]/60 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-white/45">{item.label}</div>
                    <div className="mt-2 text-xl font-bold text-white">{item.value}</div>
                  </div>
                  <div className={`rounded-xl bg-gradient-to-br ${item.tone} p-3 text-[#050816]`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <JobQueue onSelect={setSelected} />
        </motion.div>

        <aside className="space-y-6">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-white/40">Queue Focus</div>
                <h2 className="mt-1 text-xl font-semibold text-white">Selected Request</h2>
              </div>
              <MapPin className="h-5 w-5 text-[#00F5FF]" />
            </div>
            <div className="mt-4">
              <StatusUpdater job={selected} onUpdated={setSelected} />
            </div>
            <div className="mt-4">
              <CustomerDetails job={selected} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
