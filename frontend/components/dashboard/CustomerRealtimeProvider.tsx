"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Car, CheckCircle, CreditCard, MessageSquare, ShieldAlert, Sparkles, Wrench } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { toast } from "sonner";

type BookingRecord = {
  id: string | number;
  customer_id?: string;
  service_name: string;
  technician_name?: string | null;
  booking_date: string;
  booking_time: string;
  price: string | number;
  status: string;
  payment_status?: string | null;
  urgency_level?: string | null;
  service_category?: string | null;
  eta_minutes?: number | string | null;
  created_at?: string | null;
  updated_at?: string | null;
  [key: string]: unknown;
};

type LiveEvent = {
  type: string;
  title: string;
  description: string;
  status?: string;
  bookingId?: string;
  time: string;
};

type DashboardNotification = {
  id: string;
  title: string;
  desc: string;
  time: string;
  icon: typeof Car | typeof CheckCircle | typeof ShieldAlert | typeof CreditCard | typeof Sparkles;
  color: string;
  bg: string;
  unread: boolean;
};

type DashboardActivity = {
  id: string;
  title: string;
  desc: string;
  time: string;
  icon: typeof MessageSquare | typeof CreditCard | typeof CheckCircle | typeof Wrench;
  color: string;
  bg: string;
  border: string;
};

type CustomerRealtimeContextValue = {
  syncVersion: number;
  lastSyncedAt: string;
  latestEvent: LiveEvent | null;
  bookings: BookingRecord[];
  notifications: DashboardNotification[];
  unreadCount: number;
  activities: DashboardActivity[];
  trackingBooking: BookingRecord | null;
  loadingBookings: boolean;
  streamError: string | null;
  isConnected: boolean;
  retrySync: () => Promise<void>;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
};

const CustomerRealtimeContext = createContext<CustomerRealtimeContextValue | null>(null);

const completedStatuses = new Set(["completed", "paid"]);
const cancelledStatuses = new Set(["cancelled", "refunded"]);

function formatRelativeTime(value?: string | null) {
  if (!value) return "Now";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Now";

  const minutes = Math.max(1, Math.floor((Date.now() - parsed.getTime()) / 60000));
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  return `${Math.floor(hours / 24)}d ago`;
}

function isSettled(booking: BookingRecord) {
  const status = String(booking.status || "").toLowerCase();
  const paymentStatus = String(booking.payment_status || "").toLowerCase();
  return completedStatuses.has(status) || paymentStatus === "paid";
}

function isActive(booking: BookingRecord) {
  const status = String(booking.status || "").toLowerCase();
  return !completedStatuses.has(status) && !cancelledStatuses.has(status);
}

function normalizeTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function buildNotificationFromBooking(booking: BookingRecord, unread = false): DashboardNotification {
  const status = String(booking.status || "").toLowerCase();
  const paymentStatus = String(booking.payment_status || "").toLowerCase();

  if (status === "completed") {
    return {
      id: `notif-completed-${booking.id}`,
      title: "Repair completed",
      desc: `${booking.service_name} has been completed by ${booking.technician_name || "your technician"}.`,
      time: formatRelativeTime(booking.updated_at || booking.created_at || booking.booking_date),
      icon: CheckCircle,
      color: "text-[#00FFA3]",
      bg: "bg-[#00FFA3]/10",
      unread,
    };
  }

  if (paymentStatus === "paid") {
    return {
      id: `notif-paid-${booking.id}`,
      title: "Payment successful",
      desc: `Payment processed for ${booking.service_name}.`,
      time: formatRelativeTime(booking.updated_at || booking.created_at || booking.booking_date),
      icon: CreditCard,
      color: "text-[#00FFA3]",
      bg: "bg-[#00FFA3]/10",
      unread,
    };
  }

  if (status === "cancelled" || status === "refunded") {
    return {
      id: `notif-attention-${booking.id}`,
      title: "Booking update",
      desc: `${booking.service_name} is now ${booking.status}.`,
      time: formatRelativeTime(booking.updated_at || booking.created_at || booking.booking_date),
      icon: ShieldAlert,
      color: "text-[#FF4D6D]",
      bg: "bg-[#FF4D6D]/10",
      unread,
    };
  }

  return {
    id: `notif-live-${booking.id}`,
    title: "Live service update",
    desc: `${booking.service_name} is now ${booking.status || "Pending"}.`,
    time: formatRelativeTime(booking.updated_at || booking.created_at || booking.booking_date),
    icon: Car,
    color: "text-[#00F5FF]",
    bg: "bg-[#00F5FF]/10",
    unread,
  };
}

function buildRealtimeNotification(event: LiveEvent): DashboardNotification {
  const lowered = String(event.status || "").toLowerCase();

  if (event.title.toLowerCase().includes("payment") || lowered === "paid") {
    return {
      id: `live-${event.bookingId || "event"}-${Date.now()}`,
      title: event.title,
      desc: event.description,
      time: "Now",
      icon: CreditCard,
      color: "text-[#00FFA3]",
      bg: "bg-[#00FFA3]/10",
      unread: true,
    };
  }

  if (lowered === "completed") {
    return {
      id: `live-${event.bookingId || "event"}-${Date.now()}`,
      title: event.title,
      desc: event.description,
      time: "Now",
      icon: CheckCircle,
      color: "text-[#00FFA3]",
      bg: "bg-[#00FFA3]/10",
      unread: true,
    };
  }

  if (lowered === "cancelled" || lowered === "rejected" || lowered === "refunded") {
    return {
      id: `live-${event.bookingId || "event"}-${Date.now()}`,
      title: event.title,
      desc: event.description,
      time: "Now",
      icon: ShieldAlert,
      color: "text-[#FF4D6D]",
      bg: "bg-[#FF4D6D]/10",
      unread: true,
    };
  }

  return {
    id: `live-${event.bookingId || "event"}-${Date.now()}`,
    title: event.title,
    desc: event.description,
    time: "Now",
    icon: Sparkles,
    color: "text-[#00F5FF]",
    bg: "bg-[#00F5FF]/10",
    unread: true,
  };
}

function upsertBooking(current: BookingRecord[], incoming: BookingRecord) {
  const incomingId = String(incoming.id);
  const exists = current.some((booking) => String(booking.id) === incomingId);

  if (!exists) {
    return [incoming, ...current].sort(
      (left, right) =>
        new Date(String(right.created_at || right.booking_date)).getTime() -
        new Date(String(left.created_at || left.booking_date)).getTime()
    );
  }

  return current
    .map((booking) => (String(booking.id) === incomingId ? { ...booking, ...incoming } : booking))
    .sort(
      (left, right) =>
        new Date(String(right.created_at || right.booking_date)).getTime() -
        new Date(String(left.created_at || left.booking_date)).getTime()
    );
}

export function CustomerRealtimeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [syncVersion, setSyncVersion] = useState(0);
  const [lastSyncedAt, setLastSyncedAt] = useState("");
  const [latestEvent, setLatestEvent] = useState<LiveEvent | null>(null);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [notifications, setNotifications] = useState<DashboardNotification[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const hydrateBookings = useCallback(async () => {
    if (!user) {
      setBookings([]);
      setNotifications([]);
      setLoadingBookings(false);
      return;
    }

    setLoadingBookings(true);
    setStreamError(null);

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("customer_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      setStreamError("We could not load your live repair data. Retry to reconnect.");
      setBookings([]);
      setNotifications([]);
      setLoadingBookings(false);
      return;
    }

    const rows = ((data || []) as BookingRecord[]).sort(
      (left, right) =>
        new Date(String(right.created_at || right.booking_date)).getTime() -
        new Date(String(left.created_at || left.booking_date)).getTime()
    );

    setBookings(rows);
    setNotifications(rows.slice(0, 5).map((booking) => buildNotificationFromBooking(booking, false)));
    setLoadingBookings(false);
    setLastSyncedAt(normalizeTime());
  }, [user]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      void hydrateBookings();
    }, 0);

    return () => clearTimeout(timeout);
  }, [hydrateBookings]);

  useEffect(() => {
    if (!user) return;

    const bookingChannel = supabase.channel(`customer-dashboard-realtime-${user.id}`);
    // Supabase's realtime channel typings are narrower than the runtime API here.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (bookingChannel as any).on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "bookings",
        filter: `customer_id=eq.${user.id}`,
      },
      (payload: {
        eventType?: "INSERT" | "UPDATE" | "DELETE";
        new?: BookingRecord;
        old?: { id?: string | number; status?: string; service_name?: string; technician_name?: string | null };
      }) => {
          const eventTime = normalizeTime();
          setSyncVersion((current) => current + 1);
          setLastSyncedAt(eventTime);
          setStreamError(null);

          if (payload.eventType === "DELETE") {
            const removedId = String(payload.old?.id || "");
            setBookings((current) => current.filter((booking) => String(booking.id) !== removedId));

            const deletedEvent: LiveEvent = {
              type: "DELETE",
              title: "Booking removed",
              description: "A repair booking was removed from your active ecosystem.",
              status: payload.old?.status,
              bookingId: removedId,
              time: eventTime,
            };

            setLatestEvent(deletedEvent);
            setNotifications((current) => [buildRealtimeNotification(deletedEvent), ...current].slice(0, 20));
            toast.info("A booking was removed from your dashboard.");
            return;
          }

          if (!payload.new) {
            return;
          }

          setBookings((current) => upsertBooking(current, payload.new as BookingRecord));

          const bookingStatus = String(payload.new.status || "");
          const paymentStatus = String(payload.new.payment_status || "");
          const serviceName = payload.new.service_name || "Repair request";
          const technicianName = payload.new.technician_name || "your technician";

          const event: LiveEvent =
            payload.eventType === "INSERT"
              ? {
                  type: "INSERT",
                  title: "New repair booked",
                  description: `${serviceName} has entered your live ecosystem with ${technicianName}.`,
                  status: bookingStatus,
                  bookingId: String(payload.new.id),
                  time: eventTime,
                }
              : {
                  type: "UPDATE",
                  title: bookingStatus || "Booking updated",
                  description:
                    paymentStatus.toLowerCase() === "paid"
                      ? `${serviceName} payment processed successfully.`
                      : `${serviceName} is now ${bookingStatus || "updated"}.`,
                  status: bookingStatus || paymentStatus,
                  bookingId: String(payload.new.id),
                  time: eventTime,
                };

          setLatestEvent(event);
          setNotifications((current) => [buildRealtimeNotification(event), ...current].slice(0, 20));

          if (bookingStatus === "Assigned") {
            toast.success("Technician accepted your repair request.");
          } else if (bookingStatus === "On The Way") {
            toast.success("Your technician is on the way.");
          } else if (bookingStatus === "Repairing") {
            toast.success("Repair is in progress.");
          } else if (bookingStatus === "Completed") {
            toast.success("Repair completed successfully.");
          } else if (paymentStatus === "Paid") {
            toast.success("Payment confirmed in realtime.");
          } else if (bookingStatus === "Rejected") {
            toast.error("A technician rejected this request. Renova will reassign.");
          }
        }
      )
      .subscribe((status: string) => {
        if (status === "SUBSCRIBED") {
          setIsConnected(true);
          setStreamError(null);
          return;
        }

        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          setIsConnected(false);
          setStreamError("Realtime stream is unstable. Retry to restore live updates.");
        }

        if (status === "CLOSED") {
          setIsConnected(false);
        }
      });

    const reviewChannel = supabase.channel(`customer-review-realtime-${user.id}`);
    // Supabase's realtime channel typings are narrower than the runtime API here.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (reviewChannel as any).on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "reviews",
        filter: `customer_id=eq.${user.id}`,
      },
      (payload: { eventType?: "INSERT" | "UPDATE" }) => {
        if (payload.eventType === "INSERT") {
          toast.success("Your review is now visible across the Renova ecosystem.");
        }
      }
    ).subscribe();

    return () => {
      void supabase.removeChannel(bookingChannel);
      void supabase.removeChannel(reviewChannel);
    };
  }, [user]);

  const activities = useMemo<DashboardActivity[]>(() => {
    if (!bookings.length) {
      return [
        {
          id: "empty-activity",
          title: "Your live activity feed is ready",
          desc: "Book a repair to start generating realtime ecosystem events.",
          time: "Now",
          icon: MessageSquare,
          color: "text-white/60",
          bg: "bg-white/5",
          border: "border-white/10",
        },
      ];
    }

    return bookings.slice(0, 8).map((booking) => {
      const settled = isSettled(booking);
      const status = String(booking.status || "").toLowerCase();

      return {
        id: String(booking.id),
        title: settled ? "Payment confirmed" : booking.status || "Live update",
        desc: `${booking.service_name} • ${booking.technician_name || "Technician assigned soon"}`,
        time: formatRelativeTime(booking.updated_at || booking.created_at || booking.booking_date),
        icon: settled ? CreditCard : status === "completed" ? CheckCircle : status === "repairing" ? Wrench : MessageSquare,
        color: settled ? "text-[#00FFA3]" : status === "repairing" ? "text-[#B8B2FF]" : "text-[#00F5FF]",
        bg: settled ? "bg-[#00FFA3]/10" : status === "repairing" ? "bg-[#5227FF]/10" : "bg-[#00F5FF]/10",
        border: settled ? "border-[#00FFA3]/30" : status === "repairing" ? "border-[#5227FF]/30" : "border-[#00F5FF]/30",
      };
    });
  }, [bookings]);

  const trackingBooking = useMemo(() => {
    return bookings.find((booking) => isActive(booking)) || bookings[0] || null;
  }, [bookings]);

  const unreadCount = useMemo(() => notifications.filter((notification) => notification.unread).length, [notifications]);

  const retrySync = useCallback(async () => {
    await hydrateBookings();
    toast.success("Realtime sync reconnected.");
  }, [hydrateBookings]);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications((current) =>
      current.map((notification) => (notification.id === id ? { ...notification, unread: false } : notification))
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((current) => current.map((notification) => ({ ...notification, unread: false })));
  }, []);

  const value = useMemo(
    () => ({
      syncVersion,
      lastSyncedAt,
      latestEvent,
      bookings,
      notifications,
      unreadCount,
      activities,
      trackingBooking,
      loadingBookings,
      streamError,
      isConnected,
      retrySync,
      markNotificationRead,
      markAllNotificationsRead,
    }),
    [
      syncVersion,
      lastSyncedAt,
      latestEvent,
      bookings,
      notifications,
      unreadCount,
      activities,
      trackingBooking,
      loadingBookings,
      streamError,
      isConnected,
      retrySync,
      markNotificationRead,
      markAllNotificationsRead,
    ]
  );

  return <CustomerRealtimeContext.Provider value={value}>{children}</CustomerRealtimeContext.Provider>;
}

export function useCustomerRealtime() {
  const context = useContext(CustomerRealtimeContext);

  if (!context) {
    return {
      syncVersion: 0,
      lastSyncedAt: "",
      latestEvent: null,
      bookings: [],
      notifications: [],
      unreadCount: 0,
      activities: [],
      trackingBooking: null,
      loadingBookings: false,
      streamError: null,
      isConnected: false,
      retrySync: async () => {},
      markNotificationRead: () => {},
      markAllNotificationsRead: () => {},
    };
  }

  return context;
}
