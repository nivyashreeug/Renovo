"use client"

import React, { useState } from "react"
import { motion, type Variants } from "framer-motion"
import {
  Bell, Lock, Shield, Eye, Volume2, MapPin, BarChart3, Zap, Radio, LogOut, Edit2,
  ToggleLeft, AlertCircle, MessageCircle, Clock, Smartphone
} from "lucide-react"
import { useAuth } from "@/providers/AuthProvider"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import AvailabilityToggle from "@/components/technician/AvailabilityToggle"

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <motion.button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex items-center h-8 w-14 rounded-full transition ${
        checked ? "bg-[#00F5FF]" : "bg-white/10"
      }`}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        initial={false}
        animate={{ x: checked ? 28 : 4 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="w-6 h-6 bg-white rounded-full shadow-lg"
      />
    </motion.button>
  )
}

export default function TechnicianSettingsPage() {
  const { user, profile, logout } = useAuth()
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  // Notification Settings
  const [notifications, setNotifications] = useState({
    assignments: true,
    emergencies: true,
    messages: true,
    reminders: true,
    completionAcknowledgment: true,
    pushEnabled: true,
    emailEnabled: false,
  })

  // Privacy & Security
  const [privacy, setPrivacy] = useState({
    showOnlineStatus: true,
    allowTracking: true,
    shareRatings: true,
    twoFactorEnabled: false,
    locationTracking: true,
  })

  // Preferences
  const [preferences, setPreferences] = useState({
    autoAcceptJobs: false,
    soundNotifications: true,
    vibration: true,
    darkMode: true,
    highContrastMode: false,
    animationsEnabled: true,
  })

  const handleSave = async () => {
    setSaving(true)
    try {
      // Simulate save
      await new Promise((resolve) => setTimeout(resolve, 500))
      toast.success("Settings saved successfully!")
    } catch (err) {
      console.error(err)
      toast.error("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Profile Section */}
      <motion.div
        variants={itemVariants}
        className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-white">Settings & Preferences</h2>
            <p className="text-sm text-white/55 mt-1">Manage your technician profile and operational preferences</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 rounded-xl border border-[#00F5FF]/20 bg-[#00F5FF]/10 px-4 py-2 text-sm text-[#00F5FF] hover:border-[#00F5FF]/40 transition"
          >
            <Edit2 size={16} />
            Edit Profile
          </motion.button>
        </div>

        {/* Profile Info Card */}
        <div className="rounded-xl border border-white/10 bg-[#050816]/60 p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#5227FF] to-[#00F5FF] flex items-center justify-center text-white font-bold text-xl">
              {profile?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "T"}
            </div>
            <div className="flex-1">
              <div className="text-lg font-semibold text-white">{profile?.full_name || user?.email?.split("@")[0] || "Technician"}</div>
              <div className="text-sm text-white/55 mt-1">{user?.email || "No email"}</div>
              <div className="text-xs text-white/45 mt-1">ID: {user?.id?.slice(0, 8) || "—"}...</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-[#00FFA3]">4.9★</div>
              <div className="text-xs text-white/45">Rating</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Availability & Status */}
      <motion.div
        variants={itemVariants}
        className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Radio size={20} className="text-[#00F5FF]" />
          Availability & Status
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-[#050816]/60 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-semibold text-white">Online Status</div>
                <div className="text-sm text-white/55 mt-1">Receive new job assignments</div>
              </div>
              <AvailabilityToggle />
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#050816]/60 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-semibold text-white">Auto-Accept Jobs</div>
                <div className="text-sm text-white/55 mt-1">Automatically accept suitable repairs</div>
              </div>
              <ToggleSwitch checked={preferences.autoAcceptJobs} onChange={(v) => setPreferences({ ...preferences, autoAcceptJobs: v })} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        variants={itemVariants}
        className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Bell size={20} className="text-[#00F5FF]" />
          Notification Preferences
        </h3>
        <div className="grid gap-3">
          {[
            {
              key: "assignments" as const,
              label: "New Job Assignments",
              description: "Get alerts when new jobs match your skills",
              icon: Zap,
            },
            {
              key: "emergencies" as const,
              label: "Emergency Requests",
              description: "Priority alerts for urgent repair requests",
              icon: AlertCircle,
            },
            {
              key: "messages" as const,
              label: "Customer Messages",
              description: "Notifications from customers",
              icon: MessageCircle,
            },
            {
              key: "reminders" as const,
              label: "Appointment Reminders",
              description: "Reminders before scheduled repairs",
              icon: Clock,
            },
            {
              key: "pushEnabled" as const,
              label: "Push Notifications",
              description: "Receive push notifications on mobile",
              icon: Smartphone,
            },
            {
              key: "emailEnabled" as const,
              label: "Email Notifications",
              description: "Receive email summaries",
              icon: MessageCircle,
            },
          ].map((setting) => {
            const Icon = setting.icon
            return (
              <div key={setting.key} className="rounded-xl border border-white/10 bg-[#050816]/60 p-4 flex items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-[#5227FF] to-[#00F5FF] text-white mt-1">
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="font-semibold text-white">{setting.label}</div>
                    <div className="text-sm text-white/55">{setting.description}</div>
                  </div>
                </div>
                <ToggleSwitch
                  checked={notifications[setting.key]}
                  onChange={(v) => setNotifications({ ...notifications, [setting.key]: v })}
                />
              </div>
            )
          })}

          <div className="rounded-xl border border-white/10 bg-[#050816]/60 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="font-semibold text-white">Sound Notifications</div>
                <div className="text-sm text-white/55 mt-1">Audio alerts for new events</div>
              </div>
              <ToggleSwitch checked={preferences.soundNotifications} onChange={(v) => setPreferences({ ...preferences, soundNotifications: v })} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Privacy & Security */}
      <motion.div
        variants={itemVariants}
        className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Shield size={20} className="text-[#00FFA3]" />
          Privacy & Security
        </h3>
        <div className="grid gap-3">
          {[
            {
              key: "showOnlineStatus" as const,
              label: "Show Online Status",
              description: "Let customers see when you're available",
              icon: Eye,
            },
            {
              key: "allowTracking" as const,
              label: "Allow Location Tracking",
              description: "Enable live location sharing during repairs",
              icon: MapPin,
            },
            {
              key: "shareRatings" as const,
              label: "Share Ratings Publicly",
              description: "Display your ratings on your profile",
              icon: BarChart3,
            },
            {
              key: "locationTracking" as const,
              label: "Live Tracking",
              description: "Allow customers to track your real-time location",
              icon: Radio,
            },
          ].map((setting) => {
            const Icon = setting.icon
            return (
              <div key={setting.key} className="rounded-xl border border-white/10 bg-[#050816]/60 p-4 flex items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-[#00FFA3] to-[#5227FF] text-white mt-1">
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="font-semibold text-white">{setting.label}</div>
                    <div className="text-sm text-white/55">{setting.description}</div>
                  </div>
                </div>
                <ToggleSwitch
                  checked={privacy[setting.key]}
                  onChange={(v) => setPrivacy({ ...privacy, [setting.key]: v })}
                />
              </div>
            )
          })}

          <div className="rounded-xl border border-[#FF4D6D]/10 bg-[#FF4D6D]/5 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-[#FF4D6D] to-[#FFB020] text-white mt-1">
                  <Lock size={18} />
                </div>
                <div>
                  <div className="font-semibold text-white">Two-Factor Authentication</div>
                  <div className="text-sm text-white/55">Add extra security to your account</div>
                </div>
              </div>
              <ToggleSwitch checked={privacy.twoFactorEnabled} onChange={(v) => setPrivacy({ ...privacy, twoFactorEnabled: v })} />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Display Preferences */}
      <motion.div
        variants={itemVariants}
        className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Eye size={20} className="text-[#5227FF]" />
          Display & Accessibility
        </h3>
        <div className="grid gap-3">
          {[
            {
              key: "soundNotifications" as const,
              label: "Sound Effects",
              description: "Enable audio feedback and alerts",
              icon: Volume2,
            },
            {
              key: "vibration" as const,
              label: "Haptic Feedback",
              description: "Vibration for notifications and actions",
              icon: ToggleLeft,
            },
            {
              key: "animationsEnabled" as const,
              label: "Smooth Animations",
              description: "Enable UI animations and transitions",
              icon: Zap,
            },
            {
              key: "highContrastMode" as const,
              label: "High Contrast Mode",
              description: "Increase visual contrast for accessibility",
              icon: Eye,
            },
          ].map((setting) => {
            const Icon = setting.icon
            return (
              <div key={setting.key} className="rounded-xl border border-white/10 bg-[#050816]/60 p-4 flex items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-[#5227FF] to-[#00FFA3] text-white mt-1">
                    <Icon size={18} />
                  </div>
                  <div>
                    <div className="font-semibold text-white">{setting.label}</div>
                    <div className="text-sm text-white/55">{setting.description}</div>
                  </div>
                </div>
                <ToggleSwitch
                  checked={preferences[setting.key]}
                  onChange={(v) => setPreferences({ ...preferences, [setting.key]: v })}
                />
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        variants={itemVariants}
        className="grid gap-3 md:grid-cols-2"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={saving}
          className="rounded-xl border border-[#00F5FF]/20 bg-[#00F5FF]/10 px-6 py-3 font-semibold text-[#00F5FF] hover:border-[#00F5FF]/40 transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            logout()
            router.push("/login")
          }}
          className="rounded-xl border border-[#FF4D6D]/20 bg-[#FF4D6D]/10 px-6 py-3 font-semibold text-[#FF4D6D] hover:border-[#FF4D6D]/40 transition flex items-center justify-center gap-2"
        >
          <LogOut size={16} />
          Logout
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
