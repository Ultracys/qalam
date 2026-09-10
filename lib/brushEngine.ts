import { nibEdges } from '@/lib/geometry';
import type { BrushPoint, Stroke } from '@/types/stroke';

function pointWidth(stroke: Stroke, point: BrushPoint) {
  const sensitivity = stroke.pressureSensitivity / 100;
  const pressure = stroke.pressureEnabled ? 1 - sensitivity + (0.35 + point.pressure * 0.95) * sensitivity : 1;
  const tilt = 1 + Math.min(0.16, Math.hypot(point.tiltX, point.tiltY) / 540);
  const speed = Math.max(0.88, 1 - point.velocity * 0.045);
  return stroke.nibWidth * pressure * tilt * speed;
}

export function drawStroke(ctx: CanvasRenderingContext2D, stroke: Stroke) {
  const points = stroke.points;
  if (!points.length) return;
  ctx.save();
  ctx.fillStyle = stroke.color;
  ctx.globalCompositeOperation = 'source-over';
  const first = nibEdges(points[0], pointWidth(stroke, points[0]), stroke.nibAngle);
  ctx.beginPath();
  ctx.moveTo(first.left.x, first.left.y);
  ctx.lineTo(first.right.x, first.right.y);
  ctx.lineTo(first.right.x + 0.01, first.right.y + 0.01);
  ctx.closePath();
  ctx.fill();

  for (let index = 1; index < points.length; index += 1) {
    const previous = nibEdges(points[index - 1], pointWidth(stroke, points[index - 1]), stroke.nibAngle);
    const current = nibEdges(points[index], pointWidth(stroke, points[index]), stroke.nibAngle);
    ctx.beginPath();
    ctx.moveTo(previous.left.x, previous.left.y);
    ctx.lineTo(previous.right.x, previous.right.y);
    ctx.lineTo(current.right.x, current.right.y);
    ctx.lineTo(current.left.x, current.left.y);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

export function drawStrokes(ctx: CanvasRenderingContext2D, strokes: Stroke[]) {
  for (const stroke of strokes) drawStroke(ctx, stroke);
}
