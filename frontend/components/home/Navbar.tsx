"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import GooeyNav from "@/components/effects/GooeyNav";
import Logo from "@/components/shared/Logo";

const navItems = [
  { label: "Home", href: "/", sectionId: "home" },
  { label: "Services", href: "/services", sectionId: "services" },
  { label: "Technicians", href: "/technicians", sectionId: "technicians" },
  { label: "Reviews", href: "/reviews", sectionId: "reviews" },
  { label: "Contacts", href: "/contacts", sectionId: "contacts" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Intersection Observer for active section detection
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          const index = navItems.findIndex((item) => item.sectionId === sectionId);
          if (index !== -1) {
            setActiveIndex(index);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    navItems.forEach((item) => {
      const section = document.getElementById(item.sectionId);
      if (section) {
        observer.observe(section);
      }
    });

    return () => {
      navItems.forEach((item) => {
        const section = document.getElementById(item.sectionId);
        if (section) {
          observer.unobserve(section);
        }
      });
    };
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${scrolled ? "py-4" : "py-6"
        }`}
    >
      {/* Separate Background Layer to prevent mix-blend-mode compositing bugs */}
      <div
        className={`absolute inset-0 transition-all duration-500 -z-10 ${scrolled
            ? "bg-[#050816]/70 backdrop-blur-md border-b border-[#5227FF]/20 shadow-[0_4px_30px_rgba(82,39,255,0.1)]"
            : "bg-transparent"
          }`}
      />

      <div className="w-full px-8 md:px-16 flex items-center justify-between relative">
        {/* LEFT: Logo */}
        <Link href="/" className="z-50">
          <Logo />
        </Link>

        {/* CENTER: GooeyNav */}
        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2">
          <div className="relative">
            <GooeyNav
              items={navItems}
              particleCount={15}
              particleDistances={[90, 10]}
              particleR={100}
              initialActiveIndex={0}
              currentActiveIndex={activeIndex}
              animationTime={600}
              timeVariance={300}
              colors={[1, 2, 3, 1, 2, 3, 1, 4]}
            />
          </div>
        </div>

        {/* RIGHT: Buttons */}
        <div className="hidden lg:flex items-center gap-8 z-50 ml-auto">
          <Link
            href="/login"
            className="relative group px-5 py-2 rounded-full border border-[#5227FF]/50 text-white font-medium text-sm overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#5227FF]/20 to-[#8B5CF6]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 group-hover:text-[#00F5FF] transition-colors duration-300">
              Login
            </span>
          </Link>
          <Link
            href="/signup"
            className="relative group px-5 py-2 rounded-full border border-[#5227FF]/50 text-white font-medium text-sm overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#5227FF]/20 to-[#8B5CF6]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 group-hover:text-[#00F5FF] transition-colors duration-300">
              Sign Up
            </span>
          </Link>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative px-6 py-2.5 rounded-full bg-[#FF4D6D] text-white font-semibold text-sm tracking-wide shadow-[0_0_20px_rgba(255,77,109,0.4)] overflow-hidden group border border-[#FF4D6D]/50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF4D6D] to-[#8B5CF6] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute -inset-1 bg-[#FF4D6D] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
            <span className="relative z-10 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Emergency Booking
            </span>
          </motion.button>
        </div>

        {/* Mobile Menu Button */}
        <button className="lg:hidden text-white p-2 z-50 relative">
          <div className="w-6 h-0.5 bg-white mb-1.5" />
          <div className="w-6 h-0.5 bg-white mb-1.5" />
          <div className="w-4 h-0.5 bg-white" />
        </button>
      </div>
    </motion.nav>
  );
}
