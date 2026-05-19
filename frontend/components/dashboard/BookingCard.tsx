"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Smartphone, Laptop, RotateCcw, XCircle } from "lucide-react";

interface BookingCardProps {
    type: string;
    device: string;
    date: string;
    time: string;
    status: string;
    price: string;
    delay?: number;
    onReschedule?: () => void;
    onCancel?: () => void;
}

export default function BookingCard({ type, device, date, time, status, price, delay = 0, onReschedule, onCancel }: BookingCardProps) {
    const isEmergency = status === "Emergency";
    const isCompleted = status === "Completed";
    const isCancelled = status === "Cancelled";
    const isRefunded = status === "Refunded";
    const isManageable = !isCompleted && !isCancelled && !isRefunded;

    const statusStyles: Record<string, string> = {
        Upcoming: "bg-[#00F5FF]/10 text-[#00F5FF] border-[#00F5FF]/30",
        Completed: "bg-[#00FFA3]/10 text-[#00FFA3] border-[#00FFA3]/30",
        Emergency: "bg-[#FF4D6D]/10 text-[#FF4D6D] border-[#FF4D6D]/30",
        Cancelled: "bg-white/10 text-white/60 border-white/20",
        Refunded: "bg-[#00FFA3]/10 text-[#00FFA3] border-[#00FFA3]/30",
        Rescheduled: "bg-[#5227FF]/10 text-[#A78BFA] border-[#5227FF]/30",
        "Refund Initiated": "bg-[#FFB020]/10 text-[#FFB020] border-[#FFB020]/30",
    };

    const displayedStatus = isRefunded ? "Refunded" : status;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay }}
            whileHover={{ scale: 1.02 }}
            className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 overflow-hidden cursor-pointer backdrop-blur-sm"
        >
            <div className={`absolute left-0 top-0 w-1 h-full ${
                isEmergency ? "bg-[#FF4D6D] shadow-[0_0_10px_#FF4D6D]" : 
                isCompleted ? "bg-[#00FFA3]" : "bg-[#00F5FF]"
            }`} />

            <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isEmergency ? "bg-[#FF4D6D]/10 text-[#FF4D6D]" : "bg-white/10 text-white"
                    }`}>
                        {device.includes("Phone") ? <Smartphone size={24} /> : <Laptop size={24} />}
                    </div>
                    <div>
                        <h4 className="font-bold text-lg text-white">{type}</h4>
                        <p className="text-sm text-white/50">{device}</p>
                    </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
                    isEmergency ? statusStyles.Emergency :
                    statusStyles[displayedStatus] || statusStyles.Upcoming
                }`}>
                    {displayedStatus}
                </div>
            </div>

            {isRefunded && (
                <div className="relative z-10 mb-4 rounded-2xl border border-[#00FFA3]/20 bg-[#00FFA3]/10 px-4 py-3 text-sm text-[#00FFA3]">
                    Refund completed. The payment will reflect in your original method shortly.
                </div>
            )}

            {status === "Refund Initiated" && (
                <div className="relative z-10 mb-4 rounded-2xl border border-[#FFB020]/20 bg-[#FFB020]/10 px-4 py-3 text-sm text-[#FFB020]">
                    Refund initiated. The amount will be returned within 2-4 business days.
                </div>
            )}

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10 relative z-10">
                <div className="flex gap-4 text-sm text-white/60">
                    <div className="flex items-center gap-1.5">
                        <Calendar size={14} className={isEmergency ? "text-[#FF4D6D]" : ""} />
                        <span>{date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock size={14} className={isEmergency ? "text-[#FF4D6D]" : ""} />
                        <span>{time}</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="font-bold text-white">{price}</span>
                    {isManageable ? (
                        <ArrowRight size={14} className="text-white/50 group-hover:text-white transition-colors" />
                    ) : null}
                </div>
            </div>

            {isManageable && (onReschedule || onCancel) && (
                <div className="relative z-10 mt-5 flex flex-wrap gap-3">
                    {onReschedule && (
                        <button
                            type="button"
                            onClick={onReschedule}
                            className="inline-flex items-center gap-2 rounded-xl border border-[#00F5FF]/25 bg-[#00F5FF]/10 px-4 py-2 text-sm font-medium text-[#00F5FF] transition-colors hover:bg-[#00F5FF]/20"
                        >
                            <RotateCcw size={14} />
                            Reschedule
                        </button>
                    )}
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="inline-flex items-center gap-2 rounded-xl border border-[#FF4D6D]/25 bg-[#FF4D6D]/10 px-4 py-2 text-sm font-medium text-[#FF4D6D] transition-colors hover:bg-[#FF4D6D]/20"
                        >
                            <XCircle size={14} />
                            Cancel
                        </button>
                    )}
                </div>
            )}
        </motion.div>
    );
}
