'use client';

import React from 'react';
import { CHAPTERS } from '@/lib/data';
import { pad2 } from '@/lib/math';

interface RailNavProps {
  progress: number;
  currentChapter: number;
  onJump: (chapterIndex: number) => void;
}

export default function RailNav({
  progress,
  currentChapter,
  onJump,
}: RailNavProps) {
  return (
    <nav className="rail" id="rail" aria-label="Chapters">
      <i
        className="rail-fill"
        style={{ transform: `scaleY(${progress.toFixed(4)})` }}
      />
      {CHAPTERS.map((chap, idx) => {
        const isCurrent = currentChapter === idx;
        return (
          <a
            key={chap.id}
            href={`#chapter-${idx + 1}`}
            className={isCurrent ? 'on' : ''}
            data-jump={String(idx + 1)}
            aria-label={`Chapter ${idx + 1}: ${chap.title}`}
            onClick={(e) => {
              e.preventDefault();
              onJump(idx);
            }}
          >
            <span>
              {pad2(idx + 1)} {chap.title}
            </span>
          </a>
        );
      })}
    </nav>
  );
}
