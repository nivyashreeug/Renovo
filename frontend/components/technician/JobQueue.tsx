"use client"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import JobCard from "./JobCard"
import SkeletonCard from "@/components/ui/SkeletonCard"
import { supabase } from "@/lib/supabase"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { TechnicianJob } from "./technician-utils"
import { useAuth } from "@/providers/AuthProvider"
import { useTechnicianRealtime } from "@/components/technician/TechnicianRealtimeProvider"

type Props = {
  onSelect?: (job: TechnicianJob) => void
  onCountsChange?: (counts: { active: number; queue: number }) => void
  mode?: "pending" | "active"
}

const PENDING_STATUS = "Pending"
export default function JobQueue({ onSelect, onCountsChange, mode = "pending" }: Props) {
  const { user } = useAuth()
  const realtime = useTechnicianRealtime()
  const [busyId, setBusyId] = useState<string | number | null>(null)
  const sourceJobs = useMemo(() => (mode === "pending" ? realtime.queueJobs : realtime.activeJobs), [mode, realtime.activeJobs, realtime.queueJobs])
  // local optimistic copy so UI updates immediately and can rollback on error
  const [localJobs, setLocalJobs] = useState<typeof sourceJobs>(sourceJobs)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLocalJobs(sourceJobs)
    }, 0)

    return () => clearTimeout(timeout)
  }, [sourceJobs])
  const loading = realtime.loading
  const summary = useMemo(
    () => ({ active: realtime.activeJobs.length, queue: realtime.queueJobs.length }),
    [realtime.activeJobs.length, realtime.queueJobs.length]
  )

  useEffect(() => {
    onCountsChange?.(summary)
  }, [onCountsChange, summary])

  const accept = useCallback(async (job: TechnicianJob) => {
    const snapshot = [...(localJobs || [])]
    setBusyId(job.id)
    // optimistic update: remove from pending UI immediately
    setLocalJobs((current) => current.filter((entry) => entry.id !== job.id))

    try {
      const technicianId = user?.id || (await supabase.auth.getUser()).data?.user?.id
      const { error } = await supabase
        .from("bookings")
        .update({
          status: "Assigned",
          technician_id: technicianId,
          last_updated_at: new Date().toISOString(),
        })
        .eq("id", job.id as string)
        .eq("status", PENDING_STATUS)

      if (error) throw error
      onSelect?.({ ...job, status: "Assigned", technician_id: technicianId ?? null })
      await realtime.refresh()
      toast.success("Repair Accepted Successfully")
    } catch (err) {
      console.error(err)
      // rollback
      setLocalJobs(snapshot)
      toast.error("Could not accept booking. Please retry.")
    } finally {
      setBusyId(null)
    }
  }, [localJobs, onSelect, realtime, user])

  const reject = useCallback(async (job: TechnicianJob) => {
    const snapshot = [...(localJobs || [])]
    setBusyId(job.id)
    setLocalJobs((s) => s.filter((current) => current.id !== job.id))
    try {
      const { error } = await supabase
        .from("bookings")
        .update({
          status: "Rejected",
          last_updated_at: new Date().toISOString(),
        })
        .eq("id", job.id as string)
        .eq("status", PENDING_STATUS)

      if (error) throw error
      await realtime.refresh()
      toast.success("Repair request rejected")
    } catch (err) {
      console.error(err)
      setLocalJobs(snapshot)
      toast.error("Could not reject booking. Please retry.")
    } finally {
      setBusyId(null)
    }
  }, [localJobs, realtime])

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">{mode === "pending" ? "Pending Repair Requests" : "Active Jobs"}</h3>
          <p className="text-sm text-white/45">
            {mode === "pending" ? "Realtime customer requests waiting for your decision" : "Accepted jobs synced live from Supabase"}
          </p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/65">
          {mode === "pending" ? `${summary.queue} pending` : `${summary.active} active`}
        </div>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {localJobs.map((job) => (
            <motion.div key={job.id} layout>
              <JobCard
                job={job}
                onAccept={mode === "pending" ? accept : undefined}
                onReject={mode === "pending" ? reject : undefined}
                onSelect={onSelect}
                busy={busyId === job.id}
                mode={mode}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        {localJobs.length === 0 && (
          <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/5 p-8 text-center text-white/45 md:col-span-2">
            {mode === "pending"
              ? "No pending requests right now. Fresh customer bookings will appear here instantly."
              : "No active jobs yet. Accepted repairs will move here automatically."}
          </div>
        )}
      </div>
      )}
    </section>
  )
}
