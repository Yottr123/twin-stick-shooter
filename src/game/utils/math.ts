export const clamp = (v: number, lo: number, hi: number): number =>
  Math.max(lo, Math.min(hi, v));

export const dist = (
  a: { x: number; y: number },
  b: { x: number; y: number }
): number => Math.hypot(a.x - b.x, a.y - b.y);

export const normalize = (dx: number, dy: number): [number, number] => {
  const m = Math.hypot(dx, dy) || 1;
  return [dx / m, dy / m];
};

export const circlesOverlap = (
  a: { x: number; y: number },
  b: { x: number; y: number },
  ra: number,
  rb: number
): boolean => dist(a, b) < ra + rb;

export const randBetween = (min: number, max: number): number =>
  min + Math.random() * (max - min);
