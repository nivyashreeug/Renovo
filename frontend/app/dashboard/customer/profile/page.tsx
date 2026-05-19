"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import {
  Award,
  BadgeCheck,
  CalendarDays,
  ChevronRight,
  CreditCard,
  Mail,
  MapPin,
  PencilLine,
  Plus,
  Shield,
  Sparkles,
  Star,
  UserCircle2,
  X,
} from "lucide-react";
import { toast } from "sonner";

type SavedAddress = {
  id: string;
  label: string;
  address: string;
  city: string;
  zipCode: string;
  isDefault?: boolean;
};

type SavedPayment = {
  id: string;
  type: string;
  details: string;
  status: string;
  isDefault?: boolean;
};

type Profile = {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string | null;
  created_at?: string | null;
  saved_addresses?: SavedAddress[] | null;
  saved_payments?: SavedPayment[] | null;
};

type SettingsForm = {
  full_name: string;
  email: string;
  avatar_url: string;
};

type AddressForm = {
  label: string;
  address: string;
  city: string;
  zipCode: string;
  isDefault: boolean;
};

type PaymentForm = {
  type: string;
  details: string;
  status: string;
  isDefault: boolean;
};

const defaultAddresses: SavedAddress[] = [
  {
    id: "home",
    label: "Home",
    address: "32 Aurora Residency, Sector 18",
    city: "Bengaluru",
    zipCode: "560001",
    isDefault: true,
  },
  {
    id: "office",
    label: "Office",
    address: "Tower B, Global Tech Park",
    city: "Bengaluru",
    zipCode: "560103",
    isDefault: false,
  },
];

const defaultPayments: SavedPayment[] = [
  {
    id: "card-1",
    type: "Visa",
    details: "•••• 4242",
    status: "Verified",
    isDefault: true,
  },
  {
    id: "upi-1",
    type: "UPI",
    details: "renovo@upi",
    status: "Ready",
    isDefault: false,
  },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);
  const [settingsForm, setSettingsForm] = useState<SettingsForm>({
    full_name: "",
    email: "",
    avatar_url: "",
  });
  const [addressForm, setAddressForm] = useState<AddressForm>({
    label: "",
    address: "",
    city: "",
    zipCode: "",
    isDefault: false,
  });
  const [paymentForm, setPaymentForm] = useState<PaymentForm>({
    type: "",
    details: "",
    status: "Verified",
    isDefault: false,
  });
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>(defaultAddresses);
  const [savedPayments, setSavedPayments] = useState<SavedPayment[]>(defaultPayments);

  useEffect(() => {
    if (!user) return;

    let active = true;

    const fetchProfile = async () => {
      setLoading(true);
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (!active) return;

      const nextProfile = (data || null) as Profile | null;
      setProfile(nextProfile);

      const storedAddresses = localStorage.getItem("renovo.saved_addresses");
      const storedPayments = localStorage.getItem("renovo.saved_payments");

      if (nextProfile?.saved_addresses?.length) {
        setSavedAddresses(nextProfile.saved_addresses);
      } else if (storedAddresses) {
        setSavedAddresses(JSON.parse(storedAddresses) as SavedAddress[]);
      } else {
        setSavedAddresses(defaultAddresses);
      }

      if (nextProfile?.saved_payments?.length) {
        setSavedPayments(nextProfile.saved_payments);
      } else if (storedPayments) {
        setSavedPayments(JSON.parse(storedPayments) as SavedPayment[]);
      } else {
        setSavedPayments(defaultPayments);
      }

      setSettingsForm({
        full_name: nextProfile?.full_name || user.user_metadata?.full_name || "",
        email: nextProfile?.email || user.email || "",
        avatar_url: nextProfile?.avatar_url || "",
      });
      setLoading(false);
    };

    void fetchProfile();
    return () => {
      active = false;
    };
  }, [user]);

  const fullName = profile?.full_name || user?.user_metadata?.full_name || "Premium User";
  const memberSince = profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "—";

  const persistCollections = async (nextAddresses: SavedAddress[], nextPayments: SavedPayment[]) => {
    if (!user) return;

    setSavedAddresses(nextAddresses);
    setSavedPayments(nextPayments);
    setProfile((current) =>
      current
        ? {
            ...current,
            saved_addresses: nextAddresses,
            saved_payments: nextPayments,
          }
        : current,
    );

    localStorage.setItem("renovo.saved_addresses", JSON.stringify(nextAddresses));
    localStorage.setItem("renovo.saved_payments", JSON.stringify(nextPayments));

    const { error } = await supabase
      .from("profiles")
      .update({
        saved_addresses: nextAddresses,
        saved_payments: nextPayments,
      })
      .eq("id", user.id);

    if (error) {
      toast.info("Saved locally. Add JSON columns to persist this in Supabase.");
      return;
    }

    toast.success("Saved successfully.");
  };

  const saveProfile = async () => {
    if (!user) return;

    setSavingProfile(true);
    const snapshot = profile;
    const optimistic: Profile = {
      id: user.id,
      full_name: settingsForm.full_name,
      email: settingsForm.email,
      avatar_url: settingsForm.avatar_url || null,
      created_at: snapshot?.created_at || new Date().toISOString(),
      saved_addresses: snapshot?.saved_addresses || savedAddresses,
      saved_payments: snapshot?.saved_payments || savedPayments,
    };

    setProfile(optimistic);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: settingsForm.full_name,
        email: settingsForm.email,
        avatar_url: settingsForm.avatar_url || null,
      })
      .eq("id", user.id);

    if (error) {
      setProfile(snapshot);
      toast.error("Could not save profile changes.");
      setSavingProfile(false);
      return;
    }

    toast.success("Profile updated successfully.");
    setSettingsOpen(false);
    setSavingProfile(false);
  };

  const openAddressEditor = (address?: SavedAddress) => {
    if (address) {
      setEditingAddressId(address.id);
      setAddressForm({
        label: address.label,
        address: address.address,
        city: address.city,
        zipCode: address.zipCode,
        isDefault: Boolean(address.isDefault),
      });
    } else {
      setEditingAddressId(null);
      setAddressForm({ label: "", address: "", city: "", zipCode: "", isDefault: false });
    }
    setAddressModalOpen(true);
  };

  const openPaymentEditor = (payment?: SavedPayment) => {
    if (payment) {
      setEditingPaymentId(payment.id);
      setPaymentForm({
        type: payment.type,
        details: payment.details,
        status: payment.status,
        isDefault: Boolean(payment.isDefault),
      });
    } else {
      setEditingPaymentId(null);
      setPaymentForm({ type: "", details: "", status: "Verified", isDefault: false });
    }
    setPaymentModalOpen(true);
  };

  const normalizeDefaultAddress = (addresses: SavedAddress[]) => {
    if (addresses.length === 0) return addresses;
    if (addresses.some((address) => address.isDefault)) return addresses;
    return addresses.map((address, index) => (index === 0 ? { ...address, isDefault: true } : address));
  };

  const normalizeDefaultPayment = (payments: SavedPayment[]) => {
    if (payments.length === 0) return payments;
    if (payments.some((payment) => payment.isDefault)) return payments;
    return payments.map((payment, index) => (index === 0 ? { ...payment, isDefault: true } : payment));
  };

  const saveAddress = async () => {
    const nextAddress: SavedAddress = {
      id: editingAddressId || `address-${Date.now()}`,
      label: addressForm.label,
      address: addressForm.address,
      city: addressForm.city,
      zipCode: addressForm.zipCode,
      isDefault: addressForm.isDefault,
    };

    let nextAddresses = savedAddresses.filter((item) => item.id !== nextAddress.id);
    if (nextAddress.isDefault) {
      nextAddresses = nextAddresses.map((item) => ({ ...item, isDefault: false }));
    }
    nextAddresses = [...nextAddresses, nextAddress];
    nextAddresses = normalizeDefaultAddress(nextAddresses).sort(
      (a, b) => Number(Boolean(b.isDefault)) - Number(Boolean(a.isDefault)),
    );

    await persistCollections(nextAddresses, savedPayments);
    setAddressModalOpen(false);
    setEditingAddressId(null);
  };

  const savePayment = async () => {
    const nextPayment: SavedPayment = {
      id: editingPaymentId || `payment-${Date.now()}`,
      type: paymentForm.type,
      details: paymentForm.details,
      status: paymentForm.status,
      isDefault: paymentForm.isDefault,
    };

    let nextPayments = savedPayments.filter((item) => item.id !== nextPayment.id);
    if (nextPayment.isDefault) {
      nextPayments = nextPayments.map((item) => ({ ...item, isDefault: false }));
    }
    nextPayments = [...nextPayments, nextPayment];
    nextPayments = normalizeDefaultPayment(nextPayments).sort(
      (a, b) => Number(Boolean(b.isDefault)) - Number(Boolean(a.isDefault)),
    );

    await persistCollections(savedAddresses, nextPayments);
    setPaymentModalOpen(false);
    setEditingPaymentId(null);
  };

  const removeAddress = async (id: string) => {
    const nextAddresses = normalizeDefaultAddress(savedAddresses.filter((item) => item.id !== id));
    await persistCollections(nextAddresses, savedPayments);
  };

  const removePayment = async (id: string) => {
    const nextPayments = normalizeDefaultPayment(savedPayments.filter((item) => item.id !== id));
    await persistCollections(savedAddresses, nextPayments);
  };

  const setDefaultAddress = async (id: string) => {
    const nextAddresses = savedAddresses.map((item) => ({ ...item, isDefault: item.id === id }));
    await persistCollections(nextAddresses, savedPayments);
  };

  const setDefaultPayment = async (id: string) => {
    const nextPayments = savedPayments.map((item) => ({ ...item, isDefault: item.id === id }));
    await persistCollections(savedAddresses, nextPayments);
  };

  return (
    <div className="relative min-h-[calc(100vh-8rem)] overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-[#5227FF]/20 blur-3xl" />
        <div className="absolute top-24 right-0 h-80 w-80 rounded-full bg-[#00F5FF]/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#00FFA3]/10 blur-3xl" />
      </div>

      <div className="relative z-10 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8"
        >
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="relative mx-auto md:mx-0">
                <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#00F5FF] via-[#5227FF] to-[#00FFA3] opacity-60 blur-md" />
                <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-[#050816] p-1 shadow-[0_0_40px_rgba(82,39,255,0.25)] md:h-32 md:w-32">
                  {profile?.avatar_url ? (
                    <div className="h-full w-full rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${profile.avatar_url})` }} />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-full bg-linear-to-br from-[#0f1530] to-[#050816] text-4xl font-bold text-white/70">
                      {fullName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full border border-[#00FFA3]/40 bg-[#00FFA3]/20 backdrop-blur-md">
                    <BadgeCheck className="h-4 w-4 text-[#00FFA3]" />
                  </div>
                </div>
              </div>

              <div className="text-center md:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#00F5FF]/20 bg-[#00F5FF]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#9fefff]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Premium Member
                </div>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-5xl">{fullName}</h1>
                <p className="mt-2 max-w-2xl text-sm text-white/60 md:text-base">
                  Your account center for bookings, payments, and service history — built to feel clean, fast, and professional.
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80">
                    <Mail className="h-4 w-4 text-[#00F5FF]" />
                    {profile?.email || user?.email || "—"}
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80">
                    <CalendarDays className="h-4 w-4 text-[#00FFA3]" />
                    Member since {memberSince}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:min-w-[420px]">
              {[
                { label: "Rating", value: "4.9", icon: Star, tone: "text-[#00F5FF]" },
                { label: "Repairs", value: "12", icon: Award, tone: "text-[#00FFA3]" },
                { label: "Verified", value: "100%", icon: Shield, tone: "text-[#8B5CF6]" },
                { label: "Priority", value: "Pro", icon: UserCircle2, tone: "text-[#FFB020]" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md">
                    <Icon className={`mx-auto h-5 w-5 ${item.tone}`} />
                    <div className="mt-2 text-xl font-bold text-white">{item.value}</div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-white/45">{item.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center text-white/60 backdrop-blur-xl">
            Loading profile...
          </div>
        ) : (
          <>
            <div className="grid gap-6 xl:grid-cols-3">
              <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="xl:col-span-2 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Account Details</h2>
                    <p className="mt-1 text-sm text-white/60">A refined overview of your customer profile.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSettingsOpen(true)}
                    className="inline-flex items-center gap-2 rounded-full border border-[#00F5FF]/20 bg-[#00F5FF]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#9fefff] transition hover:bg-[#00F5FF]/15"
                  >
                    Edit Profile
                    <PencilLine className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {[
                    { label: "Full Name", value: profile?.full_name || "—", icon: UserCircle2 },
                    { label: "Email", value: profile?.email || "—", icon: Mail },
                    { label: "Joined", value: memberSince, icon: CalendarDays },
                    { label: "Status", value: "Verified customer", icon: BadgeCheck },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="rounded-2xl border border-white/10 bg-[#0b1020]/70 p-4">
                        <div className="flex items-center gap-2 text-sm text-white/50">
                          <Icon className="h-4 w-4 text-[#00F5FF]" />
                          {item.label}
                        </div>
                        <div className="mt-2 text-base font-semibold text-white">{item.value}</div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Profile Completeness</h3>
                      <p className="text-sm text-white/60">Complete your account to unlock faster bookings and smoother support.</p>
                    </div>
                    <span className="rounded-full border border-[#00FFA3]/20 bg-[#00FFA3]/10 px-3 py-1 text-xs font-semibold text-[#00FFA3]">88%</span>
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                    <motion.div initial={{ width: 0 }} animate={{ width: "88%" }} transition={{ duration: 1 }} className="h-full rounded-full bg-linear-to-r from-[#5227FF] via-[#00F5FF] to-[#00FFA3]" />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/55">
                    <span className="rounded-full border border-white/10 bg-[#0b1020]/70 px-3 py-1">Display name set</span>
                    <span className="rounded-full border border-white/10 bg-[#0b1020]/70 px-3 py-1">Email verified</span>
                    <span className="rounded-full border border-white/10 bg-[#0b1020]/70 px-3 py-1">Saved payment ready</span>
                  </div>
                </div>
              </motion.section>

              <motion.aside initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#00F5FF]/10 text-[#00F5FF]">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Security</h3>
                      <p className="text-sm text-white/60">Protected account and secure session handling.</p>
                    </div>
                  </div>
                  <div className="mt-4 rounded-2xl border border-white/10 bg-[#0b1020]/70 p-4">
                    <div className="flex items-center gap-3">
                      <BadgeCheck className="h-5 w-5 text-[#00FFA3]" />
                      <div>
                        <div className="text-sm font-medium text-white">Protected profile</div>
                        <div className="text-xs text-white/50">Encrypted session + verified access</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
                    <ChevronRight className="h-4 w-4 text-white/35" />
                  </div>
                  <div className="mt-4 space-y-3 text-sm text-white/70">
                    <button type="button" onClick={() => setSettingsOpen(true)} className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-[#0b1020]/70 p-4 text-left transition hover:border-white/20">
                      <span>Edit profile details</span>
                      <PencilLine className="h-4 w-4 text-[#00F5FF]" />
                    </button>
                    <button type="button" onClick={() => openAddressEditor()} className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-[#0b1020]/70 p-4 text-left transition hover:border-white/20">
                      <span>Add saved address</span>
                      <MapPin className="h-4 w-4 text-[#00F5FF]" />
                    </button>
                    <button type="button" onClick={() => openPaymentEditor()} className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-[#0b1020]/70 p-4 text-left transition hover:border-white/20">
                      <span>Add payment method</span>
                      <CreditCard className="h-4 w-4 text-[#00FFA3]" />
                    </button>
                  </div>
                </div>
              </motion.aside>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Saved Addresses</h2>
                    <p className="mt-1 text-sm text-white/60">Your frequently used service locations.</p>
                  </div>
                  <button type="button" onClick={() => openAddressEditor()} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 transition hover:bg-white/10">
                    Add Address
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="mt-5 space-y-4">
                  {savedAddresses.map((address) => (
                    <div key={address.id} className="rounded-2xl border border-white/10 bg-[#0b1020]/70 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00F5FF]/10 text-[#00F5FF]">
                            <MapPin className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-semibold text-white">{address.label}</h3>
                              {address.isDefault && (
                                <span className="rounded-full border border-[#00FFA3]/20 bg-[#00FFA3]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#00FFA3]">Default</span>
                              )}
                            </div>
                            <p className="mt-1 text-sm text-white/65">{address.address}</p>
                            <p className="text-sm text-white/45">{address.city}, {address.zipCode}</p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <button type="button" onClick={() => setDefaultAddress(address.id)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 transition hover:bg-white/10">Set Default</button>
                          <button type="button" onClick={() => openAddressEditor(address)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 transition hover:bg-white/10">Edit</button>
                          <button type="button" onClick={() => removeAddress(address.id)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 transition hover:bg-white/10">Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>

              <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Saved Payments</h2>
                    <p className="mt-1 text-sm text-white/60">Your preferred payment methods for quick checkout.</p>
                  </div>
                  <button type="button" onClick={() => openPaymentEditor()} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 transition hover:bg-white/10">
                    Add Method
                    <CreditCard className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="mt-5 space-y-4">
                  {savedPayments.map((payment) => (
                    <div key={payment.id} className="rounded-2xl border border-white/10 bg-[#0b1020]/70 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00FFA3]/10 text-[#00FFA3]">
                            <CreditCard className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-base font-semibold text-white">{payment.type}</h3>
                              {payment.isDefault && (
                                <span className="rounded-full border border-[#00FFA3]/20 bg-[#00FFA3]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#00FFA3]">Default</span>
                              )}
                            </div>
                            <p className="mt-1 text-sm text-white/65">{payment.details}</p>
                            <p className="text-sm text-white/45">{payment.status}</p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <button type="button" onClick={() => setDefaultPayment(payment.id)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 transition hover:bg-white/10">Set Default</button>
                          <button type="button" onClick={() => openPaymentEditor(payment)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 transition hover:bg-white/10">Edit</button>
                          <button type="button" onClick={() => removePayment(payment.id)} className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 transition hover:bg-white/10">Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            </div>
          </>
        )}
      </div>

      {settingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.96, opacity: 0, y: 12 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#060916] shadow-[0_0_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9fefff]">Profile Settings</p>
                <h2 className="mt-1 text-2xl font-bold text-white">Edit Your Account</h2>
              </div>
              <button type="button" onClick={() => setSettingsOpen(false)} className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:bg-white/10 hover:text-white" aria-label="Close settings">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-6 px-6 py-6 md:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-4">
                {[
                  { key: "full_name", label: "Full Name", icon: UserCircle2, placeholder: "Enter your full name" },
                  { key: "email", label: "Email", icon: Mail, placeholder: "name@example.com" },
                  { key: "avatar_url", label: "Avatar URL", icon: Sparkles, placeholder: "https://... or /path" },
                ].map((field) => {
                  const Icon = field.icon;
                  return (
                    <label key={field.key} className="block">
                      <span className="mb-2 flex items-center gap-2 text-sm font-medium text-white/80">
                        <Icon className="h-4 w-4 text-[#00F5FF]" />
                        {field.label}
                      </span>
                      <input
                        type="text"
                        value={settingsForm[field.key as keyof SettingsForm]}
                        onChange={(e) => setSettingsForm((current) => ({ ...current, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[#00F5FF] focus:bg-white/8"
                      />
                    </label>
                  );
                })}
              </div>

              <div className="space-y-4">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-[#5227FF] to-[#00F5FF] text-[#050816]">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Professional Profile</h3>
                      <p className="text-sm text-white/60">Update your public identity and contact details.</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5">
                  <h3 className="text-lg font-semibold text-white">What changes do</h3>
                  <ul className="mt-3 space-y-3 text-sm text-white/60">
                    <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#00F5FF]" />Refreshes your dashboard header</li>
                    <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#00FFA3]" />Updates your booking confirmations</li>
                    <li className="flex items-start gap-2"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#8B5CF6]" />Keeps your account center polished</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 px-6 py-5">
              <button type="button" onClick={() => setSettingsOpen(false)} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10">Cancel</button>
              <button type="button" onClick={saveProfile} disabled={savingProfile} className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-[#5227FF] to-[#00F5FF] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(82,39,255,0.35)] transition hover:shadow-[0_0_30px_rgba(0,245,255,0.3)] disabled:cursor-not-allowed disabled:opacity-60">
                {savingProfile ? "Saving..." : "Save Changes"}
                <Plus className="h-4 w-4 rotate-45" />
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {addressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.96, opacity: 0, y: 12 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#060916] shadow-[0_0_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9fefff]">Saved Address</p>
                <h2 className="mt-1 text-2xl font-bold text-white">{editingAddressId ? "Edit Address" : "Add Address"}</h2>
              </div>
              <button type="button" onClick={() => setAddressModalOpen(false)} className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:bg-white/10 hover:text-white" aria-label="Close address editor">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 px-6 py-6 md:grid-cols-2">
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-medium text-white/80">Label</span>
                <input type="text" value={addressForm.label} onChange={(e) => setAddressForm((current) => ({ ...current, label: e.target.value }))} placeholder="Home, Office, etc." className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[#00F5FF] focus:bg-white/8" />
              </label>
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-medium text-white/80">Full Address</span>
                <textarea value={addressForm.address} onChange={(e) => setAddressForm((current) => ({ ...current, address: e.target.value }))} placeholder="Apartment, street, landmark" rows={4} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[#00F5FF] focus:bg-white/8" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-white/80">City</span>
                <input type="text" value={addressForm.city} onChange={(e) => setAddressForm((current) => ({ ...current, city: e.target.value }))} placeholder="Bengaluru" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[#00F5FF] focus:bg-white/8" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-white/80">ZIP Code</span>
                <input type="text" value={addressForm.zipCode} onChange={(e) => setAddressForm((current) => ({ ...current, zipCode: e.target.value }))} placeholder="560001" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[#00F5FF] focus:bg-white/8" />
              </label>
              <label className="flex items-center gap-3 md:col-span-2">
                <input type="checkbox" checked={addressForm.isDefault} onChange={(e) => setAddressForm((current) => ({ ...current, isDefault: e.target.checked }))} className="h-4 w-4 rounded border-white/20 bg-white/5 text-[#00F5FF]" />
                <span className="text-sm text-white/80">Set as default address</span>
              </label>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 px-6 py-5">
              <button type="button" onClick={() => setAddressModalOpen(false)} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10">Cancel</button>
              <button type="button" onClick={saveAddress} disabled={!addressForm.label || !addressForm.address || !addressForm.city || !addressForm.zipCode} className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-[#5227FF] to-[#00F5FF] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(82,39,255,0.35)] transition hover:shadow-[0_0_30px_rgba(0,245,255,0.3)] disabled:cursor-not-allowed disabled:opacity-60">
                Save Address
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-8 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.96, opacity: 0, y: 12 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#060916] shadow-[0_0_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9fefff]">Saved Payment</p>
                <h2 className="mt-1 text-2xl font-bold text-white">{editingPaymentId ? "Edit Payment" : "Add Payment Method"}</h2>
              </div>
              <button type="button" onClick={() => setPaymentModalOpen(false)} className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:bg-white/10 hover:text-white" aria-label="Close payment editor">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 px-6 py-6 md:grid-cols-2">
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-medium text-white/80">Type</span>
                <input type="text" value={paymentForm.type} onChange={(e) => setPaymentForm((current) => ({ ...current, type: e.target.value }))} placeholder="Visa, Mastercard, UPI, Wallet" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[#00F5FF] focus:bg-white/8" />
              </label>
              <label className="block md:col-span-2">
                <span className="mb-2 block text-sm font-medium text-white/80">Details</span>
                <input type="text" value={paymentForm.details} onChange={(e) => setPaymentForm((current) => ({ ...current, details: e.target.value }))} placeholder="•••• 4242 or renovo@upi" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[#00F5FF] focus:bg-white/8" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-white/80">Status</span>
                <input type="text" value={paymentForm.status} onChange={(e) => setPaymentForm((current) => ({ ...current, status: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/30 outline-none transition focus:border-[#00F5FF] focus:bg-white/8" />
              </label>
              <label className="flex items-center gap-3 pt-10">
                <input type="checkbox" checked={paymentForm.isDefault} onChange={(e) => setPaymentForm((current) => ({ ...current, isDefault: e.target.checked }))} className="h-4 w-4 rounded border-white/20 bg-white/5 text-[#00F5FF]" />
                <span className="text-sm text-white/80">Set as default payment</span>
              </label>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 px-6 py-5">
              <button type="button" onClick={() => setPaymentModalOpen(false)} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10">Cancel</button>
              <button type="button" onClick={savePayment} disabled={!paymentForm.type || !paymentForm.details} className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-[#5227FF] to-[#00F5FF] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(82,39,255,0.35)] transition hover:shadow-[0_0_30px_rgba(0,245,255,0.3)] disabled:cursor-not-allowed disabled:opacity-60">
                Save Payment
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
