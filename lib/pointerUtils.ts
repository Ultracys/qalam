import type { BrushPoint } from '@/types/stroke';

export function pointFromPointer(event: PointerEvent | React.PointerEvent, x: number, y: number, previous?: BrushPoint): BrushPoint {
  const timestamp = event.timeStamp || performance.now();
  const elapsed = Math.max(1, timestamp - (previous?.timestamp ?? timestamp));
  const traveled = previous ? Math.hypot(x - previous.x, y - previous.y) : 0;
  return {
    x,
    y,
    pressure: event.pressure > 0 ? event.pressure : 0.5,
    tiltX: event.tiltX ?? 0,
    tiltY: event.tiltY ?? 0,
    timestamp,
    velocity: traveled / elapsed,
  };
}

export function supportsPointerEvents() {
  return typeof window !== 'undefined' && 'PointerEvent' in window;
}
