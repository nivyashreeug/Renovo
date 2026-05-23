import { supabase } from "@/lib/supabase";

type RealtimeCallback<T = unknown> = (payload: T) => void;

export function subscribeToBookingsByTechnician(
  technicianId: string,
  cb: RealtimeCallback
) {
  const channel = supabase
    .channel(`bookings:technician:${technicianId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "bookings", filter: `technician_id=eq.${technicianId}` },
      (payload) => cb(payload)
    )
    .subscribe();

  return async () => {
    try {
      await channel.unsubscribe();
    } catch {
      // swallow unsubscribe errors
    }
  };
}

export function subscribeToBookingsByCustomer(
  customerId: string,
  cb: RealtimeCallback
) {
  const channel = supabase
    .channel(`bookings:customer:${customerId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "bookings", filter: `customer_id=eq.${customerId}` },
      (payload) => cb(payload)
    )
    .subscribe();

  return async () => {
    try {
      await channel.unsubscribe();
    } catch {
    }
  };
}

// Generic helper to subscribe to a table with a filter (safe wrapper)
export function subscribeToTable(
  table: string,
  filter: string | undefined,
  cb: RealtimeCallback
) {
  const name = `${table}:${filter ?? "all"}:${Date.now()}`;
  const opts: { event: "*"; schema: "public"; table: string; filter?: string } = {
    event: "*",
    schema: "public",
    table,
  };
  if (filter) opts.filter = filter;

  const channel = supabase.channel(name).on("postgres_changes", opts, (p) => cb(p)).subscribe();

  return async () => {
    try {
      await channel.unsubscribe();
    } catch {
    }
  };
}
