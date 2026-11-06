'use client';

import React from 'react';

interface FooterProps {
  onBeginAgain: () => void;
}

export default function Footer({ onBeginAgain }: FooterProps) {
  return (
    <footer className="footer" id="footer">
      <div className="ft-bar">
        <div className="ft-l">
          <p className="ft-kick mono">
            <span className="ft-dot" aria-hidden="true" />
            Open for new work · 2026
          </p>
          <h2 className="ft-title">
            Let’s build <em>what’s next.</em>
          </h2>
        </div>

        <div className="ft-r">
          <a
            className="ft-mail"
            href="mailto:reachout@yogindersuria.live?subject=Project%20enquiry"
          >
            reachout@yogindersuria.live
            <span aria-hidden="true">→</span>
          </a>
          <nav className="ft-links mono" aria-label="Elsewhere">
            <a
              href="https://ysuriadesign.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Portfolio ↗
            </a>
            <a
              href="https://x.com/suriadesign"
              target="_blank"
              rel="noopener noreferrer"
            >
              X ↗
            </a>
            <a
              href="https://www.linkedin.com/in/yogi-suria-a8b787316/"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn ↗
            </a>
          </nav>
        </div>

        <div className="ft-base mono">
          <span>© 2026 Yogi Suria</span>
          <button
            className="ft-again mono"
            data-jump="0"
            onClick={onBeginAgain}
          >
            Begin again ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
