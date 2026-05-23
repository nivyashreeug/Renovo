import type { Metadata } from "next";
import "./globals.css";

import { AuthProvider } from "@/providers/AuthProvider";
import { NotificationProvider } from "@/providers/NotificationProvider";
import NotificationDropdown from "@/components/NotificationDropdown";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "RENOVA",
  description: "Futuristic Repair Marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>
          <NotificationProvider>
            <div className="fixed top-4 right-4 z-50">
              <NotificationDropdown />
            </div>
            {children}
            <Toaster
              richColors
              closeButton
              position="top-right"
              toastOptions={{
                style: {
                  background: "#0b1020",
                  color: "#ffffff",
                  border: "1px solid rgba(255,255,255,0.12)",
                },
              }}
            />
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
