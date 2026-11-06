'use client';

import React from 'react';

interface ScrollCueProps {
  opacity: number;
}

export default function ScrollCue({ opacity }: ScrollCueProps) {
  return (
    <div
      className="scroll-cue mono"
      id="cue"
      style={{
        opacity: Math.max(0, opacity * 1.4 - 0.4),
        pointerEvents: opacity > 0.1 ? 'auto' : 'none',
      }}
    >
      <span>Scroll</span>
      <i />
    </div>
  );
}
