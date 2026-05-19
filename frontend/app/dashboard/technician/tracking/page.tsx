"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Navigation2, Clock, Phone, MessageSquare, AlertCircle, CheckCircle2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { TechnicianJob, statusTone, formatRelativeTime } from "@/components/technician/technician-utils"

export default function TechnicianTrackingPage() {
  const [jobs, setJobs] = useState<TechnicianJob[]>([])
  const [selected, setSelected] = useState<TechnicianJob | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      const result = await supabase
        .from("bookings")
        .select("*")
        .in("status", ["Assigned", "On The Way", "Repairing"])
        .order("created_at", { ascending: false })
        .limit(10)
      
      const rows = (result.data ?? []) as TechnicianJob[]
      if (!mounted) return
      setJobs(rows)
      if (rows.length > 0) setSelected(rows[0])
      setLoading(false)
    }
    load()

    const channel = supabase
      .channel("public:bookings:technician-tracking")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, (payload) => {
        const updated = payload.new as TechnicianJob
        setJobs((prev) => {
          const idx = prev.findIndex((j) => j.id === updated.id)
          const isVisible = ["Assigned", "On The Way", "Repairing"].includes(String(updated.status))
          if (idx === -1 && isVisible) return [updated, ...prev]
          if (idx > -1) {
            const copy = [...prev]
            copy[idx] = updated
            return copy
          }
          return prev
        })
      })
      .subscribe()

    return () => {
      mounted = false
      void supabase.removeChannel(channel)
    }
  }, [])

  const tone = statusTone(String(selected?.status || "Assigned"))

  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_0.85fr]">
      {/* Main Tracking Map */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-6 backdrop-blur-xl shadow-[0_0_60px_rgba(0,245,255,0.08)]"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-white">Live Tracking</h2>
            <p className="text-sm text-white/55 mt-1">Realtime repair location & status</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-[#00F5FF]">{jobs.length}</div>
            <div className="text-xs uppercase tracking-[0.2em] text-white/40">Active Repairs</div>
          </div>
        </div>

        {loading ? (
          <div className="h-[500px] rounded-[1.5rem] border border-white/10 bg-[#050816]/40 flex items-center justify-center">
            <div className="text-white/55 text-center">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                <Navigation2 className="w-8 h-8 mx-auto mb-3 text-[#00F5FF]" />
              </motion.div>
              Loading live tracking...
            </div>
          </div>
        ) : selected ? (
          <>
            {/* Animated Map Preview */}
            <div className="relative h-[420px] rounded-[1.5rem] border border-white/10 bg-[radial-gradient(circle_at_center,_rgba(0,245,255,0.1),_rgba(5,8,22,0.5))] overflow-hidden mb-6">
              {/* Grid Background */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 
                    'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />

              {/* Animated Particles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: Math.random() * 300, y: Math.random() * 300, opacity: 0 }}
                  animate={{
                    x: [Math.random() * 300, Math.random() * 300],
                    y: [Math.random() * 300, Math.random() * 300],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{ duration: 8 + i * 2, repeat: Infinity }}
                  className="absolute w-2 h-2 bg-[#00F5FF] rounded-full blur-sm"
                />
              ))}

              {/* Center Technician Pulse */}
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-1/3 left-1/3 w-4 h-4 bg-[#00F5FF] rounded-full shadow-[0_0_30px_rgba(0,245,255,0.6)]"
              />

              {/* Customer Location */}
              <motion.div
                animate={{ scale: [0.8, 1, 0.8] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                className="absolute bottom-1/4 right-1/4 w-6 h-6 border-2 border-[#5227FF] rounded-full shadow-[0_0_20px_rgba(82,39,255,0.4)]"
              />

              {/* Connection Line Animation */}
              <motion.svg
                className="absolute inset-0"
                width="100%"
                height="100%"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="trackingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00F5FF" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#5227FF" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                <motion.line
                  x1="33%"
                  y1="33%"
                  x2="75%"
                  y2="75%"
                  stroke="url(#trackingGradient)"
                  strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </motion.svg>

              {/* Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#050816] via-[#050816]/80 to-transparent p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white flex items-center gap-2">
                      <MapPin size={16} className="text-[#00F5FF]" />
                      {String(selected.address || "Unknown Location")}
                    </div>
                    <div className="text-xs text-white/55 mt-1">
                      ETA: {String(selected.eta_minutes || 15)} minutes away
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    <Navigation2 className="w-5 h-5 text-[#00F5FF]" />
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="space-y-3">
              <div className="text-sm font-semibold text-white uppercase tracking-[0.2em]">Repair Timeline</div>
              <div className="space-y-2">
                {[
                  { label: "Assigned", icon: CheckCircle2, completed: ["Assigned", "On The Way", "Repairing", "Completed"].includes(String(selected.status)) },
                  { label: "On The Way", icon: Navigation2, completed: ["On The Way", "Repairing", "Completed"].includes(String(selected.status)) },
                  { label: "Repairing", icon: AlertCircle, completed: ["Repairing", "Completed"].includes(String(selected.status)) },
                  { label: "Completed", icon: CheckCircle2, completed: String(selected.status) === "Completed" },
                ].map((stage, idx) => {
                  const Icon = stage.icon
                  return (
                    <motion.div
                      key={stage.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 border transition ${
                        stage.completed
                          ? "border-[#00FFA3]/30 bg-[#00FFA3]/10"
                          : "border-white/10 bg-white/5"
                      }`}
                    >
                      <Icon
                        size={18}
                        className={stage.completed ? "text-[#00FFA3]" : "text-white/40"}
                      />
                      <span
                        className={stage.completed ? "text-white font-semibold" : "text-white/60"}
                      >
                        {stage.label}
                      </span>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </>
        ) : (
          <div className="h-[420px] rounded-[1.5rem] border border-dashed border-white/10 flex items-center justify-center text-white/55 text-center">
            <div>
              <MapPin className="w-8 h-8 mx-auto mb-3 text-white/30" />
              No active repairs to track
            </div>
          </div>
        )}
      </motion.div>

      {/* Sidebar - Active Jobs List */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-4"
      >
        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <div className="text-sm font-semibold text-white uppercase tracking-[0.2em]">Active Queue</div>
          <div className="text-xs text-white/45 mt-1">{jobs.length} repairs in progress</div>
        </div>

        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {jobs.map((job, idx) => {
            const jobTone = statusTone(String(job.status))
            return (
              <motion.button
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => setSelected(job)}
                className={`w-full text-left rounded-[1.5rem] border p-4 backdrop-blur-xl transition-all ${
                  selected?.id === job.id
                    ? `border-[#00F5FF]/40 bg-gradient-to-r from-[#00F5FF]/15 to-[#5227FF]/10 shadow-[0_0_30px_rgba(0,245,255,0.15)]`
                    : `border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8`
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white line-clamp-1">
                      {String(job.customer_name || "Customer")}
                    </div>
                    <div className="text-xs text-white/55 mt-1">{String(job.service_type || "Repair")}</div>
                  </div>
                  <div className={`rounded-full text-[10px] font-semibold px-2 py-1 border whitespace-nowrap ${jobTone.className}`}>
                    {jobTone.label}
                  </div>
                </div>
                <div className="text-xs text-white/45 mt-2 flex items-center gap-1">
                  <MapPin size={12} />
                  {String(job.address || "Unknown").slice(0, 40)}...
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Customer Contact Card */}
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4 backdrop-blur-xl"
          >
            <div className="text-sm font-semibold text-white uppercase tracking-[0.2em]">Customer</div>
            <div className="mt-3 space-y-2">
              <div className="text-sm font-semibold text-white">{String(selected.customer_name || "N/A")}</div>
              {selected.customer_phone && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center gap-2 rounded-xl border border-[#00FFA3]/20 bg-[#00FFA3]/10 px-3 py-2 text-sm text-[#00FFA3] hover:border-[#00FFA3]/40 transition"
                >
                  <Phone size={14} />
                  Call Customer
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-2 rounded-xl border border-[#00F5FF]/20 bg-[#00F5FF]/10 px-3 py-2 text-sm text-[#00F5FF] hover:border-[#00F5FF]/40 transition"
              >
                <MessageSquare size={14} />
                Send Message
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
