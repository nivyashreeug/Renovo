// Placeholder for React Bits TextPressure Component
import React from 'react';

export default function TextPressure(props: any) {
  return (
    <h1 
      className="text-white font-bold uppercase w-full flex items-center justify-center text-center tracking-tighter"
      style={{ fontSize: "clamp(4rem, 15vw, 15rem)", lineHeight: 0.9, letterSpacing: "-0.05em", color: props.textColor, WebkitTextStroke: props.stroke ? `2px ${props.strokeColor}` : "none" }}
    >
      {props.text}
    </h1>
  );
}
