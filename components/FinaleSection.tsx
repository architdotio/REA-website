'use client';

import React from 'react';

interface FinaleSectionProps {
  isActive: boolean;
}

export default function FinaleSection({ isActive }: FinaleSectionProps) {
  return (
    <section className={`finale ${isActive ? 'on' : ''}`} id="finale">
      <p className="finale-kicker mono">
        Design engineer · Motion designer · Marketer
      </p>
      <h2 className="finale-title">
        One person. <em>One thread.</em>
      </h2>
    </section>
  );
}
