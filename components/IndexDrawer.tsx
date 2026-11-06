'use client';

import React from 'react';
import { CHAPTERS } from '@/lib/data';
import { pad2 } from '@/lib/math';

interface IndexDrawerProps {
  isOpen: boolean;
  currentChapter: number;
  onClose: () => void;
  onJump: (chapterIndex: number) => void;
}

export default function IndexDrawer({
  isOpen,
  currentChapter,
  onClose,
  onJump,
}: IndexDrawerProps) {
  return (
    <nav
      className={`index ${isOpen ? 'open' : ''}`}
      id="index"
      aria-hidden={!isOpen}
    >
      <ol id="index-list">
        {CHAPTERS.map((chap, idx) => {
          const isCurrent = currentChapter === idx;
          return (
            <li key={chap.id}>
              <a
                href={`#chapter-${idx + 1}`}
                className={isCurrent ? 'on' : ''}
                data-jump={String(idx + 1)}
                onClick={(e) => {
                  e.preventDefault();
                  onJump(idx);
                  onClose();
                }}
              >
                <small>{pad2(idx + 1)}</small>
                {chap.title}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
