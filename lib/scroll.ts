import * as THREE from 'three';
import { clamp, damp } from './math';

export interface ScrollState {
  scroll: number;
  scrollTarget: number;
  scrollVel: number;
  energy: number;
  energyS: number;
  footer: number;
  footerS: number;
  ndc: THREE.Vector2;
  fast: THREE.Vector2;
  target: THREE.Vector2;
  px: THREE.Vector2;
  down: boolean;
  clickPulse: number;
  coarse: boolean;
}

export class InputController {
  public storyMax: () => number;
  public footer = 0;
  public footerS = 0;
  public target = new THREE.Vector2(0, 0);
  public ndc = new THREE.Vector2(0, 0);
  public fast = new THREE.Vector2(0, 0);
  public px = new THREE.Vector2(typeof window !== 'undefined' ? window.innerWidth / 2 : 0, typeof window !== 'undefined' ? window.innerHeight / 2 : 0);
  public energy = 0;
  public energyS = 0;
  public lastMove = 0;
  public moved = false;
  public down = false;
  public clickPulse = 0;
  public coarse = false;
  public scrollTarget = 0;
  public scroll = 0;
  public scrollVel = 0;
  private footerEl: HTMLElement | null = null;
  private cleanupFns: (() => void)[] = [];

  constructor({ storyMax }: { storyMax?: () => number } = {}) {
    this.storyMax = storyMax || (() => {
      if (typeof document === 'undefined') return 1000;
      return Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    });

    if (typeof window === 'undefined') return;

    this.coarse = window.matchMedia('(pointer: coarse)').matches;

    const onPointer = (clientX: number, clientY: number) => {
      const nx = (clientX / window.innerWidth) * 2 - 1;
      const ny = -(clientY / window.innerHeight) * 2 + 1;
      const dist = Math.hypot(nx - this.target.x, ny - this.target.y);
      this.energy = Math.min(1, this.energy + dist * 2.2);
      this.target.set(nx, ny);
      this.px.set(clientX, clientY);
      this.lastMove = performance.now();
      this.moved = true;
    };

    const handlePointerMove = (e: PointerEvent) => onPointer(e.clientX, e.clientY);
    const handlePointerDown = (e: PointerEvent) => {
      this.down = true;
      this.clickPulse = 1;
      onPointer(e.clientX, e.clientY);
    };
    const handlePointerUp = () => {
      this.down = false;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) onPointer(touch.clientX, touch.clientY);
    };
    const handleScroll = () => this.readScroll();
    const handleResize = () => this.readScroll();

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    this.cleanupFns.push(() => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    });

    this.readScroll();
    this.scroll = this.scrollTarget;
  }

  public readScroll() {
    if (typeof window === 'undefined') return;
    const max = Math.max(1, this.storyMax());
    this.scrollTarget = clamp(window.scrollY / max, 0, 1);
    this.footerEl ||= document.getElementById('footer');
    const footerH = this.footerEl?.offsetHeight || window.innerHeight;
    this.footer = clamp((window.scrollY - max) / Math.max(1, footerH), 0, 1);
  }

  public update(dt: number) {
    if (this.coarse && (performance.now() - this.lastMove) / 1000 > 2.5) {
      this.target.multiplyScalar(Math.max(0, 1 - dt * 1.5));
    }

    this.ndc.x = damp(this.ndc.x, this.target.x, 3.2, dt);
    this.ndc.y = damp(this.ndc.y, this.target.y, 3.2, dt);
    this.fast.x = damp(this.fast.x, this.target.x, 14, dt);
    this.fast.y = damp(this.fast.y, this.target.y, 14, dt);

    this.energy = damp(this.energy, 0, 1.6, dt);
    this.energyS = damp(this.energyS, this.energy, 5, dt);
    this.clickPulse = damp(this.clickPulse, 0, 3.5, dt);

    const prevScroll = this.scroll;
    this.scroll = damp(this.scroll, this.scrollTarget, 2.6, dt);
    if (Math.abs(this.scroll - this.scrollTarget) < 1e-6) {
      this.scroll = this.scrollTarget;
    }
    this.scrollVel = (this.scroll - prevScroll) / Math.max(dt, 1e-4);
    this.footerS = damp(this.footerS, this.footer, 2.6, dt);
  }

  public destroy() {
    this.cleanupFns.forEach((fn) => fn());
    this.cleanupFns = [];
  }
}
