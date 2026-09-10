'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ImagePlus, Minus, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { drawStroke, drawStrokes } from '@/lib/brushEngine';
import { pointSegmentDistance } from '@/lib/geometry';
import { pointFromPointer } from '@/lib/pointerUtils';
import { interpolatePoints, smoothPoint } from '@/lib/strokeSmoothing';
import { downloadText, strokesToSvg } from '@/lib/svgExporter';
import { canvasStore, useCanvasStore } from '@/store/canvasStore';
import type { BrushPoint, Stroke } from '@/types/stroke';
import { drawPracticeGuides } from '@/components/PracticeGuides';
import { Toolbar } from '@/components/Toolbar';
import { BrushSettings } from '@/components/BrushSettings';
import { useQalamWebMcp } from '@/hooks/useQalamWebMcp';

type DebugData = { pressure: number; tiltX: number; tiltY: number; velocity: number; pointerType: string };

export function CalligraphyCanvas() {
  useQalamWebMcp();
  const state = useCanvasStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number | null>(null);
  const activeStroke = useRef<Stroke | null>(null);
  const activePen = useRef<number | null>(null);
  const transform = useRef({ x: 0, y: 0, zoom: 1 });
  const touches = useRef(new Map<number, { x: number; y: number }>());
  const lastPinchDistance = useRef(0);
  const mousePan = useRef<{ id: number; x: number; y: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [debugData, setDebugData] = useState<DebugData>({ pressure: 0, tiltX: 0, tiltY: 0, velocity: 0, pointerType: '—' });
  const [traceUrl, setTraceUrl] = useState<string | null>(null);
  const [traceOpacity, setTraceOpacity] = useState(34);
  const traceImage = useRef<HTMLImageElement | null>(null);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = state.darkMode ? '#171a18' : '#fbfaf5';
    ctx.fillRect(0, 0, width, height);
    const view = transform.current;
    ctx.setTransform(dpr * view.zoom, 0, 0, dpr * view.zoom, dpr * view.x, dpr * view.y);
    if (state.guides) drawPracticeGuides(ctx, rect.width / view.zoom, rect.height / view.zoom, state.brush.nibWidth, state.practice, state.grid);
    if (traceImage.current) {
      const image = traceImage.current;
      const maxWidth = rect.width * 0.72;
      const scale = Math.min(maxWidth / image.naturalWidth, (rect.height * 0.7) / image.naturalHeight, 1);
      ctx.save(); ctx.globalAlpha = traceOpacity / 100; ctx.drawImage(image, 40, 40, image.naturalWidth * scale, image.naturalHeight * scale); ctx.restore();
    }
    drawStrokes(ctx, state.strokes);
    if (activeStroke.current) drawStroke(ctx, activeStroke.current);
  }, [state, traceOpacity]);

  const queueRender = useCallback(() => {
    if (frameRef.current !== null) return;
    frameRef.current = requestAnimationFrame(() => { frameRef.current = null; render(); });
  }, [render]);

  useEffect(() => { canvasStore.hydrate(); }, []);
  useEffect(() => { document.documentElement.classList.toggle('dark', state.darkMode); queueRender(); }, [state.darkMode, queueRender]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(queueRender);
    observer.observe(canvas);
    queueRender();
    return () => observer.disconnect();
  }, [queueRender]);

  const canvasPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const view = transform.current;
    return { x: (event.clientX - rect.left - view.x) / view.zoom, y: (event.clientY - rect.top - view.y) / view.zoom };
  };

  const eraseAt = (point: { x: number; y: number }) => {
    const radius = Math.max(12, state.brush.nibWidth * 1.2);
    const match = [...canvasStore.getState().strokes].reverse().find((stroke) => stroke.points.some((sample, index) => index > 0 && pointSegmentDistance(point, stroke.points[index - 1], sample) < radius));
    if (match) canvasStore.removeStroke(match.id);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (event.pointerType === 'touch') {
      if (activePen.current !== null) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      touches.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
      return;
    }
    const point = canvasPoint(event);
    if (state.tool === 'pan') { event.currentTarget.setPointerCapture(event.pointerId); mousePan.current = { id: event.pointerId, x: event.clientX, y: event.clientY }; return; }
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    if (state.tool === 'eraser') { eraseAt(point); return; }
    activePen.current = event.pointerId;
    const first = pointFromPointer(event, point.x, point.y);
    activeStroke.current = { id: crypto.randomUUID(), tool: 'qalam', points: [first], color: state.brush.color, nibWidth: state.brush.nibWidth, nibAngle: state.brush.nibAngle, pressureEnabled: state.brush.pressureEnabled, pressureSensitivity: state.brush.pressureSensitivity, smoothing: state.brush.smoothing };
    setDebugData({ pressure: first.pressure, tiltX: first.tiltX, tiltY: first.tiltY, velocity: 0, pointerType: event.pointerType });
    queueRender();
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (event.pointerType === 'touch') {
      if (activePen.current !== null || !touches.current.has(event.pointerId)) return;
      const previous = touches.current.get(event.pointerId)!;
      touches.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
      const points = [...touches.current.values()];
      if (points.length === 1) { transform.current.x += event.clientX - previous.x; transform.current.y += event.clientY - previous.y; }
      if (points.length >= 2) {
        const pinchDistance = Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y);
        if (lastPinchDistance.current) {
          const nextZoom = Math.max(0.45, Math.min(4, transform.current.zoom * (pinchDistance / lastPinchDistance.current)));
          transform.current.zoom = nextZoom; setZoom(nextZoom);
        }
        lastPinchDistance.current = pinchDistance;
      }
      queueRender(); return;
    }
    const point = canvasPoint(event);
    if (mousePan.current?.id === event.pointerId) { transform.current.x += event.clientX - mousePan.current.x; transform.current.y += event.clientY - mousePan.current.y; mousePan.current = { id: event.pointerId, x: event.clientX, y: event.clientY }; queueRender(); return; }
    if (state.tool === 'eraser' && event.buttons) { eraseAt(point); return; }
    const stroke = activeStroke.current;
    if (!stroke || activePen.current !== event.pointerId) return;
    const events = event.nativeEvent.getCoalescedEvents?.() ?? [event.nativeEvent];
    for (const sampleEvent of events) {
      const rect = event.currentTarget.getBoundingClientRect();
      const view = transform.current;
      const sample = { x: (sampleEvent.clientX - rect.left - view.x) / view.zoom, y: (sampleEvent.clientY - rect.top - view.y) / view.zoom };
      const previous = stroke.points.at(-1)!;
      let current = pointFromPointer(sampleEvent, sample.x, sample.y, previous);
      const stabilization = { off: 0, low: 12, medium: 28, high: 45 }[state.brush.stabilizer];
      current = smoothPoint(previous, current, Math.max(state.brush.smoothing, stabilization));
      stroke.points.push(...interpolatePoints(previous, current, stroke.nibWidth * 0.28));
      setDebugData({ pressure: current.pressure, tiltX: current.tiltX, tiltY: current.tiltY, velocity: current.velocity, pointerType: event.pointerType });
    }
    queueRender();
  };

  const finishPointer = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (event.pointerType === 'touch') { touches.current.delete(event.pointerId); lastPinchDistance.current = 0; return; }
    if (mousePan.current?.id === event.pointerId) { mousePan.current = null; return; }
    if (activePen.current !== event.pointerId) return;
    if (activeStroke.current?.points.length) canvasStore.addStroke(activeStroke.current);
    activeStroke.current = null; activePen.current = null; queueRender();
  };

  const changeZoom = (delta: number) => { const next = Math.max(0.45, Math.min(4, transform.current.zoom + delta)); transform.current.zoom = next; setZoom(next); queueRender(); };
  const exportPng = (transparent: boolean) => {
    const source = canvasRef.current; if (!source) return;
    if (!transparent) { const anchor = document.createElement('a'); anchor.href = source.toDataURL('image/png'); anchor.download = 'qalam-canvas.png'; anchor.click(); return; }
    const temp = document.createElement('canvas'); temp.width = source.width; temp.height = source.height; const ctx = temp.getContext('2d'); if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2); const view = transform.current; ctx.setTransform(dpr * view.zoom, 0, 0, dpr * view.zoom, dpr * view.x, dpr * view.y); drawStrokes(ctx, state.strokes);
    const anchor = document.createElement('a'); anchor.href = temp.toDataURL('image/png'); anchor.download = 'qalam-canvas-transparent.png'; anchor.click();
  };
  const exportSvg = () => { const rect = canvasRef.current?.getBoundingClientRect(); if (!rect) return; downloadText(strokesToSvg(state.strokes, Math.round(rect.width), Math.round(rect.height)), 'qalam-canvas.svg', 'image/svg+xml'); };

  const uploadTrace = (file?: File) => {
    if (!file) return;
    if (traceUrl) URL.revokeObjectURL(traceUrl);
    const url = URL.createObjectURL(file); const image = new Image(); image.onload = () => { traceImage.current = image; queueRender(); }; image.src = url; setTraceUrl(url);
  };

  return (
    <main className="app-shell" dir="rtl">
      <Toolbar onPng={exportPng} onSvg={exportSvg} zoom={zoom} onZoom={changeZoom} />
      <section className="workspace">
        <BrushSettings />
        <div className="canvas-stage">
          <canvas ref={canvasRef} aria-label="لوحة الكتابة بالخط العربي" onContextMenu={(event) => event.preventDefault()} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={finishPointer} onPointerCancel={finishPointer} />
          <div className="canvas-status"><span className="live-dot" />{activePen.current !== null ? 'القلم متصل' : 'جاهز للكتابة'}<i />{Math.round(zoom * 100)}%</div>
          <div className="trace-panel">
            {!traceUrl ? <label className="trace-upload"><ImagePlus />إضافة نموذج<input type="file" accept="image/*" onChange={(event) => uploadTrace(event.target.files?.[0])} /></label> : <><Button size="icon-sm" variant="ghost" aria-label="حذف النموذج" onClick={() => { traceImage.current = null; setTraceUrl(null); queueRender(); }}><X /></Button><Minus /><Slider aria-label="شفافية النموذج" min={0} max={100} value={[traceOpacity]} onValueChange={(value) => setTraceOpacity(value[0])} /><Plus /><span>{traceOpacity}%</span></>}
          </div>
          {state.debug && <output className="debug-panel"><b>بيانات القلم</b><span>Pressure <strong>{debugData.pressure.toFixed(2)}</strong></span><span>Tilt X <strong>{debugData.tiltX}°</strong></span><span>Tilt Y <strong>{debugData.tiltY}°</strong></span><span>Velocity <strong>{debugData.velocity.toFixed(2)}</strong></span><span>Pointer <strong>{debugData.pointerType}</strong></span><span>Nib <strong>{state.brush.nibAngle}°</strong></span></output>}
        </div>
      </section>
    </main>
  );
}
