"use client"
import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Star } from "lucide-react"
import { supabase } from "@/lib/supabase"

type Review = Record<string, unknown>

export default function ReviewsPanel() {
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    let mounted = true
    const channel = supabase
      .channel("dashboard-reviews")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "reviews" },
        (payload) => {
          const newReview = payload.new as Review
          setReviews((current) => [newReview, ...current].slice(0, 10))
        }
      )
      .subscribe()

    async function load() {
      const res = await supabase.from("reviews").select("*").order("created_at", { ascending: false }).limit(10)
      const rows = (res.data ?? []) as Review[]
      if (!mounted) return
      setReviews(rows)
    }
    load()
    return ()=> {
      mounted=false
      void supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-white/40">Feedback</div>
          <div className="mt-1 text-xl font-semibold text-white">Reviews</div>
        </div>
        <div className="flex items-center gap-1 text-[#00FFA3]"><Star className="h-4 w-4 fill-current" /> 4.9</div>
      </div>
      <div className="mt-4 space-y-3 max-h-96 overflow-y-auto pr-1">
        {reviews.map(r => (
          <motion.div key={String(r.id)} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/10 bg-[#050816]/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-white">{String(r.customer_name || "Customer")}</div>
                <div className="text-xs text-white/45">{String(r.service_name || "Completed service")}</div>
              </div>
              <div className="text-xs text-[#00FFA3]">★★★★★</div>
            </div>
            <div className="mt-2 text-sm text-white/65">{String(r.comment || r.review || "Great service experience.")}</div>
          </motion.div>
        ))}
        {reviews.length===0 && <div className="rounded-2xl border border-dashed border-white/10 bg-[#050816]/70 p-6 text-center text-white/45">No reviews yet</div>}
      </div>
    </div>
  )
}
