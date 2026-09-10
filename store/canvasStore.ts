'use client';

import { useSyncExternalStore } from 'react';
import type { BrushSettings, PracticeStyle } from '@/types/brush';
import type { Stroke, Tool } from '@/types/stroke';

export type CanvasState = {
  strokes: Stroke[];
  redoStack: Stroke[];
  tool: Tool;
  brush: BrushSettings;
  practice: PracticeStyle;
  guides: boolean;
  darkMode: boolean;
  debug: boolean;
  grid: boolean;
};

const defaults: CanvasState = {
  strokes: [], redoStack: [], tool: 'qalam', practice: 'ruqah', guides: true,
  darkMode: false, debug: false, grid: false,
  brush: { color: '#17140f', nibWidth: 14, nibAngle: 45, pressureEnabled: true, pressureSensitivity: 70, smoothing: 52, stabilizer: 'medium' },
};

let state = defaults;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());
const persist = () => {
  try { localStorage.setItem('qalam-canvas-settings', JSON.stringify({ ...state, strokes: [], redoStack: [] })); } catch { /* storage may be unavailable */ }
};

export const canvasStore = {
  getState: () => state,
  subscribe: (listener: () => void) => { listeners.add(listener); return () => listeners.delete(listener); },
  set(patch: Partial<CanvasState>) { state = { ...state, ...patch }; persist(); notify(); },
  setBrush(patch: Partial<BrushSettings>) { state = { ...state, brush: { ...state.brush, ...patch } }; persist(); notify(); },
  addStroke(stroke: Stroke) { state = { ...state, strokes: [...state.strokes, stroke], redoStack: [] }; notify(); },
  removeStroke(id: string) { const found = state.strokes.find((stroke) => stroke.id === id); if (!found) return; state = { ...state, strokes: state.strokes.filter((stroke) => stroke.id !== id), redoStack: [...state.redoStack, found] }; notify(); },
  undo() { const stroke = state.strokes.at(-1); if (!stroke) return; state = { ...state, strokes: state.strokes.slice(0, -1), redoStack: [...state.redoStack, stroke] }; notify(); },
  redo() { const stroke = state.redoStack.at(-1); if (!stroke) return; state = { ...state, strokes: [...state.strokes, stroke], redoStack: state.redoStack.slice(0, -1) }; notify(); },
  clear() { state = { ...state, redoStack: state.strokes, strokes: [] }; notify(); },
  hydrate() { try { const saved = localStorage.getItem('qalam-canvas-settings'); if (saved) state = { ...defaults, ...JSON.parse(saved), strokes: [], redoStack: [] }; } catch { /* ignore invalid saved settings */ } notify(); },
};

export function useCanvasStore() {
  return useSyncExternalStore(canvasStore.subscribe, canvasStore.getState, canvasStore.getState);
}
