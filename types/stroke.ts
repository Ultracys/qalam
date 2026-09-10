export type BrushPoint = {
  x: number;
  y: number;
  pressure: number;
  tiltX: number;
  tiltY: number;
  timestamp: number;
  velocity: number;
};

export type Tool = 'qalam' | 'eraser' | 'pan';

export type Stroke = {
  id: string;
  tool: 'qalam';
  points: BrushPoint[];
  color: string;
  nibWidth: number;
  nibAngle: number;
  pressureEnabled: boolean;
  pressureSensitivity: number;
  smoothing: number;
};
