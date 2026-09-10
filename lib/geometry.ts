import type { BrushPoint } from '@/types/stroke';

export const distance = (a: Pick<BrushPoint, 'x' | 'y'>, b: Pick<BrushPoint, 'x' | 'y'>) =>
  Math.hypot(b.x - a.x, b.y - a.y);

export function nibEdges(point: BrushPoint, width: number, angle: number) {
  const radians = (angle * Math.PI) / 180;
  const half = width / 2;
  const vx = Math.cos(radians) * half;
  const vy = Math.sin(radians) * half;
  return {
    left: { x: point.x - vx, y: point.y - vy },
    right: { x: point.x + vx, y: point.y + vy },
  };
}

export function pointSegmentDistance(
  point: { x: number; y: number },
  start: { x: number; y: number },
  end: { x: number; y: number },
) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  if (!dx && !dy) return Math.hypot(point.x - start.x, point.y - start.y);
  const t = Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(point.x - (start.x + t * dx), point.y - (start.y + t * dy));
}
