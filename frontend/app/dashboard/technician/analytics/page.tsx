"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2, IndianRupee, RefreshCcw, Sparkles, Star, TimerReset } from "lucide-react";
import EarningsAnalytics from "@/components/technician/EarningsAnalytics";
import { formatMoney } from "@/components/technician/technician-utils";
import { useTechnicianInsights } from "@/components/technician/useTechnicianInsights";

export default function TechnicianAnalyticsPage() {
  const { loading, refreshing, metrics, scopeLabel, refresh } = useTechnicianInsights()

  const insights = useMemo(
    () => [
      {
        label: "Response Time",
        value: metrics.responseTimeMinutes > 0 ? `${metrics.responseTimeMinutes}m` : "Live",
        hint: "Average booking update lag",
        icon: TimerReset,
        tone: "from-[#00F5FF] to-[#5227FF]",
      },
      {
        label: "Completion Rate",
        value: `${metrics.completionRate}%`,
        hint: `${metrics.completedJobs} completed jobs`,
        icon: CheckCircle2,
        tone: "from-[#00FFA3] to-[#00F5FF]",
      },
      {
        label: "Customer Rating",
        value: metrics.reviewCount > 0 ? `${metrics.averageRating.toFixed(1)}/5` : "No reviews",
        hint: `${metrics.reviewCount} live review${metrics.reviewCount === 1 ? "" : "s"}`,
        icon: Star,
        tone: "from-[#5227FF] to-[#00FFA3]",
      },
      {
        label: "Monthly Revenue",
        value: formatMoney(metrics.monthlyRevenue),
        hint: `${metrics.activeJobs} active jobs | ${metrics.workloadLabel}`,
        icon: IndianRupee,
        tone: "from-[#FFB020] to-[#FF4D6D]",
      },
    ],
    [metrics]
  )

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
              Operations Analytics
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-white md:text-5xl">
              The technician workspace now tracks performance, throughput, and revenue together.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65 md:text-base">
              Use this view to understand workload distribution, revenue flow, and service quality without leaving the
              dashboard. It is designed for realtime decision-making, not static reporting.
            </p>
            <p className="mt-3 text-xs uppercase tracking-[0.24em] text-white/40">
              {loading ? "Loading live technician metrics..." : scopeLabel}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void refresh(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 transition hover:border-[#00F5FF]/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCcw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing" : "Refresh Live Data"}
            </button>

            <Link
              href="/dashboard/technician/performance-ai"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 transition hover:border-[#00F5FF]/30 hover:text-white"
            >
              Open Performance AI
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {insights.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-[#050816]/60 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-white/45">{item.label}</div>
                    <div className="mt-2 text-2xl font-bold text-white">{item.value}</div>
                    <div className="mt-1 text-xs text-white/45">{item.hint}</div>
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

      <EarningsAnalytics />
    </div>
  )
}
