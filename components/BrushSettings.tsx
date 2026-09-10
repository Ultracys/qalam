'use client';

import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { canvasStore, useCanvasStore } from '@/store/canvasStore';
import { PresetSelector } from '@/components/PresetSelector';
import type { StabilizerLevel } from '@/types/brush';

function RangeControl({ label, value, min, max, unit, onChange }: { label: string; value: number; min: number; max: number; unit: string; onChange: (value: number) => void }) {
  return (
    <label className="control-stack">
      <span className="control-label"><span>{label}</span><b>{Math.round(value)}{unit}</b></span>
      <Slider min={min} max={max} value={[value]} onValueChange={(next) => onChange(next[0])} />
    </label>
  );
}

export function BrushSettings() {
  const { brush, guides, grid, debug } = useCanvasStore();
  return (
    <aside className="settings-panel" aria-label="إعدادات القلم">
      <div className="panel-heading"><div><span className="eyebrow">قلم القصب</span><h2>خصائص السن</h2></div><span className="nib-preview" style={{ width: brush.nibWidth * 1.5, rotate: `${brush.nibAngle}deg`, background: brush.color }} /></div>
      <PresetSelector />
      <RangeControl label="عرض السن" value={brush.nibWidth} min={4} max={34} unit=" بكسل" onChange={(nibWidth) => canvasStore.setBrush({ nibWidth })} />
      <RangeControl label="زاوية السن" value={brush.nibAngle} min={0} max={90} unit="°" onChange={(nibAngle) => canvasStore.setBrush({ nibAngle })} />
      <RangeControl label="تنعيم المسار" value={brush.smoothing} min={0} max={90} unit="%" onChange={(smoothing) => canvasStore.setBrush({ smoothing })} />
      <RangeControl label="حساسية الضغط" value={brush.pressureSensitivity} min={0} max={100} unit="%" onChange={(pressureSensitivity) => canvasStore.setBrush({ pressureSensitivity })} />
      <label className="control-stack"><span>مثبّت الضربة</span><Select value={brush.stabilizer} onValueChange={(stabilizer) => canvasStore.setBrush({ stabilizer: stabilizer as StabilizerLevel })}><SelectTrigger className="w-full"><SelectValue /></SelectTrigger><SelectContent align="start"><SelectItem value="off">متوقف</SelectItem><SelectItem value="low">خفيف</SelectItem><SelectItem value="medium">متوسط</SelectItem><SelectItem value="high">عالٍ</SelectItem></SelectContent></Select></label>
      <div className="color-row"><span>لون الحبر</span><input aria-label="لون الحبر" type="color" value={brush.color} onChange={(event) => canvasStore.setBrush({ color: event.target.value })} /></div>
      <div className="switch-row"><label htmlFor="pressure">الاستجابة للضغط</label><Switch id="pressure" checked={brush.pressureEnabled} onCheckedChange={(pressureEnabled) => canvasStore.setBrush({ pressureEnabled })} /></div>
      <div className="switch-row"><label htmlFor="guides">أدلة الخط</label><Switch id="guides" checked={guides} onCheckedChange={(value) => canvasStore.set({ guides: value })} /></div>
      <div className="switch-row"><label htmlFor="grid">شبكة النقاط</label><Switch id="grid" checked={grid} onCheckedChange={(value) => canvasStore.set({ grid: value })} /></div>
      <div className="switch-row"><label htmlFor="debug">بيانات القلم</label><Switch id="debug" checked={debug} onCheckedChange={(value) => canvasStore.set({ debug: value })} /></div>
    </aside>
  );
}
