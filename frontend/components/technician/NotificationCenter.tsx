"use client"
import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { BellRing, Sparkles } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { TechnicianNotification } from "./technician-utils"

type Note = TechnicianNotification

export default function NotificationCenter() {
  const [notes, setNotes] = useState<Note[]>([])

  useEffect(() => {
    let mounted = true
    async function load() {
      const res = await supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(20)
      const rows = (res.data ?? []) as Note[]
      if (!mounted) return
      setNotes(rows)
    }
    load()

    const channel = supabase
      .channel("public:notifications")
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications" }, (payload) => {
        setNotes((s) => [payload.new as Note, ...s].slice(0, 20))
      })
      .subscribe()

    return () => { mounted = false; void supabase.removeChannel(channel) }
  }, [])

  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-white/40">Realtime Feed</div>
          <div className="mt-1 text-xl font-semibold text-white">Notifications</div>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60"><BellRing className="h-4 w-4 text-[#00F5FF]" /> Live</div>
      </div>
      <div className="mt-4 space-y-3 max-h-[26rem] overflow-y-auto pr-1">
        {notes.map((n) => (
          <motion.div key={String(n.id)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/10 bg-[#050816]/70 p-4 text-sm text-white/75">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-white">{String(n.title || n.message || "Notification")}</div>
                <div className="mt-1 text-white/55">{String(n.desc || n.message || "New platform update")}</div>
              </div>
              <Sparkles className="h-4 w-4 text-[#00FFA3]" />
            </div>
          </motion.div>
        ))}
        {notes.length === 0 && <div className="rounded-2xl border border-dashed border-white/10 bg-[#050816]/70 p-6 text-center text-white/45">No notifications yet</div>}
      </div>
    </div>
  )
}
