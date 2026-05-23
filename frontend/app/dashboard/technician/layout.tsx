"use client"
import React, { useEffect, useState } from "react"
import TechnicianSidebar from "@/components/technician/TechnicianSidebar"
import TechnicianNavbar from "@/components/technician/TechnicianNavbar"
import Particles from "@/components/technician/Particles"
import { useAuth } from "@/providers/AuthProvider"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { TechnicianRealtimeProvider } from "@/components/technician/TechnicianRealtimeProvider"

export default function TechnicianLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

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
    <TechnicianRealtimeProvider>
      <div className="min-h-screen bg-[#050816] text-slate-100">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-40 -top-20 h-150 w-150 rounded-full bg-linear-to-tr from-[#5227FF]/30 to-[#00F5FF]/10 blur-3xl opacity-40" />
          <div className="absolute -right-50 top-40 h-125 w-125 rounded-full bg-linear-to-br from-[#8B5CF6]/20 to-[#00FFA3]/10 blur-3xl opacity-30" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        </div>

        <div className="flex">
          <TechnicianSidebar mobileOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
          <main className="flex-1 overflow-hidden p-4 md:p-6 relative">
            <Particles />
            <TechnicianNavbar onMenuOpen={() => setMobileSidebarOpen(true)} />
            <div className="mt-6 relative z-10">{children}</div>
          </main>
        </div>
      </div>
    </TechnicianRealtimeProvider>
  )
}
