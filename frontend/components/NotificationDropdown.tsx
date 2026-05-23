"use client";

import React, { useState } from "react";
import { useNotifications } from "@/providers/NotificationProvider";

export default function NotificationDropdown() {
  const { notifications, unreadCount, markAllRead } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        aria-label="Notifications"
        className="relative p-2 rounded-full hover:bg-white/5"
        onClick={() => {
          setOpen((v) => !v);
          if (!open) markAllRead();
        }}
      >
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-violet-500/10 rounded-full flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 text-xs bg-rose-500 text-white rounded-full px-1.5">{unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-[#071028] border border-white/6 rounded-lg shadow-lg p-3 z-50">
          <div className="text-sm font-semibold mb-2">Notifications</div>
          <div className="max-h-64 overflow-auto space-y-2">
            {notifications.length === 0 && <div className="text-xs text-white/40">No notifications yet</div>}
            {notifications.map((n) => (
              <div key={n.id} className="p-2 rounded-md hover:bg-white/3">
                <div className="text-sm font-medium">{n.title}</div>
                {n.body && <div className="text-xs text-white/60 truncate">{n.body}</div>}
                <div className="text-[10px] text-white/40 mt-1">{new Date(n.created_at).toLocaleTimeString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
