"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Send, Sparkles, Star, MessageSquare, PenLine, ChevronDown } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase";

type BookingBrief = {
  id: string | number;
  service_name: string;
  technician_name?: string | null;
  booking_date?: string;
  status?: string;
};

type ReviewRow = {
  id: string | number;
  customer_id?: string | null;
  customer_name?: string | null;
  service_name?: string | null;
  comment?: string | null;
  review?: string | null;
  rating?: number | null;
  created_at?: string | null;
  booking_id?: string | number | null;
  technician_name?: string | null;
};

interface ReviewComposerProps {
  customerId?: string;
  customerName: string;
  bookings: BookingBrief[];
}

function pickDefaultBooking(bookings: BookingBrief[]) {
  return bookings.find((booking) => booking.status === "Completed" || booking.status === "Paid") || bookings[0] || null;
}

function formatDate(value?: string | null) {
  if (!value) return "Just now";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getSupabaseErrorMessage(error: unknown) {
  if (!error || typeof error !== "object") {
    return "Failed to post your review.";
  }

  const maybeError = error as {
    message?: string;
    details?: string;
    hint?: string;
    code?: string;
  };

  if (maybeError.code === "42501" || maybeError.message?.toLowerCase().includes("row-level security")) {
    return "You do not have permission to post this review. Please sign in again and retry.";
  }

  if (maybeError.code === "42P01") {
    return "Reviews table is missing in Supabase. Run the reviews migration and retry.";
  }

  if (maybeError.code === "42703") {
    return "Reviews table schema is outdated. Apply the latest reviews migration and retry.";
  }

  return maybeError.message || maybeError.details || maybeError.hint || "Failed to post your review.";
}

function StarSelector({ rating, onChange }: { rating: number; onChange: (value: number) => void }) {
  return (
    <div className="flex items-center gap-2">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          className="group relative rounded-full p-1 transition hover:scale-110"
        >
          <Star
            size={22}
            className={value <= rating ? "fill-[#00F5FF] text-[#00F5FF] drop-shadow-[0_0_14px_rgba(0,245,255,0.35)]" : "text-white/25"}
          />
        </button>
      ))}
      <span className="ml-2 text-sm text-white/60">{rating}.0 / 5.0</span>
    </div>
  );
}

export default function ReviewComposer({ customerId, customerName, bookings }: ReviewComposerProps) {
  const [selectedBookingId, setSelectedBookingId] = useState<string>("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [postedReview, setPostedReview] = useState<ReviewRow | null>(null);
  const selectedBookingValue = selectedBookingId || String(pickDefaultBooking(bookings)?.id || "");

  const selectedBooking = useMemo(() => {
    return bookings.find((booking) => String(booking.id) === selectedBookingId) || pickDefaultBooking(bookings);
  }, [bookings, selectedBookingId]);

  useEffect(() => {
    let mounted = true;

    const loadReviews = async () => {
      if (!customerId) {
        setReviews([]);
        return;
      }

      const { data } = await supabase
        .from("reviews")
        .select("*")
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false })
        .limit(6);

      if (!mounted) return;

      setReviews((data || []) as ReviewRow[]);
    };

    void loadReviews();

    return () => {
      mounted = false;
    };
  }, [customerId]);

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!comment.trim()) {
      toast.error("Write your review comment before posting.");
      return;
    }

    setIsSubmitting(true);

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      setIsSubmitting(false);
      toast.error("Your session expired. Please log in again.");
      return;
    }

    const resolvedCustomerName =
      customerName.trim() ||
      authUser.user_metadata?.full_name ||
      authUser.email?.split("@")[0] ||
      "Customer";

    const serviceName = selectedBooking?.service_name || "Customer review";

    const payload = {
      customer_id: authUser.id,
      customer_name: resolvedCustomerName,
      service_name: serviceName,
      rating,
      comment: comment.trim(),
      booking_id: selectedBooking ? String(selectedBooking.id) : null,
      technician_name: selectedBooking?.technician_name || null,
    };

    const optimisticReview: ReviewRow = {
      id: `optimistic-${Date.now()}`,
      ...payload,
      created_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase
        .from("reviews")
        .insert(payload)
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      const insertedReview = (data as ReviewRow | null) ?? optimisticReview;

      setReviews((current) => [insertedReview, ...current].slice(0, 6));
      setPostedReview(insertedReview);
      setComment("");
      setRating(5);

      toast.success("Your review is live on Renova.");
    } catch (error) {
      toast.error(getSupabaseErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="rounded-[36px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl sm:p-7">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-4 xl:w-[48%]">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#00F5FF]/20 bg-[#00F5FF]/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-[#00F5FF]">
            <PenLine size={12} /> Customer review studio
          </div>
          <div>
            <h3 className="text-3xl font-semibold text-white">Write your own repair review</h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
              Share a real comment about your completed repair. Your post will be saved to Renova, visible to the team, and reflected in the review stream.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <MiniStat label="Bookings available" value={String(bookings.length)} />
            <MiniStat label="Current rating" value={`${rating}.0`} accent="text-[#00FFA3]" />
            <MiniStat label="Review status" value={postedReview ? "Posted" : "Draft"} accent={postedReview ? "text-[#00FFA3]" : "text-[#FFB020]"} />
          </div>

          <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-white/45">Post preview</div>
                <div className="mt-1 text-lg font-semibold text-white">{selectedBooking?.service_name || "Choose a booking"}</div>
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/60">
                {selectedBooking ? formatDate(selectedBooking.booking_date) : "No booking"}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-3 text-sm text-white/70">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{selectedBooking?.technician_name || "Technician"}</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Booking #{selectedBooking?.id || "—"}</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">{rating} stars</span>
            </div>

            <AnimatePresence mode="wait">
              {postedReview ? (
                <motion.div
                  key={String(postedReview.id)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-5 rounded-[24px] border border-[#00FFA3]/20 bg-[#00FFA3]/10 p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-full border border-[#00FFA3]/30 bg-[#00FFA3]/15 p-2 text-[#00FFA3]">
                      <CheckCircle2 size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Review posted successfully</div>
                      <p className="mt-1 text-sm leading-6 text-white/70">
                        Your comment is now live and visible to the Renova team.
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="mt-5 rounded-[24px] border border-dashed border-white/10 bg-white/5 p-4 text-sm text-white/55">
                  Write a comment and hit post to publish your review.
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-5 xl:w-[48%]">
          <form
            className="rounded-[30px] border border-white/10 bg-black/20 p-5"
            onSubmit={(event) => {
              event.preventDefault();
              void handleSubmit();
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-white/45">Review form</div>
                <div className="mt-1 text-xl font-semibold text-white">Post your feedback</div>
              </div>
              <MessageSquare size={18} className="text-[#00F5FF]" />
            </div>

            <div className="mt-5 space-y-5">
              <label className="block text-sm text-white/60">
                Booking
                <div className="relative mt-2">
                  <select
                    value={selectedBookingValue}
                    onChange={(event) => setSelectedBookingId(event.target.value)}
                    className="w-full appearance-none rounded-2xl border border-white/10 bg-[#08111f] px-4 py-3 pr-10 text-white outline-none transition focus:border-[#00F5FF]/50"
                  >
                    {bookings.length === 0 ? (
                      <option value="">No completed bookings available</option>
                    ) : (
                      bookings.map((booking) => (
                        <option key={String(booking.id)} value={String(booking.id)}>
                          {booking.service_name} • {booking.technician_name || "Technician"} • #{booking.id}
                        </option>
                      ))
                    )}
                  </select>
                  <ChevronDown size={16} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/40" />
                </div>
              </label>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm text-white/45">Rating</div>
                    <div className="mt-2 text-white/85">Tap to rate your service experience</div>
                  </div>
                  <StarSelector rating={rating} onChange={setRating} />
                </div>
              </div>

              <label className="block text-sm text-white/60">
                Your comment
                <textarea
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      void handleSubmit();
                    }
                  }}
                  rows={6}
                  placeholder="Write what you loved, what could be better, or simply say thanks to your technician. Press Enter to post, Shift+Enter for a new line."
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-[#08111f] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-[#00F5FF]/50"
                />
              </label>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm text-white/50">
                  {comment.length}/400 characters
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || !comment.trim() || !customerId}
                  className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-[#00F5FF] via-[#00FFA3] to-[#B8F3FF] px-5 py-3 text-sm font-semibold text-[#02111f] shadow-[0_0_28px_rgba(0,245,255,0.2)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Sparkles size={15} className="animate-spin" /> Posting...
                    </>
                  ) : (
                    <>
                      <Send size={15} /> Post Review
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          <div className="rounded-[30px] border border-white/10 bg-white/5 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-white/45">Your posted reviews</div>
                <div className="mt-1 text-xl font-semibold text-white">Latest comments</div>
              </div>
              <Sparkles size={18} className="text-[#00FFA3]" />
            </div>

            <div className="mt-5 space-y-3 max-h-96 overflow-y-auto pr-1">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <motion.div
                    key={String(review.id)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-[24px] border border-white/10 bg-black/20 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-white">{review.service_name || "Service"}</div>
                        <div className="mt-1 text-xs text-white/45">
                          {review.technician_name || "Technician"} • {formatDate(review.created_at)}
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-1 rounded-full border border-[#00FFA3]/20 bg-[#00FFA3]/10 px-3 py-1 text-xs text-[#00FFA3]">
                        <Star size={12} className="fill-current" /> {review.rating || 5}.0
                      </div>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-white/70">{review.comment || review.review || "Great service experience."}</p>
                  </motion.div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-6 text-center text-white/45">
                  Your reviews will appear here after you post them.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniStat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
      <div className="text-xs uppercase tracking-[0.24em] text-white/45">{label}</div>
      <div className={`mt-2 text-lg font-semibold ${accent || "text-white"}`}>{value}</div>
    </div>
  );
}
