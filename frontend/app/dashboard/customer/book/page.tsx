"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { 
  Smartphone, Laptop, Car, Tv, Cpu, CreditCard,
  ChevronRight, ChevronLeft, ShieldCheck, CheckCircle2, Calendar, Clock3, User2, Sparkles, Hash
} from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/providers/AuthProvider";

// Components
import { ServiceCard } from "@/components/booking/ServiceCard";
import { TechnicianCard } from "@/components/booking/TechnicianCard";
import { TimePicker } from "@/components/booking/TimePicker";
import { AddressForm } from "@/components/booking/AddressForm";
import { StepIndicator } from "@/components/booking/StepIndicator";
import { BookingSummary } from "@/components/booking/BookingSummary";

// Mock Data for Services
const services = [
  { id: "ac", title: "AC Repair", description: "Comprehensive AC servicing and repair.", price: "₹499", time: "1-2 hrs", icon: Tv },
  { id: "mobile", title: "Mobile Repair", description: "Screen replacement, battery issues, etc.", price: "₹299", time: "30-60 mins", icon: Smartphone },
  { id: "laptop", title: "Laptop Repair", description: "Hardware and software troubleshooting.", price: "₹599", time: "1-3 hrs", icon: Laptop },
  { id: "vehicle", title: "Vehicle Repair", description: "On-spot breakdown assistance.", price: "₹999", time: "1-4 hrs", icon: Car },
  { id: "appliance", title: "Appliance Repair", description: "Washing machines, refrigerators, etc.", price: "₹399", time: "1-2 hrs", icon: Tv },
  { id: "electronics", title: "Electronics Repair", description: "General electronics diagnostics.", price: "₹249", time: "1 hr", icon: Cpu },
];

// Mock Data for Technicians
const technicians = [
  { id: "t1", name: "Alex Mercer", specialty: "Electronics Expert", rating: 4.9, completedJobs: 1240, eta: "15 mins", price: "₹150", imageUrl: "", isOnline: true },
  { id: "t2", name: "Sarah Chen", specialty: "Appliance Specialist", rating: 4.8, completedJobs: 856, eta: "25 mins", price: "₹200", imageUrl: "", isOnline: true },
  { id: "t3", name: "Mike Johnson", specialty: "Automotive Tech", rating: 4.7, completedJobs: 532, eta: "45 mins", price: "₹300", imageUrl: "", isOnline: false },
  { id: "t4", name: "David Kim", specialty: "IT & Hardware", rating: 5.0, completedJobs: 2105, eta: "10 mins", price: "₹100", imageUrl: "", isOnline: true },
];

const STEPS = ["Select Service", "Choose Technician", "Schedule Time", "Confirm Details", "Payment Method"];

const paymentMethods = [
  {
    id: "upi",
    label: "UPI",
    description: "Pay instantly with UPI apps",
    icon: Smartphone,
  },
  {
    id: "card",
    label: "Credit / Debit Card",
    description: "Secure card payment with OTP",
    icon: CreditCard,
  },
  {
    id: "wallet",
    label: "Wallet",
    description: "Use your stored wallet balance",
    icon: Sparkles,
  },
  {
    id: "netbanking",
    label: "Net Banking",
    description: "Redirect to your bank securely",
    icon: ShieldCheck,
  },
] as const;

interface ServiceOption {
  id: string;
  title: string;
  description: string;
  price: string;
  time: string;
}

interface TechnicianOption {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  completedJobs: number;
  eta: string;
  price: string;
  imageUrl: string;
  isOnline: boolean;
}

interface AddressPayload {
  address: string;
  apartment: string;
  city: string;
  zipCode: string;
}

interface CreatedBooking {
  id: string;
  serviceName: string;
  technicianName: string;
  bookingDateLabel: string;
  bookingTime: string;
  eta: string;
  totalPrice: number;
  paymentMethod: string;
}

export default function BookingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<CreatedBooking | null>(null);
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Form State
  const [selectedService, setSelectedService] = useState<ServiceOption | null>(null);
  const [selectedTechnician, setSelectedTechnician] = useState<TechnicianOption | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<(typeof paymentMethods)[number] | null>(null);
  const [address, setAddress] = useState<AddressPayload>({
    address: "",
    apartment: "",
    city: "",
    zipCode: "",
  });

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex < currentStep) {
      setCurrentStep(stepIndex);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return !!selectedService;
      case 1: return !!selectedTechnician;
      case 2: return !!selectedDate && !!selectedTime;
      case 3: return !!address.address && !!address.city && !!address.zipCode;
      case 4: return !!selectedPaymentMethod;
      default: return false;
    }
  };

  const handleBooking = async () => {
    if (isSubmitting) {
      return;
    }

    console.log("[booking] handleBooking invoked");
    console.log("[booking] selectedService:", selectedService);
    console.log("[booking] selectedTechnician:", selectedTechnician);
    console.log("[booking] selectedDate:", selectedDate);
    console.log("[booking] selectedTime:", selectedTime);
    console.log("[booking] user.id:", user?.id);

    if (authLoading) {
      toast.info("Checking your session. Please wait a moment.");
      return;
    }

    if (!user) {
      toast.error("Please log in to book a service.");
      router.push("/login");
      return;
    }

    if (!selectedService || !selectedTechnician || !selectedDate || !selectedTime) {
      toast.error("Please complete service, technician, and schedule selection.");
      return;
    }

    if (!address.address || !address.city || !address.zipCode) {
      toast.error("Please complete the service address.");
      return;
    }

    if (!selectedPaymentMethod) {
      toast.error("Please choose a payment method.");
      return;
    }

    setIsSubmitting(true);

    try {
      toast.info(`Processing ${selectedPaymentMethod.label} payment...`);
      await new Promise((resolve) => setTimeout(resolve, 1100));

      const servicePrice = Number(selectedService.price.replace(/[^0-9]/g, ""));
      const techFee = Number(selectedTechnician.price.replace(/[^0-9]/g, ""));
      const subtotal = servicePrice + techFee;
      const total = Number((subtotal + subtotal * 0.18).toFixed(2));
      const bookingDateTime = new Date(selectedDate);

      const payload = {
        customer_id: user.id,
        service_name: selectedService.title,
        technician_name: selectedTechnician.name,
        booking_date: bookingDateTime.toISOString(),
        booking_time: selectedTime,
        status: "Paid",
        price: total,
      };

      console.log("[booking] insert payload:", payload);

      const { data, error } = await supabase
        .from("bookings")
        .insert([payload])
        .select()
        .maybeSingle();

      if (error) {
        console.error("[booking] Supabase insert error:", error);
        const isRlsError = error.code === "42501" || /row-level security/i.test(error.message);
        const isSchemaError = error.code === "42703" || /column/i.test(error.message);
        const failureMessage = isRlsError
          ? "Booking failed due to permissions. Check Supabase RLS policy for bookings insert."
          : isSchemaError
            ? "Booking payload does not match table schema. Verify bookings columns in Supabase."
            : error.message || "Failed to create booking.";

        toast.error(failureMessage, {
          action: {
            label: "Retry",
            onClick: () => {
              void handleBooking();
            },
          },
        });

        return;
      }

      console.log("[booking] booking created successfully:", data);
      toast.success("Booking confirmed successfully.");

      const fallbackBookingId = `${selectedService.id.toUpperCase()}-${selectedTechnician.id.toUpperCase()}-${String(selectedDate.getDate()).padStart(2, "0")}`;
      const bookingDateLabel = selectedDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      setCreatedBooking({
        id: data?.id ? String(data.id) : fallbackBookingId,
        serviceName: selectedService.title,
        technicianName: selectedTechnician.name,
        bookingDateLabel,
        bookingTime: selectedTime,
        eta: selectedTechnician.eta,
        totalPrice: total,
        paymentMethod: selectedPaymentMethod.label,
      });

      setShowSuccess(true);
      redirectTimerRef.current = setTimeout(() => {
        router.push("/dashboard/customer");
      }, 4500);

    } catch (error) {
      console.error("[booking] unexpected booking error:", error);
      toast.error("Failed to create booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#050816]">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-linear-to-br from-[#5227FF]/20 via-transparent to-[#00FFA3]/20"></div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 backdrop-blur-md"
        />

        <div className="pointer-events-none absolute inset-0">
          {Array.from({ length: 14 }).map((_, index) => (
            <motion.div
              key={`particle-${index}`}
              className="absolute h-1.5 w-1.5 rounded-full bg-[#00F5FF]/70 shadow-[0_0_12px_rgba(0,245,255,0.9)]"
              initial={{
                opacity: 0,
                x: ((index * 73) % 1000) + 12,
                y: 820 + (index % 5) * 46,
              }}
              animate={{
                opacity: [0, 1, 0],
                y: -120,
              }}
              transition={{
                duration: 4 + (index % 4),
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeOut",
              }}
            />
          ))}
        </div>
        
        <motion.div 
          initial={{ scale: 0.88, opacity: 0, y: 24 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 mx-4 w-full max-w-2xl rounded-3xl border border-white/10 bg-white/6 p-8 backdrop-blur-xl shadow-[0_0_80px_rgba(82,39,255,0.28)]"
        >
          <motion.div
            animate={{ opacity: [0.35, 0.85, 0.35] }}
            transition={{ duration: 2.8, repeat: Infinity }}
            className="pointer-events-none absolute -inset-px rounded-3xl border border-[#00F5FF]/30"
          />

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.18, type: "spring", stiffness: 220 }}
            className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#00FFA3] bg-[#00FFA3]/20 shadow-[0_0_50px_rgba(0,255,163,0.55)]"
          >
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center justify-center"
            >
              <CheckCircle2 className="h-12 w-12 text-[#00FFA3]" />
            </motion.div>
          </motion.div>
          
          <h2 className="mb-2 text-center text-3xl font-bold text-white font-space-grotesk">Successfully Booked!</h2>
          <p className="mb-7 text-center text-white/70">Your superhero technician is on the way.</p>

          <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-white/6 p-5 backdrop-blur-xl">
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#00F5FF]/25 blur-2xl" />
            <div className="absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-[#5227FF]/30 blur-2xl" />

            <div className="relative grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-[#0d1228]/70 p-3">
                <p className="text-xs uppercase tracking-wider text-white/50">Service</p>
                <p className="mt-1 font-semibold text-white">{createdBooking?.serviceName}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#0d1228]/70 p-3">
                <p className="text-xs uppercase tracking-wider text-white/50">Technician</p>
                <p className="mt-1 flex items-center gap-1.5 font-semibold text-white"><User2 className="h-4 w-4 text-[#00F5FF]" />{createdBooking?.technicianName}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#0d1228]/70 p-3">
                <p className="text-xs uppercase tracking-wider text-white/50">Date</p>
                <p className="mt-1 flex items-center gap-1.5 font-semibold text-white"><Calendar className="h-4 w-4 text-[#00F5FF]" />{createdBooking?.bookingDateLabel}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#0d1228]/70 p-3">
                <p className="text-xs uppercase tracking-wider text-white/50">Time</p>
                <p className="mt-1 flex items-center gap-1.5 font-semibold text-white"><Clock3 className="h-4 w-4 text-[#00F5FF]" />{createdBooking?.bookingTime}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#0d1228]/70 p-3">
                <p className="text-xs uppercase tracking-wider text-white/50">Estimated Arrival</p>
                <p className="mt-1 flex items-center gap-1.5 font-semibold text-[#00FFA3]"><Sparkles className="h-4 w-4" />{createdBooking?.eta}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-[#0d1228]/70 p-3">
                <p className="text-xs uppercase tracking-wider text-white/50">Total Price</p>
                <p className="mt-1 font-semibold text-[#00FFA3]">₹{createdBooking?.totalPrice.toFixed(2)}</p>
              </div>
                <div className="rounded-xl border border-white/10 bg-[#0d1228]/70 p-3 sm:col-span-2">
                  <p className="text-xs uppercase tracking-wider text-white/50">Payment Method</p>
                  <p className="mt-1 font-semibold text-white">{createdBooking?.paymentMethod}</p>
                </div>
            </div>

            <div className="relative mt-4 rounded-xl border border-[#00F5FF]/30 bg-[#00F5FF]/8 p-3">
              <p className="text-xs uppercase tracking-wider text-[#9fefff]">Booking ID</p>
              <p className="mt-1 flex items-center gap-1.5 font-mono text-sm text-white"><Hash className="h-4 w-4 text-[#00F5FF]" />{createdBooking?.id}</p>
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-between text-xs text-white/60">
            <span>Realtime dispatch syncing...</span>
            <span>Redirecting</span>
          </div>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 4.5, ease: "linear" }}
              className="h-full bg-linear-to-r from-[#5227FF] to-[#00FFA3]"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white selection:bg-[#5227FF]/30">
      {/* Cinematic Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
        <div className="absolute top-0 left-1/4 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5227FF]/20 blur-[120px]"></div>
        <div className="absolute bottom-0 right-1/4 h-150 w-150 translate-x-1/3 translate-y-1/3 rounded-full bg-[#00F5FF]/10 blur-[150px]"></div>
        <div className="absolute top-1/2 left-1/2 h-200 w-200 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#8B5CF6]/5 blur-[100px]"></div>
        
        {/* Cyber Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)'
          }}
        ></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        
        {/* Top Hero Section */}
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 mb-6 backdrop-blur-md"
          >
            <ShieldCheck className="h-4 w-4 text-[#00FFA3]" />
            <span className="text-sm font-medium text-white/80">Premium Service Guaranteed</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4 text-4xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl font-space-grotesk drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          >
            Book Your <span className="text-transparent bg-clip-text bg-linear-to-r from-[#00F5FF] via-[#5227FF] to-[#8B5CF6] drop-shadow-[0_0_20px_rgba(82,39,255,0.4)]">Repair Experience</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg text-white/60"
          >
            Connect instantly with verified technicians and schedule premium repair services in realtime.
          </motion.p>
        </div>

        {/* Step Indicator */}
        <div className="mx-auto max-w-3xl mb-16">
          <StepIndicator currentStep={currentStep} steps={STEPS} onStepClick={handleStepClick} />
        </div>

        {/* Main Layout: Left Content & Right Summary */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          
          {/* Left Content Area */}
          <div className="w-full lg:w-2/3">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl xl:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
              >
                {/* Step 1: Select Service */}
                {currentStep === 0 && (
                  <div>
                    <h2 className="mb-6 text-2xl font-bold text-white font-space-grotesk">Select Service</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {services.map((service) => (
                        <ServiceCard
                          key={service.id}
                          {...service}
                          isSelected={selectedService?.id === service.id}
                          onClick={() => setSelectedService(service)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Choose Technician */}
                {currentStep === 1 && (
                  <div>
                    <div className="mb-6 flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-white font-space-grotesk">Choose Technician</h2>
                      <span className="flex items-center gap-2 text-sm text-[#00FFA3]">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FFA3] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FFA3]"></span>
                        </span>
                        Live Availability
                      </span>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {technicians.map((tech) => (
                        <TechnicianCard
                          key={tech.id}
                          {...tech}
                          isSelected={selectedTechnician?.id === tech.id}
                          onClick={() => setSelectedTechnician(tech)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Schedule Time */}
                {currentStep === 2 && (
                  <div>
                    <h2 className="mb-6 text-2xl font-bold text-white font-space-grotesk">Schedule Time</h2>
                    <TimePicker
                      selectedDate={selectedDate}
                      selectedTime={selectedTime}
                      onDateSelect={setSelectedDate}
                      onTimeSelect={setSelectedTime}
                    />
                  </div>
                )}

                {/* Step 4: Confirm Details (Address) */}
                {currentStep === 3 && (
                  <div>
                    <h2 className="mb-6 text-2xl font-bold text-white font-space-grotesk">Service Location</h2>
                    <AddressForm formData={address} setFormData={setAddress} />
                  </div>
                )}

                {/* Step 5: Payment Method */}
                {currentStep === 4 && (
                  <div>
                    <div className="mb-6 flex items-center justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-white font-space-grotesk">Payment Method</h2>
                        <p className="mt-1 text-sm text-white/60">Choose how you want to complete the booking payment.</p>
                      </div>
                      <div className="rounded-full border border-[#00F5FF]/20 bg-[#00F5FF]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#9fefff]">
                        Secure checkout
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {paymentMethods.map((method) => {
                        const Icon = method.icon;
                        const isSelected = selectedPaymentMethod?.id === method.id;

                        return (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => setSelectedPaymentMethod(method)}
                            className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300 ${
                              isSelected
                                ? "border-[#00F5FF]/60 bg-white/10 shadow-[0_0_30px_rgba(0,245,255,0.18)]"
                                : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
                            }`}
                          >
                            <div className="relative flex items-start gap-4">
                              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-r from-[#5227FF] to-[#00F5FF] text-[#050816]">
                                <Icon className="h-5 w-5" />
                              </div>

                              <div className="flex-1">
                                <div className="flex items-center justify-between gap-3">
                                  <h3 className="text-lg font-semibold text-white">{method.label}</h3>
                                  {isSelected && (
                                    <span className="rounded-full border border-[#00FFA3]/30 bg-[#00FFA3]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#00FFA3]">
                                      Selected
                                    </span>
                                  )}
                                </div>
                                <p className="mt-1 text-sm text-white/60">{method.description}</p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {selectedPaymentMethod && selectedService && selectedTechnician && (
                      <div className="mt-6 rounded-2xl border border-[#00F5FF]/20 bg-[#00F5FF]/6 p-5">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-[#9fefff]">Ready to pay</p>
                            <h3 className="mt-1 text-xl font-semibold text-white">{selectedPaymentMethod.label}</h3>
                          </div>
                          <div className="text-right">
                            <p className="text-xs uppercase tracking-[0.2em] text-white/40">Amount due</p>
                            <p className="text-2xl font-bold text-[#00FFA3]">
                              ₹{(
                                Number(selectedService.price.replace(/[^0-9]/g, "")) +
                                Number(selectedTechnician.price.replace(/[^0-9]/g, "")) +
                                (Number(selectedService.price.replace(/[^0-9]/g, "")) + Number(selectedTechnician.price.replace(/[^0-9]/g, ""))) * 0.18
                              ).toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <p className="mt-4 text-sm text-white/60">
                          Tap <span className="font-semibold text-white">Pay & Confirm Booking</span> to complete the payment and create your paid booking.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
                  <button
                    onClick={handleBack}
                    className={`flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-colors ${
                      currentStep === 0
                        ? "invisible"
                        : "text-white/60 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </button>
                  
                  {currentStep < 4 ? (
                    <motion.button
                      whileHover={isStepValid() ? { scale: 1.02 } : {}}
                      whileTap={isStepValid() ? { scale: 0.98 } : {}}
                      onClick={handleNext}
                      disabled={!isStepValid()}
                      className={`flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all ${
                        isStepValid()
                          ? "bg-white text-[#050816] shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]"
                          : "bg-white/10 text-white/30 cursor-not-allowed"
                      }`}
                    >
                      {currentStep === 3 ? "Proceed to Payment" : "Next Step"}
                      <ChevronRight className="h-4 w-4" />
                    </motion.button>
                  ) : null}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Summary Panel */}
          <div className="w-full lg:w-1/3">
            <BookingSummary
              service={selectedService}
              technician={selectedTechnician}
              date={selectedDate}
              time={selectedTime}
              address={address}
              paymentMethod={selectedPaymentMethod}
              onConfirm={handleBooking}
              isSubmitting={isSubmitting}
            />
          </div>
          
        </div>
      </div>
    </div>
  );
}
