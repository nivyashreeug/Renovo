"use client"
import React, { useMemo, useState } from "react"
import { Settings, LogOut, Menu } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/providers/AuthProvider"
import { TECHNICIAN_MENU, getTechnicianDisplayName } from "./technician-utils"
import AvailabilityToggle from "./AvailabilityToggle"

export default function TechnicianSidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, profile, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  const items = useMemo(() => TECHNICIAN_MENU, [])
  const displayName = getTechnicianDisplayName(profile, user)

  return (
    <aside className={`sticky top-0 flex h-screen flex-col border-r border-white/10 bg-[#050816]/85 px-3 py-4 text-sm text-slate-200 backdrop-blur-2xl transition-all duration-300 ${collapsed ? "w-[92px]" : "w-[320px]"}`}>
      <div className="flex items-center justify-between gap-3 px-2 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5227FF] to-[#00F5FF] font-black text-[#050816] shadow-[0_0_25px_rgba(0,245,255,0.18)]">RN</div>
          <div className={`${collapsed ? "hidden" : "block"}`}>
            <div className="text-lg font-semibold text-white">Renova</div>
            <div className="text-xs uppercase tracking-[0.25em] text-white/45">Technician Center</div>
          </div>
        </div>
        <button onClick={() => setCollapsed((value) => !value)} className="rounded-xl border border-white/10 bg-white/5 p-2 text-white/70 transition hover:border-[#00F5FF]/30 hover:text-white">
          <Menu size={16} />
        </button>
      </div>

      <div className={`rounded-3xl border border-white/10 bg-white/5 p-4 ${collapsed ? "px-2" : "px-4"}`}>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 text-lg font-bold text-white">{displayName.charAt(0).toUpperCase()}</div>
          <div className={`${collapsed ? "hidden" : "block"}`}>
            <div className="font-semibold text-white">{displayName}</div>
            <div className="text-xs text-white/55">Realtime repair specialist</div>
          </div>
        </div>

        <div className={`mt-4 ${collapsed ? "hidden" : "block"}`}>
          <AvailabilityToggle compact />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="flex flex-col gap-2">
          {items.map((it) => {
            const ActiveIcon = it.icon
            const active = pathname?.startsWith(it.href)
            return (
              <li key={it.href}>
                <button
                  onClick={() => router.push(it.href)}
                  className={`group flex w-full items-center gap-3 rounded-2xl border px-3 py-3 transition-all duration-300 ${
                    active
                      ? "border-[#00F5FF]/30 bg-gradient-to-r from-[#5227FF]/20 to-[#00F5FF]/10 text-white shadow-[0_0_25px_rgba(0,245,255,0.12)]"
                      : "border-transparent bg-transparent text-white/70 hover:border-white/10 hover:bg-white/5 hover:text-white"
                  } ${collapsed ? "justify-center" : ""}`}
                >
                  <div className={`rounded-xl p-2 ${active ? "bg-white/10 text-[#00F5FF]" : "bg-white/5 text-white/55 group-hover:text-white"}`}>
                    <ActiveIcon size={18} />
                  </div>
                  <span className={`${collapsed ? "hidden" : "inline-flex"} font-medium`}>{it.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="space-y-3 pt-3">
        <button onClick={() => router.push("/dashboard/technician/settings")} className={`w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-left text-white/70 transition hover:border-[#00F5FF]/30 hover:text-white ${collapsed ? "flex items-center justify-center" : ""}`}>
          <div className="flex items-center gap-3">
            <Settings size={16} />
            <span className={`${collapsed ? "hidden" : "inline"}`}>Open Settings</span>
          </div>
        </button>
        <button onClick={logout} className={`w-full rounded-2xl border border-[#FF4D6D]/20 bg-[#FF4D6D]/10 px-3 py-3 text-left text-white/80 transition hover:bg-[#FF4D6D]/15 ${collapsed ? "flex items-center justify-center" : ""}`}>
          <div className="flex items-center gap-3">
            <LogOut size={16} />
            <span className={`${collapsed ? "hidden" : "inline"}`}>Logout</span>
          </div>
        </button>
      </div>
    </aside>
  )
}
