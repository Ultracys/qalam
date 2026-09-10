import type { PracticeStyle } from '@/types/brush';

export function drawPracticeGuides(ctx: CanvasRenderingContext2D, width: number, height: number, nibWidth: number, style: PracticeStyle, grid: boolean) {
  if (style === 'none') return;
  const unit = Math.max(7, nibWidth);
  ctx.save();
  ctx.lineWidth = 1;
  if (grid) {
    ctx.fillStyle = 'rgba(40, 105, 91, .18)';
    for (let x = unit; x < width; x += unit) for (let y = unit; y < height; y += unit) { ctx.beginPath(); ctx.arc(x, y, 1.2, 0, Math.PI * 2); ctx.fill(); }
  }
  const baselineGap = style === 'thuluth' ? unit * 7 : style === 'diwani' ? unit * 5 : unit * 4;
  for (let y = baselineGap; y < height; y += baselineGap) {
    ctx.strokeStyle = 'rgba(157, 116, 46, .26)';
    ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    ctx.strokeStyle = 'rgba(40, 105, 91, .16)';
    ctx.setLineDash([4, 7]);
    ctx.beginPath(); ctx.moveTo(0, y - unit * 2); ctx.lineTo(width, y - unit * 2); ctx.stroke();
  }
  ctx.restore();
}
