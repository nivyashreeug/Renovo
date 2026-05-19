"use client"

import React, { useState } from "react"
import JobQueue from "@/components/technician/JobQueue"
import CustomerDetails from "@/components/technician/CustomerDetails"
import StatusUpdater from "@/components/technician/StatusUpdater"
import { TechnicianJob } from "@/components/technician/technician-utils"

export default function TechnicianJobsPage() {
  const [selected, setSelected] = useState<TechnicianJob | null>(null)

  return (
    <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
      <div className="space-y-6">
        <JobQueue onSelect={setSelected} />
      </div>
      <aside className="space-y-6">
        <StatusUpdater job={selected} onUpdated={setSelected} />
        <CustomerDetails job={selected} />
      </aside>
    </div>
  )
}
