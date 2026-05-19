"use client"

import React, { useEffect, useState, useMemo } from "react"
import { motion, type Variants } from "framer-motion"
import { BarChart, Bar, AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, DollarSign, CheckCircle2, Star } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { formatMoney } from "@/components/technician/technician-utils"

type ChartData = { date: string; value: number; week?: string }
type CompletionData = { status: string; count: number }

export default function TechnicianEarningsPage() {
  const [dailyData, setDailyData] = useState<ChartData[]>([])
  const [weeklyData, setWeeklyData] = useState<ChartData[]>([])
  const [completionData, setCompletionData] = useState<CompletionData[]>([])
  const [summary, setSummary] = useState({
    today: 0,
    week: 0,
    month: 0,
    completed: 0,
    rating: 4.9,
    totalEarnings: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadEarnings() {
      try {
        // Fetch all bookings with pricing and completion data
        const res = await supabase
          .from("bookings")
          .select("id,amount,price,created_at,status,booking_date")
          .order("created_at", { ascending: true })
          .limit(500)

        const rows = (res.data ?? []) as Record<string, unknown>[]
        if (!mounted) return

        // Process daily data
        const dailyGrouped: Record<string, number> = {}
        const weeklyGrouped: Record<string, number> = {}
        const completionMap: Record<string, number> = {}
        let today = 0
        let thisWeek = 0
        let thisMonth = 0
        let completed = 0
        let totalEarnings = 0

        const now = new Date()
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
        const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).getTime()
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime()

        rows.forEach((r) => {
          const created = new Date(String(r.booking_date || r.created_at || "")).getTime()
          const day = new Date(created).toISOString().slice(0, 10)
          const weekKey = `W${Math.floor((now.getTime() - created) / (7 * 24 * 60 * 60 * 1000))}`
          const amount = Number((r.amount as unknown) || (r.price as unknown) || 0)
          const status = String(r.status || "")

          dailyGrouped[day] = (dailyGrouped[day] || 0) + amount
          weeklyGrouped[weekKey] = (weeklyGrouped[weekKey] || 0) + amount
          completionMap[status] = (completionMap[status] || 0) + 1
          totalEarnings += amount

          if (created >= todayStart) today += amount
          if (created >= weekStart) thisWeek += amount
          if (created >= monthStart) thisMonth += amount
          if (status === "Completed") completed++
        })

        // Prepare chart data
        const dailyChart = Object.keys(dailyGrouped)
          .slice(-30)
          .map((k) => ({ date: k, value: dailyGrouped[k] }))

        const weeklyChart = Object.keys(weeklyGrouped)
          .slice(-12)
          .map((k) => ({ week: k, date: k, value: weeklyGrouped[k] }))

        const completionChart = Object.entries(completionMap)
          .map(([status, count]) => ({ status, count }))
          .slice(0, 5)

        setDailyData(dailyChart)
        setWeeklyData(weeklyChart)
        setCompletionData(completionChart)
        setSummary({
          today,
          week: thisWeek,
          month: thisMonth,
          completed,
          rating: 4.9,
          totalEarnings,
        })
        setLoading(false)
      } catch (err) {
        console.error("Failed to load earnings:", err)
        setLoading(false)
      }
    }

    loadEarnings()
    return () => {
      mounted = false
    }
  }, [])

  const weekAverage = useMemo(() => {
    if (weeklyData.length === 0) return 0
    const sum = weeklyData.reduce((acc, d) => acc + d.value, 0)
    return sum / weeklyData.length
  }, [weeklyData])

  const chartVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }),
  }

  const COLORS = ["#00F5FF", "#5227FF", "#00FFA3", "#FFB020", "#FF4D6D"]

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[
          {
            label: "Today",
            value: formatMoney(summary.today),
            icon: DollarSign,
            color: "from-[#00F5FF] to-[#00FFA3]",
            textColor: "text-[#00F5FF]",
          },
          {
            label: "This Week",
            value: formatMoney(summary.week),
            icon: TrendingUp,
            color: "from-[#5227FF] to-[#00F5FF]",
            textColor: "text-[#5227FF]",
          },
          {
            label: "This Month",
            value: formatMoney(summary.month),
            icon: DollarSign,
            color: "from-[#00FFA3] to-[#5227FF]",
            textColor: "text-[#00FFA3]",
          },
          {
            label: "Completed",
            value: summary.completed,
            icon: CheckCircle2,
            color: "from-[#00FFA3] to-[#00F5FF]",
            textColor: "text-[#00FFA3]",
          },
          {
            label: "Rating",
            value: summary.rating.toFixed(1),
            icon: Star,
            color: "from-[#FFB020] to-[#FF4D6D]",
            textColor: "text-[#FFB020]",
          },
        ].map((stat, idx) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              custom={idx}
              variants={chartVariants}
              initial="hidden"
              animate="visible"
              className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4 backdrop-blur-xl hover:border-white/20 transition"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-white/40">{stat.label}</div>
                  <div className={`mt-2 text-2xl font-bold ${stat.textColor}`}>{stat.value}</div>
                </div>
                <div className={`rounded-xl bg-gradient-to-br ${stat.color} p-3 text-white`}>
                  <Icon size={24} />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Main Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Daily Revenue Trend */}
        <motion.div
          custom={0}
          variants={chartVariants}
          initial="hidden"
          animate="visible"
          className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white">Daily Revenue</h3>
            <p className="text-sm text-white/55 mt-1">Last 30 days earnings trend</p>
          </div>
          {loading ? (
            <div className="h-64 flex items-center justify-center text-white/55">Loading...</div>
          ) : (
            <ResponsiveContainer width="100%" height={260} minWidth={0} minHeight={260}>
              <AreaChart data={dailyData}>
                <defs>
                  <linearGradient id="colorDaily" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F5FF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00F5FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.3)" />
                <YAxis stroke="rgba(255,255,255,0.3)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#050816",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#00F5FF"
                  fillOpacity={1}
                  fill="url(#colorDaily)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Weekly Comparison */}
        <motion.div
          custom={1}
          variants={chartVariants}
          initial="hidden"
          animate="visible"
          className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white">Weekly Breakdown</h3>
            <p className="text-sm text-white/55 mt-1">Average: {formatMoney(weekAverage)}</p>
          </div>
          {loading ? (
            <div className="h-64 flex items-center justify-center text-white/55">Loading...</div>
          ) : (
            <ResponsiveContainer width="100%" height={260} minWidth={0} minHeight={260}>
              <BarChart data={weeklyData}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="week" stroke="rgba(255,255,255,0.3)" />
                <YAxis stroke="rgba(255,255,255,0.3)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#050816",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Bar dataKey="value" fill="#5227FF" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Job Completion Status */}
        <motion.div
          custom={2}
          variants={chartVariants}
          initial="hidden"
          animate="visible"
          className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white">Job Status Distribution</h3>
            <p className="text-sm text-white/55 mt-1">All bookings by status</p>
          </div>
          {loading ? (
            <div className="h-64 flex items-center justify-center text-white/55">Loading...</div>
          ) : completionData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260} minWidth={0} minHeight={260}>
              <PieChart>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#050816",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Pie
                  data={completionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {completionData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-white/55">No data available</div>
          )}
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          custom={3}
          variants={chartVariants}
          initial="hidden"
          animate="visible"
          className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
        >
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white">Performance Metrics</h3>
            <p className="text-sm text-white/55 mt-1">Key indicators & incentives</p>
          </div>
          <div className="space-y-4">
            {[
              {
                label: "Average Per Job",
                value: summary.completed > 0 ? formatMoney(summary.totalEarnings / summary.completed) : "—",
                progress: 75,
              },
              {
                label: "Completion Rate",
                value: `${summary.completed} repairs`,
                progress: (summary.completed / Math.max(1, summary.completed + 5)) * 100,
              },
              {
                label: "Customer Rating",
                value: `${summary.rating} / 5.0`,
                progress: (summary.rating / 5) * 100,
              },
              {
                label: "On-Time Arrivals",
                value: "94%",
                progress: 94,
              },
            ].map((metric, idx) => (
              <div key={metric.label}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/80">{metric.label}</span>
                  <span className="text-sm font-semibold text-[#00F5FF]">{metric.value}</span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.progress}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: idx * 0.1 }}
                    className="h-full rounded-full bg-gradient-to-r from-[#00F5FF] to-[#5227FF]"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Total Earnings Card */}
      <motion.div
        custom={4}
        variants={chartVariants}
        initial="hidden"
        animate="visible"
        className="rounded-[1.75rem] border border-white/10 bg-gradient-to-r from-[#5227FF]/20 to-[#00F5FF]/20 p-8 backdrop-blur-xl text-center"
      >
        <div className="text-xs uppercase tracking-[0.3em] text-white/55">Total Lifetime Earnings</div>
        <div className="mt-3 text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00F5FF] via-[#5227FF] to-[#00FFA3]">
          {formatMoney(summary.totalEarnings)}
        </div>
      </motion.div>
    </div>
  )
}
