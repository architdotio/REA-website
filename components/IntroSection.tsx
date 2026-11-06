'use client';

import React from 'react';

interface IntroSectionProps {
  introOpacity: number;
}

export default function IntroSection({ introOpacity }: IntroSectionProps) {
  const blurAmount = Math.max(0, (1 - introOpacity) * 10).toFixed(1);

  return (
    <section
      className="intro"
      id="intro"
      style={{
        opacity: introOpacity,
        filter: `blur(${blurAmount}px)`,
        pointerEvents: introOpacity > 0.1 ? 'auto' : 'none',
      }}
    >
      <p className="intro-kicker mono">
        Welcome to the greatest portfolio of 2026 · Opus 5.5 era
      </p>
      <h1 className="intro-title">
        Yogi Suria — design, motion and code, by one person.
      </h1>
      <p className="intro-now">
        <i aria-hidden="true" />
        Currently designing at{' '}
        <a href="https://jumper.exchange" target="_blank" rel="noopener">
          Jumper
        </a>
      </p>
    </section>
  );
}
