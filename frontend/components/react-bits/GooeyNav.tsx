// Placeholder for React Bits GooeyNav Component
import React from 'react';
import Link from 'next/link';

export default function GooeyNav({ items }: any) {
  return (
    <nav className="flex gap-8">
      {items.map((i: any, index: number) => (
        <Link 
          key={index} 
          href={i.href}
          className="text-white/80 hover:text-white transition-colors duration-300 font-medium text-sm tracking-wide"
        >
          {i.label}
        </Link>
      ))}
    </nav>
  );
}
