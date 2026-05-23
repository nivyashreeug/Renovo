"use client";

import React, { useState } from "react";
import { BellRing, Globe, Lock, Save, ShieldCheck, Smartphone } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { toast } from "sonner";

export default function SettingsPage() {
  const { user, profile } = useAuth();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [trackingAlerts, setTrackingAlerts] = useState(true);
  const [marketingUpdates, setMarketingUpdates] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionGuard, setSessionGuard] = useState(true);

  const saveSettings = () => {
    toast.success("Your customer settings have been saved.");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#00F5FF]/20 bg-[#00F5FF]/10 px-3 py-1 text-xs uppercase tracking-[0.22em] text-[#00F5FF]">
          <ShieldCheck size={12} /> Account controls
        </div>
        <h1 className="mt-3 text-3xl font-bold">Customer Settings</h1>
        <p className="mt-2 text-white/60">Manage notifications, privacy, and security preferences for your Renova account.</p>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <InfoCard title="Account" value={profile?.full_name || user?.email || "Customer"} icon={Globe} />
          <InfoCard title="Email" value={user?.email || "Not available"} icon={Smartphone} />
          <InfoCard title="Security" value={twoFactor ? "2FA Enabled" : "Standard"} icon={Lock} />
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur-2xl">
          <h2 className="text-lg font-semibold text-white">Notification Preferences</h2>
          <p className="mt-1 text-sm text-white/60">Choose how Renova keeps you updated about bookings and repairs.</p>
          <div className="mt-4 space-y-3">
            <ToggleRow label="Email alerts" description="Invoice generation and booking confirmations" checked={emailAlerts} onChange={setEmailAlerts} icon={BellRing} />
            <ToggleRow label="Push notifications" description="Instant mobile app notifications" checked={pushAlerts} onChange={setPushAlerts} icon={Smartphone} />
            <ToggleRow label="Tracking updates" description="Technician route and ETA updates" checked={trackingAlerts} onChange={setTrackingAlerts} icon={Globe} />
            <ToggleRow label="Marketing updates" description="Promotions and seasonal offers" checked={marketingUpdates} onChange={setMarketingUpdates} icon={BellRing} />
          </div>
        </section>

        <section className="rounded-[24px] border border-white/10 bg-white/5 p-5 backdrop-blur-2xl">
          <h2 className="text-lg font-semibold text-white">Security & Privacy</h2>
          <p className="mt-1 text-sm text-white/60">Protect your account access and session security.</p>
          <div className="mt-4 space-y-3">
            <ToggleRow label="Two-factor authentication" description="Require OTP when signing in" checked={twoFactor} onChange={setTwoFactor} icon={Lock} />
            <ToggleRow label="Session guard" description="Auto-expire inactive sessions" checked={sessionGuard} onChange={setSessionGuard} icon={ShieldCheck} />
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
            Security logs and device management will be added in the next dashboard release.
          </div>
        </section>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={saveSettings}
          className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-[#00F5FF] via-[#00FFA3] to-[#B8F3FF] px-6 py-3 text-sm font-semibold text-[#02111f] shadow-[0_0_24px_rgba(0,245,255,0.2)] transition hover:scale-[1.01]"
        >
          <Save size={15} /> Save Settings
        </button>
      </div>
    </div>
  );
}

function InfoCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-white/45">
        <Icon size={13} className="text-[#00F5FF]" /> {title}
      </div>
      <div className="mt-3 text-lg font-semibold text-white wrap-break-word">{value}</div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
  icon: Icon,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-2 text-[#00F5FF]">
          <Icon size={14} />
        </div>
        <div>
          <p className="font-medium text-white">{label}</p>
          <p className="mt-1 text-xs text-white/55">{description}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`h-7 w-13 rounded-full border transition ${checked ? "border-[#00F5FF]/50 bg-[#00F5FF]/20" : "border-white/15 bg-white/5"}`}
      >
        <span
          className={`block h-5 w-5 rounded-full bg-white transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`}
        />
      </button>
    </div>
  );
}
