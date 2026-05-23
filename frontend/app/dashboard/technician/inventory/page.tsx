"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Package, PlusCircle, RefreshCw, ShieldAlert, Sparkles, Wrench } from "lucide-react";
import { toast } from "sonner";

type StockItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  threshold: number;
  status: "healthy" | "low" | "critical";
};

export default function TechnicianInventoryPage() {
  const [items, setItems] = useState<StockItem[]>([
    { id: "1", name: "Pro Torque Driver", category: "Tools", quantity: 8, threshold: 3, status: "healthy" },
    { id: "2", name: "Flex Display Module", category: "Spare Parts", quantity: 2, threshold: 5, status: "critical" },
    { id: "3", name: "USB-C Port Kit", category: "Parts", quantity: 5, threshold: 4, status: "low" },
    { id: "4", name: "Thermal Paste", category: "Consumables", quantity: 12, threshold: 4, status: "healthy" },
    { id: "5", name: "Battery Seal Pack", category: "Consumables", quantity: 3, threshold: 6, status: "critical" },
    { id: "6", name: "Precision Tweezers", category: "Tools", quantity: 9, threshold: 2, status: "healthy" },
  ]);

  const stats = useMemo(
    () => [
      { label: "Healthy", value: items.filter((item) => item.status === "healthy").length, tone: "from-[#00FFA3] to-[#00F5FF]" },
      { label: "Low Stock", value: items.filter((item) => item.status === "low").length, tone: "from-[#FFB020] to-[#FF4D6D]" },
      { label: "Critical", value: items.filter((item) => item.status === "critical").length, tone: "from-[#FF4D6D] to-[#FFB020]" },
      { label: "Items", value: items.length, tone: "from-[#5227FF] to-[#00F5FF]" },
    ],
    [items]
  );

  const restock = (id: string) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 5, status: item.quantity + 5 > item.threshold ? "healthy" : item.status } : item
      )
    );
    toast.success("Restock request sent");
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.03] p-6 backdrop-blur-xl shadow-[0_0_60px_rgba(82,39,255,0.08)]"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00F5FF]/20 bg-[#00F5FF]/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-[#00F5FF]">
              <Sparkles className="h-3.5 w-3.5" />
              Inventory Management
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-white md:text-5xl">
              Tools, spare parts, and equipment with live stock alerts.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/65 md:text-base">
              Keep the repair line moving with a realtime view of what is available, what needs restocking, and what is
              in danger of blocking jobs.
            </p>
          </div>

          <button
            type="button"
            onClick={() => toast.message("Inventory sync refreshed")}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 transition hover:border-[#00F5FF]/30 hover:text-white"
          >
            <RefreshCw className="h-4 w-4" />
            Sync Inventory
          </button>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-[#050816]/60 p-4">
              <div className="text-[10px] uppercase tracking-[0.25em] text-white/45">{item.label}</div>
              <div className="mt-2 text-2xl font-bold text-white">{item.value}</div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className={`h-full rounded-full bg-gradient-to-r ${item.tone}`} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const isCritical = item.status === "critical";
          const isLow = item.status === "low";
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-[1.75rem] border p-5 backdrop-blur-xl ${
                isCritical
                  ? "border-[#FF4D6D]/25 bg-[#FF4D6D]/10"
                  : isLow
                    ? "border-[#FFB020]/25 bg-[#FFB020]/10"
                    : "border-white/10 bg-white/5"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.25em] text-white/40">{item.category}</div>
                  <h3 className="mt-2 text-lg font-semibold text-white">{item.name}</h3>
                </div>
                <div className={`rounded-xl p-3 ${isCritical ? "bg-[#FF4D6D]/20 text-[#FF4D6D]" : isLow ? "bg-[#FFB020]/20 text-[#FFB020]" : "bg-[#00FFA3]/20 text-[#00FFA3]"}`}>
                  <Package className="h-4 w-4" />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl border border-white/10 bg-[#050816]/60 p-3">
                  <div className="text-white/45">Available</div>
                  <div className="mt-1 text-xl font-bold text-white">{item.quantity}</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-[#050816]/60 p-3">
                  <div className="text-white/45">Threshold</div>
                  <div className="mt-1 text-xl font-bold text-white">{item.threshold}</div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${isCritical ? "border-[#FF4D6D]/30 bg-[#FF4D6D]/10 text-[#FF8DA1]" : isLow ? "border-[#FFB020]/30 bg-[#FFB020]/10 text-[#FFB020]" : "border-[#00FFA3]/30 bg-[#00FFA3]/10 text-[#00FFA3]"}`}>
                  <ShieldAlert className="h-3.5 w-3.5" />
                  {item.status}
                </div>
                <button
                  type="button"
                  onClick={() => restock(item.id)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white/80 transition hover:border-[#00F5FF]/30 hover:text-white"
                >
                  <PlusCircle className="h-4 w-4" />
                  Restock
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-white/40">Inventory Intelligence</div>
            <div className="mt-1 text-xl font-semibold text-white">Proactive stock protection</div>
          </div>
          <Wrench className="h-5 w-5 text-[#00F5FF]" />
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/65">
          Low-stock parts are highlighted before they block a repair. Keep emergency components at the top of the
          queue and let technicians trigger restock with one tap.
        </p>
      </div>
    </div>
  );
}
