"use client";

import React, { useState } from "react";

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="grid gap-6 max-w-2xl">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Theme</h3>
            <p className="text-sm text-white/60">Toggle between cinematic and standard themes.</p>
          </div>
          <label className="inline-flex items-center">
            <input type="checkbox" checked={darkMode} onChange={() => setDarkMode((s) => !s)} className="mr-2" />
            <span className="text-sm">Cinematic</span>
          </label>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Notifications</h3>
            <p className="text-sm text-white/60">Receive booking and technician updates.</p>
          </div>
          <label className="inline-flex items-center">
            <input type="checkbox" checked={notifications} onChange={() => setNotifications((s) => !s)} className="mr-2" />
            <span className="text-sm">Enabled</span>
          </label>
        </div>
      </div>
    </div>
  );
}
