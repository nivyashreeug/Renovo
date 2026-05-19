"use client"
import React, { useEffect, useState } from "react"
import { Bell, User, Clock, LogOut } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/providers/AuthProvider"
import { supabase } from "@/lib/supabase"

export default function TopNavbar() {
  const [time, setTime] = useState("")
  const [online, setOnline] = useState(true)
  const { user, profile, logout } = useAuth()
  const fallbackName = user?.email?.split("@")[0] ?? "Technician"

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString())
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  async function toggleAvailability() {
    setOnline((v) => !v)
    try {
      const { data } = await supabase.auth.getSession()
      const userId = data.session?.user?.id
      if (!userId) return
      await supabase.from("profiles").update({ is_available: !online }).eq("id", userId)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <header className="w-full flex items-center justify-between gap-4 py-3 px-4 bg-transparent">
      <div className="flex items-center gap-4">
        <div className="text-slate-200 font-semibold">{
          profile?.full_name ? `Welcome back, ${profile.full_name}` : user?.email ? `Welcome back, ${user.email.split("@")[0]}` : "Welcome"
        } <span className="hidden md:inline">👨‍🔧</span></div>
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-300 px-3 py-1 rounded-lg bg-[#ffffff07]">
          <Clock size={14} /> {time}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 rounded-md bg-[#ffffff06] hover:bg-[#ffffff08]">
          <Bell size={18} />
        </button>
        <div className="flex items-center gap-3 p-2 rounded-md bg-[#ffffff06]">
          <div className={`h-3 w-3 rounded-full ${online ? "bg-[#00FFA3] shadow-[0_0_14px_#00FFA3]/40" : "bg-[#FF4D6D]"}`} />
          <button onClick={toggleAvailability} className="text-sm text-slate-200">
            {online ? "Online" : "Offline"}
          </button>
        </div>

        {user ? (
          <div className="flex items-center gap-2 p-2 rounded-md bg-[#ffffff06]">
            <User size={18} />
            <div className="hidden md:block text-sm">{profile?.full_name ?? fallbackName}</div>
            <button onClick={logout} className="ml-3 p-2 rounded-md bg-transparent hover:bg-white/5">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-sm text-cyan-400 hover:underline">Login</Link>
            <Link href="/signup" className="text-sm text-white/80 ml-2">Sign up</Link>
          </div>
        )}
      </div>
    </header>
  )
}
