"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Bell, Clock3, LogOut, Menu, Radio, Sparkles } from "lucide-react"
import { useAuth } from "@/providers/AuthProvider"
import { getTechnicianDisplayName } from "./technician-utils"

type TechnicianNavbarProps = {
  activeJobsCount?: number
  onMenuOpen?: () => void
}

export default function TechnicianNavbar({ activeJobsCount = 0, onMenuOpen }: TechnicianNavbarProps) {
  const [time, setTime] = useState("")
  const { user, profile, logout } = useAuth()

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const displayName = useMemo(() => getTechnicianDisplayName(profile, user), [profile, user])

  return (
    <header className="sticky top-0 z-30 mb-6 rounded-[1.75rem] border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-2xl shadow-[0_0_50px_rgba(82,39,255,0.08)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onMenuOpen}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/70 transition hover:border-[#00F5FF]/30 hover:text-white lg:hidden"
            aria-label="Open technician navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-[#5227FF] to-[#00F5FF] font-black text-[#050816] shadow-[0_0_25px_rgba(0,245,255,0.2)]">
            RN
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/45">
              <Sparkles className="h-3.5 w-3.5 text-[#00F5FF]" />
              Technician Operations
            </div>
            <h1 className="mt-1 text-xl font-semibold text-white md:text-2xl">Welcome back, {displayName} 👨‍🔧</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#0b1020]/80 px-4 py-2 text-sm text-white/70">
            <Radio className="h-4 w-4 text-[#00FFA3]" />
            Live
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#0b1020]/80 px-4 py-2 text-sm text-white/70">
            <Clock3 className="h-4 w-4 text-[#00F5FF]" />
            {time}
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#0b1020]/80 px-4 py-2 text-sm text-white/70">
            <Bell className="h-4 w-4 text-[#FFB020]" />
            {activeJobsCount} active jobs
          </div>
          <button onClick={logout} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:border-[#FF4D6D]/30 hover:bg-[#FF4D6D]/10 hover:text-white">
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
