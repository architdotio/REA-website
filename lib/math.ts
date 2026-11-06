export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export function damp(current: number, target: number, rate: number, dt: number): number {
  return target + (current - target) * Math.exp(-rate * dt);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function pad2(num: number): string {
  return String(num).padStart(2, '0');
}

export function pad3(num: number): string {
  return String(num).padStart(3, '0');
}
