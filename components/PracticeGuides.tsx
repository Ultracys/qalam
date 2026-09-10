import type { PracticeStyle } from '@/types/brush';

function trainingLineMetrics(fontSize: number) {
  const baselineGap = Math.max(120, fontSize * 1.55);
  return { baselineGap, headlineOffset: fontSize * 0.72 };
}

export function drawPracticeGuides(ctx: CanvasRenderingContext2D, width: number, height: number, nibWidth: number, style: PracticeStyle, grid: boolean, trainingSize?: number) {
  if (style === 'none') return;
  const unit = Math.max(7, nibWidth);
  ctx.save();
  ctx.lineWidth = 1;
  if (grid) {
    ctx.fillStyle = 'rgba(40, 105, 91, .18)';
    for (let x = unit; x < width; x += unit) for (let y = unit; y < height; y += unit) { ctx.beginPath(); ctx.arc(x, y, 1.2, 0, Math.PI * 2); ctx.fill(); }
  }
  const trainingMetrics = trainingSize ? trainingLineMetrics(trainingSize) : null;
  const baselineGap = trainingMetrics?.baselineGap ?? (style === 'thuluth' ? unit * 7 : style === 'diwani' ? unit * 5 : unit * 4);
  const headlineOffset = trainingMetrics?.headlineOffset ?? unit * 2;
  for (let y = baselineGap; y < height; y += baselineGap) {
    ctx.strokeStyle = 'rgba(157, 116, 46, .26)';
    ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    ctx.strokeStyle = 'rgba(40, 105, 91, .16)';
    ctx.setLineDash([4, 7]);
    ctx.beginPath(); ctx.moveTo(0, y - headlineOffset); ctx.lineTo(width, y - headlineOffset); ctx.stroke();
  }
  ctx.restore();
}

export function drawTrainingTemplate(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  text: string,
  fontFamily: string,
  fontSize: number,
  opacity: number,
) {
  const sample = text.trim();
  if (!sample) return;
  const { baselineGap } = trainingLineMetrics(fontSize);
  ctx.save();
  ctx.direction = 'rtl';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.font = `${fontSize}px ${fontFamily || 'serif'}`;
  ctx.fillStyle = `rgba(23, 107, 90, ${Math.max(0.05, opacity / 100)})`;
  for (let y = baselineGap; y < height; y += baselineGap) {
    ctx.fillText(sample, width / 2, y, Math.max(120, width - 96));
  }
  ctx.restore();
}
