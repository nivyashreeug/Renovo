"use client";

import { motion } from "framer-motion";
import { format, addDays, startOfToday } from "date-fns";

interface TimePickerProps {
  selectedDate: Date | null;
  selectedTime: string | null;
  onDateSelect: (date: Date) => void;
  onTimeSelect: (time: string) => void;
}

export function TimePicker({
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
}: TimePickerProps) {
  const today = startOfToday();
  const dates = Array.from({ length: 7 }, (_, i) => addDays(today, i));

  const timeSlots = [
    "09:00 AM",
    "10:30 AM",
    "12:00 PM",
    "02:30 PM",
    "04:00 PM",
    "06:00 PM",
    "Emergency Booking",
  ];

  return (
    <div className="space-y-6">
      {/* Date Selection */}
      <div>
        <h4 className="mb-4 text-sm font-semibold text-white/60">Select Date</h4>
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {dates.map((date, i) => {
            const isSelected =
              selectedDate?.toDateString() === date.toDateString();
            return (
              <motion.button
                key={i}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDateSelect(date)}
                className={`flex min-w-[80px] flex-col items-center justify-center rounded-2xl border p-3 transition-all
                  ${
                    isSelected
                      ? "border-[#5227FF] bg-[#5227FF]/20 text-white shadow-[0_0_15px_rgba(82,39,255,0.4)]"
                      : "border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <span className="text-xs uppercase">{format(date, "EEE")}</span>
                <span className="text-2xl font-bold font-space-grotesk">
                  {format(date, "d")}
                </span>
                <span className="text-xs">{format(date, "MMM")}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Time Selection */}
      <div>
        <h4 className="mb-4 text-sm font-semibold text-white/60">Select Time</h4>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {timeSlots.map((time, i) => {
            const isSelected = selectedTime === time;
            const isEmergency = time === "Emergency Booking";
            
            return (
              <motion.button
                key={i}
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onTimeSelect(time)}
                className={`col-span-1 rounded-xl border p-3 text-center text-sm font-medium transition-all
                  ${
                    isEmergency
                      ? isSelected
                        ? "border-[#FF4D6D] bg-[#FF4D6D]/20 text-[#FF4D6D] shadow-[0_0_15px_rgba(255,77,109,0.4)]"
                        : "border-[#FF4D6D]/30 bg-[#FF4D6D]/10 text-[#FF4D6D] hover:bg-[#FF4D6D]/20"
                      : isSelected
                      ? "border-[#00F5FF] bg-[#00F5FF]/20 text-[#00F5FF] shadow-[0_0_15px_rgba(0,245,255,0.4)]"
                      : "border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
                  }
                  ${isEmergency ? "col-span-2 sm:col-span-3 md:col-span-4 mt-2" : ""}
                `}
              >
                {time}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
