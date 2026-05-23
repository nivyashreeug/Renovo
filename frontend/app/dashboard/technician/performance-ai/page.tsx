"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { BrainCircuit, Lightbulb, RefreshCcw, Sparkles, Target, TrendingUp, Zap } from "lucide-react";
import { formatRelativeTime } from "@/components/technician/technician-utils";
import { useTechnicianInsights } from "@/components/technician/useTechnicianInsights";

export default function TechnicianPerformanceAIPage() {
  const {
    loading,
    metrics,
    scopeLabel,
    lastAnalysisAt,
    runningAnalysis,
    rebalancing,
    runAnalysis,
    rebalanceWorkload,
  } = useTechnicianInsights()

  const insights = useMemo(
    () => [
      {
        label: "Efficiency Score",
        value: `${metrics.performanceScore}%`,
        note: `${metrics.completedJobs} completed jobs across ${metrics.totalBookings} tracked bookings.`,
        icon: Target,
        tone: "from-[#00F5FF] to-[#5227FF]",
      },
      {
        label: "Customer Satisfaction",
        value: metrics.reviewCount > 0 ? `${metrics.satisfactionRate}%` : "No reviews",
        note: metrics.reviewCount > 0 ? `${metrics.averageRating.toFixed(1)} / 5 from live Supabase reviews.` : "Waiting for customer review data.",
        icon: TrendingUp,
        tone: "from-[#00FFA3] to-[#00F5FF]",
      },
      {
        label: "Completion Pace",
        value: `${metrics.speedDelta >= 0 ? "+" : ""}${metrics.speedDelta}%`,
        note: `Weekly revenue ${metrics.weeklyRevenue > 0 ? "is" : "remains"} ${metrics.weeklyRevenue > 0 ? "active" : "quiet"} with ${metrics.activeJobs} live jobs.`,
        icon: Zap,
        tone: "from-[#FFB020] to-[#FF4D6D]",
      },
    ],
    [metrics]
  )

  const suggestions = metrics.suggestions

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
              <BrainCircuit className="h-3.5 w-3.5" />
              Technician Performance AI
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-white md:text-5xl">
              Holographic insights for a smarter repair operation.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65 md:text-base">
              This panel turns workflow data into practical guidance so technicians can work faster, stay balanced, and
              deliver better customer outcomes.
            </p>
            <p className="mt-3 text-xs uppercase tracking-[0.24em] text-white/40">
              {loading ? "Loading live AI workspace..." : scopeLabel}
              {lastAnalysisAt ? ` | last analyzed ${formatRelativeTime(lastAnalysisAt)}` : ""}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void runAnalysis()}
              disabled={runningAnalysis}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 transition hover:border-[#00F5FF]/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {runningAnalysis ? <RefreshCcw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {runningAnalysis ? "Running Analysis" : "Run AI Analysis"}
            </button>

            <button
              type="button"
              onClick={() => void rebalanceWorkload()}
              disabled={rebalancing || metrics.activeJobs === 0}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 transition hover:border-[#FF4D6D]/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {rebalancing ? "Rebalancing..." : "Rebalance Workload"}
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          {insights.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-[#050816]/60 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-[0.25em] text-white/45">{item.label}</div>
                    <div className="mt-2 text-3xl font-black text-white">{item.value}</div>
                    <div className="mt-2 text-sm text-white/55">{item.note}</div>
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

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-white/40">AI Suggestions</div>
              <div className="mt-1 text-xl font-semibold text-white">Smart productivity prompts</div>
            </div>
            <Lightbulb className="h-5 w-5 text-[#FFB020]" />
          </div>
          <div className="mt-4 space-y-3">
            {suggestions.map((suggestion, index) => (
              <div key={suggestion} className="rounded-2xl border border-white/10 bg-[#050816]/60 p-4 text-sm text-white/75">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-[#00F5FF]/20 p-2 text-[#00F5FF]">
                    <span className="block h-2 w-2 rounded-full bg-current" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Insight #{index + 1}</div>
                    <div className="mt-1 leading-relaxed text-white/70">{suggestion}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-white/40">Diagnostics Dial</div>
            <div className="mt-1 text-xl font-semibold text-white">Performance confidence</div>
          </div>
          <div className="flex items-center justify-center py-4">
            <div className="relative flex h-56 w-56 items-center justify-center rounded-full border border-white/10 bg-[#050816]/70 shadow-[0_0_50px_rgba(0,245,255,0.12)]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute inset-3 rounded-full border border-dashed border-[#00F5FF]/30"
              />
              <div className="text-center">
                <div className="text-5xl font-black text-white">{metrics.performanceScore}</div>
                <div className="mt-1 text-xs uppercase tracking-[0.3em] text-white/45">AI Score</div>
              </div>
            </div>
          </div>
          <div className="grid gap-3 rounded-2xl border border-white/10 bg-[#050816]/60 p-4 text-sm text-white/70">
            <div className="flex items-center justify-between gap-3">
              <span>Average ETA</span>
              <span className="font-semibold text-white">{metrics.avgEtaMinutes > 0 ? `${metrics.avgEtaMinutes} min` : "-"}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Weekly revenue</span>
              <span className="font-semibold text-white">{metrics.weeklyRevenue > 0 ? `INR ${Math.round(metrics.weeklyRevenue)}` : "INR 0"}</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span>Workload state</span>
              <span className="font-semibold text-white">{metrics.workloadLabel}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
