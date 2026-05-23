"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import {
  User, Mail, Lock, Wrench, ShieldCheck, CheckCircle2, AlertCircle,
  Eye, EyeOff, Loader2, ArrowRight, ArrowLeft, Zap
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/shared/Logo";
import {
  getDashboardRouteFromRole,
  syncProfileFromAuthUser,
} from "@/lib/dashboard-routing";
import { buildAuthUrl } from "@/lib/auth-urls";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer"
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isMounted] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP background animations
    const ctx = gsap.context(() => {
      gsap.to(blob1Ref.current, {
        x: "random(-100, 100)",
        y: "random(-100, 100)",
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      gsap.to(blob2Ref.current, {
        x: "random(-150, 150)",
        y: "random(-150, 150)",
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // clear error
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const setRole = (role: string) => {
    setFormData({ ...formData, role });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const loginRedirectUrl = "https://renovo-gilt.vercel.app/login/callback";

      if (!loginRedirectUrl) {
        throw new Error("Missing base URL for auth redirects. Set NEXT_PUBLIC_SITE_URL in production.");
      }

      // CREATE AUTH USER
      const { data, error } =
        await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,

          options: {
            emailRedirectTo: loginRedirectUrl,

            data: {
              full_name: formData.fullName,
              role: formData.role,
            },
          },
        });

      if (error) {
        setErrors({
          email: error.message,
        });
        return;
      }

      if (data.user) {
        const targetRoute = getDashboardRouteFromRole(formData.role);

        // Do not block navigation on profile sync.
        void syncProfileFromAuthUser(
          data.user,
          formData.fullName,
          formData.role
        );

        if (data.session) {
          router.replace(targetRoute);
          return;
        }

        // Fallback: if signUp returned no session, try immediate sign-in.
        const { data: loginData } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (loginData.session) {
          router.replace(targetRoute);
          return;
        }
      }

      setIsSuccess(true);
    } catch {
      setErrors({
        email:
          "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen w-full bg-[#050816] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#5227FF] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#050816] flex flex-col lg:flex-row overflow-hidden font-sans text-white selection:bg-[#5227FF] selection:text-white" ref={containerRef}>

      {/* LEFT SIDE - VISUALS */}
      <div className="relative w-full lg:w-1/2 min-h-[50vh] lg:min-h-screen flex flex-col justify-between p-8 lg:p-16 z-10 overflow-hidden border-b lg:border-b-0 lg:border-r border-[#5227FF]/20">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-[#050816]/40 via-[#050816] to-[#050816]" />
          <div ref={blob1Ref} className="absolute top-1/4 left-1/4 w-125 h-125 bg-[#5227FF] rounded-full blur-[120px] opacity-20 mix-blend-screen pointer-events-none" />
          <div ref={blob2Ref} className="absolute bottom-1/4 right-1/4 w-100 h-100 bg-[#00F5FF] rounded-full blur-[100px] opacity-10 mix-blend-screen pointer-events-none" />
          {/* Cyber grid */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <div className="absolute inset-0 bg-linear-to-t from-[#050816] via-transparent to-[#050816] pointer-events-none" />
        </div>

        {/* Top: Navigation & Logo */}
        <div className="relative z-20 flex items-center gap-5">
          <Link
            href="/"
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/3 border border-white/10 hover:bg-white/8 hover:border-[#00F5FF]/30 hover:shadow-[0_0_15px_rgba(0,245,255,0.15)] transition-all duration-300 backdrop-blur-md"
            title="Back to Home"
          >
            <ArrowLeft className="w-4 h-4 text-white/60 group-hover:text-[#00F5FF] transition-all group-hover:-translate-x-0.5 duration-300" />
          </Link>
          <div className="w-px h-6 bg-white/10" />
          <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
            <Logo />
          </Link>
        </div>

        {/* Center: Hero Typography & Floating UI */}
        <div className="relative z-20 my-12 lg:my-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#00F5FF]/10 border border-[#00F5FF]/20 backdrop-blur-md mb-6">
              <span className="text-[#00F5FF] text-xs font-bold tracking-widest uppercase flex items-center gap-2">
                <Zap className="w-3 h-3" />
                Next-Gen Repair Platform
              </span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6 tracking-tight">
              Join the <span className="text-transparent bg-clip-text bg-linear-to-r from-[#5227FF] to-[#00F5FF]">Future</span><br />
              of Repair Services
            </h1>

            <p className="text-lg text-white/60 max-w-lg leading-relaxed font-light">
              Create your RENOVA account and experience intelligent repair technology powered by realtime tracking and verified professionals.
            </p>
          </motion.div>

          {/* Professional Floating Visuals */}
          <div className="mt-12 relative h-70 hidden sm:block">
            {/* Main Image */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-64 h-48 rounded-2xl overflow-hidden border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10"
            >
              <img src="https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Professional Repair" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-linear-to-t from-[#050816] via-transparent to-transparent opacity-80" />
            </motion.div>

            {/* Floating Image 2 */}
            <motion.div
              animate={{ y: [15, -15, 15] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-16 left-48 w-48 h-40 rounded-2xl overflow-hidden border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.6)] z-20"
            >
              <img src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" alt="Circuit Board" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-[#00F5FF]/20 mix-blend-overlay" />
            </motion.div>

            {/* Overlay UI Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: [-5, 5, -5], opacity: 1 }}
              transition={{ y: { duration: 5, repeat: Infinity, ease: "easeInOut" }, opacity: { duration: 0.8, delay: 0.2 } }}
              className="absolute -bottom-4 left-10 p-3 rounded-xl bg-[#0A0D1E]/90 border border-white/10 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center gap-3 w-56 z-30"
            >
              <div className="w-8 h-8 rounded-full bg-[#00FFA3]/20 flex items-center justify-center border border-[#00FFA3]/30">
                <ShieldCheck className="w-4 h-4 text-[#00FFA3]" />
              </div>
              <div>
                <div className="text-[10px] text-white/50 uppercase tracking-wider mb-0.5">Verification</div>
                <div className="text-xs font-semibold text-white/90">100% Secure Platform</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom: Social Proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="relative z-20 mt-8 lg:mt-0"
        >
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#050816] overflow-hidden bg-gray-800">
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-[#050816] bg-[#2A2D3A] flex items-center justify-center text-xs font-bold text-white">
                +5k
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 mb-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg key={i} className="w-3.5 h-3.5 text-[#00FFA3] fill-[#00FFA3]" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div className="text-sm text-white/60 font-medium">Trusted by 5000+ Users</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center p-6 lg:p-16 relative">
        {/* Subtle Form Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[#5227FF]/10 rounded-[100px] blur-[100px] pointer-events-none" />

        <div className="w-full max-w-95 relative z-10">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="bg-[#0A0D1E]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 lg:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative overflow-hidden"
              >
                {/* Internal Card Glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#5227FF]/20 rounded-full blur-[60px]" />

                <h2 className="text-2xl font-bold mb-2 text-white">Create Account</h2>
                <p className="text-white/50 text-sm mb-8">Join the elite network of repair professionals and customers.</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Role Selection */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <button
                      type="button"
                      onClick={() => setRole("customer")}
                      className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 overflow-hidden group ${formData.role === "customer"
                          ? "bg-[#5227FF]/10 border-[#5227FF] shadow-[0_0_20px_rgba(82,39,255,0.2)]"
                            : "bg-white/2 border-white/10 hover:bg-white/5"
                        }`}
                    >
                      {formData.role === "customer" && (
                        <motion.div layoutId="role-glow" className="absolute inset-0 bg-linear-to-b from-[#5227FF]/20 to-transparent opacity-50" />
                      )}
                      <User className={`w-6 h-6 mb-2 transition-colors ${formData.role === "customer" ? "text-[#00F5FF]" : "text-white/40 group-hover:text-white/60"}`} />
                      <span className={`text-sm font-medium transition-colors ${formData.role === "customer" ? "text-white" : "text-white/40 group-hover:text-white/60"}`}>Customer</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole("technician")}
                      className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 overflow-hidden group ${formData.role === "technician"
                          ? "bg-[#5227FF]/10 border-[#5227FF] shadow-[0_0_20px_rgba(82,39,255,0.2)]"
                            : "bg-white/2 border-white/10 hover:bg-white/5"
                        }`}
                    >
                      {formData.role === "technician" && (
                        <motion.div layoutId="role-glow" className="absolute inset-0 bg-linear-to-b from-[#5227FF]/20 to-transparent opacity-50" />
                      )}
                      <Wrench className={`w-6 h-6 mb-2 transition-colors ${formData.role === "technician" ? "text-[#00F5FF]" : "text-white/40 group-hover:text-white/60"}`} />
                      <span className={`text-sm font-medium transition-colors ${formData.role === "technician" ? "text-white" : "text-white/40 group-hover:text-white/60"}`}>Technician</span>
                    </button>
                  </div>

                  {/* Inputs */}
                  <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <div className={`relative flex items-center rounded-xl bg-black/40 border transition-all duration-300 ${errors.fullName ? "border-[#FF4D6D] shadow-[0_0_15px_rgba(255,77,109,0.2)]" : "border-white/10 focus-within:border-[#5227FF] focus-within:shadow-[0_0_15px_rgba(82,39,255,0.2)]"}`}>
                        <div className="pl-4 pr-2 text-white/40">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          name="fullName"
                          placeholder="Full Name"
                          value={formData.fullName}
                          onChange={handleChange}
                          className="w-full bg-transparent py-3.5 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none"
                          data-gramm="false" data-gramm_editor="false" data-enable-grammarly="false" spellCheck="false" autoComplete="off" suppressHydrationWarning
                        />
                      </div>
                      <AnimatePresence>
                        {errors.fullName && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-[#FF4D6D] text-xs mt-1.5 ml-1 flex items-center gap-1 overflow-hidden">
                            <AlertCircle className="w-3 h-3" /> {errors.fullName}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Email */}
                    <div>
                      <div className={`relative flex items-center rounded-xl bg-black/40 border transition-all duration-300 ${errors.email ? "border-[#FF4D6D] shadow-[0_0_15px_rgba(255,77,109,0.2)]" : "border-white/10 focus-within:border-[#5227FF] focus-within:shadow-[0_0_15px_rgba(82,39,255,0.2)]"}`}>
                        <div className="pl-4 pr-2 text-white/40">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          placeholder="Email Address"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full bg-transparent py-3.5 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none"
                          data-gramm="false" data-gramm_editor="false" data-enable-grammarly="false" spellCheck="false" autoComplete="off" suppressHydrationWarning
                        />
                      </div>
                      <AnimatePresence>
                        {errors.email && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-[#FF4D6D] text-xs mt-1.5 ml-1 flex items-center gap-1 overflow-hidden">
                            <AlertCircle className="w-3 h-3" /> {errors.email}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Password */}
                    <div>
                      <div className={`relative flex items-center rounded-xl bg-black/40 border transition-all duration-300 ${errors.password ? "border-[#FF4D6D] shadow-[0_0_15px_rgba(255,77,109,0.2)]" : "border-white/10 focus-within:border-[#5227FF] focus-within:shadow-[0_0_15px_rgba(82,39,255,0.2)]"}`}>
                        <div className="pl-4 pr-2 text-white/40">
                          <Lock className="w-4 h-4" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full bg-transparent py-3.5 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none"
                          data-gramm="false" data-gramm_editor="false" data-enable-grammarly="false" spellCheck="false" autoComplete="off" suppressHydrationWarning
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="pr-4 text-white/40 hover:text-white transition-colors focus:outline-none">
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <AnimatePresence>
                        {errors.password && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-[#FF4D6D] text-xs mt-1.5 ml-1 flex items-center gap-1 overflow-hidden">
                            <AlertCircle className="w-3 h-3" /> {errors.password}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <div className={`relative flex items-center rounded-xl bg-black/40 border transition-all duration-300 ${errors.confirmPassword ? "border-[#FF4D6D] shadow-[0_0_15px_rgba(255,77,109,0.2)]" : "border-white/10 focus-within:border-[#5227FF] focus-within:shadow-[0_0_15px_rgba(82,39,255,0.2)]"}`}>
                        <div className="pl-4 pr-2 text-white/40">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="confirmPassword"
                          placeholder="Confirm Password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full bg-transparent py-3.5 pr-4 text-sm text-white placeholder:text-white/30 focus:outline-none"
                          data-gramm="false" data-gramm_editor="false" data-enable-grammarly="false" spellCheck="false" autoComplete="off" suppressHydrationWarning
                        />
                      </div>
                      <AnimatePresence>
                        {errors.confirmPassword && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-[#FF4D6D] text-xs mt-1.5 ml-1 flex items-center gap-1 overflow-hidden">
                            <AlertCircle className="w-3 h-3" /> {errors.confirmPassword}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting}
                    className="relative w-full py-4 mt-6 rounded-xl bg-linear-to-r from-[#5227FF] to-[#00F5FF] text-white font-semibold text-sm tracking-wide shadow-[0_0_20px_rgba(82,39,255,0.4)] overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        <>
                          Create Account
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </span>
                  </motion.button>

                  <p className="text-center text-xs text-white/50 mt-4">
                    Already have an account? <Link href="/login" className="text-[#00F5FF] hover:text-white transition-colors hover:underline">Log in</Link>
                  </p>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#0A0D1E]/80 backdrop-blur-2xl border border-[#00FFA3]/30 rounded-3xl p-10 shadow-[0_20px_60px_rgba(0,255,163,0.15)] flex flex-col items-center text-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,255,163,0.1),transparent)]" />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-20 h-20 bg-[#00FFA3]/20 rounded-full flex items-center justify-center mb-6 border border-[#00FFA3]/50 relative z-10 shadow-[0_0_30px_rgba(0,255,163,0.3)]"
                >
                  <CheckCircle2 className="w-10 h-10 text-[#00FFA3]" />
                </motion.div>
                <h2 className="text-2xl font-bold mb-2 relative z-10 text-white">Welcome to RENOVA</h2>
                <p className="text-white/60 text-sm mb-8 relative z-10">
                  Your account has been created successfully. Experience the future of repair services.
                </p>
                <Link href="/dashboard" className="relative z-10 w-full py-3.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all font-medium text-sm text-white flex items-center justify-center gap-2 group">
                  Go to Dashboard <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
