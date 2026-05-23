"use client";

import { useMemo } from "react";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import { Cell, Pie, PieChart, ResponsiveContainer, LineChart, Line, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { ArrowUpRight, Banknote, CalendarClock, CircleDollarSign, PieChart as PieChartIcon } from "lucide-react";
import type { PaymentRecord } from "./payment-types";

interface PaymentAnalyticsProps {
  records: PaymentRecord[];
}

export default function PaymentAnalytics({ records }: PaymentAnalyticsProps) {
  const summary = useMemo(() => {
    const completed = records.filter((record) => String(record.paymentStatus) === "Paid");
    const pending = records.filter((record) => String(record.paymentStatus) === "Pending" || String(record.paymentStatus) === "Processing");
    const refunded = records.filter((record) => String(record.paymentStatus) === "Refunded");

    const totalSpent = completed.reduce((sum, record) => sum + record.total, 0);
    const pendingAmount = pending.reduce((sum, record) => sum + record.total, 0);
    const refundedAmount = refunded.reduce((sum, record) => sum + record.total, 0);

    const months = Array.from({ length: 6 }, (_, index) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - index));
      return date;
    });

    const monthData = months.map((date) => {
      const monthIndex = date.getMonth();
      const year = date.getFullYear();
      const label = date.toLocaleDateString("en-US", { month: "short" });

      const amount = completed.reduce((sum, record) => {
        const paymentDate = new Date(record.paymentDate || record.bookingDate);
        if (paymentDate.getMonth() === monthIndex && paymentDate.getFullYear() === year) {
          return sum + record.total;
        }
        return sum;
      }, 0);

      return { label, amount };
    });

    const pieData = [
      { name: "Paid", value: completed.length, color: "#00FFA3" },
      { name: "Pending", value: pending.length, color: "#FFB020" },
      { name: "Refunded", value: refunded.length, color: "#FF4D6D" },
    ].filter((entry) => entry.value > 0);

    return {
      totalSpent,
      pendingAmount,
      refundedAmount,
      completedCount: completed.length,
      pendingCount: pending.length,
      activeInvoices: pending.length,
      monthlySeries: monthData,
      pieData,
      settledRatio: records.length === 0 ? 0 : Math.round((completed.length / records.length) * 100),
    };
  }, [records]);

  return (
    <section className="overflow-hidden rounded-[34px] border border-white/10 bg-white/5 p-5 backdrop-blur-2xl sm:p-6 lg:p-7">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-6 xl:w-[41%]">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">Fintech analytics</p>
            <h2 className="mt-2 text-3xl font-semibold text-white">Payment Intelligence</h2>
            <p className="mt-2 max-w-2xl text-sm text-white/60">A cinematic billing cockpit with realtime money movement, invoice health, and repair spend tracking.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <MetricCard icon={CircleDollarSign} label="Total spent" value={summary.totalSpent} accent="text-[#00FFA3]" />
            <MetricCard icon={Banknote} label="Pending invoices" value={summary.pendingAmount} accent="text-[#FFB020]" />
            <MetricCard icon={ArrowUpRight} label="Completed" value={summary.completedCount} countOnly />
            <MetricCard icon={CalendarClock} label="Active invoices" value={summary.activeInvoices} countOnly />
          </div>

          <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-white/45">Settlement ratio</p>
                <div className="mt-2 text-3xl font-semibold text-white"><CountUp end={summary.settledRatio} duration={1.3} />%</div>
              </div>
              <div className="relative h-24 w-24 rounded-full border border-white/10 bg-white/5 p-2">
                <div
                  className="flex h-full w-full items-center justify-center rounded-full"
                  style={{ background: `conic-gradient(#00FFA3 0 ${summary.settledRatio}%, rgba(255,255,255,0.1) ${summary.settledRatio}% 100%)` }}
                >
                  <div className="flex h-[72%] w-[72%] items-center justify-center rounded-full border border-white/10 bg-[#08111f] text-sm text-white/80">
                    Paid
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <motion.div initial={{ width: 0 }} animate={{ width: `${summary.settledRatio}%` }} transition={{ duration: 1.1, ease: "easeOut" }} className="h-full rounded-full bg-linear-to-r from-[#00F5FF] via-[#00FFA3] to-[#B8F3FF]" />
            </div>
          </div>
        </div>

        <div className="grid gap-4 xl:w-[59%] xl:grid-cols-[1.35fr_0.95fr]">
          <div className="rounded-[28px] border border-white/10 bg-[#07111d]/90 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.28em] text-white/45">Monthly spending</div>
                <div className="mt-1 text-lg font-semibold text-white">Repair outflow</div>
              </div>
              <PieChartIcon size={18} className="text-[#00F5FF]" />
            </div>
            <div className="h-[290px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={summary.monthlySeries}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: "rgba(255,255,255,0.55)", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 12 }} axisLine={false} tickLine={false} width={36} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#08111f",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 16,
                      color: "#fff",
                    }}
                    formatter={(value) => {
                      const amount = typeof value === "number" ? value : Number(value);

                      if (!Number.isFinite(amount)) {
                        return ["", "Spending"] as const;
                      }

                      return [`₹${amount.toLocaleString("en-IN")}`, "Spending"] as const;
                    }}
                  />
                  <Line type="monotone" dataKey="amount" stroke="#00F5FF" strokeWidth={3} dot={{ r: 4, fill: "#00FFA3", stroke: "#00FFA3" }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#07111d]/90 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.28em] text-white/45">Payment mix</div>
                <div className="mt-1 text-lg font-semibold text-white">Invoice status</div>
              </div>
              <PieChartIcon size={18} className="text-[#00FFA3]" />
            </div>
            <div className="h-[198px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={summary.pieData} dataKey="value" nameKey="name" innerRadius={56} outerRadius={86} paddingAngle={4}>
                    {summary.pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#08111f",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 16,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 space-y-2">
              {summary.pieData.map((entry) => (
                <div key={entry.name} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-3 py-2 text-sm text-white/70">
                  <span>{entry.name}</span>
                  <span className="font-medium" style={{ color: entry.color }}>{entry.value}</span>
                </div>
              ))}
              {summary.refundedAmount > 0 && (
                <div className="rounded-2xl border border-[#FF4D6D]/20 bg-[#FF4D6D]/10 px-3 py-2 text-sm text-[#FF8DA1]">Refunded total: ₹{summary.refundedAmount.toLocaleString("en-IN")}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricCard({ icon: Icon, label, value, accent, countOnly = false }: { icon: typeof Banknote; label: string; value: number; accent?: string; countOnly?: boolean }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="rounded-[24px] border border-white/10 bg-black/20 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-[0.24em] text-white/45">{label}</div>
          <div className={`mt-2 text-2xl font-semibold ${accent || "text-white"}`}>
            {countOnly ? <CountUp end={value} duration={1.1} /> : `₹${value.toLocaleString("en-IN")}`}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-[#00F5FF]">
          <Icon size={18} />
        </div>
      </div>
    </motion.div>
  );
}
