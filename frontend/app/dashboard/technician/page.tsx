"use client"
import React, { useState, useMemo } from "react"
import { motion, type Variants } from "framer-motion"
import { useAuth } from "@/providers/AuthProvider"
import JobQueue from "@/components/technician/JobQueue"
import EarningsAnalytics from "@/components/technician/EarningsAnalytics"
import NotificationCenter from "@/components/technician/NotificationCenter"
import CustomerDetails from "@/components/technician/CustomerDetails"
import StatusUpdater from "@/components/technician/StatusUpdater"
import ReviewsPanel from "@/components/technician/ReviewsPanel"
import AvailabilityToggle from "@/components/technician/AvailabilityToggle"
import { TechnicianJob } from "@/components/technician/technician-utils"
import { Target, Clock, Star, Zap } from "lucide-react"

export default function TechnicianPage() {
  const [selected, setSelected] = useState<TechnicianJob | null>(null)
  const { profile, user } = useAuth()
  const [metrics, setMetrics] = useState({ active: 0, queue: 0 })

  const displayName = useMemo(() => {
    if (profile?.full_name) return profile.full_name
    if (user?.email) return user.email.split("@")[0]
    return "Technician"
  }, [profile, user])

  const stats = useMemo(
    () => [
      { label: "Active", value: metrics.active, icon: Zap, color: "from-[#00F5FF] to-[#5227FF]" },
      { label: "Queue", value: metrics.queue, icon: Target, color: "from-[#5227FF] to-[#00FFA3]" },
      { label: "Online", value: "1", icon: Clock, color: "from-[#00FFA3] to-[#00F5FF]" },
      { label: "Rating", value: "4.9", icon: Star, color: "from-[#FFB020] to-[#FF4D6D]" },
    ],
    [metrics]
  )

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20, rotateX: -10 },
    visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.6, ease: "easeOut" } },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 gap-6 xl:grid-cols-[1.45fr_0.95fr]"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="xl:col-span-2">
        <div className="rounded-[1.75rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.02] p-6 backdrop-blur-xl shadow-[0_0_60px_rgba(82,39,255,0.08)]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xs uppercase tracking-[0.3em] text-white/40 mb-2"
              >
                Technician Command Center
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-[#00F5FF] to-[#5227FF] bg-clip-text text-transparent"
              >
                Welcome back, {displayName}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-3 max-w-2xl text-sm text-white/65 leading-relaxed"
              >
                Realtime repair workflow, live booking queue, analytics, customer details, and status control in one
                futuristic workspace. Your assignments are synced in real-time.
              </motion.p>
            </motion.div>

            {/* Metrics Grid */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 gap-3"
            >
              {stats.map((stat, idx) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + idx * 0.05 }}
                    className="rounded-2xl border border-white/10 bg-[#050816]/60 p-4 text-center group hover:border-white/20 transition"
                  >
                    <div className="flex items-center justify-center mb-2">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} text-white`}>
                        <Icon size={16} />
                      </div>
                    </div>
                    <motion.div
                      key={stat.value}
                      initial={{ scale: 1.2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-xl font-bold text-white"
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-white/45 mt-1">{stat.label}</div>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div variants={itemVariants} className="space-y-6">
        {/* Analytics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div variants={itemVariants} className="h-full">
            <EarningsAnalytics />
          </motion.div>
          <motion.div variants={itemVariants} className="h-full">
            <NotificationCenter />
          </motion.div>
        </div>

        {/* Job Queue */}
        <motion.div variants={itemVariants}>
          <JobQueue mode="pending" onSelect={(job) => setSelected(job)} onCountsChange={setMetrics} />
        </motion.div>
      </motion.div>

      {/* Sidebar */}
      <motion.aside variants={itemVariants} className="space-y-4">
        {/* Availability Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl"
        >
          <div className="mb-4">
            <div className="text-xs uppercase tracking-[0.3em] text-white/40">Status Control</div>
            <div className="mt-1 text-lg font-semibold text-white">Realtime repair workflow</div>
          </div>
          <AvailabilityToggle />
        </motion.div>

        {/* Status Updater */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
          <StatusUpdater job={selected} onUpdated={setSelected} />
        </motion.div>

        {/* Customer Details */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
          <CustomerDetails job={selected} />
        </motion.div>

        {/* Reviews Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
          <ReviewsPanel />
        </motion.div>
      </motion.aside>
    </motion.div>
  )
}
