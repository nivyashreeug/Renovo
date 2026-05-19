"use client";

import { motion } from "framer-motion";
import { Headset, MessageCircle, FileText, PhoneCall, ShieldQuestion } from "lucide-react";
import Link from "next/link";

const supportItems = [
  {
    title: "24/7 Live Support",
    description: "Talk to a human when the job is urgent.",
    icon: MessageCircle,
    href: "/contacts",
  },
  {
    title: "Warranty & Policy",
    description: "See cancellation, refund, and service coverage.",
    icon: ShieldQuestion,
    href: "/dashboard/customer/settings",
  },
  {
    title: "Receipts & Invoices",
    description: "Download payment history and service bills.",
    icon: FileText,
    href: "/dashboard/customer/payments",
  },
];

export default function SupportPanel() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md relative overflow-hidden">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#00F5FF]/10 blur-3xl" />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#00F5FF]/20 bg-[#00F5FF]/10 text-[#00F5FF]">
            <Headset size={18} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Customer Support</h3>
            <p className="text-sm text-white/55">Fast help, policy clarity, and direct escalation.</p>
          </div>
        </div>

        <div className="space-y-3">
          {supportItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <Link href={item.href} className="block rounded-2xl border border-white/10 bg-[#0b1020]/70 p-4 transition hover:border-white/20 hover:bg-white/10">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-[#00F5FF] border border-white/10">
                      <Icon size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="font-semibold text-white">{item.title}</h4>
                        <span className="text-white/35">
                          <PhoneCall size={14} />
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-white/60">{item.description}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
