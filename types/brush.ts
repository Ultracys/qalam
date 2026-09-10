export type StabilizerLevel = 'off' | 'low' | 'medium' | 'high';
export type PracticeStyle = 'none' | 'ruqah' | 'diwani' | 'thuluth' | 'naskh';

export type BrushSettings = {
  color: string;
  nibWidth: number;
  nibAngle: number;
  pressureEnabled: boolean;
  pressureSensitivity: number;
  smoothing: number;
  stabilizer: StabilizerLevel;
};

export type BrushPreset = BrushSettings & {
  id: Exclude<PracticeStyle, 'none'>;
  name: string;
};
