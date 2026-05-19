"use client";

import { useEffect, useMemo, useState } from "react";
import { IndianRupee, ArrowUpRight, CreditCard } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, Tooltip } from "recharts";

type BookingRecord = {
    booking_date: string;
    price: number | string;
    status: string;
    service_name?: string;
};

interface PaymentOverviewProps {
    bookings?: BookingRecord[];
}

export default function PaymentOverview({ bookings = [] }: PaymentOverviewProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const data = useMemo(() => {
        const monthly = new Map<string, number>();

        bookings.forEach((booking) => {
            const parsed = new Date(booking.booking_date);

            if (Number.isNaN(parsed.getTime())) {
                return;
            }

            const key = parsed.toLocaleDateString("en-US", { month: "short" });
            monthly.set(key, (monthly.get(key) || 0) + Number(booking.price || 0));
        });

        const ordered = Array.from(monthly.entries()).map(([name, total]) => ({ name, total }));
        return ordered.length > 0 ? ordered : [
            { name: "Jan", total: 120 },
            { name: "Feb", total: 210 },
            { name: "Mar", total: 180 },
        ];
    }, [bookings]);

    const totalSpent = useMemo(
        () => bookings.filter((booking) => booking.status === "Paid" || booking.status === "Completed").reduce((sum, booking) => sum + Number(booking.price || 0), 0),
        [bookings],
    );

    const pendingInvoice = useMemo(
        () => bookings.find((booking) => booking.status !== "Paid" && booking.status !== "Completed"),
        [bookings],
    );

    return (
        <div className="bg-white/5 rounded-3xl border border-white/10 p-6 backdrop-blur-md relative overflow-hidden group">
            <div className="absolute -right-20 -top-20 w-48 h-48 bg-[#00FFA3]/10 blur-[60px] rounded-full group-hover:bg-[#00FFA3]/20 transition-all" />
            
            <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                    <h3 className="text-white/60 font-medium mb-1">Total Spent</h3>
                    <div className="text-3xl font-bold text-white flex items-center gap-2">
                        ₹{totalSpent.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                        <span className="text-[#00FFA3] text-sm flex items-center bg-[#00FFA3]/10 px-2 py-1 rounded-full border border-[#00FFA3]/20">
                            <ArrowUpRight size={14} /> 12.5%
                        </span>
                    </div>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#00FFA3]/10 text-[#00FFA3] flex items-center justify-center border border-[#00FFA3]/30">
                    <IndianRupee size={24} />
                </div>
            </div>

            <div className="h-[120px] w-full relative z-10 -ml-4">
                {!mounted ? (
                    <div className="h-full w-full rounded-2xl border border-white/10 bg-white/5 animate-pulse" />
                ) : (
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={120}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00FFA3" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#00FFA3" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#050816', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                            itemStyle={{ color: '#00FFA3' }}
                        />
                        <Area type="monotone" dataKey="total" stroke="#00FFA3" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
                    </AreaChart>
                </ResponsiveContainer>
                )}
            </div>

            <div className="mt-6 space-y-3 relative z-10">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#5227FF]/20 text-[#5227FF] flex items-center justify-center">
                            <CreditCard size={14} />
                        </div>
                        <div>
                            <p className="text-sm text-white font-medium">Pending Invoice</p>
                            <p className="text-xs text-white/50">{pendingInvoice?.service_name || "No pending invoice"}</p>
                        </div>
                    </div>
                    <span className="text-white font-bold">₹{pendingInvoice ? Number(pendingInvoice.price || 0).toLocaleString("en-IN") : "0"}</span>
                </div>
            </div>
        </div>
    );
}
