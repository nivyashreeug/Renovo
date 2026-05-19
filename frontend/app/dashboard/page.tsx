"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const checkRoleAndRedirect = async () => {
            if (!loading) {
                if (!user) {
                    router.push("/login");
                    return;
                }

                // Try to get role from user_metadata first
                let role = user.user_metadata?.role;
                console.log("Role from user_metadata:", role);
                
                // If not in metadata, fetch from profiles table
                if (!role) {
                    console.log("Fetching role from profiles table...");
                    const { data: profile, error } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', user.id)
                        .single();
                        
                    if (error) {
                        console.error("Error fetching profile:", error);
                    }
                        
                    if (profile) {
                        role = profile.role;
                        console.log("Role from profiles table:", role);
                    }
                }
                
                console.log("Final resolved role:", role);
                
                // Redirect based on role (case-insensitive)
                if (role && role.toLowerCase() === "technician") {
                    router.push("/dashboard/technician");
                } else {
                    router.push("/dashboard/customer");
                }
            }
        };
        
        checkRoleAndRedirect();
    }, [user, loading, router]);

    // SHOW LOADING STATE WHILE CHECKING AUTH OR REDIRECTING
    return (
        <main className="min-h-screen bg-[#050816] text-white flex items-center justify-center relative overflow-hidden">
            {/* BACKGROUND GLOW */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#5227FF]/20 blur-[140px] rounded-full" />
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-6 relative z-10"
            >
                <div className="relative">
                    <div className="absolute inset-0 border-4 border-cyan-400/20 rounded-full"></div>
                    <Loader2 className="w-16 h-16 text-cyan-400 animate-spin relative z-10" />
                </div>
                <h1 className="text-2xl font-semibold text-white/90 tracking-wide">
                    {loading ? "Authenticating..." : "Routing to your Dashboard..."}
                </h1>
            </motion.div>
        </main>
    );
}