'use client';

import { useState } from 'react';
import { ArrowLeft, Flame, PenTool, Sparkles } from 'lucide-react';
import { CalligraphyCanvas } from '@/components/CalligraphyCanvas';
import { TraceRace } from '@/components/TraceRace';

type ExperienceMode = 'choose' | 'canvas' | 'race';

export function ModeHub() {
  const [mode, setMode] = useState<ExperienceMode>('choose');

  if (mode === 'canvas') {
    return (
      <div className="mode-experience">
        <button className="mode-back" type="button" onClick={() => setMode('choose')}>
          <ArrowLeft aria-hidden="true" />
          تغيير الطور
        </button>
        <CalligraphyCanvas />
      </div>
    );
  }

  if (mode === 'race') {
    return <TraceRace onExit={() => setMode('choose')} />;
  }

  return (
    <main className="mode-gateway" dir="rtl">
      <div className="mode-gateway-glow" aria-hidden="true" />
      <header className="mode-gateway-header">
        <div className="mode-brand-mark">ق</div>
        <div>
          <span>قلم</span>
          <small>مساحة الخط العربي</small>
        </div>
      </header>

      <section className="mode-gateway-copy">
        <span className="mode-eyebrow"><Sparkles aria-hidden="true" /> اختر تجربتك</span>
        <h1>بأي طريقة تبي تكتب اليوم؟</h1>
        <p>تدرّب بهدوء على لوحتك، أو ادخل تحديًا سريعًا واختبر دقتك تحت الضغط.</p>
      </section>

      <section className="mode-cards" aria-label="أطوار قلم">
        <button className="mode-card mode-card-canvas" type="button" onClick={() => setMode('canvas')}>
          <span className="mode-card-number">01</span>
          <span className="mode-card-icon"><PenTool aria-hidden="true" /></span>
          <span className="mode-card-copy">
            <strong>اللوحة الحرة</strong>
            <small>اكتب وتدرّب على مهلك بكل أدوات قلم المعتادة.</small>
          </span>
          <span className="mode-card-action">دخول اللوحة <ArrowLeft aria-hidden="true" /></span>
        </button>

        <button className="mode-card mode-card-race" type="button" onClick={() => setMode('race')}>
          <span className="mode-card-badge"><Flame aria-hidden="true" /> جديد</span>
          <span className="mode-card-number">02</span>
          <span className="mode-card-icon"><Flame aria-hidden="true" /></span>
          <span className="mode-card-copy">
            <strong>سباق القلم</strong>
            <small>لاحق العبارة قبل ما تلحقك النار، واجمع أعلى تقييم.</small>
          </span>
          <span className="mode-card-action">ابدأ التحدي <ArrowLeft aria-hidden="true" /></span>
        </button>
      </section>

      <footer className="mode-gateway-footer">
        <span>اضغط على الطور للدخول مباشرة</span>
        <span aria-hidden="true">✦</span>
        <span>يدعم القلم واللمس والفأرة</span>
      </footer>
    </main>
  );
}
