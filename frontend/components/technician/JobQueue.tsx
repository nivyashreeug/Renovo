"use client"
import React, { useEffect, useMemo, useState } from "react"
import JobCard from "./JobCard"
import { supabase } from "@/lib/supabase"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { TechnicianJob } from "./technician-utils"

type Props = {
  onSelect?: (job: TechnicianJob) => void
  onCountsChange?: (counts: { active: number; queue: number }) => void
}

export default function JobQueue({ onSelect, onCountsChange }: Props) {
  const [jobs, setJobs] = useState<TechnicianJob[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    async function load() {
      const result = await supabase
        .from("bookings")
        .select("*")
        .in("status", ["Pending", "Assigned", "On The Way", "Repairing"])
        .order("created_at", { ascending: false })
        .limit(50)
      const rows = (result.data ?? []) as TechnicianJob[]
      if (!mounted) return
      setJobs(rows)
      setLoading(false)
    }
    load()

    const channel = supabase
      .channel("public:bookings:technician-queue")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, (payload) => {
      const updated = payload.new as TechnicianJob
      setJobs((prev) => {
        const idx = prev.findIndex((j) => j.id === updated.id)
        const isVisible = ["Pending", "Assigned", "On The Way", "Repairing"].includes(String(updated.status))
        if (idx === -1 && isVisible) return [updated, ...prev]
        if (idx > -1) {
          const copy = [...prev]
          copy[idx] = updated
          return copy
        }
        return prev
      })
      })
      .subscribe()

    return () => {
      mounted = false
      void supabase.removeChannel(channel)
    }
  }, [])

  const summary = useMemo(() => {
    const active = jobs.filter((job) => job.status !== "Completed" && job.status !== "Rejected").length
    const queue = jobs.length
    onCountsChange?.({ active, queue })
    return { active, queue }
  }, [jobs, onCountsChange])

  async function accept(job: TechnicianJob) {
    const snapshot = jobs
    setJobs((s) => s.map((current) => (current.id === job.id ? { ...current, status: "Assigned" } : current)))
    try {
      const userRes = await supabase.auth.getUser()
      const technicianId = userRes.data?.user?.id
      await supabase.from("bookings").update({ status: "Assigned", technician_id: technicianId }).eq("id", job.id as string)
      toast.success("Repair accepted")
    } catch (err) {
      console.error(err)
      setJobs(snapshot)
      toast.error("Could not accept booking")
    }
  }

  async function reject(job: TechnicianJob) {
    const snapshot = jobs
    setJobs((s) => s.filter((current) => current.id !== job.id))
    try {
      await supabase.from("bookings").update({ status: "Rejected" }).eq("id", job.id as string)
      toast("Job rejected")
    } catch (err) {
      console.error(err)
      setJobs(snapshot)
      toast.error("Could not reject booking")
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-white">Job Queue</h3>
          <p className="text-sm text-white/45">Live assignments synced from Supabase</p>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/65">
          {summary.active} active • {summary.queue} total
        </div>
      </div>
      {loading ? (
        <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 text-center text-white/55">Loading live jobs...</div>
      ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {jobs.map((job) => (
            <motion.div key={job.id} layout>
              <JobCard job={job} onAccept={accept} onReject={reject} onSelect={onSelect} />
            </motion.div>
          ))}
        </AnimatePresence>
        {jobs.length === 0 && (
          <div className="rounded-[1.5rem] border border-dashed border-white/10 bg-white/5 p-8 text-center text-white/45 md:col-span-2">
            No live jobs yet. When bookings are assigned, they will appear here instantly.
          </div>
        )}
      </div>
      )}
    </section>
  )
}
