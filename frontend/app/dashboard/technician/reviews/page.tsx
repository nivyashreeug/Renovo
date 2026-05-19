"use client"

import React, { useEffect, useState } from "react"
import { motion, type Variants } from "framer-motion"
import { Star, MessageCircle, ThumbsUp, Calendar } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { formatRelativeTime } from "@/components/technician/technician-utils"

type Review = {
  id: string | number
  customer_name?: string
  rating?: number
  comment?: string
  service_type?: string
  created_at?: string
  booking_id?: string
}

export default function TechnicianReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    average: 4.9,
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
        // Fetch bookings with completion status (these represent reviews)
        const res = await supabase
          .from("bookings")
          .select("id,customer_name,service_type,created_at,status,booking_id")
          .eq("status", "Completed")
          .order("created_at", { ascending: false })
          .limit(100)

        const rows = (res.data ?? []) as Review[]
        if (!mounted) return

        // Mock ratings for now (in a real app, these would be actual review ratings)
        const reviewsWithRatings = rows.map((r, idx) => ({
          ...r,
          rating: Math.floor(Math.random() * 2) + 4,
          comment: [
            "Excellent technician! Very professional and quick service.",
            "Great experience. Highly recommend!",
            "Fixed the issue perfectly. Very satisfied.",
            "Fast and efficient. Great work!",
            "Professional service and fair pricing.",
          ][idx % 5],
        }))

        setReviews(reviewsWithRatings)

        // Calculate stats
        const avgRating =
          reviewsWithRatings.length > 0
            ? reviewsWithRatings.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewsWithRatings.length
            : 4.9

        const distribution = {
          5: reviewsWithRatings.filter((r) => r.rating === 5).length,
          4: reviewsWithRatings.filter((r) => r.rating === 4).length,
          3: reviewsWithRatings.filter((r) => r.rating === 3).length,
          2: reviewsWithRatings.filter((r) => r.rating === 2).length,
          1: reviewsWithRatings.filter((r) => r.rating === 1).length,
        }

        setStats({
          average: Math.round(avgRating * 10) / 10,
          total: reviewsWithRatings.length,
          fiveStar: distribution[5],
          fourStar: distribution[4],
          threeStar: distribution[3],
          twoStar: distribution[2],
          oneStar: distribution[1],
        })

        setLoading(false)
      } catch (err) {
        console.error("Failed to load reviews:", err)
        setLoading(false)
      }
    }

    loadReviews()
    return () => {
      mounted = false
    }
  }, [])

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
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[
          {
            label: "Average Rating",
            value: stats.average,
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
                <div className={`rounded-xl bg-gradient-to-br ${stat.color} p-3 text-white`}>
                  <Icon size={24} />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Rating Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Rating Breakdown</h3>
        <div className="space-y-4">
          {[
            { stars: 5, count: stats.fiveStar, label: "Excellent" },
            { stars: 4, count: stats.fourStar, label: "Good" },
            { stars: 3, count: stats.threeStar, label: "Average" },
            { stars: 2, count: stats.twoStar, label: "Poor" },
            { stars: 1, count: stats.oneStar, label: "Needs Improvement" },
          ].map((item, idx) => (
            <div key={item.stars}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">{item.stars}</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < item.stars ? "fill-[#FFB020] text-[#FFB020]" : "text-white/20"}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-white/55 ml-2">{item.label}</span>
                </div>
                <span className="text-sm font-semibold text-white">{item.count} reviews</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width:
                      stats.total > 0
                        ? `${(item.count / stats.total) * 100}%`
                        : "0%",
                  }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.3 + idx * 0.05 }}
                  className="h-full bg-gradient-to-r from-[#FFB020] to-[#FF4D6D]"
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Reviews List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <h3 className="text-lg font-semibold text-white">Recent Reviews</h3>
        {loading ? (
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-8 text-center text-white/55">
            Loading reviews...
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((review, idx) => (
            <motion.div
              key={review.id}
              variants={itemVariants}
              className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl hover:border-white/20 transition"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#5227FF] to-[#00F5FF] flex items-center justify-center text-white font-bold">
                  {String(review.customer_name || "C").charAt(0).toUpperCase()}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h4 className="font-semibold text-white">{String(review.customer_name || "Customer")}</h4>
                      <p className="text-xs text-white/55">{String(review.service_type || "Service")}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < (review.rating || 0)
                              ? "fill-[#FFB020] text-[#FFB020]"
                              : "text-white/20"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-white/75 mb-3">{review.comment}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/45">
                      {formatRelativeTime(String(review.created_at))}
                    </span>
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
            <MessageCircle className="w-8 h-8 mx-auto mb-3 text-white/30" />
            No reviews yet. Complete repairs to receive customer feedback.
          </div>
        )}
      </motion.div>
    </div>
  )
}
