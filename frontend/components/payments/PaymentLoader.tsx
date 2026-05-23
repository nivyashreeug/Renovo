import React from "react";

export default function PaymentLoader() {
  return (
    <div className="space-y-6">
      <div className="rounded-[34px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl">
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="h-4 w-40 rounded-full bg-white/10 animate-pulse" />
            <div className="h-10 w-3/4 rounded-2xl bg-white/10 animate-pulse" />
            <div className="h-4 w-full rounded-full bg-white/10 animate-pulse" />
            <div className="h-4 w-5/6 rounded-full bg-white/10 animate-pulse" />
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-24 rounded-[24px] border border-white/10 bg-white/5 animate-pulse" />
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="h-40 rounded-[28px] border border-white/10 bg-white/5 animate-pulse" />
            <div className="h-40 rounded-[28px] border border-white/10 bg-white/5 animate-pulse" />
            <div className="sm:col-span-2 h-24 rounded-[28px] border border-white/10 bg-white/5 animate-pulse" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4 rounded-[30px] border border-white/10 bg-white/5 p-5 backdrop-blur-2xl">
          <div className="h-5 w-48 rounded-full bg-white/10 animate-pulse" />
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-32 rounded-[26px] border border-white/10 bg-white/5 animate-pulse" />
          ))}
        </div>
        <div className="space-y-4 rounded-[30px] border border-white/10 bg-white/5 p-5 backdrop-blur-2xl">
          <div className="h-5 w-40 rounded-full bg-white/10 animate-pulse" />
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-28 rounded-[24px] border border-white/10 bg-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
