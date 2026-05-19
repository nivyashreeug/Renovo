"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { toast } from "sonner";

type CustomerRealtimeContextValue = {
  syncVersion: number;
  lastSyncedAt: string;
};

const CustomerRealtimeContext = createContext<CustomerRealtimeContextValue | null>(null);

export function CustomerRealtimeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [syncVersion, setSyncVersion] = useState(0);
  const [lastSyncedAt, setLastSyncedAt] = useState("");

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`customer-dashboard-realtime-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
          filter: `customer_id=eq.${user.id}`,
        },
        (payload: { eventType?: string }) => {
          setSyncVersion((current) => current + 1);
          setLastSyncedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));

          if (payload.eventType === "INSERT") {
            toast.success("New booking activity synced.");
          } else if (payload.eventType === "UPDATE") {
            toast.info("Your booking status updated.");
          } else if (payload.eventType === "DELETE") {
            toast.info("A booking was removed from your dashboard.");
          }
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [user]);

  const value = useMemo(
    () => ({
      syncVersion,
      lastSyncedAt,
    }),
    [syncVersion, lastSyncedAt],
  );

  return <CustomerRealtimeContext.Provider value={value}>{children}</CustomerRealtimeContext.Provider>;
}

export function useCustomerRealtime() {
  const context = useContext(CustomerRealtimeContext);

  if (!context) {
    return {
      syncVersion: 0,
      lastSyncedAt: "",
    };
  }

  return context;
}