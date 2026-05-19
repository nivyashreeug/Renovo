"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import {
    ArrowLeft,
    Mail,
    Lock,
    Wrench,
    ShieldCheck,
    Zap,
} from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        const { data, error } =
            await supabase.auth.signInWithPassword({
                email,
                password,
            });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        console.log("Logged in user:", data.user);

        setLoading(false);

        window.location.href = "/dashboard";
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#050816] text-white flex items-center justify-center px-6 py-10">
            {/* BACKGROUND GLOW */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#5227FF]/20 blur-[140px] rounded-full" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/20 blur-[140px] rounded-full" />
            </div>

            {/* GRID OVERLAY */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:40px_40px]" />

            {/* MAIN CONTAINER */}
            <div className="relative z-10 w-full max-w-7xl grid lg:grid-cols-2 gap-10 items-center">
                {/* LEFT SIDE */}
                <motion.div
                    initial={{ opacity: 0, x: -60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                    className="hidden lg:flex flex-col justify-center"
                >
                    {/* BACK BUTTON */}
                    <Link
                        href="/"
                        className="mb-10 flex items-center gap-2 text-white/70 hover:text-cyan-400 transition-all duration-300"
                    >
                        <ArrowLeft size={18} />
                        Back to Home
                    </Link>

                    {/* TITLE */}
                    <h1 className="text-6xl xl:text-7xl font-black leading-tight tracking-tight">
                        Welcome Back to
                        <span className="block bg-gradient-to-r from-[#5227FF] to-cyan-400 bg-clip-text text-transparent">
                            RENOVA
                        </span>
                    </h1>

                    {/* SUBTITLE */}
                    <p className="mt-6 text-lg text-white/70 max-w-xl leading-relaxed">
                        Access your futuristic repair dashboard,
                        track realtime bookings, connect with
                        verified technicians, and experience
                        intelligent repair services.
                    </p>

                    {/* FEATURE CARDS */}
                    <div className="mt-12 grid grid-cols-2 gap-5">
                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-[0_0_40px_rgba(82,39,255,0.15)]"
                        >
                            <Zap className="text-cyan-400 mb-4" />
                            <h3 className="font-semibold text-lg">
                                Realtime Tracking
                            </h3>
                            <p className="text-white/60 text-sm mt-2">
                                Live technician movement and
                                intelligent repair status updates.
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.03 }}
                            className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 shadow-[0_0_40px_rgba(0,245,255,0.15)]"
                        >
                            <ShieldCheck className="text-[#00FFA3] mb-4" />
                            <h3 className="font-semibold text-lg">
                                Verified Experts
                            </h3>
                            <p className="text-white/60 text-sm mt-2">
                                Trusted professionals with ratings,
                                reviews, and smart booking systems.
                            </p>
                        </motion.div>
                    </div>

                    {/* SOCIAL PROOF */}
                    <div className="mt-12 flex items-center gap-6">
                        <div>
                            <h2 className="text-4xl font-bold text-cyan-400">
                                5000+
                            </h2>
                            <p className="text-white/60 text-sm">
                                Repairs Completed
                            </p>
                        </div>

                        <div>
                            <h2 className="text-4xl font-bold text-[#00FFA3]">
                                1200+
                            </h2>
                            <p className="text-white/60 text-sm">
                                Verified Technicians
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* RIGHT SIDE */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="relative"
                >
                    {/* GLOW */}
                    <div className="absolute -inset-1 rounded-[40px] bg-gradient-to-r from-[#5227FF]/40 to-cyan-400/40 blur-2xl opacity-50" />

                    {/* CARD */}
                    <div className="relative rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-2xl p-8 md:p-12 shadow-[0_0_80px_rgba(82,39,255,0.2)]">
                        {/* MOBILE BACK BUTTON */}
                        <Link
                            href="/"
                            className="lg:hidden mb-8 flex items-center gap-2 text-white/70 hover:text-cyan-400 transition-all duration-300"
                        >
                            <ArrowLeft size={18} />
                            Back to Home
                        </Link>

                        {/* FORM HEADER */}
                        <div className="mb-10">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 text-sm mb-6">
                                <Wrench size={16} />
                                Secure Authentication
                            </div>

                            <h2 className="text-4xl md:text-5xl font-black">
                                Login
                            </h2>

                            <p className="mt-4 text-white/60 leading-relaxed">
                                Continue your futuristic repair
                                experience with RENOVA.
                            </p>
                        </div>

                        {/* ERROR */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-300 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        {/* FORM */}
                        <form
                            onSubmit={handleLogin}
                            className="space-y-6"
                        >
                            {/* EMAIL */}
                            <div>
                                <label className="mb-2 block text-sm text-white/70">
                                    Email Address
                                </label>

                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" size={18} />

                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                        placeholder="Enter your email"
                                        className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-4 outline-none backdrop-blur-xl transition-all duration-300 focus:border-cyan-400/40 focus:shadow-[0_0_30px_rgba(0,245,255,0.15)]"
                                    />
                                </div>
                            </div>

                            {/* PASSWORD */}
                            <div>
                                <label className="mb-2 block text-sm text-white/70">
                                    Password
                                </label>

                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400" size={18} />

                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        required
                                        placeholder="Enter your password"
                                        className="w-full rounded-2xl border border-white/10 bg-white/5 pl-12 pr-4 py-4 outline-none backdrop-blur-xl transition-all duration-300 focus:border-cyan-400/40 focus:shadow-[0_0_30px_rgba(0,245,255,0.15)]"
                                    />
                                </div>
                            </div>

                            {/* LOGIN BUTTON */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#5227FF] to-cyan-400 py-4 font-semibold text-white shadow-[0_0_50px_rgba(82,39,255,0.4)]"
                            >
                                <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 bg-white/10" />

                                <span className="relative z-10">
                                    {loading
                                        ? "Signing In..."
                                        : "Login to RENOVA"}
                                </span>
                            </motion.button>
                        </form>

                        {/* FOOTER */}
                        <div className="mt-8 text-center text-white/60 text-sm">
                            Don’t have an account?{" "}
                            <Link
                                href="/signup"
                                className="text-cyan-400 hover:text-cyan-300 transition-colors"
                            >
                                Create Account
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}