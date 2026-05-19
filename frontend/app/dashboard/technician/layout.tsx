"use client"
import React, { useEffect } from "react"
import TechnicianSidebar from "@/components/technician/TechnicianSidebar"
import TechnicianNavbar from "@/components/technician/TechnicianNavbar"
import Particles from "@/components/technician/Particles"
import { useAuth } from "@/providers/AuthProvider"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function TechnicianLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#050816] text-slate-100 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050816] text-slate-100">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-20 w-[600px] h-[600px] bg-gradient-to-tr from-[#5227FF]/30 to-[#00F5FF]/10 rounded-full blur-3xl opacity-40" />
        <div className="absolute right-[-200px] top-40 w-[500px] h-[500px] bg-gradient-to-br from-[#8B5CF6]/20 to-[#00FFA3]/10 rounded-full blur-3xl opacity-30" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
      </div>

      <div className="flex">
        <TechnicianSidebar />
        <main className="flex-1 p-6 relative overflow-hidden">
          <Particles />
          <TechnicianNavbar />
          <div className="mt-6 relative z-10">{children}</div>
        </main>
      </div>
    </div>
  )
}
