"use client"
import React from "react"
import { motion } from "framer-motion"
import { BellRing, Sparkles } from "lucide-react"
import { useTechnicianRealtime } from "@/components/technician/TechnicianRealtimeProvider"

export default function NotificationCenter() {
  const { notifications, unreadCount, markNotificationRead, markAllNotificationsRead, loading, streamError } = useTechnicianRealtime()

  const notes = notifications

  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-white/40">Realtime Feed</div>
          <div className="mt-1 text-xl font-semibold text-white">Notifications</div>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60"><BellRing className="h-4 w-4 text-[#00F5FF]" /> {streamError ? "Reconnect" : loading ? "Syncing" : "Live"}</div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 text-xs text-white/45">
        <span>{unreadCount} unread</span>
        {unreadCount > 0 && (
          <button type="button" onClick={markAllNotificationsRead} className="uppercase tracking-[0.2em] text-[#00F5FF] hover:text-white transition-colors">
            Mark all read
          </button>
        )}
      </div>
      <div className="mt-4 space-y-3 max-h-104 overflow-y-auto pr-1">
        {notes.map((n) => (
          <motion.button key={String(n.id)} type="button" onClick={() => markNotificationRead(n.id)} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`w-full rounded-2xl border p-4 text-left text-sm text-white/75 transition ${n.unread ? "border-[#00F5FF]/20 bg-[#050816]/85" : "border-white/10 bg-[#050816]/70 hover:border-white/20"}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold text-white">{String(n.title || n.message || "Notification")}</div>
                <div className="mt-1 text-white/55">{String(n.desc || n.message || "New platform update")}</div>
              </div>
              <Sparkles className="h-4 w-4 text-[#00FFA3]" />
            </div>
          </motion.button>
        ))}
        {notes.length === 0 && <div className="rounded-2xl border border-dashed border-white/10 bg-[#050816]/70 p-6 text-center text-white/45">No notifications yet</div>}
      </div>
    </div>
  )
}
