'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Project, ProjectMedia } from '@/lib/data';

interface WorkModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function WorkModal({
  project,
  isOpen,
  onClose,
}: WorkModalProps) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentMediaIndex(0);
      document.documentElement.classList.add('modal-open');
    } else {
      document.documentElement.classList.remove('modal-open');
    }
    return () => {
      document.documentElement.classList.remove('modal-open');
    };
  }, [isOpen, project]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || !project) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        setCurrentMediaIndex((prev) => (prev + 1) % project.media.length);
      } else if (e.key === 'ArrowLeft') {
        setCurrentMediaIndex((prev) =>
          (prev - 1 + project.media.length) % project.media.length
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, project, onClose]);

  if (!project) return null;

  const currentMedia: ProjectMedia | undefined = project.media[currentMediaIndex];

  const handleStep = (delta: number) => {
    const total = project.media.length;
    setCurrentMediaIndex((prev) => (prev + delta + total) % total);
  };

  return (
    <div
      className={`work-modal ${isOpen ? 'open' : ''}`}
      id="work-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wm-title"
      aria-hidden={!isOpen}
      style={{ '--pc': project.color } as React.CSSProperties}
    >
      <div className="wm-backdrop" onClick={onClose} data-close />

      <article className="wm-glass">
        <header className="wm-head">
          <h3 className="wm-title" id="wm-title">
            {project.name}
          </h3>
          <p className="wm-desc" id="wm-desc">
            {project.desc}
          </p>
          <button
            className="wm-close"
            onClick={onClose}
            aria-label="Close"
            data-close
          >
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <path
                d="M3 3l10 10M13 3L3 13"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        <div className="wm-stage" id="wm-stage" ref={stageRef}>
          {currentMedia && (
            <>
              {currentMedia.type === 'video' ? (
                <video
                  key={currentMedia.src}
                  src={currentMedia.src}
                  playsInline
                  loop={!currentMedia.sound}
                  controls={!!currentMedia.sound}
                  muted={!currentMedia.sound}
                  autoPlay
                />
              ) : (
                <img
                  key={currentMedia.src}
                  src={currentMedia.src}
                  alt={`${project.name} — sample ${currentMediaIndex + 1}`}
                  decoding="async"
                />
              )}
              {currentMedia.label && (
                <p
                  className={
                    currentMedia.sound ? 'wm-cap wm-cap-hi mono' : 'wm-cap mono'
                  }
                >
                  {currentMedia.label}
                </p>
              )}
            </>
          )}
        </div>

        <footer className="wm-foot">
          <div className="wm-thumbs" id="wm-thumbs">
            {project.media.map((media, idx) => {
              const isSelected = idx === currentMediaIndex;
              return (
                <button
                  key={idx}
                  className={`wm-thumb ${isSelected ? 'on' : ''}`}
                  aria-label={media.label || `${project.name} — ${idx + 1}`}
                  onClick={() => setCurrentMediaIndex(idx)}
                >
                  {media.type === 'image' ? (
                    <span
                      style={{
                        backgroundImage: `url("${media.src}")`,
                        display: 'block',
                        width: '100%',
                        height: '100%',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                  ) : (
                    <>
                      <video
                        src={media.thumb || media.src}
                        muted
                        playsInline
                        preload="metadata"
                      />
                      <span className="mono">{media.label || 'Film'}</span>
                    </>
                  )}
                </button>
              );
            })}
          </div>

          <nav className="wm-nav" aria-label="Media">
            <button
              id="wm-prev"
              aria-label="Previous"
              onClick={() => handleStep(-1)}
            >
              ←
            </button>
            <button
              id="wm-next"
              aria-label="Next"
              onClick={() => handleStep(1)}
            >
              →
            </button>
          </nav>
        </footer>
      </article>
    </div>
  );
}
