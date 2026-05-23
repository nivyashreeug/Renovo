"use client"
import React, { useState } from "react"
import { motion } from "framer-motion"
import { Radio, RadioOff } from "lucide-react"
import { useTechnicianRealtime } from "@/components/technician/TechnicianRealtimeProvider"

type Props = {
  compact?: boolean
}

export default function AvailabilityToggle({ compact = false }: Props) {
  const [saving, setSaving] = useState(false)
  const { isAvailable, setAvailability } = useTechnicianRealtime()
  const online = isAvailable

  async function toggle() {
    setSaving(true)
    const next = !online
    await setAvailability(next)
    setSaving(false)
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative group flex items-center justify-between gap-3 rounded-2xl border ${
        online
          ? "border-[#00FFA3]/30 bg-[#00FFA3]/10 shadow-[0_0_30px_rgba(0,255,163,0.15)]"
          : "border-[#FF4D6D]/30 bg-[#FF4D6D]/10 shadow-[0_0_30px_rgba(255,77,109,0.15)]"
      } ${compact ? "px-3 py-2.5" : "px-4 py-3.5"} backdrop-blur-xl transition-all duration-300`}
    >
      <div className="flex items-center gap-3">
        <motion.div
          animate={{
            scale: online ? [1, 1.3, 1] : 1,
            opacity: online ? [1, 0.7, 1] : 1,
          }}
          transition={{
            duration: online ? 2 : 0,
            repeat: online ? Infinity : 0,
          }}
          className={`relative h-3 w-3 rounded-full transition-all ${
            online
              ? "bg-[#00FFA3] shadow-[0_0_12px_rgba(0,255,163,0.8)] ring-2 ring-[#00FFA3]/30"
              : "bg-[#FF4D6D] shadow-[0_0_8px_rgba(255,77,109,0.6)]"
          }`}
        />
        <div>
          <motion.div
            initial={false}
            animate={{ color: online ? "#00FFA3" : "#FF4D6D" }}
            className={`text-sm font-semibold`}
          >
            {online ? "Online" : "Offline"}
          </motion.div>
          <div className="text-xs text-white/45">{online ? "Receiving bookings" : "Queue paused"}</div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={saving}
        onClick={toggle}
        className={`relative rounded-xl border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] transition ${
          online
            ? "border-[#00FFA3]/30 bg-[#00FFA3]/20 text-[#00FFA3] hover:border-[#00FFA3]/50 hover:bg-[#00FFA3]/30"
            : "border-[#FF4D6D]/30 bg-[#FF4D6D]/20 text-[#FF4D6D] hover:border-[#FF4D6D]/50 hover:bg-[#FF4D6D]/30"
        } disabled:opacity-60 flex items-center gap-1.5`}
      >
        {online ? <RadioOff size={12} /> : <Radio size={12} />}
        {online ? "Go Offline" : "Go Online"}
      </motion.button>
    </motion.div>
  )
}
