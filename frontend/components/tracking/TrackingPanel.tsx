"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation2, Clock, CheckCircle2, Truck } from "lucide-react";
import { useCustomerRealtime } from "@/components/dashboard/CustomerRealtimeProvider";
import { useCallback } from "react";

function ErrorBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-lg border border-rose-400/20 bg-rose-900/10 p-3 mb-4 flex items-center justify-between">
      <div className="text-sm text-rose-200">{message}</div>
      <button onClick={onRetry} className="text-xs px-3 py-1 rounded bg-rose-500/20 text-rose-200">Retry</button>
    </div>
  )
}

function TrackingPanel() {
  const { trackingBooking, loadingBookings, streamError, retrySync } = useCustomerRealtime();

  const eta = useMemo(() => {
    if (!trackingBooking) return null;
    const val = Number(trackingBooking.eta_minutes || 0);
    return Number.isFinite(val) && val > 0 ? Math.round(val) : null;
  }, [trackingBooking]);

  const status = String(trackingBooking?.status || "Pending");

  return (
    <div className="max-w-4xl w-full mx-auto">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-[0_0_60px_rgba(0,245,255,0.06)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-white">Live Technician Tracking</h3>
            <p className="text-sm text-white/55 mt-1">Realtime location, ETA and repair progress</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-white/60">Status</div>
            <div className="text-lg font-bold text-[#00F5FF]">{status}</div>
          </div>
        </div>

        {streamError ? (
          <ErrorBanner message={streamError} onRetry={() => { retrySync(); }} />
        ) : loadingBookings ? (
          <div className="h-64 flex items-center justify-center text-white/55">Loading tracking...</div>
        ) : !trackingBooking ? (
          <div className="h-64 flex items-center justify-center text-white/55">No active repair to track yet.</div>
        ) : (
          <div>
            <div className="relative h-60 rounded-[1.25rem] border border-white/8 bg-[radial-gradient(circle_at_center,_rgba(0,245,255,0.06),_rgba(5,8,22,0.45))] overflow-hidden mb-4">
              <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

              <motion.div animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }} transition={{ duration: 2.2, repeat: Infinity }} className="absolute left-1/3 top-1/3 w-4 h-4 bg-[#00F5FF] rounded-full shadow-[0_0_30px_rgba(0,245,255,0.5)]" />

              <motion.div animate={{ scale: [0.9, 1, 0.9] }} transition={{ duration: 2.5, repeat: Infinity }} className="absolute right-1/4 bottom-1/4 w-5 h-5 border-2 border-[#5227FF] rounded-full shadow-[0_0_18px_rgba(82,39,255,0.32)]" />

              <motion.svg className="absolute inset-0" width="100%" height="100%" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="custTrack" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00F5FF" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#5227FF" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                <motion.line x1="30%" y1="30%" x2="70%" y2="70%" stroke="url(#custTrack)" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, repeat: Infinity }} />
              </motion.svg>

              <div className="absolute bottom-3 left-3 right-3 p-3 bg-gradient-to-t from-[#050816] via-[#050816]/80 to-transparent rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-white flex items-center gap-2"><MapPin size={14} className="text-[#00F5FF]" /> {String(trackingBooking.address || "Unknown location")}</div>
                    <div className="text-xs text-white/55 mt-1 flex items-center gap-2"><Clock size={12} /> ETA: {eta ? `${eta} min` : "Estimating..."}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity }}><Navigation2 className="w-5 h-5 text-[#00F5FF]" /></motion.div>
                    <div className="text-xs text-white/50">Tech: <span className="text-white font-semibold">{String(trackingBooking.technician_name || "---")}</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[{
                key: 'assigned', label: 'Assigned', done: ['Assigned','On The Way','Repairing','Completed'].includes(status)
              },{
                key: 'onway', label: 'On The Way', done: ['On The Way','Repairing','Completed'].includes(status)
              },{
                key: 'repairing', label: 'Repairing', done: ['Repairing','Completed'].includes(status)
              }].map((s, i) => (
                <motion.div key={s.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className={`p-3 rounded-xl border ${s.done ? 'border-[#00FFA3]/30 bg-[#00FFA3]/10' : 'border-white/10 bg-white/5'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${s.done ? 'bg-[#00FFA3]/10 text-[#00FFA3]' : 'bg-white/5 text-white/60'}`}>
                      {s.key === 'onway' ? <Truck size={16} /> : <CheckCircle2 size={16} />}
                    </div>
                    <div>
                      <div className={`text-sm ${s.done ? 'text-white font-semibold' : 'text-white/60'}`}>{s.label}</div>
                      <div className="text-xs text-white/50">{s.done ? 'Completed' : 'Pending'}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default React.memo(TrackingPanel)
