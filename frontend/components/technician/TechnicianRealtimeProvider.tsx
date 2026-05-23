"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import type { TechnicianJob, TechnicianNotification } from "@/components/technician/technician-utils";

type TechnicianRealtimeNotification = TechnicianNotification & {
  unread?: boolean;
  level?: "info" | "success" | "warning" | "critical";
};

type TechnicianRealtimeContextValue = {
  queueJobs: TechnicianJob[];
  activeJobs: TechnicianJob[];
  latestJob: TechnicianJob | null;
  notifications: TechnicianRealtimeNotification[];
  unreadCount: number;
  isAvailable: boolean;
  loading: boolean;
  streamError: string | null;
  isConnected: boolean;
  refresh: () => Promise<void>;
  setAvailability: (next: boolean) => Promise<boolean>;
  markNotificationRead: (id: string | number) => void;
  markAllNotificationsRead: () => void;
};

const ACTIVE_STATUSES = new Set(["Assigned", "On The Way", "Repairing"]);

const TechnicianRealtimeContext = createContext<TechnicianRealtimeContextValue | null>(null);

function normalizeStatus(status?: string) {
  return String(status || "").trim();
}

function isPending(job: TechnicianJob) {
  return normalizeStatus(job.status) === "Pending";
}

function isActive(job: TechnicianJob) {
  return ACTIVE_STATUSES.has(normalizeStatus(job.status));
}

function sortByNewest(left: TechnicianJob, right: TechnicianJob) {
  const leftStamp = new Date(String(left.last_updated_at || left.created_at || left.booking_date || "")).getTime();
  const rightStamp = new Date(String(right.last_updated_at || right.created_at || right.booking_date || "")).getTime();
  return rightStamp - leftStamp;
}

function buildNotification(job: TechnicianJob, level: TechnicianRealtimeNotification["level"] = "info") {
  const status = normalizeStatus(job.status);

  return {
    id: `booking-${job.id}-${String(job.last_updated_at || job.created_at || job.booking_date || Date.now())}`,
    title:
      status === "Pending"
        ? "New repair request"
        : status === "Assigned"
          ? "Repair assigned"
          : status === "On The Way"
            ? "Technician en route"
            : status === "Repairing"
              ? "Repair in progress"
              : status === "Completed"
                ? "Repair completed"
                : `Status updated to ${status || "updated"}`,
    desc: `${job.customer_name || "Customer"} • ${job.service_name || job.service_type || "Repair"}`,
    created_at: String(job.last_updated_at || job.created_at || job.booking_date || new Date().toISOString()),
    unread: true,
    level,
  } satisfies TechnicianRealtimeNotification;
}

export function TechnicianRealtimeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [queueJobs, setQueueJobs] = useState<TechnicianJob[]>([]);
  const [activeJobs, setActiveJobs] = useState<TechnicianJob[]>([]);
  const [latestJob, setLatestJob] = useState<TechnicianJob | null>(null);
  const [notifications, setNotifications] = useState<TechnicianRealtimeNotification[]>([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const loadSnapshot = useCallback(async () => {
    if (!user) {
      setQueueJobs([]);
      setActiveJobs([]);
      setNotifications([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setStreamError(null);

    const [queueResult, activeResult, profileResult, notificationsResult] = await Promise.all([
      supabase.from("bookings").select("*").eq("status", "Pending").order("created_at", { ascending: false }).limit(30),
      supabase
        .from("bookings")
        .select("*")
        .eq("technician_id", user.id)
        .in("status", ["Assigned", "On The Way", "Repairing"])
        .order("created_at", { ascending: false })
        .limit(30),
      supabase.from("profiles").select("is_available").eq("id", user.id).maybeSingle(),
      supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20),
    ]);

    if (queueResult.error || activeResult.error || profileResult.error || notificationsResult.error) {
      setStreamError("Tech stream could not sync. Retry to reconnect your operations center.");
      setLoading(false);
      return;
    }

    const nextQueue = ((queueResult.data || []) as TechnicianJob[]).sort(sortByNewest);
    const nextActive = ((activeResult.data || []) as TechnicianJob[]).sort(sortByNewest);
    const _allowedLevels = ["critical", "info", "success", "warning"] as const;
    const nextNotifications = ((notificationsResult.data || []) as TechnicianNotification[]).map((notification) => ({
      ...notification,
      unread: notification.unread ?? true,
      level: _allowedLevels.includes(String(notification.level) as any) ? (String(notification.level) as TechnicianRealtimeNotification["level"]) : "info",
    }));

    setQueueJobs(nextQueue);
    setActiveJobs(nextActive);
    setLatestJob(nextActive[0] || nextQueue[0] || null);
    setNotifications(nextNotifications as TechnicianRealtimeNotification[]);
    setIsAvailable(Boolean(profileResult.data?.is_available ?? true));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      void loadSnapshot();
    }, 0);

    return () => {
      window.clearTimeout(handle);
    };
  }, [loadSnapshot]);

  useEffect(() => {
    if (!user) return;

    // Supabase's realtime typings are narrower than the runtime API here.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bookingsChannel = supabase.channel(`technician-realtime-bookings-${user.id}`) as any;
    bookingsChannel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
        },
        (payload: { eventType?: "INSERT" | "UPDATE" | "DELETE"; new?: TechnicianJob; old?: TechnicianJob }) => {
          setIsConnected(true);
          setStreamError(null);

          const next = (payload.new || payload.old) as TechnicianJob | undefined;
          if (!next?.id) return;

          if (payload.eventType === "DELETE") {
            setQueueJobs((current) => current.filter((job) => String(job.id) !== String(next.id)));
            setActiveJobs((current) => current.filter((job) => String(job.id) !== String(next.id)));
            return;
          }

          setQueueJobs((current) => {
            const filtered = current.filter((job) => String(job.id) !== String(next.id));
            return isPending(next) ? [next, ...filtered].sort(sortByNewest) : filtered;
          });

          setActiveJobs((current) => {
            const filtered = current.filter((job) => String(job.id) !== String(next.id));
            return isActive(next) && String(next.technician_id || user.id) === user.id ? [next, ...filtered].sort(sortByNewest) : filtered;
          });

          setLatestJob(next);

          if (isPending(next)) {
            setNotifications((current) => [buildNotification(next, "warning"), ...current].slice(0, 20));
            toast.info("New repair request received.");
          } else if (normalizeStatus(next.status) === "Assigned") {
            setNotifications((current) => [buildNotification(next, "info"), ...current].slice(0, 20));
            toast.success("Booking assigned to your active jobs.");
          } else if (normalizeStatus(next.status) === "Completed") {
            setNotifications((current) => [buildNotification(next, "success"), ...current].slice(0, 20));
            toast.success("Repair completed and synced live.");
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
          setStreamError("Realtime technician stream is unstable. Retry to restore live operations.");
        }

        if (status === "CLOSED") {
          setIsConnected(false);
        }
      });

    // Supabase's realtime typings are narrower than the runtime API here.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reviewChannel = supabase.channel(`technician-realtime-reviews-${user.id}`) as any;
    reviewChannel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reviews",
        },
        (payload: { eventType?: "INSERT" | "UPDATE"; new?: { customer_name?: string; service_name?: string; rating?: number } }) => {
              if (payload.eventType !== "INSERT" || !payload.new) return;

              const review = payload.new;

              setNotifications((current) => ([
                {
                  id: `review-${Date.now()}`,
                  title: "New customer review",
                  desc: `${review.customer_name || "Customer"} rated ${review.service_name || "your service"} ${review.rating || 5} stars.`,
                  created_at: new Date().toISOString(),
                  unread: true,
                  level: "success",
                },
                ...current,
              ].slice(0, 20) as TechnicianRealtimeNotification[]));
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(bookingsChannel);
      void supabase.removeChannel(reviewChannel);
    };
  }, [user]);

  const refresh = useCallback(async () => {
    await loadSnapshot();
    toast.success("Technician workspace resynced.");
  }, [loadSnapshot]);

  const setAvailability = useCallback(async (next: boolean) => {
    if (!user) return false;

    const { error } = await supabase.from("profiles").update({ is_available: next }).eq("id", user.id);

    if (error) {
      toast.error("Could not update availability.");
      return false;
    }

    setIsAvailable(next);
    toast.success(next ? "🟢 You are online and receiving jobs" : "🔴 You are offline and the queue is paused");
    return true;
  }, [user]);

  const unreadCount = useMemo(() => notifications.filter((notification) => notification.unread).length, [notifications]);

  const markNotificationRead = useCallback((id: string | number) => {
    setNotifications((current) =>
      current.map((notification) =>
        String(notification.id) === String(id)
          ? { ...notification, unread: false }
          : notification
      )
    );
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications((current) => current.map((notification) => ({ ...notification, unread: false })));
  }, []);

  const value = useMemo(
    () => ({
      queueJobs,
      activeJobs,
      latestJob,
      notifications,
      unreadCount,
      isAvailable,
      loading,
      streamError,
      isConnected,
      refresh,
      setAvailability,
      markNotificationRead,
      markAllNotificationsRead,
    }),
    [
      queueJobs,
      activeJobs,
      latestJob,
      notifications,
      unreadCount,
      isAvailable,
      loading,
      streamError,
      isConnected,
      refresh,
      setAvailability,
      markNotificationRead,
      markAllNotificationsRead,
    ]
  );

  return <TechnicianRealtimeContext.Provider value={value}>{children}</TechnicianRealtimeContext.Provider>;
}

export function useTechnicianRealtime() {
  const context = useContext(TechnicianRealtimeContext);

  if (!context) {
    return {
      queueJobs: [],
      activeJobs: [],
      latestJob: null,
      notifications: [],
      unreadCount: 0,
      isAvailable: true,
      loading: false,
      streamError: null,
      isConnected: false,
      refresh: async () => {},
      setAvailability: async () => false,
      markNotificationRead: () => {},
      markAllNotificationsRead: () => {},
    } satisfies TechnicianRealtimeContextValue;
  }

  return context;
}