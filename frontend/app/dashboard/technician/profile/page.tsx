"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, Camera, Clock3, Mail, MapPin, Phone, Sparkles, Star, UserRound, Wrench } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useTechnicianInsights } from "@/components/technician/useTechnicianInsights";

export default function TechnicianProfilePage() {
  const { user, profile } = useAuth();
  const { metrics, scopeLabel, loading } = useTechnicianInsights();

  const displayName = useMemo(() => {
    return profile?.full_name || user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Technician";
  }, [profile, user]);

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-linear-to-br from-white/10 to-white/3 p-6 backdrop-blur-xl shadow-[0_0_60px_rgba(82,39,255,0.08)]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,245,255,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(82,39,255,0.14),transparent_32%)]" />
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 overflow-hidden rounded-3xl border border-[#00F5FF]/25 bg-[#050816]/80 text-[#00F5FF] shadow-[0_0_30px_rgba(0,245,255,0.12)] flex items-center justify-center">
              <UserRound size={32} />
              <div className="absolute right-2 top-2 h-3 w-3 rounded-full bg-[#00FFA3] shadow-[0_0_12px_#00FFA3]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#00F5FF]/20 bg-[#00F5FF]/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-[#00F5FF]">
                <Sparkles size={12} /> Technician Profile
              </div>
              <h1 className="mt-3 text-3xl font-black text-white md:text-5xl">{displayName}</h1>
              <p className="mt-2 text-sm text-white/60">{scopeLabel} • Realtime repair operations workspace</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Rating", value: metrics.averageRating > 0 ? metrics.averageRating.toFixed(1) : "4.9", icon: Star, tone: "text-[#00FFA3]" },
              { label: "Jobs", value: String(metrics.totalBookings), icon: Wrench, tone: "text-[#00F5FF]" },
              { label: "Availability", value: String(profile?.is_available ? "Online" : "Offline"), icon: BadgeCheck, tone: profile?.is_available ? "text-[#00FFA3]" : "text-[#FF4D6D]" },
              { label: "Response", value: metrics.responseTimeMinutes > 0 ? `${metrics.responseTimeMinutes}m` : "Live", icon: Clock3, tone: "text-[#FFB020]" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-[#050816]/60 p-4 text-center">
                  <div className={`mx-auto flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 ${item.tone}`}>
                    <Icon size={16} />
                  </div>
                  <div className="mt-3 text-2xl font-bold text-white">{item.value}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-white/45">{item.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-white/40">Profile intelligence</div>
              <h2 className="mt-1 text-xl font-semibold text-white">Identity & performance lane</h2>
            </div>
            <Camera className="h-5 w-5 text-[#00F5FF]" />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              { label: "Email", value: user?.email || "Not available", icon: Mail },
              { label: "Phone", value: String(profile?.phone || profile?.mobile || "Not synced"), icon: Phone },
              { label: "Region", value: String(profile?.region || profile?.city || "Assigned area"), icon: MapPin },
              { label: "Top Service", value: String(metrics.suggestions[0] || "Keep service notes detailed"), icon: Sparkles },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-[#050816]/60 p-4">
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/45">
                    <Icon size={13} className="text-[#00F5FF]" /> {item.label}
                  </div>
                  <div className="mt-2 text-sm text-white/80">{item.value}</div>
                </div>
              );
            })}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
        >
          <div className="text-xs uppercase tracking-[0.3em] text-white/40">Workspace status</div>
          <h2 className="mt-1 text-xl font-semibold text-white">Technician profile summary</h2>
          <div className="mt-4 space-y-3">
            {[
              { label: "Completed Jobs", value: metrics.completedJobs },
              { label: "Completion Rate", value: `${metrics.completionRate}%` },
              { label: "Customer Satisfaction", value: `${metrics.satisfactionRate}%` },
              { label: "Performance Score", value: `${metrics.performanceScore}%` },
            ].map((row) => (
              <div key={row.label} className="rounded-2xl border border-white/10 bg-[#050816]/60 p-4 flex items-center justify-between gap-3">
                <span className="text-sm text-white/55">{row.label}</span>
                <span className="text-base font-semibold text-white">{loading ? "…" : row.value}</span>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
