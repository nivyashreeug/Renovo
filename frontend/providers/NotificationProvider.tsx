"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { useAuth } from "./AuthProvider";
import { subscribeToBookingsByCustomer, subscribeToBookingsByTechnician } from "@/lib/realtime";

type NotificationItem = {
  id: string;
  title: string;
  body?: string;
  created_at: string;
  read?: boolean;
};

type RealtimeNotificationPayload = {
  eventType?: string;
  event?: string;
  type?: string;
  new?: unknown;
  [key: string]: unknown;
};

function toRealtimePayload(payload: unknown): RealtimeNotificationPayload {
  if (typeof payload === "object" && payload !== null) {
    return payload as RealtimeNotificationPayload;
  }

  return {};
}

const NotificationContext = createContext<{
  notifications: NotificationItem[];
  unreadCount: number;
  push: (n: Omit<NotificationItem, "id" | "created_at">) => void;
  markAllRead: () => void;
} | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const subRefs = useRef<Array<() => Promise<void>>>([]);

  useEffect(() => {
    if (!user) return;

    const pushLocal = (n: Partial<NotificationItem>) => {
      setNotifications((prev) => [
        { id: String(Date.now()) + Math.random().toString(36).slice(2, 8), title: n.title || "", body: n.body, created_at: new Date().toISOString(), read: false },
        ...prev.slice(0, 99),
      ]);
    };

    // Subscribe to bookings where the user is the customer
    const unsubCustomer = subscribeToBookingsByCustomer(user.id, (payload) => {
      const realtimePayload = toRealtimePayload(payload);
      const ev = realtimePayload.eventType ?? realtimePayload.event ?? realtimePayload.type ?? "change";
      pushLocal({ title: `Booking update: ${ev}`, body: JSON.stringify(realtimePayload.new ?? realtimePayload) });
    });

    // Subscribe to bookings where the user is the technician
    const unsubTechnician = subscribeToBookingsByTechnician(user.id, (payload) => {
      const realtimePayload = toRealtimePayload(payload);
      const ev = realtimePayload.eventType ?? realtimePayload.event ?? realtimePayload.type ?? "change";
      pushLocal({ title: `Incoming booking: ${ev}`, body: JSON.stringify(realtimePayload.new ?? realtimePayload) });
    });

    subRefs.current = [unsubCustomer, unsubTechnician];

    return () => {
      subRefs.current.forEach((fn) => {
        try { fn(); } catch (e) {}
      });
      subRefs.current = [];
    };
  }, [user]);

  const push = (n: Omit<NotificationItem, "id" | "created_at">) => {
    setNotifications((prev) => [
      { id: String(Date.now()) + Math.random().toString(36).slice(2, 8), title: n.title, body: n.body, created_at: new Date().toISOString(), read: false },
      ...prev,
    ]);
  };

  const markAllRead = () => setNotifications((prev) => prev.map((p) => ({ ...p, read: true })));

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, push, markAllRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used inside NotificationProvider");
  return ctx;
};
