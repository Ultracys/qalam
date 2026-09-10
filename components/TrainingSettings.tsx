'use client';

import { GraduationCap, PenLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { canvasStore, useCanvasStore } from '@/store/canvasStore';

export function ModeSelector() {
  const { mode } = useCanvasStore();
  return (
    <div className="mode-selector" aria-label="طور اللوحة">
      <Button type="button" variant={mode === 'free' ? 'default' : 'ghost'} onClick={() => canvasStore.set({ mode: 'free' })}><PenLine />الحر</Button>
      <Button type="button" variant={mode === 'training' ? 'default' : 'ghost'} onClick={() => canvasStore.set({ mode: 'training' })}><GraduationCap />التدريب</Button>
    </div>
  );
}

export function TrainingSettings() {
  const { trainingText, templateOpacity, templateSize } = useCanvasStore();
  const sliderValue = (value: number | readonly number[]) => typeof value === 'number' ? value : value[0];
  return (
    <section className="training-settings" aria-label="إعدادات التدريب">
      <div className="training-heading"><span>نموذج التدريب</span><small>اكتب حتى 40 حرفًا</small></div>
      <Textarea
        aria-label="النص المراد التدرب عليه"
        dir="rtl"
        maxLength={40}
        rows={2}
        placeholder="مثال: العلم نور"
        value={trainingText}
        onChange={(event) => canvasStore.set({ trainingText: event.target.value })}
      />
      <div className="control-stack">
        <span className="control-label"><span>حجم النموذج</span><b>{templateSize} بكسل</b></span>
        <Slider aria-label="حجم نموذج التدريب" min={48} max={180} value={templateSize} onValueChange={(value) => canvasStore.set({ templateSize: sliderValue(value) })} />
      </div>
      <div className="control-stack">
        <span className="control-label"><span>وضوح النموذج</span><b>{templateOpacity}%</b></span>
        <Slider aria-label="وضوح نموذج التدريب" min={5} max={45} value={templateOpacity} onValueChange={(value) => canvasStore.set({ templateOpacity: sliderValue(value) })} />
      </div>
    </section>
  );
}
