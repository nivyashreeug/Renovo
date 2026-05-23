"use client";

import { motion } from "framer-motion";
import { MapPin, Building, Map, Hash } from "lucide-react";

type BookingAddressFormData = {
  address: string;
  apartment: string;
  city: string;
  zipCode: string;
};

interface AddressFormProps {
  formData: BookingAddressFormData;
  setFormData: React.Dispatch<React.SetStateAction<BookingAddressFormData>>;
}

export function AddressForm({ formData, setFormData }: AddressFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <MapPin className="h-5 w-5 text-white/40 group-focus-within:text-[#00F5FF] transition-colors" />
        </div>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="block w-full rounded-xl border border-white/10 bg-white/5 p-4 pl-12 text-white placeholder-white/30 backdrop-blur-sm transition-all focus:border-[#00F5FF] focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-[#00F5FF]"
          placeholder="Full Street Address"
        />
        {/* Glow effect on focus */}
        <div className="absolute -inset-[1px] -z-10 rounded-xl bg-gradient-to-r from-[#00F5FF] to-[#5227FF] opacity-0 blur transition-opacity duration-300 group-focus-within:opacity-20" />
      </div>

      <div className="relative group">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Building className="h-5 w-5 text-white/40 group-focus-within:text-[#00F5FF] transition-colors" />
        </div>
        <input
          type="text"
          name="apartment"
          value={formData.apartment}
          onChange={handleChange}
          className="block w-full rounded-xl border border-white/10 bg-white/5 p-4 pl-12 text-white placeholder-white/30 backdrop-blur-sm transition-all focus:border-[#00F5FF] focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-[#00F5FF]"
          placeholder="Apartment, suite, etc. (optional)"
        />
        <div className="absolute -inset-[1px] -z-10 rounded-xl bg-gradient-to-r from-[#00F5FF] to-[#5227FF] opacity-0 blur transition-opacity duration-300 group-focus-within:opacity-20" />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Map className="h-5 w-5 text-white/40 group-focus-within:text-[#00F5FF] transition-colors" />
          </div>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="block w-full rounded-xl border border-white/10 bg-white/5 p-4 pl-12 text-white placeholder-white/30 backdrop-blur-sm transition-all focus:border-[#00F5FF] focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-[#00F5FF]"
            placeholder="City"
          />
          <div className="absolute -inset-[1px] -z-10 rounded-xl bg-gradient-to-r from-[#00F5FF] to-[#5227FF] opacity-0 blur transition-opacity duration-300 group-focus-within:opacity-20" />
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Hash className="h-5 w-5 text-white/40 group-focus-within:text-[#00F5FF] transition-colors" />
          </div>
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            className="block w-full rounded-xl border border-white/10 bg-white/5 p-4 pl-12 text-white placeholder-white/30 backdrop-blur-sm transition-all focus:border-[#00F5FF] focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-[#00F5FF]"
            placeholder="ZIP Code"
          />
          <div className="absolute -inset-[1px] -z-10 rounded-xl bg-gradient-to-r from-[#00F5FF] to-[#5227FF] opacity-0 blur transition-opacity duration-300 group-focus-within:opacity-20" />
        </div>
      </div>
      
      {/* Visual map placeholder */}
      <div className="relative mt-6 h-32 w-full overflow-hidden rounded-xl border border-white/10 bg-[#050816]">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-transparent to-transparent z-10"></div>
        <div 
          className="absolute inset-0 z-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, #00F5FF 1px, transparent 1px)`,
            backgroundSize: '20px 20px',
          }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#00F5FF]/20 backdrop-blur-md border border-[#00F5FF]/50 shadow-[0_0_15px_#00F5FF]">
            <MapPin className="h-5 w-5 text-[#00F5FF]" />
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-[#00F5FF]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
