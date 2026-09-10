import { distance } from '@/lib/geometry';
import type { BrushPoint } from '@/types/stroke';

export function smoothPoint(previous: BrushPoint, current: BrushPoint, smoothing: number): BrushPoint {
  const alpha = Math.max(0.18, 1 - smoothing / 115);
  return {
    ...current,
    x: previous.x + (current.x - previous.x) * alpha,
    y: previous.y + (current.y - previous.y) * alpha,
    pressure: previous.pressure + (current.pressure - previous.pressure) * alpha,
  };
}

export function interpolatePoints(previous: BrushPoint, current: BrushPoint, spacing: number) {
  const count = Math.max(1, Math.ceil(distance(previous, current) / Math.max(1, spacing)));
  return Array.from({ length: count }, (_, index) => {
    const t = (index + 1) / count;
    return {
      x: previous.x + (current.x - previous.x) * t,
      y: previous.y + (current.y - previous.y) * t,
      pressure: previous.pressure + (current.pressure - previous.pressure) * t,
      tiltX: previous.tiltX + (current.tiltX - previous.tiltX) * t,
      tiltY: previous.tiltY + (current.tiltY - previous.tiltY) * t,
      timestamp: previous.timestamp + (current.timestamp - previous.timestamp) * t,
      velocity: current.velocity,
    } satisfies BrushPoint;
  });
}
