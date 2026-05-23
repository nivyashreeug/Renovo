"use client"

import React, { useEffect, useState } from "react"
import { motion, type Variants } from "framer-motion"
import { Calendar, MessageCircle, Star, ThumbsUp } from "lucide-react"

import { supabase } from "@/lib/supabase"
import { useAuth } from "@/providers/AuthProvider"
import { formatRelativeTime, getTechnicianDisplayName } from "@/components/technician/technician-utils"

type Review = {
  id: string | number
  customer_name?: string | null
  rating?: number | null
  comment?: string | null
  review?: string | null
  service_name?: string | null
  technician_name?: string | null
  created_at?: string | null
  booking_id?: string | number | null
}

export default function TechnicianReviewsPage() {
  const { user, profile } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    average: 0,
    total: 0,
    fiveStar: 0,
    fourStar: 0,
    threeStar: 0,
    twoStar: 0,
    oneStar: 0,
  })

  useEffect(() => {
    let mounted = true

    async function loadReviews() {
      try {
        const displayName = getTechnicianDisplayName(profile, user).trim().toLowerCase()
        const res = await supabase
          .from("reviews")
          .select("id,customer_name,rating,comment,service_name,technician_name,created_at,booking_id")
          .order("created_at", { ascending: false })
          .limit(100)

        const rows = ((res.data ?? []) as Review[]).filter((review) => {
          if (!displayName || displayName === "technician") return true
          return String(review.technician_name || "").trim().toLowerCase() === displayName
        })

        if (!mounted) return

        setReviews(rows)

        const average =
          rows.length > 0
            ? rows.reduce((sum, review) => sum + Number(review.rating || 0), 0) / rows.length
            : 0

        const distribution = {
          5: rows.filter((review) => review.rating === 5).length,
          4: rows.filter((review) => review.rating === 4).length,
          3: rows.filter((review) => review.rating === 3).length,
          2: rows.filter((review) => review.rating === 2).length,
          1: rows.filter((review) => review.rating === 1).length,
        }

        setStats({
          average: Math.round(average * 10) / 10,
          total: rows.length,
          fiveStar: distribution[5],
          fourStar: distribution[4],
          threeStar: distribution[3],
          twoStar: distribution[2],
          oneStar: distribution[1],
        })
      } catch (err) {
        console.error("Failed to load reviews:", err)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    void loadReviews()

    return () => {
      mounted = false
    }
  }, [profile, user])

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[
          {
            label: "Average Rating",
            value: stats.total > 0 ? stats.average.toFixed(1) : "—",
            icon: Star,
            color: "from-[#FFB020] to-[#FF4D6D]",
          },
          {
            label: "Total Reviews",
            value: stats.total,
            icon: MessageCircle,
            color: "from-[#00F5FF] to-[#5227FF]",
          },
          {
            label: "5-Star Reviews",
            value: stats.fiveStar,
            icon: Star,
            color: "from-[#00FFA3] to-[#00F5FF]",
          },
          {
            label: "Satisfaction Rate",
            value: stats.total > 0 ? `${Math.round(((stats.fiveStar + stats.fourStar) / stats.total) * 100)}%` : "—",
            icon: ThumbsUp,
            color: "from-[#5227FF] to-[#00FFA3]",
          },
          {
            label: "Recent Activity",
            value: reviews.length > 0 ? formatRelativeTime(String(reviews[0].created_at)) : "—",
            icon: Calendar,
            color: "from-[#FF4D6D] to-[#FFB020]",
          },
        ].map((stat, idx) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-[1.75rem] border border-white/10 bg-white/5 p-4 backdrop-blur-xl hover:border-white/20 transition"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-white/40">{stat.label}</div>
                  <div className="mt-2 text-2xl font-bold text-white">{stat.value}</div>
                </div>
                <div className={`rounded-xl bg-linear-to-br ${stat.color} p-3 text-white`}>
                  <Icon size={24} />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
      >
        <h3 className="mb-4 text-lg font-semibold text-white">Rating Breakdown</h3>
        <div className="space-y-4">
          {[
            { stars: 5, count: stats.fiveStar, label: "Excellent" },
            { stars: 4, count: stats.fourStar, label: "Good" },
            { stars: 3, count: stats.threeStar, label: "Average" },
            { stars: 2, count: stats.twoStar, label: "Poor" },
            { stars: 1, count: stats.oneStar, label: "Needs Improvement" },
          ].map((item, idx) => (
            <div key={item.stars}>
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">{item.stars}</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, starIndex) => (
                      <Star
                        key={starIndex}
                        size={14}
                        className={starIndex < item.stars ? "fill-[#FFB020] text-[#FFB020]" : "text-white/20"}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-xs text-white/55">{item.label}</span>
                </div>
                <span className="text-sm font-semibold text-white">{item.count} reviews</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: stats.total > 0 ? `${(item.count / stats.total) * 100}%` : "0%" }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.3 + idx * 0.05 }}
                  className="h-full bg-linear-to-r from-[#FFB020] to-[#FF4D6D]"
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Recent Reviews</h3>
        {loading ? (
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-8 text-center text-white/55">
            Loading reviews...
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <motion.div
              key={review.id}
              variants={itemVariants}
              className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl hover:border-white/20 transition"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#5227FF] to-[#00F5FF] font-bold text-white">
                  {String(review.customer_name || "C").charAt(0).toUpperCase()}
                </div>

                <div className="flex-1">
                  <div className="mb-2 flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-white">{String(review.customer_name || "Customer")}</h4>
                      <p className="text-xs text-white/55">{String(review.service_name || "Service")}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, starIndex) => (
                        <Star
                          key={starIndex}
                          size={16}
                          className={starIndex < Number(review.rating || 0) ? "fill-[#FFB020] text-[#FFB020]" : "text-white/20"}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="mb-3 text-sm text-white/75">
                    {review.comment || review.review || "Customer left a rating without a written note."}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/45">{formatRelativeTime(String(review.created_at))}</span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-1 rounded-lg border border-[#00FFA3]/20 bg-[#00FFA3]/10 px-3 py-1 text-xs text-[#00FFA3] hover:border-[#00FFA3]/40 transition"
                    >
                      <ThumbsUp size={12} />
                      Helpful
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="rounded-[1.75rem] border border-dashed border-white/10 bg-white/5 p-8 text-center text-white/55">
            <MessageCircle className="mx-auto mb-3 h-8 w-8 text-white/30" />
            No reviews yet. Completed repairs with customer feedback will appear here automatically.
          </div>
        )}
      </motion.div>
    </div>
  )
}
