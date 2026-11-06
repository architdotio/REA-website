'use client';

import React from 'react';

interface HeaderProps {
  currentChapter: number;
  soundOn: boolean;
  onToggleSound: () => void;
  onToggleIndex: () => void;
  onJumpStart: () => void;
}

export default function Header({
  currentChapter,
  soundOn,
  onToggleSound,
  onToggleIndex,
  onJumpStart,
}: HeaderProps) {
  const chapterText = String(currentChapter).padStart(2, '0');

  return (
    <header className="top">
      <a
        className="mark"
        href="#"
        onClick={(e) => {
          e.preventDefault();
          onJumpStart();
        }}
        aria-label="One Thread — back to start"
      >
        <span className="mark-pic" aria-hidden="true">
          <img
            src="/media/profile.jpg"
            alt=""
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
          <b>YS</b>
        </span>
        <span className="mark-word">Yogi&nbsp;Suria</span>
      </a>

      <div className="counter mono" aria-live="polite">
        <span id="count-now">{chapterText}</span>
        <span className="counter-sep">/</span>
        <span>06</span>
      </div>

      <div className="top-r">
        <button
          className={`sound-btn mono ${soundOn ? 'on' : ''}`}
          id="sound-btn"
          aria-pressed={soundOn}
          aria-label="Sound"
          onClick={onToggleSound}
        >
          Sound <span>{soundOn ? 'on' : 'off'}</span>
        </button>

        <button
          className="index-btn mono"
          id="index-btn"
          aria-expanded="false"
          aria-controls="index"
          onClick={onToggleIndex}
        >
          Index
        </button>
      </div>
    </header>
  );
}
