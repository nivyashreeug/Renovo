"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

import { supabase } from "@/lib/supabase"
import { useAuth } from "@/providers/AuthProvider"
import { getTechnicianDisplayName, type TechnicianJob } from "@/components/technician/technician-utils"

type ReviewRow = {
  id: string | number
  customer_name?: string | null
  technician_name?: string | null
  service_name?: string | null
  booking_id?: string | number | null
  rating?: number | null
  comment?: string | null
  review?: string | null
  created_at?: string | null
}

type InsightMetrics = {
  totalBookings: number
  activeJobs: number
  queueJobs: number
  completedJobs: number
  completionRate: number
  monthlyRevenue: number
  weeklyRevenue: number
  averageTicket: number
  averageRating: number
  reviewCount: number
  satisfactionRate: number
  responseTimeMinutes: number
  avgEtaMinutes: number
  speedDelta: number
  performanceScore: number
  reliabilityPercent: number
  workloadLabel: string
  suggestions: string[]
}

type InsightState = {
  metrics: InsightMetrics
  bookings: TechnicianJob[]
  reviews: ReviewRow[]
  scopeLabel: string
}

const ACTIVE_STATUSES = new Set(["Pending", "Assigned", "On The Way", "Repairing"])
const COMPLETED_STATUSES = new Set(["Completed", "Paid"])

function normalizeName(value?: string | null) {
  return (value || "").trim().toLowerCase().replace(/\s+/g, " ")
}

function getMoneyValue(job: TechnicianJob) {
  return Number(job.amount || job.price || 0)
}

function getTimestamp(value?: string | null) {
  const time = value ? new Date(value).getTime() : Number.NaN
  return Number.isNaN(time) ? null : time
}

function round(value: number, digits = 1) {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

function formatScopeLabel(hasPersonalData: boolean) {
  return hasPersonalData ? "Your technician data" : "Team-wide fallback"
}

function buildSuggestions(metrics: InsightMetrics) {
  const suggestions: string[] = []

  if (metrics.activeJobs >= 6) {
    suggestions.push(`You have ${metrics.activeJobs} active jobs. Prioritize high-ETA repairs first to avoid spillover.`)
  } else if (metrics.activeJobs === 0) {
    suggestions.push("No active jobs are assigned right now. Stay available so new dispatches can route to you quickly.")
  } else {
    suggestions.push(`Your active load is ${metrics.activeJobs} jobs. Keep same-zone repairs grouped to reduce travel time.`)
  }

  if (metrics.satisfactionRate < 80 && metrics.reviewCount > 0) {
    suggestions.push("Customer satisfaction is slipping below 80%. Add repair notes and tighter ETA updates on every booking.")
  } else if (metrics.reviewCount > 0) {
    suggestions.push(`Customer satisfaction is ${metrics.satisfactionRate}%. Keep closing jobs cleanly to protect your rating.`)
  } else {
    suggestions.push("No live reviews yet. Finished jobs with clear notes will help generate stronger customer feedback.")
  }

  if (metrics.speedDelta < 0) {
    suggestions.push(`Completion pace is down ${Math.abs(metrics.speedDelta)}% versus the prior week. Clear older assigned jobs before taking new queue items.`)
  } else {
    suggestions.push(`Completion pace is up ${metrics.speedDelta}% versus the prior week. Maintain the same dispatch rhythm this week.`)
  }

  if (metrics.responseTimeMinutes > 45) {
    suggestions.push("Average response time is elevated. Acknowledge fresh bookings sooner to keep handoff latency low.")
  } else {
    suggestions.push("Response time is healthy. Continue updating status early so customers see movement fast.")
  }

  return suggestions
}

function calculateMetrics(bookings: TechnicianJob[], reviews: ReviewRow[]): InsightMetrics {
  const now = Date.now()
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000
  const fourteenDaysAgo = now - 14 * 24 * 60 * 60 * 1000
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime()

  const activeJobs = bookings.filter((job) => ACTIVE_STATUSES.has(String(job.status || ""))).length
  const queueJobs = bookings.filter((job) => String(job.status || "") === "Pending").length
  const completedBookings = bookings.filter((job) => COMPLETED_STATUSES.has(String(job.status || "")))
  const completedJobs = completedBookings.length
  const weeklyRevenue = bookings.reduce((sum, job) => {
    const stamp = getTimestamp(String(job.booking_date || job.created_at || ""))
    return stamp && stamp >= sevenDaysAgo ? sum + getMoneyValue(job) : sum
  }, 0)
  const monthlyRevenue = bookings.reduce((sum, job) => {
    const stamp = getTimestamp(String(job.booking_date || job.created_at || ""))
    return stamp && stamp >= monthStart ? sum + getMoneyValue(job) : sum
  }, 0)

  const reviewRatings = reviews.map((review) => Number(review.rating || 0)).filter((rating) => rating > 0)
  const averageRating = reviewRatings.length > 0 ? round(reviewRatings.reduce((sum, rating) => sum + rating, 0) / reviewRatings.length, 1) : 0
  const satisfactionRate = reviewRatings.length > 0 ? Math.round((reviewRatings.filter((rating) => rating >= 4).length / reviewRatings.length) * 100) : 0

  const responseSamples = bookings
    .map((job) => {
      const created = getTimestamp(String(job.created_at || job.booking_date || ""))
      const updated = getTimestamp(String(job.last_updated_at || ""))
      if (!created || !updated || updated <= created) return null
      return (updated - created) / 60000
    })
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value))

  const responseTimeMinutes = responseSamples.length > 0 ? Math.round(responseSamples.reduce((sum, value) => sum + value, 0) / responseSamples.length) : 0

  const etaSamples = bookings
    .filter((job) => ACTIVE_STATUSES.has(String(job.status || "")))
    .map((job) => Number(job.eta_minutes || 0))
    .filter((value) => Number.isFinite(value) && value > 0)

  const avgEtaMinutes = etaSamples.length > 0 ? Math.round(etaSamples.reduce((sum, value) => sum + value, 0) / etaSamples.length) : 0

  const currentWeekCompleted = completedBookings.filter((job) => {
    const stamp = getTimestamp(String(job.last_updated_at || job.created_at || job.booking_date || ""))
    return stamp && stamp >= sevenDaysAgo
  }).length

  const previousWeekCompleted = completedBookings.filter((job) => {
    const stamp = getTimestamp(String(job.last_updated_at || job.created_at || job.booking_date || ""))
    return stamp && stamp >= fourteenDaysAgo && stamp < sevenDaysAgo
  }).length

  const speedDelta = previousWeekCompleted > 0
    ? Math.round(((currentWeekCompleted - previousWeekCompleted) / previousWeekCompleted) * 100)
    : currentWeekCompleted > 0
      ? 100
      : 0

  const totalBookings = bookings.length
  const completionRate = totalBookings > 0 ? Math.round((completedJobs / totalBookings) * 100) : 0
  const averageTicket = completedJobs > 0 ? round(completedBookings.reduce((sum, job) => sum + getMoneyValue(job), 0) / completedJobs, 0) : 0
  const reliabilityPercent = Math.round((completionRate * 0.55) + (satisfactionRate * 0.45))
  const workloadLabel = activeJobs >= 6 ? "High Load" : activeJobs >= 3 ? "Balanced" : activeJobs > 0 ? "Light Load" : "Open Capacity"
  const performanceScore = Math.max(
    0,
    Math.min(
      99,
      Math.round(
        (completionRate * 0.4) +
          (satisfactionRate * 0.25) +
          ((averageRating / 5) * 100 * 0.2) +
          ((responseTimeMinutes > 0 ? Math.max(0, 100 - responseTimeMinutes) : 65) * 0.15)
      )
    )
  )

  const metrics: InsightMetrics = {
    totalBookings,
    activeJobs,
    queueJobs,
    completedJobs,
    completionRate,
    monthlyRevenue,
    weeklyRevenue,
    averageTicket,
    averageRating,
    reviewCount: reviewRatings.length,
    satisfactionRate,
    responseTimeMinutes,
    avgEtaMinutes,
    speedDelta,
    performanceScore,
    reliabilityPercent,
    workloadLabel,
    suggestions: [],
  }

  metrics.suggestions = buildSuggestions(metrics)
  return metrics
}

const EMPTY_METRICS = calculateMetrics([], [])

async function loadTechnicianInsightState(userId?: string, displayName?: string): Promise<InsightState> {
  const [bookingResult, reviewResult] = await Promise.all([
    supabase
      .from("bookings")
      .select("id,status,customer_name,service_name,service_type,booking_date,booking_time,address,priority,payment_status,technician_name,technician_id,amount,price,eta_minutes,repair_notes,last_updated_at,created_at")
      .order("created_at", { ascending: false })
      .limit(500),
    supabase
      .from("reviews")
      .select("id,customer_name,technician_name,service_name,booking_id,rating,comment,created_at")
      .order("created_at", { ascending: false })
      .limit(300),
  ])

  if (bookingResult.error) throw bookingResult.error
  if (reviewResult.error) throw reviewResult.error

  const bookings = (bookingResult.data || []) as TechnicianJob[]
  const reviews = (reviewResult.data || []) as ReviewRow[]
  const normalizedName = normalizeName(displayName)

  const scopedBookings = bookings.filter((job) => {
    const matchesId = userId ? String(job.technician_id || "") === userId : false
    const matchesName = normalizedName && normalizedName !== "technician"
      ? normalizeName(job.technician_name) === normalizedName
      : false
    return matchesId || matchesName
  })

  const scopedReviews = reviews.filter((review) => {
    if (!normalizedName || normalizedName === "technician") return false
    return normalizeName(review.technician_name) === normalizedName
  })

  const hasPersonalData = scopedBookings.length > 0 || scopedReviews.length > 0
  const visibleBookings = hasPersonalData ? scopedBookings : bookings
  const visibleReviews = hasPersonalData ? scopedReviews : reviews

  return {
    bookings: visibleBookings,
    reviews: visibleReviews,
    metrics: calculateMetrics(visibleBookings, visibleReviews),
    scopeLabel: formatScopeLabel(hasPersonalData),
  }
}

export function useTechnicianInsights() {
  const { user, profile } = useAuth()
  const [state, setState] = useState<InsightState>({
    bookings: [],
    reviews: [],
    metrics: EMPTY_METRICS,
    scopeLabel: "Loading",
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [runningAnalysis, setRunningAnalysis] = useState(false)
  const [rebalancing, setRebalancing] = useState(false)
  const [lastAnalysisAt, setLastAnalysisAt] = useState<string | null>(null)

  const displayName = useMemo(() => getTechnicianDisplayName(profile, user), [profile, user])

  const refresh = useCallback(async (showToast = false) => {
    if (!user) {
      setState({
        bookings: [],
        reviews: [],
        metrics: EMPTY_METRICS,
        scopeLabel: "No technician session",
      })
      setLoading(false)
      return
    }

    setRefreshing(true)
    try {
      const next = await loadTechnicianInsightState(user.id, displayName)
      setState(next)
      if (showToast) {
        toast.success("Live analytics refreshed from Supabase.")
      }
    } catch (error) {
      console.error("Failed to load technician insights:", error)
      toast.error("Could not load technician analytics from Supabase.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [displayName, user])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void refresh()
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [refresh])

  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel(`public:technician-insights:${user.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, () => {
        void refresh()
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "reviews" }, () => {
        void refresh()
      })
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [refresh, user])

  const runAnalysis = useCallback(async () => {
    setRunningAnalysis(true)
    try {
      await refresh(true)
      setLastAnalysisAt(new Date().toISOString())
    } finally {
      setRunningAnalysis(false)
    }
  }, [refresh])

  const rebalanceWorkload = useCallback(async () => {
    if (!user) {
      toast.error("Your session expired. Please sign in again.")
      return
    }

    const candidates = state.bookings
      .filter((job) => ACTIVE_STATUSES.has(String(job.status || "")))
      .sort((left, right) => {
        const leftStamp = getTimestamp(String(left.created_at || left.booking_date || "")) || 0
        const rightStamp = getTimestamp(String(right.created_at || right.booking_date || "")) || 0
        return leftStamp - rightStamp
      })
      .slice(0, 3)

    if (candidates.length === 0) {
      toast.message("No active jobs are available to rebalance.")
      return
    }

    setRebalancing(true)

    try {
      const now = new Date().toISOString()
      const updates = candidates.map((job, index) => {
        const currentEta = Math.max(10, Number(job.eta_minutes || 20))
        const nextPriority = index === 0 ? "High" : index === 1 ? "Medium" : "Normal"
        const nextEta = Math.max(10, currentEta - 5)
        const nextNotes = [String(job.repair_notes || "").trim(), `AI workload rebalance applied ${now}`].filter(Boolean).join(" | ")

        return supabase
          .from("bookings")
          .update({
            priority: nextPriority,
            eta_minutes: nextEta,
            repair_notes: nextNotes,
            last_updated_at: now,
            technician_id: job.technician_id || user.id,
          })
          .eq("id", job.id)
      })

      const results = await Promise.all(updates)
      const failed = results.find((result) => result.error)

      if (failed?.error) {
        throw failed.error
      }

      await refresh()
      toast.success(`Rebalanced ${candidates.length} active booking${candidates.length > 1 ? "s" : ""}.`)
    } catch (error) {
      console.error("Failed to rebalance workload:", error)
      toast.error("Could not apply workload rebalance.")
    } finally {
      setRebalancing(false)
    }
  }, [refresh, state.bookings, user])

  return {
    ...state,
    displayName,
    lastAnalysisAt,
    loading,
    refreshing,
    runningAnalysis,
    rebalancing,
    refresh,
    runAnalysis,
    rebalanceWorkload,
  }
}
