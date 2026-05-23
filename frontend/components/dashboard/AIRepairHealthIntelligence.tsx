"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import {
  AlertTriangle,
  Bot,
  BrainCircuit,
  Car,
  Cpu,
  Gauge,
  Laptop,
  ShieldAlert,
  Smartphone,
  Sparkles,
  ThermometerSun,
  Timer,
  Tv,
  WashingMachine,
  Wrench,
  Zap,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type DeviceKey =
  | "ac"
  | "laptop"
  | "mobile"
  | "vehicle"
  | "washing_machine"
  | "electronics";

type DeviceHealth = {
  key: DeviceKey;
  name: string;
  score: number;
  prediction: string;
  recommendation: string;
  nextServiceInDays: number;
  trend: "Improving" | "Stable" | "Declining";
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

type RiskSignal = {
  id: string;
  title: string;
  details: string;
  severity: "moderate" | "high" | "critical";
  impact: string;
};

type AssistantInsight = {
  id: string;
  message: string;
};

const STATUS_META = {
  excellent: {
    label: "Excellent",
    color: "#00FFA3",
    glow: "shadow-[0_0_30px_rgba(0,255,163,0.28)]",
    ring: "stroke-[#00FFA3]",
  },
  stable: {
    label: "Stable",
    color: "#00F5FF",
    glow: "shadow-[0_0_30px_rgba(0,245,255,0.24)]",
    ring: "stroke-[#00F5FF]",
  },
  moderate: {
    label: "Moderate Risk",
    color: "#FFB020",
    glow: "shadow-[0_0_30px_rgba(255,176,32,0.24)]",
    ring: "stroke-[#FFB020]",
  },
  high: {
    label: "High Risk",
    color: "#FF7A59",
    glow: "shadow-[0_0_30px_rgba(255,122,89,0.26)]",
    ring: "stroke-[#FF7A59]",
  },
  critical: {
    label: "Critical",
    color: "#FF4D6D",
    glow: "shadow-[0_0_32px_rgba(255,77,109,0.3)]",
    ring: "stroke-[#FF4D6D]",
  },
} as const;

function getHealthStatus(score: number) {
  if (score >= 90) return "excellent" as const;
  if (score >= 75) return "stable" as const;
  if (score >= 60) return "moderate" as const;
  if (score >= 45) return "high" as const;
  return "critical" as const;
}

function getRiskSignals(devices: DeviceHealth[]): RiskSignal[] {
  const baseSignals: RiskSignal[] = [
    {
      id: "cooling-instability",
      title: "Cooling instability detected",
      details: "AC thermal variance exceeded adaptive threshold over the last 48h.",
      severity: "high",
      impact: "Potential efficiency drop: 18% within 30 days",
    },
    {
      id: "battery-degradation",
      title: "Battery degradation probability rising",
      details: "Mobile charging cycle model predicts accelerated wear pattern.",
      severity: "moderate",
      impact: "Estimated backup drop: 14% in 21 days",
    },
    {
      id: "fan-anomaly",
      title: "Fan efficiency anomaly identified",
      details: "Laptop fan RPM variance suggests dust load accumulation trend.",
      severity: "high",
      impact: "Overheating risk window: next 17 days",
    },
  ];

  const criticalDevice = devices.find((device) => device.score < 45);

  if (criticalDevice) {
    baseSignals.unshift({
      id: "critical-device",
      title: `${criticalDevice.name} health entering critical band`,
      details: "Predictive engine detected a severe reliability decline trajectory.",
      severity: "critical",
      impact: "Immediate preventive dispatch recommended",
    });
  }

  return baseSignals;
}

const INITIAL_HEALTH_DATA: DeviceHealth[] = [
  {
    key: "ac",
    name: "AC",
    score: 82,
    prediction: "Cooling efficiency may drop by 18% within 30 days.",
    recommendation: "Filter maintenance recommended in 12 days.",
    nextServiceInDays: 24,
    trend: "Stable",
    icon: ThermometerSun,
  },
  {
    key: "laptop",
    name: "Laptop",
    score: 76,
    prediction: "Fan load trend indicates thermal stress in 2-3 weeks.",
    recommendation: "Recommended: precision fan and vent cleaning.",
    nextServiceInDays: 21,
    trend: "Declining",
    icon: Laptop,
  },
  {
    key: "mobile",
    name: "Mobile",
    score: 71,
    prediction: "Battery degradation risk detected from charge-cycle pattern.",
    recommendation: "Battery optimization tune-up advised soon.",
    nextServiceInDays: 18,
    trend: "Declining",
    icon: Smartphone,
  },
  {
    key: "vehicle",
    name: "Vehicle",
    score: 88,
    prediction: "Engine diagnostics stable with minor coolant variance.",
    recommendation: "Preventive coolant pressure check in 34 days.",
    nextServiceInDays: 34,
    trend: "Improving",
    icon: Car,
  },
  {
    key: "washing_machine",
    name: "Washing Machine",
    score: 67,
    prediction: "Drum vibration profile suggests potential bearing stress.",
    recommendation: "Proactive balancing and alignment service suggested.",
    nextServiceInDays: 19,
    trend: "Stable",
    icon: WashingMachine,
  },
  {
    key: "electronics",
    name: "Electronics",
    score: 91,
    prediction: "Integrated circuit performance remains in optimal range.",
    recommendation: "No immediate action required.",
    nextServiceInDays: 46,
    trend: "Improving",
    icon: Cpu,
  },
];

const ASSISTANT_INSIGHTS: AssistantInsight[] = [
  {
    id: "stable",
    message: "Your overall repair ecosystem is stable. Predictive confidence: 93.4%.",
  },
  {
    id: "ac",
    message: "Cooling efficiency anomaly detected in AC. Recommended: Deep Cooling Service.",
  },
  {
    id: "battery",
    message: "Battery degradation probability rising. Estimated performance boost after service: +18%.",
  },
  {
    id: "dispatch",
    message: "Emergency priority activated for high-risk devices. Technician dispatch accelerated by 28%.",
  },
];

const EFFICIENCY_TREND = [
  { month: "Jan", efficiency: 72, predicted: 74 },
  { month: "Feb", efficiency: 74, predicted: 76 },
  { month: "Mar", efficiency: 71, predicted: 75 },
  { month: "Apr", efficiency: 77, predicted: 79 },
  { month: "May", efficiency: 79, predicted: 82 },
  { month: "Jun", efficiency: 81, predicted: 84 },
];

const OPTIMIZATION_RADAR = [
  { metric: "Cooling", value: 78 },
  { metric: "Battery", value: 68 },
  { metric: "Latency", value: 84 },
  { metric: "Thermals", value: 73 },
  { metric: "Reliability", value: 81 },
  { metric: "Preventive", value: 76 },
];

export default function AIRepairHealthIntelligence() {
  const [devices, setDevices] = useState<DeviceHealth[]>(INITIAL_HEALTH_DATA);
  const [assistantIndex, setAssistantIndex] = useState(0);
  const orbRef = useRef<HTMLDivElement | null>(null);
  const scanRef = useRef<HTMLDivElement | null>(null);
  const efficiencyChartRef = useRef<HTMLDivElement | null>(null);
  const radarChartRef = useRef<HTMLDivElement | null>(null);
  const [efficiencyChartWidth, setEfficiencyChartWidth] = useState(0);
  const [radarChartWidth, setRadarChartWidth] = useState(0);

  useEffect(() => {
    const node = efficiencyChartRef.current;

    if (!node || typeof ResizeObserver === "undefined") {
      return;
    }

    const updateWidth = () => {
      setEfficiencyChartWidth(Math.floor(node.getBoundingClientRect().width));
    };

    updateWidth();

    const observer = new ResizeObserver(() => {
      updateWidth();
    });

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const node = radarChartRef.current;

    if (!node || typeof ResizeObserver === "undefined") {
      return;
    }

    const updateWidth = () => {
      setRadarChartWidth(Math.floor(node.getBoundingClientRect().width));
    };

    updateWidth();

    const observer = new ResizeObserver(() => {
      updateWidth();
    });

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!orbRef.current || !scanRef.current) {
      return;
    }

    const orbPulse = gsap.to(orbRef.current, {
      boxShadow: "0 0 40px rgba(0, 245, 255, 0.7)",
      scale: 1.06,
      repeat: -1,
      yoyo: true,
      duration: 1.8,
      ease: "sine.inOut",
    });

    const scanSweep = gsap.fromTo(
      scanRef.current,
      { xPercent: -120, opacity: 0.25 },
      {
        xPercent: 120,
        opacity: 0.65,
        duration: 3.2,
        repeat: -1,
        ease: "sine.inOut",
      }
    );

    return () => {
      orbPulse.kill();
      scanSweep.kill();
    };
  }, []);

  useEffect(() => {
    const ticker = setInterval(() => {
      setDevices((current) =>
        current.map((device) => {
          const drift = Math.round((Math.random() - 0.5) * 4);
          const nextScore = Math.max(38, Math.min(96, device.score + drift));
          return {
            ...device,
            score: nextScore,
          };
        })
      );
    }, 4200);

    return () => clearInterval(ticker);
  }, []);

  useEffect(() => {
    const switchInsight = setInterval(() => {
      setAssistantIndex((current) => (current + 1) % ASSISTANT_INSIGHTS.length);
    }, 4600);

    return () => clearInterval(switchInsight);
  }, []);

  const typedMessage = useMemo(() => ASSISTANT_INSIGHTS[assistantIndex].message, [assistantIndex]);

  const overallHealth = useMemo(() => {
    if (!devices.length) return 0;
    const total = devices.reduce((sum, device) => sum + device.score, 0);
    return Math.round(total / devices.length);
  }, [devices]);

  const riskSignals = useMemo(() => getRiskSignals(devices), [devices]);
  const highestRisk = useMemo(() => {
    return Math.min(...devices.map((device) => device.score));
  }, [devices]);

  const emergencyPriority = highestRisk <= 44 ? "HIGH PRIORITY" : highestRisk <= 60 ? "MODERATE PRIORITY" : "STABLE PRIORITY";

  return (
    <section className="relative overflow-hidden rounded-[38px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl md:p-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-[#00F5FF]/12 blur-[120px]" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-[#5227FF]/18 blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[28px_28px] opacity-20" />
      </div>

      <div ref={scanRef} className="pointer-events-none absolute inset-y-0 left-0 w-[45%] bg-linear-to-r from-transparent via-[#00F5FF]/18 to-transparent blur-xl" />

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-7 flex flex-wrap items-center justify-between gap-4"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#00F5FF]/25 bg-[#00F5FF]/10 px-4 py-1.5 text-xs uppercase tracking-[0.28em] text-[#00F5FF]">
              <BrainCircuit size={12} /> RENOVA Repair Intelligence Engine
            </div>
            <h2 className="mt-3 text-3xl font-black text-white md:text-4xl">AI Repair Health Intelligence System</h2>
            <p className="mt-2 max-w-3xl text-sm text-white/65 md:text-base">
              Predictive diagnostics inspired by Tesla-grade telemetry and Jarvis-like contextual reasoning. Live scan confidence updates every few seconds.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0b1020]/75 p-4 text-right">
            <p className="text-xs uppercase tracking-[0.22em] text-white/45">Global Health Score</p>
            <p className="mt-2 text-4xl font-black text-[#00FFA3]">{overallHealth}%</p>
            <p className="text-xs text-white/50">Realtime predictive stability</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {devices.map((device, index) => {
                const status = getHealthStatus(device.score);
                const meta = STATUS_META[status];

                return (
                  <motion.div
                    key={device.key}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                    whileHover={{ y: -5, rotateX: 1.2, rotateY: -1.2 }}
                    className={`relative overflow-hidden rounded-[24px] border border-white/10 bg-[#08111f]/88 p-4 ${meta.glow}`}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,245,255,0.1),transparent_45%)]" />
                    <div className="relative">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs uppercase tracking-[0.2em] text-white/60">
                          <device.icon size={13} className="text-[#00F5FF]" /> {device.name}
                        </div>
                        <span className="text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: meta.color }}>
                          {meta.label}
                        </span>
                      </div>

                      <div className="mb-3 flex items-center justify-center">
                        <HealthRing score={device.score} ringClass={meta.ring} />
                      </div>

                      <p className="text-xs text-white/70">{device.prediction}</p>
                      <p className="mt-2 text-xs text-white/55">{device.recommendation}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div className="rounded-[24px] border border-white/10 bg-[#0a1324]/85 p-5">
                <h3 className="text-lg font-bold text-white">Predictive Maintenance Matrix</h3>
                <p className="mt-1 text-sm text-white/55">AI-generated opportunities to prevent future breakdowns.</p>
                <div className="mt-4 space-y-3">
                  {devices.slice(0, 4).map((device, idx) => (
                    <motion.div
                      key={`recommendation-${device.key}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 * idx }}
                      className="rounded-2xl border border-white/10 bg-black/20 p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-white">{device.name}</p>
                        <span className="rounded-full border border-[#00F5FF]/25 bg-[#00F5FF]/10 px-2 py-0.5 text-[11px] uppercase tracking-[0.16em] text-[#00F5FF]">
                          {device.nextServiceInDays}d
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-white/60">{device.recommendation}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-[#0a1324]/85 p-5">
                <h3 className="text-lg font-bold text-white">Smart Repair Timeline</h3>
                <p className="mt-1 text-sm text-white/55">AI-assisted maintenance sequencing for continuous reliability.</p>
                <div className="mt-4 space-y-4">
                  {[
                    { title: "Last Service", value: "2 months ago", icon: Timer, tone: "text-white" },
                    { title: "Next Recommended", value: "in 24 days", icon: Wrench, tone: "text-[#00F5FF]" },
                    { title: "Efficiency Trend", value: "Improving", icon: Gauge, tone: "text-[#00FFA3]" },
                    { title: "Anomaly Watch", value: "Battery + Cooling", icon: ShieldAlert, tone: "text-[#FFB020]" },
                  ].map((item, idx) => (
                    <div key={item.title} className="relative rounded-2xl border border-white/10 bg-black/20 p-3 pl-10">
                      <item.icon className={`absolute left-3 top-3 ${item.tone}`} size={15} />
                      <p className="text-xs uppercase tracking-[0.18em] text-white/45">{item.title}</p>
                      <p className={`mt-1 text-sm font-semibold ${item.tone}`}>{item.value}</p>
                      {idx < 3 ? <div className="absolute -bottom-3.5 left-4.5 h-3 border-l border-dashed border-white/20" /> : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-[#0b1220]/88 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">AI Analytics Dashboard</h3>
                  <p className="text-sm text-white/55">Repair frequency, optimization score, and future health projection.</p>
                </div>
                <div className="rounded-full border border-[#00F5FF]/25 bg-[#00F5FF]/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-[#00F5FF]">
                  Realtime
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <div ref={efficiencyChartRef} className="h-52 rounded-2xl border border-white/10 bg-black/20 p-3">
                  {efficiencyChartWidth > 0 ? (
                    <LineChart width={efficiencyChartWidth} height={184} data={EFFICIENCY_TREND}>
                        <CartesianGrid stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                        <XAxis dataKey="month" stroke="rgba(255,255,255,0.45)" tickLine={false} axisLine={false} />
                        <YAxis stroke="rgba(255,255,255,0.45)" tickLine={false} axisLine={false} domain={[60, 90]} />
                        <Tooltip
                          contentStyle={{
                            background: "#08111f",
                            border: "1px solid rgba(255,255,255,0.12)",
                            borderRadius: "12px",
                            color: "white",
                          }}
                        />
                        <Line type="monotone" dataKey="efficiency" stroke="#00F5FF" strokeWidth={2.4} dot={false} />
                        <Line type="monotone" dataKey="predicted" stroke="#00FFA3" strokeWidth={2.2} strokeDasharray="6 4" dot={false} />
                    </LineChart>
                  ) : (
                    <div className="h-full w-full rounded-2xl border border-dashed border-white/10 bg-white/5 animate-pulse" />
                  )}
                </div>

                <div ref={radarChartRef} className="h-52 rounded-2xl border border-white/10 bg-black/20 p-3">
                  {radarChartWidth > 0 ? (
                    <RadarChart width={radarChartWidth} height={184} data={OPTIMIZATION_RADAR}>
                        <PolarGrid stroke="rgba(255,255,255,0.15)" />
                        <PolarAngleAxis dataKey="metric" tick={{ fill: "rgba(255,255,255,0.65)", fontSize: 11 }} />
                        <Radar
                          name="Optimization"
                          dataKey="value"
                          stroke="#5227FF"
                          fill="#5227FF"
                          fillOpacity={0.32}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "#08111f",
                            border: "1px solid rgba(255,255,255,0.12)",
                            borderRadius: "12px",
                            color: "white",
                          }}
                        />
                    </RadarChart>
                  ) : (
                    <div className="h-full w-full rounded-2xl border border-dashed border-white/10 bg-white/5 animate-pulse" />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-[24px] border border-white/10 bg-[#0b1120]/90 p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#00F5FF]/25 bg-[#00F5FF]/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-[#00F5FF]">
                  <Bot size={12} /> RENOVA AI Assistant
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] uppercase tracking-[0.15em] text-white/55">
                  Live
                </span>
              </div>

              <div className="mb-4 flex items-center gap-3">
                <div ref={orbRef} className="relative h-11 w-11 rounded-full border border-[#00F5FF]/40 bg-[#00F5FF]/15">
                  <div className="absolute inset-2 rounded-full bg-[#00F5FF]/40" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Jarvis-grade maintenance intelligence</p>
                  <p className="text-xs text-white/50">Adaptive predictive context engine</p>
                </div>
              </div>

              <div className="min-h-20 rounded-2xl border border-white/10 bg-black/25 p-3 text-sm text-white/78">
                {typedMessage}
                <span className="ml-1 inline-block h-3 w-1 animate-pulse bg-[#00F5FF] align-middle" />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-white/70">
                <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <p className="text-white/45">Service Optimization</p>
                  <p className="mt-1 text-lg font-semibold text-[#00FFA3]">89%</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                  <p className="text-white/45">Prediction Confidence</p>
                  <p className="mt-1 text-lg font-semibold text-[#00F5FF]">93.4%</p>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-[#0b1120]/90 p-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-semibold text-white">AI Risk Detection System</h3>
                <AlertTriangle className="text-[#FFB020]" size={16} />
              </div>
              <div className="space-y-3">
                {riskSignals.map((risk, idx) => {
                  const tone =
                    risk.severity === "critical"
                      ? "border-[#FF4D6D]/35 bg-[#FF4D6D]/10"
                      : risk.severity === "high"
                        ? "border-[#FF7A59]/35 bg-[#FF7A59]/10"
                        : "border-[#FFB020]/35 bg-[#FFB020]/10";

                  return (
                    <motion.div
                      key={risk.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.06 * idx }}
                      className={`relative overflow-hidden rounded-2xl border p-3 ${tone}`}
                    >
                      <div className="absolute right-2 top-2 h-2 w-2 animate-pulse rounded-full bg-white/70" />
                      <p className="text-sm font-semibold text-white">{risk.title}</p>
                      <p className="mt-1 text-xs text-white/70">{risk.details}</p>
                      <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-white/75">{risk.impact}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-[24px] border border-[#FF4D6D]/30 bg-[#FF4D6D]/12 p-5">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#FF4D6D]/35 bg-black/25 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#FF9CB0]">
                <Zap size={12} /> Emergency Priority AI
              </div>
              <p className="text-xl font-black text-white">{emergencyPriority}</p>
              <p className="mt-2 text-sm text-white/80">Technician dispatch accelerated. Estimated response time improved by 28% under adaptive routing.</p>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-[#0b1120]/90 p-5">
              <h3 className="text-base font-semibold text-white">Device Monitoring Feed</h3>
              <div className="mt-3 space-y-2">
                {devices.map((device) => {
                  const status = getHealthStatus(device.score);
                  return (
                    <div key={`monitor-${device.key}`} className="rounded-xl border border-white/10 bg-black/20 px-3 py-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-white/80">{device.name}</p>
                        <p className="text-sm font-semibold" style={{ color: STATUS_META[status].color }}>
                          {device.score}%
                        </p>
                      </div>
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${device.score}%` }}
                          transition={{ duration: 0.8 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: STATUS_META[status].color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HealthRing({ score, ringClass }: { score: number; ringClass: string }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const dashOffset = circumference - progress;

  return (
    <div className="relative h-28 w-28">
      <svg viewBox="0 0 100 100" className="h-28 w-28 -rotate-90">
        <circle cx="50" cy="50" r={radius} className="fill-none stroke-white/10" strokeWidth="8" />
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          strokeWidth="8"
          className={`fill-none ${ringClass}`}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-center">
        <div>
          <p className="text-xl font-black text-white">{score}%</p>
          <p className="text-[10px] uppercase tracking-[0.16em] text-white/45">Health</p>
        </div>
      </div>
    </div>
  );
}
