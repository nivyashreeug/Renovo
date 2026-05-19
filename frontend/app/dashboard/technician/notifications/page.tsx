"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, AlertCircle, Zap, MessageSquare, CheckCircle2, Clock, Trash2, Archive } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { formatRelativeTime } from "@/components/technician/technician-utils"

type Notification = {
  id: string | number
  type: "assignment" | "urgent" | "reminder" | "message" | "completed"
  title: string
  message: string
  created_at: string
  read: boolean
  related_id?: string
}

export default function TechnicianNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "unread">("all")

  useEffect(() => {
    let mounted = true

    async function loadNotifications() {
      try {
        // Fetch recent bookings as notifications
        const res = await supabase
          .from("bookings")
          .select("id,customer_name,status,created_at,service_type,booking_date")
          .order("created_at", { ascending: false })
          .limit(50)

        const rows = (res.data ?? []) as any[]
        if (!mounted) return

        // Convert bookings to notifications
        const notifs: Notification[] = rows.map((r, idx) => {
          const status = String(r.status || "")
          let type: Notification["type"] = "assignment"
          let title = ""
          let message = ""

          if (status === "Pending") {
            type = "assignment"
            title = "New Repair Assignment"
            message = `${r.customer_name || "Customer"} booked a ${r.service_type || "repair"} service`
          } else if (status === "Assigned") {
            type = "reminder"
            title = "Repair Assigned"
            message = `You have been assigned to repair ${r.customer_name || "customer"}'s device`
          } else if (status === "On The Way") {
            type = "reminder"
            title = "En Route to Customer"
            message = `You are on the way to ${r.customer_name || "customer"}`
          } else if (status === "Repairing") {
            type = "reminder"
            title = "Repair in Progress"
            message = `Currently repairing device for ${r.customer_name || "customer"}`
          } else if (status === "Completed") {
            type = "completed"
            title = "Repair Completed"
            message = `Successfully completed ${r.service_type || "repair"} for ${r.customer_name || "customer"}`
          }

          return {
            id: r.id,
            type,
            title,
            message,
            created_at: String(r.created_at || ""),
            read: idx > 5,
            related_id: r.id,
          }
        })

        setNotifications(notifs)
        setLoading(false)
      } catch (err) {
        console.error("Failed to load notifications:", err)
        setLoading(false)
      }
    }

    loadNotifications()

    // Subscribe to realtime updates
    const channel = supabase
      .channel("public:bookings:notifications")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "bookings" }, (payload) => {
        const newBooking = payload.new as any
        const newNotif: Notification = {
          id: newBooking.id,
          type: "assignment",
          title: "New Repair Assignment",
          message: `${newBooking.customer_name || "Customer"} booked a ${newBooking.service_type || "repair"}`,
          created_at: newBooking.created_at,
          read: false,
          related_id: newBooking.id,
        }
        setNotifications((prev) => [newNotif, ...prev])
      })
      .subscribe()

    return () => {
      mounted = false
      void supabase.removeChannel(channel)
    }
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length
  const filteredNotifications =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "assignment":
        return <Zap className="w-5 h-5" />
      case "urgent":
        return <AlertCircle className="w-5 h-5" />
      case "reminder":
        return <Clock className="w-5 h-5" />
      case "message":
        return <MessageSquare className="w-5 h-5" />
      case "completed":
        return <CheckCircle2 className="w-5 h-5" />
      default:
        return <Bell className="w-5 h-5" />
    }
  }

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "assignment":
        return "from-[#00F5FF] to-[#5227FF]"
      case "urgent":
        return "from-[#FF4D6D] to-[#FFB020]"
      case "reminder":
        return "from-[#5227FF] to-[#00FFA3]"
      case "message":
        return "from-[#00FFA3] to-[#00F5FF]"
      case "completed":
        return "from-[#00FFA3] to-[#5227FF]"
      default:
        return "from-[#5227FF] to-[#00F5FF]"
    }
  }

  const getBgColor = (type: Notification["type"]) => {
    switch (type) {
      case "assignment":
        return "border-[#00F5FF]/20 bg-[#00F5FF]/5"
      case "urgent":
        return "border-[#FF4D6D]/20 bg-[#FF4D6D]/5"
      case "reminder":
        return "border-[#5227FF]/20 bg-[#5227FF]/5"
      case "message":
        return "border-[#00FFA3]/20 bg-[#00FFA3]/5"
      case "completed":
        return "border-[#00FFA3]/20 bg-[#00FFA3]/5"
      default:
        return "border-white/10 bg-white/5"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-semibold text-white">Notifications</h2>
            <p className="text-sm text-white/55 mt-1">Realtime alerts and updates</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-white/10 bg-[#050816]/60 px-4 py-3 text-center">
              <div className="text-2xl font-bold text-[#00F5FF]">{unreadCount}</div>
              <div className="text-xs uppercase tracking-[0.2em] text-white/45">Unread</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-[#050816]/60 px-4 py-3 text-center">
              <div className="text-2xl font-bold text-[#5227FF]">{notifications.length}</div>
              <div className="text-xs uppercase tracking-[0.2em] text-white/45">Total</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <div className="flex gap-3">
        {["all", "unread"].map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setFilter(tab as "all" | "unread")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`rounded-xl px-4 py-2 font-semibold uppercase tracking-[0.15em] text-xs transition ${
              filter === tab
                ? "border-[#00F5FF]/40 bg-[#00F5FF]/10 text-[#00F5FF] shadow-[0_0_20px_rgba(0,245,255,0.2)]"
                : "border-white/10 bg-white/5 text-white/70 hover:border-white/20"
            }`}
          >
            {tab === "all" ? "All Notifications" : `Unread (${unreadCount})`}
          </motion.button>
        ))}
      </div>

      {/* Notifications List */}
      <AnimatePresence mode="popLayout">
        {loading ? (
          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-8 text-center text-white/55">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-[#00F5FF]/30 border-t-[#00F5FF] rounded-full mx-auto mb-3"
            />
            Loading notifications...
          </div>
        ) : filteredNotifications.length > 0 ? (
          <div className="space-y-3">
            {filteredNotifications.map((notif, idx) => (
              <motion.div
                key={notif.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ delay: idx * 0.05 }}
                className={`group rounded-[1.5rem] border p-4 backdrop-blur-xl transition-all hover:border-white/20 ${getBgColor(notif.type)} ${
                  !notif.read ? "shadow-[0_0_30px_rgba(0,245,255,0.15)]" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`rounded-xl bg-gradient-to-br ${getNotificationColor(notif.type)} p-3 text-white flex-shrink-0`}
                  >
                    {getNotificationIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h4 className="font-semibold text-white">{notif.title}</h4>
                      {!notif.read && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-2 h-2 rounded-full bg-[#00F5FF] flex-shrink-0"
                        />
                      )}
                    </div>
                    <p className="text-sm text-white/75">{notif.message}</p>
                    <div className="mt-2 text-xs text-white/45">
                      {formatRelativeTime(notif.created_at)}
                    </div>
                  </div>

                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-lg border border-white/10 bg-white/5 text-white/60 hover:border-[#00FFA3]/30 hover:text-[#00FFA3] transition"
                      title="Archive"
                    >
                      <Archive size={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-lg border border-[#FF4D6D]/10 bg-[#FF4D6D]/5 text-[#FF4D6D]/60 hover:border-[#FF4D6D]/30 hover:text-[#FF4D6D] transition"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-[1.75rem] border border-dashed border-white/10 bg-white/5 p-12 text-center">
            <Bell className="w-8 h-8 mx-auto mb-4 text-white/30" />
            <p className="text-white/55 text-sm">
              {filter === "unread" ? "No unread notifications" : "All caught up! No new notifications"}
            </p>
          </div>
        )}
      </AnimatePresence>

      {/* Notification Categories Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Notification Categories</h3>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
          {[
            { type: "assignment" as const, label: "New Assignments", icon: Zap },
            { type: "urgent" as const, label: "Urgent Updates", icon: AlertCircle },
            { type: "reminder" as const, label: "Reminders", icon: Clock },
            { type: "message" as const, label: "Messages", icon: MessageSquare },
            { type: "completed" as const, label: "Completed", icon: CheckCircle2 },
          ].map((cat) => {
            const Icon = cat.icon
            return (
              <div
                key={cat.type}
                className={`rounded-xl border p-3 text-center ${getBgColor(cat.type)}`}
              >
                <div className={`flex justify-center mb-2`}>
                  <div
                    className={`rounded-lg bg-gradient-to-br ${getNotificationColor(cat.type)} p-2 text-white`}
                  >
                    <Icon size={16} />
                  </div>
                </div>
                <div className="text-xs font-semibold text-white">{cat.label}</div>
              </div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
