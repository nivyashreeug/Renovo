"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Copy, PhoneCall, PlusCircle, Search, MessageCircle, AlertTriangle, Navigation2, ShieldAlert, Sparkles, X, MapPin, Clock3, CarFront, Route, CheckCircle2, MessageSquare, Smartphone, Mail } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

type BookingBrief = {
    id: string | number;
    service_name?: string;
    technician_name?: string | null;
    technician_phone?: string | null;
    technician_email?: string | null;
    booking_date?: string;
    booking_time?: string;
    status?: string;
    payment_status?: string | null;
};

type ActionKind = "track" | "contact" | "emergency" | null;

interface QuickActionsProps {
    bookings?: BookingBrief[];
}

const actions = [
    { label: "Book New Repair", icon: PlusCircle, color: "from-[#5227FF] to-[#8B5CF6]", href: "/booking" },
    { label: "Track Repair", icon: Search, color: "from-[#00F5FF] to-[#00A3FF]", action: "track" as const },
    { label: "Contact Tech", icon: MessageCircle, color: "from-[#00FFA3] to-[#00CC88]", action: "contact" as const },
    { label: "Emergency", icon: AlertTriangle, color: "from-[#FF4D6D] to-[#D9002D]", pulse: true, action: "emergency" as const },
];

function formatDate(value?: string) {
    if (!value) return "Moments ago";

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;

    return parsed.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
    });
}

function normalizePhone(value?: string | null) {
    if (!value) return "";
    return value.replace(/[^+\d]/g, "");
}

function buildTrackingStage(status?: string, paymentStatus?: string | null) {
    const normalizedStatus = String(status || "").toLowerCase();
    const normalizedPayment = String(paymentStatus || "").toLowerCase();

    if (normalizedPayment === "paid" || normalizedStatus === "completed") return 4;
    if (normalizedStatus === "repairing") return 3;
    if (normalizedStatus === "on the way") return 2;
    if (normalizedStatus === "assigned" || normalizedStatus === "rescheduled") return 1;
    return 1;
}

function ActionCard({
    title,
    desc,
    icon: Icon,
    accent,
    onClick,
}: {
    title: string;
    desc: string;
    icon: typeof PhoneCall | typeof MessageSquare | typeof Mail | typeof Smartphone;
    accent: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="group rounded-[26px] border border-white/10 bg-white/5 p-4 text-left transition hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
        >
            <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-[0_0_24px_rgba(0,245,255,0.18)]`}>
                <Icon size={18} />
            </div>
            <div className="mt-4 text-base font-semibold text-white">{title}</div>
            <p className="mt-1 text-sm leading-6 text-white/60">{desc}</p>
        </button>
    );
}

function TimelineRow({
    label,
    detail,
    active,
    done,
    icon: Icon,
}: {
    label: string;
    detail: string;
    active?: boolean;
    done?: boolean;
    icon: typeof Route | typeof CarFront | typeof Clock3 | typeof CheckCircle2;
}) {
    return (
        <div className="flex items-start gap-3">
            <div className={`relative mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl border ${done ? "border-[#00FFA3]/30 bg-[#00FFA3]/10 text-[#00FFA3]" : active ? "border-[#00F5FF]/30 bg-[#00F5FF]/10 text-[#00F5FF]" : "border-white/10 bg-white/5 text-white/45"}`}>
                <Icon size={16} />
                {active ? <span className="absolute inset-0 rounded-2xl border border-[#00F5FF]/30 animate-ping" /> : null}
            </div>
            <div className="flex-1">
                <div className={`text-sm font-medium ${done ? "text-white" : active ? "text-[#00F5FF]" : "text-white/55"}`}>{label}</div>
                <div className="mt-1 text-sm leading-6 text-white/55">{detail}</div>
            </div>
        </div>
    );
}

export default function QuickActions({ bookings = [] }: QuickActionsProps) {
    const router = useRouter();
    const [activeAction, setActiveAction] = useState<ActionKind>(null);

    const latestRepair = useMemo(() => {
        return [...bookings].find((booking) => booking.status !== "Completed" && booking.status !== "Cancelled") || bookings[0] || null;
    }, [bookings]);

    const activeRepair = useMemo(() => {
        return [...bookings].find((booking) => booking.status !== "Completed" && booking.status !== "Cancelled" && booking.status !== "Refunded") || latestRepair;
    }, [bookings, latestRepair]);

    const trackingStage = useMemo(() => buildTrackingStage(activeRepair?.status, activeRepair?.payment_status), [activeRepair?.status, activeRepair?.payment_status]);
    const technicianPhone = normalizePhone(activeRepair?.technician_phone || "");
    const technicianEmail = activeRepair?.technician_email || "support@renovo.app";
    const supportPhone = "+18005550199";

    const copyBrief = async (value: string) => {
        try {
            await navigator.clipboard.writeText(value);
        } catch {
            // ignore clipboard failures in restricted browsers
        }
    };

    const handleAction = async (action: ActionKind | undefined) => {
        if (!action) return;

        setActiveAction(action);

        if (action === "track") {
            await copyBrief(`Track my repair: ${activeRepair ? `${activeRepair.service_name} • Booking ${activeRepair.id}` : "no active repair"}`);
        }

        if (action === "contact") {
            await copyBrief(`Contact tech request for ${activeRepair ? `${activeRepair.service_name}` : "latest booking"}`);
        }

        if (action === "emergency") {
            await copyBrief(`Emergency escalation for ${activeRepair ? `${activeRepair.service_name} • Booking ${activeRepair.id}` : "customer account"}`);
        }
    };

    const closeResult = () => setActiveAction(null);

    const handlePrimaryCta = () => {
        if (activeAction === "track") {
            router.push("/dashboard/customer/tracking");
            return;
        }

        if (activeAction === "contact") {
            router.push("/contacts");
            return;
        }

        if (activeAction === "emergency") {
            router.push("/booking");
        }
    };

    const handleSecondaryCta = () => {
        if (activeAction === "track") {
            router.push("/dashboard/customer/bookings");
            return;
        }

        if (activeAction === "contact") {
            window.location.href = "mailto:support@renovo.app";
            return;
        }

        if (activeAction === "emergency") {
            router.push("/contacts");
        }
    };

    const handleCallTech = () => {
        if (technicianPhone) {
            window.location.href = `tel:${technicianPhone}`;
            return;
        }

        window.location.href = `tel:${supportPhone}`;
    };

    const handleMessageTech = () => {
        const brief = activeRepair
            ? `Hi ${activeRepair.technician_name || "tech"}, I need an update on ${activeRepair.service_name || "my repair"} (Booking ${activeRepair.id}).`
            : "Hi Renova, I need an update on my repair.";

        if (technicianPhone) {
            window.location.href = `sms:${technicianPhone}?body=${encodeURIComponent(brief)}`;
            return;
        }

        window.location.href = `mailto:${technicianEmail}?subject=${encodeURIComponent("Renova repair update")}&body=${encodeURIComponent(brief)}`;
    };

    const handleCopyActionBrief = async () => {
        if (!resultContent) return;

        const payload = [
            resultContent.badge,
            resultContent.title,
            resultContent.subtitle,
            resultContent.statA,
            resultContent.statB,
            resultContent.statC,
            resultContent.statD,
        ].join("\n");

        await copyBrief(payload);
        toast.success("Action brief copied to clipboard.");
    };

    const resultContent = (() => {
        switch (activeAction) {
            case "track":
                return {
                    badge: "Live Repair Pulse",
                    title: "Tracking link activated",
                    subtitle: "Your repair is glowing on the Renova radar in realtime.",
                    ctaPrimary: "Open Live Tracking",
                    ctaSecondary: "View Booking",
                    accent: "from-[#00F5FF] via-[#5227FF] to-[#00FFA3]",
                    icon: Navigation2,
                    statA: activeRepair?.service_name || "No active repair",
                    statB: activeRepair?.technician_name || "Technician assigned soon",
                    statC: activeRepair ? `Booking ${activeRepair.id}` : "Waiting for booking",
                    statD: activeRepair ? formatDate(activeRepair.booking_date) : "Refresh to sync",
                    showTrackingPreview: true,
                    showTimeline: true,
                    showContactCards: true,
                };
            case "contact":
                return {
                    badge: "Tech Bridge Online",
                    title: "Contact lane unlocked",
                    subtitle: "Your technician channel is ready for secure follow-up and instant escalation.",
                    ctaPrimary: "Open Contacts",
                    ctaSecondary: "Email Support",
                    accent: "from-[#00FFA3] via-[#00F5FF] to-[#B8F3FF]",
                    icon: PhoneCall,
                    statA: activeRepair?.technician_name || "Technician pending",
                    statB: activeRepair?.service_name || "Repair service",
                    statC: activeRepair ? `Booking ${activeRepair.id}` : "Latest booking",
                    statD: activeRepair ? formatDate(activeRepair.booking_date) : "Available now",
                    showTrackingPreview: false,
                    showTimeline: false,
                    showContactCards: true,
                };
            case "emergency":
                return {
                    badge: "Priority Escalation",
                    title: "Emergency mode engaged",
                    subtitle: "Renova has highlighted your repair with the highest urgency visual lane.",
                    ctaPrimary: "Dispatch Emergency Booking",
                    ctaSecondary: "Open Support",
                    accent: "from-[#FF4D6D] via-[#D9002D] to-[#FFB020]",
                    icon: ShieldAlert,
                    statA: activeRepair?.service_name || "Critical request",
                    statB: activeRepair?.technician_name || "Priority team",
                    statC: activeRepair ? `Booking ${activeRepair.id}` : "Emergency queue",
                    statD: activeRepair ? formatDate(activeRepair.booking_date) : "Immediate attention",
                    showTrackingPreview: true,
                    showTimeline: true,
                    showContactCards: true,
                };
            default:
                return null;
        }
    })();

    const currentTimeline = [
        { label: "Escalation flagged", detail: "Your request is visible to the live operations lane now.", icon: Route },
        { label: "Technician notified", detail: "The assigned technician gets an instant alert and accepts the route.", icon: CarFront },
        { label: "Customer bridge open", detail: "Phone/message actions are live so you can reach the tech immediately.", icon: Clock3 },
        { label: "Resolution monitoring", detail: "Renova watches the service until the repair is completed.", icon: CheckCircle2 },
    ];

    return (
        <>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {actions.map((action) => {
                if (action.href) {
                    return (
                        <Link
                            key={action.label}
                            href={action.href}
                            className="relative group p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 overflow-hidden flex flex-col items-center justify-center gap-3 h-32 transition-colors block w-full"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br ${action.color} text-white shadow-lg relative z-10`}>
                                <action.icon size={20} />
                            </div>
                            <span className="font-medium text-white/80 group-hover:text-white text-sm z-10">{action.label}</span>
                        </Link>
                    );
                }

                return (
                    <motion.button
                        key={action.label}
                        type="button"
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAction(action.action)}
                        className="relative group p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 overflow-hidden flex flex-col items-center justify-center gap-3 h-32 transition-colors block w-full"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br ${action.color} text-white shadow-lg relative z-10`}>
                            <action.icon size={20} />
                            {action.pulse && (
                                <span className="absolute inset-0 rounded-full border-2 border-[#FF4D6D] animate-ping opacity-50" />
                            )}
                        </div>
                        <span className="font-medium text-white/80 group-hover:text-white text-sm z-10">{action.label}</span>
                    </motion.button>
                );
            })}
        </div>

        <AnimatePresence>
            {resultContent ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[80] flex items-center justify-center bg-[#02040b]/80 px-4 py-6 backdrop-blur-2xl"
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 24, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.97, y: 24, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 220, damping: 22 }}
                        className="relative w-full max-w-4xl overflow-hidden rounded-[34px] border border-white/10 bg-[#08111f]/95 shadow-[0_0_100px_rgba(0,245,255,0.15)]"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${resultContent.accent} opacity-15`} />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.06),transparent_32%)]" />

                        <div className="relative z-10 p-6 sm:p-8">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.28em] text-white/60">
                                        <Sparkles size={12} /> {resultContent.badge}
                                    </div>
                                    <h3 className="mt-5 text-3xl font-semibold text-white sm:text-4xl">{resultContent.title}</h3>
                                    <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65 sm:text-base">{resultContent.subtitle}</p>
                                </div>

                                <button
                                    type="button"
                                    onClick={closeResult}
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                                <ResultStat label="Service" value={resultContent.statA} />
                                <ResultStat label="Technician" value={resultContent.statB} />
                                <ResultStat label="Booking Ref" value={resultContent.statC} />
                                <ResultStat label="Updated" value={resultContent.statD} />
                            </div>

                            <div className="mt-8 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                                <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
                                    <div className="flex items-center gap-3">
                                        <div className={`rounded-2xl bg-gradient-to-br ${resultContent.accent} p-3 text-white shadow-lg`}>
                                            <resultContent.icon size={22} />
                                        </div>
                                        <div>
                                            <div className="text-xs uppercase tracking-[0.24em] text-white/45">Action result</div>
                                            <div className="mt-1 text-lg font-medium text-white">Cinematic control center online</div>
                                        </div>
                                    </div>
                                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 1.1, ease: "easeOut" }}
                                            className={`h-full rounded-full bg-gradient-to-r ${resultContent.accent}`}
                                        />
                                    </div>
                                    <p className="mt-4 text-sm leading-6 text-white/60">
                                        The dashboard has staged your request with neon precision. You can jump straight into the next step or return to the action grid.
                                    </p>
                                </div>

                                <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                                    <div className="text-xs uppercase tracking-[0.24em] text-white/45">Next move</div>
                                    <div className="mt-3 space-y-3">
                                        <button
                                            type="button"
                                            onClick={handlePrimaryCta}
                                            className={`w-full rounded-2xl bg-gradient-to-r ${resultContent.accent} px-4 py-3 text-sm font-semibold text-[#02111f] shadow-[0_0_24px_rgba(0,245,255,0.18)] transition hover:scale-[1.01]`}
                                        >
                                            {resultContent.ctaPrimary}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleSecondaryCta}
                                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/75 transition hover:bg-white/10"
                                        >
                                            {resultContent.ctaSecondary}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCopyActionBrief}
                                            className="w-full rounded-2xl border border-[#00F5FF]/20 bg-[#00F5FF]/10 px-4 py-3 text-sm font-medium text-[#00F5FF] transition hover:bg-[#00F5FF]/15"
                                        >
                                            <Copy size={14} className="mr-2 inline-block" /> Copy action brief
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
                                {resultContent.showContactCards ? (
                                    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <div className="text-xs uppercase tracking-[0.24em] text-white/45">Live technician contact</div>
                                                <div className="mt-1 text-lg font-semibold text-white">Call or message in one tap</div>
                                            </div>
                                            <PhoneCall size={18} className="text-[#00FFA3]" />
                                        </div>

                                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                            <ActionCard
                                                title={activeRepair?.technician_name || "Technician"}
                                                desc={technicianPhone ? `Call ${technicianPhone}` : "Call the live support bridge"}
                                                icon={PhoneCall}
                                                accent="from-[#00FFA3] to-[#00F5FF]"
                                                onClick={handleCallTech}
                                            />
                                            <ActionCard
                                                title="Message now"
                                                desc={technicianPhone ? "Send an SMS update with the current booking context" : "Email support with the booking brief"}
                                                icon={MessageSquare}
                                                accent="from-[#5227FF] to-[#00F5FF]"
                                                onClick={handleMessageTech}
                                            />
                                            <ActionCard
                                                title="Email technician"
                                                desc={technicianEmail ? technicianEmail : "Fallback support mailbox"}
                                                icon={Mail}
                                                accent="from-[#00F5FF] to-[#00FFA3]"
                                                onClick={() => {
                                                    window.location.href = `mailto:${technicianEmail}?subject=${encodeURIComponent("Renova repair update")}`;
                                                }}
                                            />
                                            <ActionCard
                                                title="Copy phone"
                                                desc={technicianPhone || supportPhone}
                                                icon={Smartphone}
                                                accent="from-[#FFB020] to-[#FF4D6D]"
                                                onClick={async () => {
                                                    await copyBrief(technicianPhone || supportPhone);
                                                    toast.success("Phone number copied.");
                                                }}
                                            />
                                        </div>
                                    </div>
                                ) : null}

                                {resultContent.showTrackingPreview ? (
                                    <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <div className="text-xs uppercase tracking-[0.24em] text-white/45">Tracking preview</div>
                                                <div className="mt-1 text-lg font-semibold text-white">Realtime repair snapshot</div>
                                            </div>
                                            <MapPin size={18} className="text-[#00F5FF]" />
                                        </div>

                                        <div className="mt-4 rounded-[26px] border border-white/10 bg-[#08111f]/90 p-4">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <div className="inline-flex items-center gap-2 rounded-full border border-[#00F5FF]/20 bg-[#00F5FF]/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[#00F5FF]">
                                                        <span className="h-2 w-2 rounded-full bg-[#00F5FF] animate-pulse" /> Live
                                                    </div>
                                                    <h4 className="mt-3 text-xl font-semibold text-white">{activeRepair?.service_name || "Repair tracking"}</h4>
                                                    <p className="mt-1 text-sm text-white/60">{activeRepair?.technician_name || "Technician assigned soon"}</p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xs uppercase tracking-[0.24em] text-white/45">ETA</div>
                                                    <div className="mt-1 text-3xl font-semibold text-[#00FFA3]">18</div>
                                                    <div className="text-xs text-white/45">mins</div>
                                                </div>
                                            </div>

                                            <div className="mt-4 grid gap-3 rounded-[22px] border border-white/10 bg-white/5 p-4">
                                                <div className="flex items-center justify-between text-sm text-white/70">
                                                    <span>Booking status</span>
                                                    <span className="text-[#00F5FF]">{activeRepair?.status || "Assigned"}</span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm text-white/70">
                                                    <span>Payment</span>
                                                    <span className="text-[#00FFA3]">{activeRepair?.payment_status || "Pending"}</span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm text-white/70">
                                                    <span>Booking ID</span>
                                                    <span>{activeRepair ? `#${activeRepair.id}` : "—"}</span>
                                                </div>
                                            </div>

                                            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${Math.min(100, trackingStage * 25)}%` }}
                                                    transition={{ duration: 1.2, ease: "easeOut" }}
                                                    className="h-full rounded-full bg-gradient-to-r from-[#00F5FF] via-[#5227FF] to-[#00FFA3]"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => router.push("/dashboard/customer/tracking")}
                                            className="mt-4 w-full rounded-2xl bg-gradient-to-r from-[#00F5FF] via-[#5227FF] to-[#00FFA3] px-4 py-3 text-sm font-semibold text-[#02111f] shadow-[0_0_24px_rgba(0,245,255,0.18)] transition hover:scale-[1.01]"
                                        >
                                            Open Full Tracking View
                                        </button>
                                    </div>
                                ) : null}
                            </div>

                            {activeAction === "emergency" ? (
                                <div className="mt-4 rounded-[28px] border border-[#FF4D6D]/20 bg-[#FF4D6D]/10 p-5">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <div className="text-xs uppercase tracking-[0.24em] text-[#FF8DA1]">Emergency escalation timeline</div>
                                            <div className="mt-1 text-lg font-semibold text-white">Realtime response chain</div>
                                        </div>
                                        <ShieldAlert size={18} className="text-[#FF4D6D]" />
                                    </div>

                                    <div className="mt-5 space-y-4">
                                        {currentTimeline.map((step, index) => (
                                            <TimelineRow
                                                key={step.label}
                                                label={step.label}
                                                detail={step.detail}
                                                icon={step.icon}
                                                done={index < trackingStage}
                                                active={index === Math.min(trackingStage, currentTimeline.length - 1)}
                                            />
                                        ))}
                                    </div>

                                    <div className="mt-5 flex flex-wrap gap-3">
                                        <button
                                            type="button"
                                            onClick={handleCallTech}
                                            className="inline-flex items-center gap-2 rounded-2xl bg-[#FF4D6D] px-4 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(255,77,109,0.25)] transition hover:scale-[1.01]"
                                        >
                                            <PhoneCall size={14} /> Call escalation line
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleSecondaryCta}
                                            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white/75 transition hover:bg-white/10"
                                        >
                                            Open Support
                                        </button>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </motion.div>
                </motion.div>
            ) : null}
        </AnimatePresence>
        </>
    );
}

function ResultStat({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
            <div className="text-xs uppercase tracking-[0.24em] text-white/45">{label}</div>
            <div className="mt-2 text-sm font-medium leading-6 text-white">{value}</div>
        </div>
    );
}
