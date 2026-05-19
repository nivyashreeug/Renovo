"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
  onStepClick?: (stepIndex: number) => void;
}

export function StepIndicator({ currentStep, steps, onStepClick }: StepIndicatorProps) {
  return (
    <div className="relative mb-12 flex w-full justify-between">
      {/* Background Track */}
      <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-white/10" />

      {/* Animated Progress Line */}
      <motion.div
        className="absolute left-0 top-1/2 h-0.5 -translate-y-1/2 bg-linear-to-r from-[#5227FF] via-[#00F5FF] to-[#00FFA3] shadow-[0_0_10px_rgba(0,245,255,0.5)]"
        initial={{ width: "0%" }}
        animate={{
          width: `${(currentStep / (steps.length - 1)) * 100}%`,
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />

      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        const canNavigateBack = Boolean(onStepClick) && isCompleted;

        return (
          <button
            key={index}
            type="button"
            onClick={() => {
              if (canNavigateBack) {
                onStepClick?.(index);
              }
            }}
            disabled={!canNavigateBack}
            className={`relative z-10 flex flex-col items-center ${
              canNavigateBack ? "cursor-pointer" : "cursor-default"
            }`}
          >
            <motion.div
              initial={false}
              animate={{
                scale: isActive ? 1.2 : 1,
                backgroundColor: isCompleted
                  ? "#00FFA3"
                  : isActive
                  ? "#050816"
                  : "#050816",
                borderColor: isCompleted
                  ? "#00FFA3"
                  : isActive
                  ? "#00F5FF"
                  : "rgba(255, 255, 255, 0.2)",
              }}
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors duration-300
                ${
                  isActive
                    ? "shadow-[0_0_20px_rgba(0,245,255,0.4)]"
                    : "shadow-none"
                }
              `}
            >
              {isCompleted ? (
                <Check className="h-5 w-5 text-[#050816]" />
              ) : (
                <span
                  className={`text-sm font-bold ${
                    isActive ? "text-[#00F5FF]" : "text-white/40"
                  }`}
                >
                  {index + 1}
                </span>
              )}
            </motion.div>
            
            <div className="absolute -bottom-8 w-max text-center">
              <span
                className={`text-xs font-medium tracking-wide transition-colors duration-300 font-space-grotesk ${
                  isActive
                    ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                    : isCompleted
                    ? "text-white/80"
                    : "text-white/40"
                }`}
              >
                {step}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
