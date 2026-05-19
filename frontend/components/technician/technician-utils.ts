import { Car, CheckCircle2, Clock3, ShieldAlert, Wrench } from "lucide-react"

export type TechnicianJob = Record<string, unknown> & {
  id: string | number
  status?: string
  customer_name?: string
  customer_image?: string | null
  customer_phone?: string | null
  service_name?: string
  service_type?: string
  booking_date?: string
  booking_time?: string
  address?: string
  issue?: string
  issue_description?: string
  priority?: string
  payment_status?: string
  technician_name?: string | null
  technician_id?: string | null
  amount?: number | string
  price?: number | string
  eta_minutes?: number | string
  repair_notes?: string | null
  last_updated_at?: string | null
  created_at?: string | null
}

export type TechnicianNotification = Record<string, unknown> & {
  id: string | number
  message?: string
  title?: string
  desc?: string
  created_at?: string
  unread?: boolean
  level?: string
}

export const TECHNICIAN_STAGES = ["Assigned", "On The Way", "Repairing", "Completed"] as const

export const TECHNICIAN_MENU = [
  { label: "Dashboard", href: "/dashboard/technician", icon: Clock3 },
  { label: "Active Jobs", href: "/dashboard/technician/jobs", icon: Wrench },
  { label: "Repair Queue", href: "/dashboard/technician/jobs", icon: Car },
  { label: "Tracking", href: "/dashboard/technician/tracking", icon: Car },
  { label: "Earnings", href: "/dashboard/technician/earnings", icon: CheckCircle2 },
  { label: "Notifications", href: "/dashboard/technician/notifications", icon: ShieldAlert },
  { label: "Reviews", href: "/dashboard/technician/reviews", icon: CheckCircle2 },
  { label: "Settings", href: "/dashboard/technician/settings", icon: Wrench },
] as const

export function getTechnicianDisplayName(profile: any, user: any) {
  const fullName = profile?.full_name || user?.user_metadata?.full_name || profile?.name || ""

  if (fullName) return fullName

  const email = user?.email || profile?.email
  if (email) return email.split("@")[0]

  return "Technician"
}

export function formatMoney(value?: number | string | null) {
  const amount = Number(value || 0)
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount)
}

export function formatRelativeTime(value?: string | null) {
  if (!value) return "Now"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const diff = Date.now() - date.getTime()
  const minutes = Math.max(1, Math.round(diff / 60000))
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.max(1, Math.round(minutes / 60))
  if (hours < 24) return `${hours}h ago`
  const days = Math.max(1, Math.round(hours / 24))
  return `${days}d ago`
}

export function statusTone(status?: string) {
  switch ((status || "").toLowerCase()) {
    case "completed":
      return {
        label: "Completed",
        className: "border-[#00FFA3]/30 bg-[#00FFA3]/10 text-[#00FFA3]",
        glow: "shadow-[0_0_30px_rgba(0,255,163,0.18)]",
      }
    case "repairing":
      return {
        label: "Repairing",
        className: "border-[#5227FF]/30 bg-[#5227FF]/10 text-[#B8B2FF]",
        glow: "shadow-[0_0_30px_rgba(82,39,255,0.18)]",
      }
    case "on the way":
      return {
        label: "On The Way",
        className: "border-[#00F5FF]/30 bg-[#00F5FF]/10 text-[#00F5FF]",
        glow: "shadow-[0_0_30px_rgba(0,245,255,0.18)]",
      }
    case "rejected":
      return {
        label: "Rejected",
        className: "border-[#FF4D6D]/30 bg-[#FF4D6D]/10 text-[#FF8DA1]",
        glow: "shadow-[0_0_30px_rgba(255,77,109,0.18)]",
      }
    default:
      return {
        label: status || "Assigned",
        className: "border-white/10 bg-white/5 text-white/80",
        glow: "shadow-[0_0_30px_rgba(255,255,255,0.08)]",
      }
  }
}

export function priorityTone(priority?: string) {
  switch ((priority || "").toLowerCase()) {
    case "critical":
    case "high":
      return "from-[#FF4D6D] to-[#FFB020]"
    case "medium":
      return "from-[#00F5FF] to-[#5227FF]"
    default:
      return "from-[#00FFA3] to-[#00F5FF]"
  }
}

export function stageIndex(status?: string) {
  const normalized = (status || "Assigned").toLowerCase()
  const found = TECHNICIAN_STAGES.findIndex((item) => item.toLowerCase() === normalized)
  return found === -1 ? 0 : found
}

export function nextStatus(status?: string) {
  const index = stageIndex(status)
  return TECHNICIAN_STAGES[Math.min(index + 1, TECHNICIAN_STAGES.length - 1)]
}
