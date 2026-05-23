"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock3, Loader2, RotateCcw } from "lucide-react";
import type { PaymentStatus } from "./payment-types";

type BadgeSize = "sm" | "md";

interface PaymentStatusBadgeProps {
  status: PaymentStatus | string;
  size?: BadgeSize;
}

const STATUS_CONFIG: Record<string, { label: string; className: string; icon: typeof Clock3 }> = {
  Pending: { label: "Pending", className: "border-[#FFB020]/25 bg-[#FFB020]/10 text-[#FFB020]", icon: Clock3 },
  Processing: { label: "Processing", className: "border-[#00F5FF]/25 bg-[#00F5FF]/10 text-[#00F5FF]", icon: Loader2 },
  Paid: { label: "Paid", className: "border-[#00FFA3]/25 bg-[#00FFA3]/10 text-[#00FFA3]", icon: CheckCircle2 },
  Refunded: { label: "Refunded", className: "border-[#FF4D6D]/25 bg-[#FF4D6D]/10 text-[#FF8DA1]", icon: RotateCcw },
};

export default function PaymentStatusBadge({ status, size = "md" }: PaymentStatusBadgeProps) {
  const config = STATUS_CONFIG[String(status) in STATUS_CONFIG ? String(status) : "Pending"] ?? STATUS_CONFIG.Pending;
  const Icon = config.icon;

  return (
    <motion.span
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${config.className} inline-flex items-center gap-2 rounded-full border px-3 py-1 font-medium backdrop-blur-md ${
        size === "sm" ? "text-[11px]" : "text-xs"
      }`}
    >
      <Icon size={size === "sm" ? 12 : 14} className={status === "Processing" ? "animate-spin" : ""} />
      {config.label}
    </motion.span>
  );
}
