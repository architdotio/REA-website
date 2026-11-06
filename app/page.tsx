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
          <p className="intro-kicker mono">
            Welcome to the greatest portfolio of 2026 · Opus 5.5 era
          </p>
          <h1 className="intro-title">
            Yogi Suria — design, motion and code, by one person.
          </h1>
          <p className="intro-now">
            <i aria-hidden="true" />
            Currently designing at{' '}
            <a
              href="https://jumper.exchange"
              target="_blank"
              rel="noopener noreferrer"
            >
              Jumper
            </a>
          </p>
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

        <a
          className="basic"
          href="https://v1.ysuriadesign.co"
          aria-label="Visit my basic portfolio"
        >
          <span className="basic-pill">Visit basic portfolio</span>
          <span className="basic-pill basic-go" aria-hidden="true">
            <svg viewBox="0 0 16 16" width="15" height="15">
              <path
                d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </a>

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

      <div
        id="awwwards"
        style={{
          position: 'fixed',
          zIndex: 999,
          transform: 'translateY(-50%)',
          top: '50%',
          right: 0,
        }}
      >
        <a
          href="https://www.awwwards.com/sites/yogi-suria-one-thread"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg width="53.08" height="171.358">
            <path className="js-color-bg" fill="white" d="M0 0h53.08v171.358H0z" />
            <g className="js-color-text" fill="black">
              <path d="M20.048 153.585v-2.002l6.752-3.757h-6.752v-1.9h10.23v2.002l-6.752 3.757h6.752v1.9zM29.899 142.382a3.317 3.317 0 0 1-1.359 1.293c-.575.297-1.223.446-1.944.446-.721 0-1.369-.149-1.944-.446a3.317 3.317 0 0 1-1.359-1.293c-.331-.564-.497-1.232-.497-2.003 0-.769.166-1.437.497-2.002a3.332 3.332 0 0 1 1.359-1.294c.575-.297 1.224-.445 1.944-.445.722 0 1.369.148 1.944.445a3.326 3.326 0 0 1 1.359 1.294c.33.565.496 1.233.496 2.002.001.77-.166 1.438-.496 2.003m-1.703-3.348c-.435-.331-.967-.497-1.601-.497s-1.167.166-1.601.497c-.434.332-.65.78-.65 1.345s.217 1.014.65 1.346c.434.33.967.496 1.601.496s1.166-.166 1.601-.496c.434-.332.649-.78.649-1.346.001-.565-.215-1.013-.649-1.345M22.912 134.996v-1.812h1.185c-.43-.283-.752-.593-.973-.929-.219-.336-.329-.732-.329-1.19 0-.479.127-.902.38-1.272.254-.37.635-.633 1.141-.79-.478-.262-.851-.591-1.118-.985a2.221 2.221 0 0 1-.402-1.265c0-.682.2-1.218.599-1.607.4-.391.957-.585 1.668-.585h5.218v1.812H25.37c-.682 0-1.023.303-1.023.907 0 .467.264.85.789 1.146.527.299 1.286.446 2.28.446h2.865v1.813H25.37c-.682 0-1.023.303-1.023.906 0 .468.275.851.826 1.147.551.298 1.352.446 2.404.446h2.704v1.812h-7.369zM21.626 122.457c-.225.224-.502.336-.833.336s-.608-.112-.833-.336a1.128 1.128 0 0 1-.336-.833c0-.331.111-.609.336-.833.225-.225.502-.336.833-.336s.608.111.833.336c.225.224.337.502.337.833 0 .332-.112.608-.337.833m1.286-1.739h7.366v1.813h-7.366v-1.813zM22.912 118.668v-1.812h1.185a3.348 3.348 0 0 1-.951-1.009 2.434 2.434 0 0 1-.351-1.272c0-.681.19-1.229.57-1.644.38-.414.931-.621 1.651-.621h5.263v1.812h-4.722c-.418 0-.727.096-.92.285-.195.19-.293.447-.293.769 0 .302.116.58.351.833.233.254.577.458 1.03.613.453.156.992.234 1.615.234h2.938v1.812h-7.366zM29.833 109.129a3.33 3.33 0 0 1-1.432 1.169 4.535 4.535 0 0 1-1.805.373 4.537 4.537 0 0 1-1.807-.373c-.579-.248-1.057-.638-1.432-1.169s-.563-1.196-.563-1.995c0-.771.183-1.413.549-1.93a3.28 3.28 0 0 1 1.382-1.141 4.221 4.221 0 0 1 1.709-.364h.746v5.071c.447-.02.838-.183 1.168-.49.332-.307.498-.724.498-1.248 0-.41-.093-.754-.277-1.031-.186-.278-.473-.529-.863-.753l.542-1.462c.69.303 1.224.724 1.592 1.265.371.541.556 1.235.556 2.083 0 .799-.188 1.464-.563 1.995m-4.085-3.574c-.41.088-.746.261-1.009.52-.262.258-.395.61-.395 1.06 0 .428.137.784.409 1.067.272.282.604.458.994.525v-3.172zM29.833 100.878c-.375.531-.852.921-1.432 1.169a4.552 4.552 0 0 1-3.612 0c-.579-.248-1.057-.638-1.432-1.169s-.563-1.196-.563-1.995c0-.77.183-1.412.549-1.93a3.278 3.278 0 0 1 1.382-1.14 4.222 4.222 0 0 1 1.709-.365h.746v5.072a1.794 1.794 0 0 0 1.168-.49c.332-.307.498-.724.498-1.249 0-.41-.093-.753-.277-1.031-.186-.277-.473-.528-.863-.753l.542-1.462c.69.302 1.224.724 1.592 1.265.371.541.556 1.234.556 2.083 0 .799-.188 1.464-.563 1.995m-4.085-3.573c-.41.088-.746.261-1.009.519-.262.258-.395.611-.395 1.06 0 .429.137.784.409 1.067.272.282.604.458.994.526v-3.172zM35.481 16.926l-4.782 14.969h-3.266l-2.584-9.682-2.584 9.682h-3.268l-4.781-14.969h3.713l2.673 10.276 2.524-10.276h3.445l2.524 10.276 2.674-10.276zM37.979 27.083c1.426 0 2.495 1.068 2.495 2.495 0 1.425-1.069 2.495-2.495 2.495-1.425 0-2.495-1.07-2.495-2.495-.001-1.427 1.07-2.495 2.495-2.495" />
            </g>
          </svg>
        </a>
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
