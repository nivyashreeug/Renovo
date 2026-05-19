"use client"

import React, { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, MessageSquare, Navigation2, Wrench } from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { TechnicianJob, TECHNICIAN_STAGES, formatRelativeTime, nextStatus, stageIndex, statusTone } from "./technician-utils"

type Props = {
  job: TechnicianJob | null
  onUpdated?: (next: TechnicianJob) => void
}

export default function StatusUpdater({ job, onUpdated }: Props) {
  const [note, setNote] = useState("")
  const [saving, setSaving] = useState(false)

  const currentStage = useMemo(() => stageIndex(job?.status), [job?.status])

  if (!job) {
    return (
      <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 text-sm text-white/55 backdrop-blur-xl">
        Select a job to manage live status, ETA, and repair actions.
      </div>
    )
  }

  const updateBooking = async (status: string) => {
    setSaving(true)
    const snapshot = { ...job }
    onUpdated?.({ ...job, status })

    const payload: Record<string, unknown> = {
      status,
      last_updated_at: new Date().toISOString(),
    }

    if (note.trim()) payload.repair_notes = note.trim()

    const { error } = await supabase.from("bookings").update(payload).eq("id", job.id)

    setSaving(false)
    if (error) {
      onUpdated?.(snapshot)
      toast.error("Could not update booking status.")
      return
    }

    toast.success(`Status updated to ${status}`)
  }

  const tone = statusTone(job.status as string)

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl shadow-[0_0_40px_rgba(82,39,255,0.08)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-white/40">Live Status</div>
          <h3 className="mt-1 text-xl font-semibold text-white">Repair Progress</h3>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${tone.className}`}>{tone.label}</span>
      </div>

      <div className="mt-5 space-y-3">
        <div className="h-2 overflow-hidden rounded-full bg-white/10">
          <motion.div initial={{ width: 0 }} animate={{ width: `${((currentStage + 1) / TECHNICIAN_STAGES.length) * 100}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-gradient-to-r from-[#00F5FF] via-[#5227FF] to-[#00FFA3]" />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {TECHNICIAN_STAGES.map((stage, index) => {
            const active = index <= currentStage
            return (
              <button
                key={stage}
                disabled={saving}
                onClick={() => updateBooking(stage)}
                className={`rounded-2xl border px-3 py-3 text-left transition ${active ? "border-[#00F5FF]/30 bg-[#00F5FF]/10 text-white" : "border-white/10 bg-black/20 text-white/55 hover:border-white/20 hover:bg-white/5"}`}
              >
                <div className="text-xs uppercase tracking-[0.2em]">Step {index + 1}</div>
                <div className="mt-1 text-sm font-semibold">{stage}</div>
              </button>
            )
          })}
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <button onClick={() => updateBooking(nextStatus(job.status as string))} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#5227FF] to-[#00F5FF] px-4 py-3 font-semibold text-[#050816] transition hover:brightness-110 disabled:opacity-60">
            <Navigation2 className="h-4 w-4" />
            Advance Status
          </button>
          <button onClick={() => updateBooking("Completed")} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#00FFA3]/30 bg-[#00FFA3]/10 px-4 py-3 font-semibold text-[#00FFA3] transition hover:bg-[#00FFA3]/15 disabled:opacity-60">
            <CheckCircle2 className="h-4 w-4" />
            Mark Completed
          </button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#050816]/70 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <MessageSquare className="h-4 w-4 text-[#00F5FF]" />
            Repair Notes
          </div>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Add technician notes, customer updates, or parts required..."
            className="mt-3 min-h-[100px] w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 outline-none placeholder:text-white/30 focus:border-[#00F5FF]/30"
          />
          <div className="mt-3 flex items-center justify-between text-xs text-white/45">
            <span>Updated {formatRelativeTime(String(job.last_updated_at || job.created_at || job.booking_date || ""))}</span>
            <button onClick={() => updateBooking(String(job.status || "Assigned"))} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-white/75 transition hover:border-[#00F5FF]/30 hover:text-white">
              <Wrench className="h-3.5 w-3.5" />
              Save Note
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
