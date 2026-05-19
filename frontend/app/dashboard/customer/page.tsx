"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

import { motion } from "framer-motion";
import { toast } from "sonner";

import { useAuth } from "@/providers/AuthProvider";
import { useCustomerRealtime } from "@/components/dashboard/CustomerRealtimeProvider";

import StatsCard from "@/components/dashboard/StatsCard";
import TrackingCard from "@/components/dashboard/TrackingCard";
import BookingCard from "@/components/dashboard/BookingCard";
import ActivityTimeline from "@/components/dashboard/ActivityTimeline";
import NotificationPanel from "@/components/dashboard/NotificationPanel";
import QuickActions from "@/components/dashboard/QuickActions";
import PaymentOverview from "@/components/dashboard/PaymentOverview";
import ProfileCard from "@/components/dashboard/ProfileCard";
import SupportPanel from "@/components/dashboard/SupportPanel";

import {
    Wrench,
    CheckCircle,
    CreditCard,
    MapPin,
    CalendarDays,
    Clock3,
    AlertTriangle,
    RotateCcw,
    XCircle,
    BadgeInfo,
    Car,
    ShieldAlert,
    MessageSquare,
} from "lucide-react";
import { useMemo } from "react";

type BookingActionKind = "cancel" | "reschedule" | null;

type BookingRecord = {
    id: string | number;
    service_name: string;
    technician_name?: string | null;
    booking_date: string;
    booking_time: string;
    price: string | number;
    status: string;
    refund_status?: string;
    refund_amount?: number;
    refund_note?: string;
    rescheduled_at?: string;
    [key: string]: unknown;
};

type DashboardNotification = {
    id: string;
    title: string;
    desc: string;
    time: string;
    icon: typeof Car | typeof CheckCircle | typeof ShieldAlert;
    color: string;
    bg: string;
    unread: boolean;
};

type DashboardActivity = {
    id: string;
    title: string;
    desc: string;
    time: string;
    icon: typeof MessageSquare | typeof CreditCard | typeof CheckCircle | typeof Wrench;
    color: string;
    bg: string;
    border: string;
};

const COMPLETED_STATUSES = new Set(["Completed"]);
const CANCELED_STATUSES = new Set(["Cancelled", "Refunded"]);

function isCompletedBooking(status: string) {
    return COMPLETED_STATUSES.has(status);
}

function isCanceledBooking(status: string) {
    return CANCELED_STATUSES.has(status);
}

function isActiveBooking(status: string) {
    return !isCompletedBooking(status) && !isCanceledBooking(status);
}

function formatBookingDate(value: string) {
    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
        return value;
    }

    return parsed.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function getRescheduleDefaults(booking: BookingRecord) {
    const parsedDate = new Date(booking?.booking_date);
    const dateValue = Number.isNaN(parsedDate.getTime())
        ? ""
        : parsedDate.toISOString().slice(0, 10);

    return {
        date: dateValue,
        time: booking?.booking_time || "",
    };
}

function formatRelativeTime(value: string) {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return "Recently";

    const diffMinutes = Math.max(1, Math.floor((Date.now() - parsed.getTime()) / 60000));

    if (diffMinutes < 60) {
        return `${diffMinutes}m ago`;
    }

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) {
        return `${diffHours}h ago`;
    }

    return `${Math.floor(diffHours / 24)}d ago`;
}

export default function CustomerDashboard() {

    const router = useRouter();
    const { syncVersion, lastSyncedAt: sharedLastSyncedAt } = useCustomerRealtime();

    const {
        user,
        profile,
        loading,
    } = useAuth();
    console.log(user?.id);

    // BOOKINGS STATE
    const [bookings, setBookings] = useState<BookingRecord[]>([]);
    const [lastSyncedAt, setLastSyncedAt] = useState<string>("");
    const [bookingAction, setBookingAction] = useState<{
        open: boolean;
        kind: BookingActionKind;
        booking: BookingRecord | null;
        rescheduleDate: string;
        rescheduleTime: string;
    }>({
        open: false,
        kind: null,
        booking: null,
        rescheduleDate: "",
        rescheduleTime: "",
    });

    // PROTECT ROUTE
    useEffect(() => {

        if (!loading && !user) {
            router.push("/login");
        }

    }, [loading, user, router]);

    // FETCH BOOKINGS
    useEffect(() => {

        const fetchBookings = async () => {

            if (!user) return;

            const { data, error } =
                await supabase
                    .from("bookings")
                    .select("*")
                    .eq("customer_id", user.id)
                    .order("created_at", {
                        ascending: false,
                    });

            if (error) {

                console.error(
                    "Error fetching bookings:",
                    error.message
                );

                return;
            }

            setBookings(data || []);
            setLastSyncedAt(sharedLastSyncedAt || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
        };

        void fetchBookings();

    }, [user, syncVersion, sharedLastSyncedAt]);

    const totalSpent = useMemo(() => {
        return bookings
            .filter((booking) => isCompletedBooking(booking.status) || booking.status === "Paid")
            .reduce((sum, booking) => sum + Number(booking.price || 0), 0);
    }, [bookings]);

    const pendingTotal = useMemo(() => {
        return bookings
            .filter((booking) => isActiveBooking(booking.status))
            .reduce((sum, booking) => sum + Number(booking.price || 0), 0);
    }, [bookings]);

    const notifications = useMemo<DashboardNotification[]>(() => {
        if (bookings.length === 0) {
            return [
                {
                    id: "welcome",
                    title: "Welcome to your dashboard",
                    desc: "Your repairs, payments, and support will appear here in realtime.",
                    time: "Now",
                    icon: MessageSquare,
                    color: "text-[#00F5FF]",
                    bg: "bg-[#00F5FF]/10",
                    unread: true,
                },
            ];
        }

        return bookings.slice(0, 3).map((booking) => {
            const isPaid = booking.status === "Paid" || booking.status === "Completed";
            const isRefunded = booking.status === "Refunded" || booking.status === "Refund Initiated";
            const isCancelled = booking.status === "Cancelled";

            return {
                id: String(booking.id),
                title: isPaid
                    ? "Payment confirmed"
                    : isCancelled
                        ? "Booking cancelled"
                        : isRefunded
                            ? "Refund in progress"
                            : "Booking update",
                desc: `${booking.service_name} • ${booking.technician_name || "Technician assigned soon"}`,
                time: formatRelativeTime(booking.booking_date),
                icon: isCancelled ? ShieldAlert : isPaid ? CheckCircle : Car,
                color: isCancelled ? "text-[#FF4D6D]" : isPaid ? "text-[#00FFA3]" : "text-[#00F5FF]",
                bg: isCancelled ? "bg-[#FF4D6D]/10" : isPaid ? "bg-[#00FFA3]/10" : "bg-[#00F5FF]/10",
                unread: !isPaid,
            };
        });
    }, [bookings]);

    const activityFeed = useMemo<DashboardActivity[]>(() => {
        if (bookings.length === 0) {
            return [
                {
                    id: "empty-activity",
                    title: "No service history yet",
                    desc: "Once you book a repair, the timeline will populate here.",
                    time: "Now",
                    icon: MessageSquare,
                    color: "text-white/60",
                    bg: "bg-white/5",
                    border: "border-white/10",
                },
            ];
        }

        return bookings.slice(0, 4).map((booking) => {
            const icon = booking.status === "Paid" || booking.status === "Completed"
                ? CreditCard
                : booking.status === "Rescheduled"
                    ? Wrench
                    : booking.status === "Cancelled"
                        ? ShieldAlert
                        : MessageSquare;

            return {
                id: String(booking.id),
                title: booking.status === "Paid" ? "Payment confirmed" : booking.status,
                desc: `${booking.service_name} • ${booking.technician_name || "Technician assigned soon"}`,
                time: formatRelativeTime(booking.booking_date),
                icon,
                color: booking.status === "Paid" || booking.status === "Completed"
                    ? "text-[#00FFA3]"
                    : booking.status === "Cancelled"
                        ? "text-[#FF4D6D]"
                        : "text-[#00F5FF]",
                bg: booking.status === "Paid" || booking.status === "Completed"
                    ? "bg-[#00FFA3]/10"
                    : booking.status === "Cancelled"
                        ? "bg-[#FF4D6D]/10"
                        : "bg-[#00F5FF]/10",
                border: booking.status === "Paid" || booking.status === "Completed"
                    ? "border-[#00FFA3]/30"
                    : booking.status === "Cancelled"
                        ? "border-[#FF4D6D]/30"
                        : "border-[#00F5FF]/30",
            };
        });
    }, [bookings]);

    const openBookingAction = (booking: BookingRecord, kind: Exclude<BookingActionKind, null>) => {
        const defaults = getRescheduleDefaults(booking);

        setBookingAction({
            open: true,
            kind,
            booking,
            rescheduleDate: defaults.date,
            rescheduleTime: defaults.time,
        });
    };

    const closeBookingAction = () => {
        setBookingAction({
            open: false,
            kind: null,
            booking: null,
            rescheduleDate: "",
            rescheduleTime: "",
        });
    };

    const applyBookingPatch = (bookingId: string | number, patch: Record<string, unknown>) => {
        setBookings((current) =>
            current.map((booking) =>
                String(booking.id) === String(bookingId)
                    ? { ...booking, ...patch }
                    : booking
            )
        );
    };

    const revertBooking = (snapshot: BookingRecord) => {
        setBookings((current) =>
            current.map((booking) =>
                String(booking.id) === String(snapshot.id) ? snapshot : booking
            )
        );
    };

    const handleConfirmCancel = async () => {
        const booking = bookingAction.booking;

        if (!booking) return;

        const snapshot = booking;
        const refundAmount = Number(booking.price || 0);

        applyBookingPatch(booking.id, {
            status: "Cancelled",
            refund_status: "Initiated",
            refund_amount: refundAmount,
            refund_note: `Refund of ₹${refundAmount.toLocaleString("en-IN")} initiated`,
        });

        closeBookingAction();
        toast.success(`Booking cancelled. Refund of ₹${refundAmount.toLocaleString("en-IN")} has been initiated.`);

        const { error } = await supabase
            .from("bookings")
            .update({ status: "Cancelled" })
            .eq("id", booking.id);

        if (error) {
            revertBooking(snapshot);
            toast.error("We could not update the booking status. Please try again.");
        }
    };

    const handleConfirmReschedule = async () => {
        const booking = bookingAction.booking;

        if (!booking) return;

        if (!bookingAction.rescheduleDate || !bookingAction.rescheduleTime) {
            toast.error("Choose a new date and time before rescheduling.");
            return;
        }

        const snapshot = booking;
        const nextBookingDate = new Date(`${bookingAction.rescheduleDate}T00:00:00`);

        applyBookingPatch(booking.id, {
            status: "Rescheduled",
            booking_date: nextBookingDate.toISOString(),
            booking_time: bookingAction.rescheduleTime,
            rescheduled_at: new Date().toISOString(),
        });

        closeBookingAction();
        toast.success("Booking rescheduled successfully. The new slot is live now.");

        const { error } = await supabase
            .from("bookings")
            .update({
                status: "Rescheduled",
                booking_date: nextBookingDate.toISOString(),
                booking_time: bookingAction.rescheduleTime,
            })
            .eq("id", booking.id);

        if (error) {
            revertBooking(snapshot);
            toast.error("We could not reschedule this booking. Please try again.");
        }
    };

    // LOADING SCREEN
    if (loading) {

        return (
            <main className="min-h-screen bg-[#050816] flex items-center justify-center text-white">

                <h1 className="text-3xl font-bold animate-pulse">
                    Loading Dashboard...
                </h1>

            </main>
        );
    }

    // BLOCK PAGE UNTIL USER EXISTS
    if (!user) return null;

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#050816] px-6 py-10">

            {/* BACKGROUND GLOW */}
            <div className="absolute inset-0 overflow-hidden">

                <div className="absolute top-0 left-0 w-125 h-125 bg-[#5227FF]/20 blur-[140px] rounded-full" />

                <div className="absolute bottom-0 right-0 w-125 h-125 bg-cyan-500/20 blur-[140px] rounded-full" />

            </div>

            {/* GRID OVERLAY */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-size-[40px_40px]" />

            <div className="relative z-10 max-w-7xl mx-auto space-y-10">

                {/* HERO SECTION */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-2xl p-8 md:p-12 shadow-[0_0_80px_rgba(82,39,255,0.15)]"
                >

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

                        {/* USER INFO */}
                        <div>

                            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-cyan-300 text-sm mb-6">
                                Customer Dashboard
                            </div>

                            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">

                                Welcome back,

                                <span className="block bg-linear-to-r from-[#5227FF] to-cyan-400 bg-clip-text text-transparent">

                                    {profile?.full_name ||
                                        user?.user_metadata?.full_name ||
                                        "User"}

                                </span>

                            </h1>

                            <p className="mt-5 text-white/60 text-lg">
                                Logged in as:
                            </p>

                            <p className="text-cyan-400 mt-1">
                                {user?.email}
                            </p>

                            <div className="mt-6 inline-flex items-center rounded-full border border-[#00FFA3]/20 bg-[#00FFA3]/10 px-4 py-2 text-[#00FFA3]">
                                {profile?.role}
                            </div>

                        </div>

                        {/* QUICK STATUS */}
                        <div className="grid grid-cols-2 gap-4">

                            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 min-w-40">

                                <p className="text-white/60 text-sm">
                                    Active Repairs
                                </p>

                                <h2 className="mt-3 text-4xl font-black text-cyan-400">
                                    {
                                        bookings.filter(
                                            (booking) =>
                                                isActiveBooking(booking.status)
                                        ).length
                                    }
                                </h2>

                            </div>

                            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 min-w-40">

                                <p className="text-white/60 text-sm">
                                    Completed
                                </p>

                                <h2 className="mt-3 text-4xl font-black text-[#00FFA3]">
                                    {
                                        bookings.filter(
                                            (booking) =>
                                                isCompletedBooking(booking.status)
                                        ).length
                                    }
                                </h2>

                            </div>

                        </div>

                    </div>

                </motion.div>

                {/* STATS ROW */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                    <StatsCard
                        title="Active Repairs"
                        value={
                            bookings.filter(
                                (booking) =>
                                    isActiveBooking(booking.status)
                            ).length
                        }
                        icon={Wrench}
                        color="#00F5FF"
                        delay={0.1}
                    />

                    <StatsCard
                        title="Completed"
                        value={
                            bookings.filter(
                                (booking) =>
                                    isCompletedBooking(booking.status)
                            ).length
                        }
                        icon={CheckCircle}
                        color="#00FFA3"
                        delay={0.2}
                    />

                    <StatsCard
                        title="Pending Payments"
                        value={bookings.filter((booking) => isActiveBooking(booking.status)).length}
                        icon={CreditCard}
                        color="#FF4D6D"
                        delay={0.3}
                    />

                    <StatsCard
                        title="Saved Addresses"
                        value={3}
                        icon={MapPin}
                        color="#5227FF"
                        delay={0.4}
                    />

                </div>

                {/* MAIN CONTENT */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                    {/* LEFT COLUMN */}
                    <div className="xl:col-span-2 space-y-8">

                        {/* LIVE TRACKING */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <TrackingCard />
                        </motion.div>

                        {/* QUICK ACTIONS */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >

                            <h3 className="text-2xl font-bold text-white mb-5">
                                Quick Actions
                            </h3>

                            <QuickActions />

                        </motion.div>

                        {/* BOOKINGS */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                        >

                            <div className="flex justify-between items-center mb-5">

                                <h3 className="text-2xl font-bold text-white">
                                    Recent Bookings
                                </h3>

                                <button className="text-sm text-[#00F5FF] hover:text-white transition-colors">
                                    View All
                                </button>

                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                {bookings.length > 0 ? (

                                    bookings.map((booking, index) => (

                                        <BookingCard
                                            key={booking.id}

                                            type={booking.service_name}

                                            device={
                                                booking.technician_name ||
                                                "Technician Assigned Soon"
                                            }

                                            date={formatBookingDate(booking.booking_date)}

                                            time={booking.booking_time}

                                            status={booking.status}

                                            price={`₹${booking.price}`}

                                            onReschedule={
                                                isActiveBooking(booking.status)
                                                    ? () => openBookingAction(booking, "reschedule")
                                                    : undefined
                                            }

                                            onCancel={
                                                isActiveBooking(booking.status)
                                                    ? () => openBookingAction(booking, "cancel")
                                                    : undefined
                                            }

                                            delay={0.8 + index * 0.1}
                                        />

                                    ))

                                ) : (

                                    <div className="col-span-2 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 text-center">

                                        <h3 className="text-2xl font-bold text-white">
                                            No Bookings Yet
                                        </h3>

                                        <p className="mt-3 text-white/60">
                                            Your upcoming repair bookings
                                            will appear here.
                                        </p>

                                    </div>

                                )}

                            </div>

                        </motion.div>

                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="space-y-8">

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <ProfileCard />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 }}
                        >
                            <PaymentOverview bookings={bookings} />
                            <div className="mt-6">
                                <SupportPanel />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.8 }}
                        >
                                <NotificationPanel notifications={notifications} newCount={notifications.filter((notification) => notification.unread).length} />
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.9 }}
                        >
                                <ActivityTimeline activities={activityFeed} />
                        </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1 }}
                                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Realtime Sync</h3>
                                        <p className="mt-1 text-sm text-white/60">Booking updates, payment changes, and refunds are streaming in live.</p>
                                    </div>
                                    <div className="rounded-full border border-[#00FFA3]/20 bg-[#00FFA3]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#00FFA3]">
                                        Live
                                    </div>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-white/70">
                                    <div className="rounded-2xl border border-white/10 bg-[#0b1020]/70 p-4">
                                        <p className="text-white/45">Total Spent</p>
                                        <p className="mt-1 text-lg font-semibold text-white">₹{totalSpent.toLocaleString("en-IN")}</p>
                                    </div>
                                    <div className="rounded-2xl border border-white/10 bg-[#0b1020]/70 p-4">
                                        <p className="text-white/45">Pending</p>
                                        <p className="mt-1 text-lg font-semibold text-white">₹{pendingTotal.toLocaleString("en-IN")}</p>
                                    </div>
                                </div>
                                <p className="mt-4 text-xs uppercase tracking-[0.2em] text-white/45">
                                    Last synced {lastSyncedAt || "just now"}
                                </p>
                            </motion.div>

                    </div>

                </div>

            </div>

            {bookingAction.open && bookingAction.booking && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="w-full max-w-2xl rounded-[32px] border border-white/10 bg-[#050816] p-6 text-white shadow-[0_0_80px_rgba(82,39,255,0.25)]"
                    >
                        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
                            <div>
                                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/60">
                                    {bookingAction.kind === "cancel" ? (
                                        <>
                                            <AlertTriangle size={14} className="text-[#FF4D6D]" />
                                            Cancel Policy
                                        </>
                                    ) : (
                                        <>
                                            <RotateCcw size={14} className="text-[#00F5FF]" />
                                            Reschedule Policy
                                        </>
                                    )}
                                </div>
                                <h3 className="text-2xl font-bold">
                                    {bookingAction.kind === "cancel"
                                        ? "Cancel this booking?"
                                        : "Move this booking to a new slot?"}
                                </h3>
                                <p className="mt-2 text-sm text-white/60">
                                    {bookingAction.kind === "cancel"
                                        ? "Cancellation is instant. If your booking is prepaid, the refund is triggered immediately after confirmation."
                                        : "Rescheduling is free when done before the job starts. The booking will update instantly for you and the technician."}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={closeBookingAction}
                                className="rounded-full border border-white/10 bg-white/5 p-2 text-white/60 transition-colors hover:text-white"
                            >
                                <XCircle size={18} />
                            </button>
                        </div>

                        <div className="grid gap-4 py-5 md:grid-cols-2">
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                <div className="flex items-center gap-2 text-sm font-semibold text-white/80">
                                    <BadgeInfo size={16} className="text-[#00F5FF]" />
                                    Booking Details
                                </div>
                                <div className="mt-4 space-y-3 text-sm text-white/70">
                                    <p>
                                        <span className="text-white/40">Service:</span> {bookingAction.booking.service_name}
                                    </p>
                                    <p>
                                        <span className="text-white/40">Technician:</span> {bookingAction.booking.technician_name || "Assigned soon"}
                                    </p>
                                    <p>
                                        <span className="text-white/40">Current Date:</span> {formatBookingDate(bookingAction.booking.booking_date)}
                                    </p>
                                    <p>
                                        <span className="text-white/40">Current Time:</span> {bookingAction.booking.booking_time}
                                    </p>
                                </div>
                            </div>

                            {bookingAction.kind === "reschedule" ? (
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-white/80">
                                        <CalendarDays size={16} className="text-[#00FFA3]" />
                                        Choose New Slot
                                    </div>
                                    <div className="mt-4 space-y-3">
                                        <label className="block text-sm text-white/60">
                                            New Date
                                            <input
                                                type="date"
                                                value={bookingAction.rescheduleDate}
                                                onChange={(event) =>
                                                    setBookingAction((current) => ({
                                                        ...current,
                                                        rescheduleDate: event.target.value,
                                                    }))
                                                }
                                                className="mt-2 w-full rounded-xl border border-white/10 bg-[#0B1020] px-4 py-3 text-white outline-none transition-colors focus:border-[#00F5FF]/50"
                                            />
                                        </label>

                                        <label className="block text-sm text-white/60">
                                            New Time
                                            <input
                                                type="text"
                                                value={bookingAction.rescheduleTime}
                                                onChange={(event) =>
                                                    setBookingAction((current) => ({
                                                        ...current,
                                                        rescheduleTime: event.target.value,
                                                    }))
                                                }
                                                placeholder="e.g. 02:30 PM"
                                                className="mt-2 w-full rounded-xl border border-white/10 bg-[#0B1020] px-4 py-3 text-white outline-none transition-colors focus:border-[#00F5FF]/50"
                                            />
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-[#FF4D6D]/20 bg-[#FF4D6D]/10 p-4">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-[#FF4D6D]">
                                        <Clock3 size={16} />
                                        Refund Policy
                                    </div>
                                    <ul className="mt-4 space-y-2 text-sm text-white/75">
                                        <li>• Refunds are initiated immediately after cancellation.</li>
                                        <li>• The amount returns to the original payment method in 2-4 business days.</li>
                                        <li>• You can book again anytime from the dashboard.</li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:justify-between">
                            <button
                                type="button"
                                onClick={closeBookingAction}
                                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                            >
                                Keep Booking
                            </button>

                            <button
                                type="button"
                                onClick={bookingAction.kind === "cancel" ? handleConfirmCancel : handleConfirmReschedule}
                                className={`rounded-xl px-5 py-3 text-sm font-bold transition-colors ${
                                    bookingAction.kind === "cancel"
                                        ? "bg-[#FF4D6D] text-white hover:bg-[#ff6b84]"
                                        : "bg-[#00F5FF] text-[#050816] hover:bg-[#7ff7ff]"
                                }`}
                            >
                                {bookingAction.kind === "cancel"
                                    ? `Confirm Cancel & Refund ₹${Number(bookingAction.booking.price || 0).toLocaleString("en-IN")}`
                                    : "Confirm Reschedule"}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

        </main>
    );
}