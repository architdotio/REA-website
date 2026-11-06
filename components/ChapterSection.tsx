'use client';

import React from 'react';
import { Chapter } from '@/lib/data';
import { pad2 } from '@/lib/math';

interface ChapterSectionProps {
  chapter: Chapter | null;
  chapterIndex: number;
  isActive: boolean;
  localProgress: number;
}

export default function ChapterSection({
  chapter,
  chapterIndex,
  isActive,
  localProgress,
}: ChapterSectionProps) {
  if (!chapter) {
    return (
      <section
        className={`chapter ${isActive ? 'on' : ''}`}
        id="chapter"
        aria-live="polite"
        style={{ '--p': localProgress.toFixed(3) } as React.CSSProperties}
      >
        <div className="ch-meta mono">
          <span className="ch-num" id="ch-num">
            01
          </span>
          <span className="ch-rule" />
          <span className="ch-kicker">Chapter</span>
        </div>
        <h2 className="ch-title" id="ch-title" />
        <p className="ch-line" id="ch-line" />
        <dl className="ch-stats" id="ch-stats" />
      </section>
    );
  }

  let charIndex = 0;
  const words = chapter.title.split(' ');

  return (
    <section
      className={`chapter ${isActive ? 'on' : ''}`}
      id="chapter"
      aria-live="polite"
      style={{ '--p': localProgress.toFixed(3) } as React.CSSProperties}
    >
      <div className="ch-meta mono">
        <span className="ch-num" id="ch-num">
          {pad2(chapterIndex + 1)}
        </span>
        <span className="ch-rule" />
        <span className="ch-kicker">Chapter</span>
      </div>

      <h2 className="ch-title" id="ch-title" aria-label={chapter.title}>
        {words.map((word, wIdx) => (
          <React.Fragment key={wIdx}>
            <span className="ch-word">
              {[...word].map((char, cIdx) => (
                <span
                  key={cIdx}
                  className="ch-char"
                  style={{ '--i': charIndex++ } as React.CSSProperties}
                >
                  {char}
                </span>
              ))}
            </span>
            {wIdx < words.length - 1 && ' '}
          </React.Fragment>
        ))}
      </h2>

      {chapter.line && (
        <p className="ch-line" id="ch-line">
          {chapter.line}
        </p>
      )}

      {chapter.stats && chapter.stats.length > 0 && (
        <dl className="ch-stats" id="ch-stats">
          {chapter.stats.map(([num, label], idx) => (
            <div key={idx} style={{ '--j': idx } as React.CSSProperties}>
              <dt>{num}</dt>
              <dd className="mono">{label}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
