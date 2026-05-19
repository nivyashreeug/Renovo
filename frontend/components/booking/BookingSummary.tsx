"use client";

import { motion } from "framer-motion";
import { Wrench, User, Calendar, MapPin, Receipt, ArrowRight, Loader2 } from "lucide-react";

interface ServiceSummary {
  title: string;
  price: string;
}

interface TechnicianSummary {
  name: string;
  price: string;
  eta: string;
}

interface AddressSummary {
  address: string;
  apartment: string;
  city: string;
  zipCode: string;
}

interface PaymentSummary {
  label: string;
}

interface BookingSummaryProps {
  service: ServiceSummary | null;
  technician: TechnicianSummary | null;
  date: Date | null;
  time: string | null;
  address: AddressSummary;
  paymentMethod: PaymentSummary | null;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function BookingSummary({
  service,
  technician,
  date,
  time,
  address,
  paymentMethod,
  onConfirm,
  isSubmitting,
}: BookingSummaryProps) {
  const isReady = service && technician && date && time && address.address && address.city && address.zipCode && paymentMethod;
  
  // Base price for calculation
  const servicePrice = service ? parseInt(service.price.replace(/[^0-9]/g, "")) : 0;
  const techFee = technician ? parseInt(technician.price.replace(/[^0-9]/g, "")) : 0;
  const subtotal = servicePrice + techFee;
  const tax = subtotal * 0.18; // 18% tax
  const total = subtotal + tax;

  return (
    <div className="sticky top-24 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl xl:p-8">
      {/* Background ambient light */}
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-[#5227FF]/10 via-transparent to-[#00F5FF]/10 opacity-50 blur-3xl" />
      
      <h3 className="mb-6 flex items-center gap-3 text-2xl font-bold text-white font-space-grotesk">
        <Receipt className="h-6 w-6 text-[#00F5FF]" />
        Booking Summary
      </h3>

      <div className="space-y-6">
        {/* Service Item */}
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10">
            <Wrench className="h-5 w-5 text-white/70" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-white/40">Selected Service</p>
            <p className="font-semibold text-white">
              {service ? service.title : <span className="text-white/30 italic">Not selected</span>}
            </p>
          </div>
          {service && <div className="text-right font-semibold text-white">₹{servicePrice}</div>}
        </div>

        {/* Technician Item */}
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 overflow-hidden">
            {technician ? (
              <div className="flex h-full w-full items-center justify-center bg-zinc-800 text-lg font-bold text-white">
                {technician.name.charAt(0)}
              </div>
            ) : (
              <User className="h-5 w-5 text-white/70" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm text-white/40">Technician</p>
            <p className="font-semibold text-white">
              {technician ? technician.name : <span className="text-white/30 italic">Not selected</span>}
            </p>
          </div>
          {technician && <div className="text-right font-semibold text-white">₹{techFee}</div>}
        </div>

        {/* Schedule Item */}
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10">
            <Calendar className="h-5 w-5 text-white/70" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-white/40">Schedule</p>
            <p className="font-semibold text-white">
              {date && time ? (
                `${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })} at ${time}`
              ) : (
                <span className="text-white/30 italic">Not selected</span>
              )}
            </p>
          </div>
        </div>

        {/* Address Item */}
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10">
            <MapPin className="h-5 w-5 text-white/70" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-white/40">Location</p>
            <p className="line-clamp-2 text-sm font-semibold text-white leading-tight">
              {address.address && address.city ? (
                `${address.address}${address.apartment ? `, ${address.apartment}` : ''}, ${address.city} ${address.zipCode}`
              ) : (
                <span className="text-white/30 italic font-normal text-base">Not provided</span>
              )}
            </p>
          </div>
        </div>

        {/* Pricing Divider */}
        <div className="my-6 border-t border-white/10"></div>

        {/* Pricing Details */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Subtotal</span>
            <span className="text-white font-medium">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Taxes (18%)</span>
            <span className="text-white font-medium">₹{tax.toFixed(2)}</span>
          </div>
          
          <div className="mt-4 flex justify-between rounded-xl bg-white/5 p-4 border border-white/10">
            <span className="font-bold text-white font-space-grotesk text-lg">Total</span>
            <span className="font-bold text-[#00FFA3] text-lg">₹{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Live ETA Preview (mock) */}
        {technician && (
          <div className="rounded-xl border border-[#00F5FF]/20 bg-[#00F5FF]/5 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#00F5FF] uppercase tracking-wider">Live ETA</span>
              <span className="text-xs font-bold text-white">{technician.eta}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
              <motion.div 
                className="h-full rounded-full bg-linear-to-r from-[#00F5FF] to-[#5227FF]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>
        )}

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/60">Payment Method</span>
            <span className={`text-sm font-semibold ${paymentMethod ? "text-white" : "text-white/30"}`}>
              {paymentMethod ? paymentMethod.label : "Not selected"}
            </span>
          </div>
        </div>

        {/* CTA Button */}
        <motion.button
          type="button"
          whileHover={isReady && !isSubmitting ? { scale: 1.02 } : {}}
          whileTap={isReady && !isSubmitting ? { scale: 0.98 } : {}}
          disabled={!isReady || isSubmitting}
          onClick={onConfirm}
          className={`group relative mt-6 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl p-4 font-bold transition-all
            ${
              isReady
                ? "bg-linear-to-r from-[#5227FF] to-[#00F5FF] text-white shadow-[0_0_20px_rgba(82,39,255,0.4)]"
                : "bg-white/5 text-white/30 cursor-not-allowed"
            }
          `}
        >
          {/* Animated background glow for ready state */}
          {isReady && !isSubmitting && (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-white/20"
            />
          )}

          <span className="relative z-10 font-space-grotesk tracking-wide">
            {isSubmitting ? "Processing Payment..." : paymentMethod ? "Pay & Confirm Booking" : "Confirm Booking"}
          </span>
          
          <div className="relative z-10">
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ArrowRight className={`h-5 w-5 transition-transform ${isReady ? "group-hover:translate-x-1" : ""}`} />
            )}
          </div>
        </motion.button>
      </div>
    </div>
  );
}
