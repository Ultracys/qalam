'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { canvasStore, useCanvasStore } from '@/store/canvasStore';
import type { BrushPreset } from '@/types/brush';

export const presets: BrushPreset[] = [
  { id: 'ruqah', name: 'الرقعة', nibAngle: 45, nibWidth: 14, smoothing: 48, color: '#17140f', pressureEnabled: true, pressureSensitivity: 70, stabilizer: 'medium' },
  { id: 'diwani', name: 'الديواني', nibAngle: 60, nibWidth: 12, smoothing: 72, color: '#17140f', pressureEnabled: true, pressureSensitivity: 66, stabilizer: 'high' },
  { id: 'thuluth', name: 'الثلث', nibAngle: 58, nibWidth: 18, smoothing: 68, color: '#17140f', pressureEnabled: true, pressureSensitivity: 62, stabilizer: 'high' },
  { id: 'naskh', name: 'النسخ', nibAngle: 50, nibWidth: 11, smoothing: 58, color: '#17140f', pressureEnabled: true, pressureSensitivity: 68, stabilizer: 'medium' },
  { id: 'kufi', name: 'الكوفي', nibAngle: 45, nibWidth: 16, smoothing: 38, color: '#17140f', pressureEnabled: true, pressureSensitivity: 55, stabilizer: 'medium' },
];

export function PresetSelector() {
  const state = useCanvasStore();
  return (
    <div className="control-stack">
      <span>نمط الخط</span>
      <Select value={state.practice === 'none' ? 'ruqah' : state.practice} onValueChange={(value) => {
        const preset = presets.find((item) => item.id === value);
        if (preset) {
          const { id, name, ...brush } = preset;
          void id; void name;
          canvasStore.set({ practice: preset.id });
          canvasStore.setBrush(brush);
        }
      }}>
        <SelectTrigger aria-label="نمط الخط" className="w-full"><SelectValue /></SelectTrigger>
        <SelectContent align="start">
          {presets.map((preset) => <SelectItem key={preset.id} value={preset.id}>{preset.name}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}
