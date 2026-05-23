"use client"

import React from "react"

export default function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="rounded-[1.5rem] border border-white/6 bg-white/3 p-4 animate-pulse">
      <div className="h-4 bg-white/8 rounded w-3/5 mb-3" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`h-3 bg-white/6 rounded ${i === lines - 1 ? 'w-2/3' : 'w-full'} mb-2`} />
      ))}
    </div>
  )
}
