'use client';

import Script from 'next/script';
import React from 'react';

export default function Home() {
  return (
    <>
      <canvas id="gl" aria-hidden="true" />
      <div id="scroll" aria-hidden="true" />

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
              href="mailto:architkumar78335@gmail.com?subject=Project%20enquiry"
            >
              architkumar78335@gmail.com
              <span aria-hidden="true">→</span>
            </a>
            <nav className="ft-links mono" aria-label="Elsewhere">
              <a
                href="https://www.linkedin.com/in/architjha/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn ↗
              </a>
            </nav>
          </div>
          <div className="ft-base mono">
            <span>© 2026 Archit Jha</span>
            <button className="ft-again mono" data-jump="0">
              Begin again ↑
            </button>
          </div>
        </div>
      </footer>

      <main id="ui">
        <header className="top">
          <a
            className="mark"
            href="#"
            data-jump="0"
            aria-label="One Thread: back to start"
          >
            <span className="mark-word">Archit&nbsp;Jha</span>
          </a>
          <div className="counter mono" aria-live="polite">
            <span id="count-now">00</span>
            <span className="counter-sep">/</span>
            <span>06</span>
          </div>
          <div className="top-r">
            <button
              className="sound-btn mono"
              id="sound-btn"
              aria-pressed="false"
              aria-label="Sound"
            >
              Sound <span>off</span>
            </button>
            <button
              className="index-btn mono"
              id="index-btn"
              aria-expanded="false"
              aria-controls="index"
            >
              Index
            </button>
          </div>
        </header>

        <section className="intro" id="intro">
          <h1 className="intro-title">
            Archit Jha: design, motion and code, by one person.
          </h1>
        </section>

        <section className="chapter" id="chapter" aria-live="polite">
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

        <div className="work-labels" id="work-labels" />
        <div className="frame-tags" id="frame-tags" aria-hidden="true" />

        <section className="finale" id="finale">
          <p className="finale-kicker mono">
            Design engineer · Motion designer · Marketer
          </p>
          <h2 className="finale-title">
            One person. <em>One thread.</em>
          </h2>
        </section>

        <nav className="rail" id="rail" aria-label="Chapters" />

        <div className="scroll-cue mono" id="cue">
          <span>Scroll</span>
          <i />
        </div>

        <nav className="index open" id="index">
          <ol id="index-list" />
        </nav>
      </main>

      <div
        className="work-modal"
        id="work-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="wm-title"
        aria-hidden="true"
      >
        <div className="wm-backdrop" data-close />
        <article className="wm-glass">
          <header className="wm-head">
            <h3 className="wm-title" id="wm-title" />
            <p className="wm-desc" id="wm-desc" />
            <button className="wm-close" data-close aria-label="Close">
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
          <div className="wm-stage" id="wm-stage" />
          <footer className="wm-foot">
            <div className="wm-thumbs" id="wm-thumbs" />
            <nav className="wm-nav" aria-label="Media">
              <button id="wm-prev" aria-label="Previous">
                ←
              </button>
              <button id="wm-next" aria-label="Next">
                →
              </button>
            </nav>
          </footer>
        </article>
      </div>

      <div id="loader">
        <div className="loader-inner">
          <p className="mono loader-k">Tying the thread</p>
          <div className="loader-bar">
            <i id="loader-fill" />
          </div>
          <p className="mono loader-p" id="loader-p">
            000
          </p>
          <div className="loader-enter">
            <button className="enter-btn on" data-enter="sound">
              Enter with sound
            </button>
            <button className="enter-btn" data-enter="mute">
              Enter muted
            </button>
          </div>
        </div>
      </div>

      <div id="cursor" aria-hidden="true">
        <i className="c-dot" />
        <i className="c-ring" />
      </div>

      <Script
        type="module"
        crossOrigin="anonymous"
        src="/assets/main-B3KnSToQ.js"
        strategy="afterInteractive"
      />
    </>
  );
}
