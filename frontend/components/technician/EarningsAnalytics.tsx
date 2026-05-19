"use client"
import React, { useEffect, useMemo, useState } from "react"
import { XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid, AreaChart, Area } from "recharts"
import { supabase } from "@/lib/supabase"
import { formatMoney } from "./technician-utils"

type ChartPoint = { date: string; value: number }

export default function EarningsAnalytics() {
  const [data, setData] = useState<ChartPoint[]>([])
  const [summary, setSummary] = useState({ today: 0, week: 0, month: 0, completed: 0, rating: 4.9 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    let mounted = true
    async function load() {
      const res = await supabase.from("bookings").select("id,amount,price,created_at,status,booking_date").order("created_at", { ascending: true }).limit(500)
      const rows = (res.data ?? []) as Record<string, unknown>[]
      if (!mounted) return
      const grouped: Record<string, number> = {}
      let today = 0
      let completed = 0
      rows.forEach((r) => {
        const created = String(r.booking_date || r.created_at || "")
        const day = created ? new Date(created).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
        const amount = Number((r.amount as unknown) || (r.price as unknown) || 0)
        grouped[day] = (grouped[day] || 0) + amount
        const diff = (Date.now() - new Date(created).getTime()) / (1000 * 60 * 60 * 24)
        if (diff < 1) today += amount
        if (String(r.status) === 'Completed') completed++
      })
      const chart = Object.keys(grouped).slice(-14).map(k => ({ date: k, value: grouped[k] }))
      setData(chart)
      setSummary({ today, week: chart.slice(-7).reduce((s,a)=>s+(a.value||0),0), month: chart.slice(-30).reduce((s,a)=>s+(a.value||0),0), completed, rating: 4.9 })
    }
    load()
    return ()=> { mounted=false }
  }, [])

  const trend = useMemo(() => data.slice(-7), [data])

  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-white/40">Analytics</div>
          <div className="mt-1 text-xl font-semibold text-white">Earnings Overview</div>
        </div>
        <div className="rounded-full border border-[#00FFA3]/20 bg-[#00FFA3]/10 px-3 py-1 text-xs font-semibold text-[#00FFA3]">Rating {summary.rating}</div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Today", value: formatMoney(summary.today) },
          { label: "Weekly", value: formatMoney(summary.week) },
          { label: "Monthly", value: formatMoney(summary.month) },
          { label: "Completed", value: String(summary.completed) },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/10 bg-[#050816]/60 p-4">
            <div className="text-[10px] uppercase tracking-[0.25em] text-white/45">{item.label}</div>
            <div className="mt-2 text-lg font-semibold text-white">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="h-56 rounded-2xl border border-white/10 bg-[#050816]/60 p-3">
          {!mounted ? (
            <div className="h-full w-full rounded-xl border border-white/10 bg-white/5 animate-pulse" />
          ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={224}>
            <AreaChart data={trend}>
              <defs>
                <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00F5FF" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#00F5FF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" hide />
              <YAxis hide />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#00F5FF" fill="url(#earningsGradient)" />
            </AreaChart>
          </ResponsiveContainer>
          )}
        </div>
        <div className="h-56 rounded-2xl border border-white/10 bg-[#050816]/60 p-3">
        {!mounted ? (
          <div className="h-full w-full rounded-xl border border-white/10 bg-white/5 animate-pulse" />
        ) : (
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={224}>
          <BarChart data={trend}>
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="date" hide />
            <YAxis hide />
            <Tooltip />
            <Bar dataKey="value" fill="#5227FF" radius={[12, 12, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        )}
        </div>
      </div>
    </div>
  )
}
