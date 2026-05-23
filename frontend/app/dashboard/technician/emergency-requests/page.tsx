"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ArrowRight, BellRing, ShieldAlert, TriangleAlert, Zap } from "lucide-react";
import { toast } from "sonner";

type EmergencyRequest = {
  id: string;
  customer: string;
  service: string;
  address: string;
  eta: string;
  severity: "critical" | "high";
};

export default function TechnicianEmergencyRequestsPage() {
  const [requests, setRequests] = useState<EmergencyRequest[]>([
    { id: "1", customer: "Aanya", service: "Phone board repair", address: "Cyber Tower, Sector 18", eta: "8 min", severity: "critical" },
    { id: "2", customer: "Rohit", service: "AC compressor failure", address: "Orion Residency", eta: "14 min", severity: "high" },
    { id: "3", customer: "Priya", service: "Laptop overheating", address: "Neo District", eta: "21 min", severity: "critical" },
  ]);

  const criticalCount = useMemo(() => requests.filter((request) => request.severity === "critical").length, [requests]);

  const dispatch = (id: string) => {
    setRequests((current) => current.filter((request) => request.id !== id));
    toast.success("Emergency dispatch activated");
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[2rem] border border-[#FF4D6D]/20 bg-gradient-to-br from-[#FF4D6D]/15 to-[#050816]/40 p-6 backdrop-blur-xl shadow-[0_0_60px_rgba(255,77,109,0.15)]"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FF4D6D]/20 bg-[#FF4D6D]/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-[#FF8DA1]">
              <ShieldAlert className="h-3.5 w-3.5" />
              Emergency Priority Queue
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-white md:text-5xl">
              High-intensity bookings that need immediate technician attention.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65 md:text-base">
              Red neon alerts, dispatch-ready actions, and a realtime queue for the fastest possible response when a
              repair becomes urgent.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-right">
            <div className="text-xs uppercase tracking-[0.25em] text-white/45">Critical</div>
            <div className="mt-2 text-3xl font-black text-white">{criticalCount}</div>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="popLayout">
        <div className="grid gap-4 xl:grid-cols-3">
          {requests.map((request, index) => (
            <motion.div
              key={request.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ delay: index * 0.06 }}
              className={`rounded-[1.75rem] border p-5 backdrop-blur-xl ${
                request.severity === "critical"
                  ? "border-[#FF4D6D]/25 bg-[#FF4D6D]/10"
                  : "border-[#FFB020]/25 bg-[#FFB020]/10"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.25em] text-white/40">{request.severity}</div>
                  <h3 className="mt-2 text-lg font-semibold text-white">{request.customer}</h3>
                  <p className="mt-1 text-sm text-white/70">{request.service}</p>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="rounded-xl bg-[#FF4D6D]/20 p-3 text-[#FF4D6D]"
                >
                  <AlertTriangle className="h-4 w-4" />
                </motion.div>
              </div>

              <div className="mt-4 grid gap-3 text-sm text-white/75">
                <div className="rounded-2xl border border-white/10 bg-[#050816]/60 p-3">
                  <div className="text-white/45">Address</div>
                  <div className="mt-1">{request.address}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#050816]/60 p-3">
                  <div className="text-white/45">ETA</div>
                  <div className="mt-1">{request.eta}</div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => dispatch(request.id)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-[#FF4D6D]/30 bg-[#FF4D6D]/15 px-4 py-3 text-sm font-semibold text-[#FF8DA1] transition hover:bg-[#FF4D6D]/20"
                >
                  <Zap className="h-4 w-4" />
                  Dispatch
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/70 transition hover:border-[#FFB020]/30 hover:text-white"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-white/40">Realtime Alerting</div>
            <div className="mt-1 text-xl font-semibold text-white">Emergency routing stays visible everywhere</div>
          </div>
          <BellRing className="h-5 w-5 text-[#FF4D6D]" />
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/65">
          This panel is designed to feel intense and immediate. Critical requests can be dispatched within one click,
          while the queue updates in realtime for the rest of the team.
        </p>
      </div>
    </div>
  );
}
