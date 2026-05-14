// Placeholder for React Bits TextType Component
import React from 'react';

export default function TextType(props: any) {
  return (
    <div className="text-white/80 font-medium">
      {props.text && props.text.length > 0 ? props.text[0] : ""}
      {props.showCursor && <span className="animate-pulse">{props.cursorCharacter || "_"}</span>}
    </div>
  );
}
