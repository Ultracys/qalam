import { nibEdges } from '@/lib/geometry';
import type { Stroke } from '@/types/stroke';

function strokePolygons(stroke: Stroke) {
  return stroke.points.slice(1).map((point, index) => {
    const previous = stroke.points[index];
    const sensitivity = stroke.pressureSensitivity / 100;
    const pressureA = stroke.pressureEnabled ? 1 - sensitivity + (0.35 + previous.pressure * 0.95) * sensitivity : 1;
    const pressureB = stroke.pressureEnabled ? 1 - sensitivity + (0.35 + point.pressure * 0.95) * sensitivity : 1;
    const a = nibEdges(previous, stroke.nibWidth * pressureA, stroke.nibAngle);
    const b = nibEdges(point, stroke.nibWidth * pressureB, stroke.nibAngle);
    return `<polygon points="${a.left.x.toFixed(2)},${a.left.y.toFixed(2)} ${a.right.x.toFixed(2)},${a.right.y.toFixed(2)} ${b.right.x.toFixed(2)},${b.right.y.toFixed(2)} ${b.left.x.toFixed(2)},${b.left.y.toFixed(2)}"/>`;
  }).join('');
}

export function strokesToSvg(strokes: Stroke[], width: number, height: number) {
  const groups = strokes.map((stroke) => `<g fill="${stroke.color}">${strokePolygons(stroke)}</g>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">${groups}</svg>`;
}

export function downloadText(content: string, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
