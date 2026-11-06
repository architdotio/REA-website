'use client';

import React from 'react';
import { pad3 } from '@/lib/math';

interface LoaderProps {
  progress: number;
  isReady: boolean;
  isDone: boolean;
  onEnter: (sound: boolean) => void;
}

export default function Loader({
  progress,
  isReady,
  isDone,
  onEnter,
}: LoaderProps) {
  const percentText = pad3(Math.round(progress * 100));

  return (
    <div
      id="loader"
      className={`${isReady ? 'ready' : ''} ${isDone ? 'done' : ''}`}
    >
      <div className="loader-inner">
        <p className="mono loader-k">
          {isReady ? 'Best with headphones' : 'Tying the thread'}
        </p>
        <div className="loader-bar">
          <i
            id="loader-fill"
            style={{ transform: `scaleX(${progress.toFixed(3)})` }}
          />
        </div>
        <p className="mono loader-p" id="loader-p">
          {percentText}
        </p>
        <div className="loader-enter">
          <button
            className="enter-btn on"
            data-enter="sound"
            onClick={() => onEnter(true)}
          >
            Enter with sound
          </button>
          <button
            className="enter-btn"
            data-enter="mute"
            onClick={() => onEnter(false)}
          >
            Enter muted
          </button>
        </div>
      </div>
    </div>
  );
}
