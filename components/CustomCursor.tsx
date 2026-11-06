'use client';

import React, { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLElement | null>(null);
  const ringRef = useRef<HTMLElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!cursor || !dot || !ring) return;

    let cx = window.innerWidth / 2;
    let cy = window.innerHeight / 2;
    let tx = cx;
    let ty = cy;
    let rafId: number;

    const handlePointerMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      cursor.classList.remove('away');
    };

    const handlePointerLeave = () => {
      cursor.classList.add('away');
    };

    const handlePointerEnter = () => {
      cursor.classList.remove('away');
    };

    const handlePointerOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a, button, .wl, .wm-thumb, [data-jump]');
      document.body.classList.toggle('hovering', !!target);
    };

    let prevTime = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - prevTime) / 1000);
      prevTime = now;

      cx += (tx - cx) * Math.min(1, dt * 16);
      cy += (ty - cy) * Math.min(1, dt * 16);

      dot.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      ring.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave);
    document.addEventListener('pointerenter', handlePointerEnter);
    document.addEventListener('pointerover', handlePointerOver);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('pointerenter', handlePointerEnter);
      document.removeEventListener('pointerover', handlePointerOver);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div id="cursor" ref={cursorRef} aria-hidden="true">
      <i className="c-dot" ref={dotRef} />
      <i className="c-ring" ref={ringRef} />
    </div>
  );
}
