"use client";

import React from "react";
import NotificationPanel from "@/components/dashboard/NotificationPanel";

export default function NotificationsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      <NotificationPanel />
    </div>
  );
}
