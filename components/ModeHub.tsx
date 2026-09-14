'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpenText, Flame, Gamepad2, LockKeyhole, Map, NotebookPen, PenTool, Sparkles, Star, Target, TimerReset } from 'lucide-react';
import { CalligraphyCanvas } from '@/components/CalligraphyCanvas';
import { TraceRace } from '@/components/TraceRace';
import { getJourney, getLesson } from '@/lib/trainingJourney';
import { canvasStore, useCanvasStore } from '@/store/canvasStore';
import type { CanvasMode } from '@/types/brush';

type ExperienceMode = 'home' | 'canvas' | 'challenges' | 'race';

export function ModeHub() {
  const [mode, setMode] = useState<ExperienceMode>('home');
  const state = useCanvasStore();
  const activeLesson = getLesson(state.activeLessonId);
  const journey = getJourney(activeLesson.journey);
  const journeyLessons = journey.chapters.flatMap((chapter) => chapter.lessons);
  const completedCount = journeyLessons.filter((lesson) => state.completedLessons[lesson.id]).length;
  const progress = Math.round((completedCount / journeyLessons.length) * 100);
  const level = Math.min(20, Math.floor(state.trainingXp / 500) + 1);

  useEffect(() => {
    canvasStore.hydrate();
  }, []);

  const openCanvas = (canvasMode: CanvasMode) => {
    if (canvasMode === 'training') {
      canvasStore.set({ mode: canvasMode, trainingText: activeLesson.text, practice: activeLesson.style, strokes: [], redoStack: [] });
    } else {
      canvasStore.set({ mode: canvasMode });
    }
    setMode('canvas');
  };

  if (mode === 'canvas') {
    return (
      <div className="mode-experience">
        <button className="mode-back" type="button" onClick={() => setMode('home')}>
          <ArrowLeft aria-hidden="true" /><span>الرئيسية</span>
        </button>
        <CalligraphyCanvas />
      </div>
    );
  }

  if (mode === 'race') return <TraceRace onExit={() => setMode('challenges')} />;

  if (mode === 'challenges') {
    return (
      <main className="game-menu-shell" dir="rtl">
        <MenuHeader xp={state.trainingXp} level={level} onHome={() => setMode('home')} />
        <section className="challenge-menu">
          <div className="menu-section-heading">
            <div><span>ميدان قلم</span><h1>التحديات</h1></div>
            <button type="button" onClick={() => setMode('home')}><ArrowRight aria-hidden="true" /> الرئيسية</button>
          </div>

          <div className="challenge-grid">
            <button className="challenge-tile challenge-tile-live" type="button" onClick={() => setMode('race')}>
              <span className="tile-corner-label"><Flame aria-hidden="true" /> متاح الآن</span>
              <span className="challenge-visual"><TimerReset aria-hidden="true" /><i><Flame aria-hidden="true" /></i></span>
              <span className="challenge-copy"><small>دقة × سرعة</small><strong>سباق الكتابة</strong><p>اكتب فوق العبارة قبل أن تلحق بك النار.</p></span>
              <span className="tile-enter">العب الآن <ArrowLeft aria-hidden="true" /></span>
            </button>
            <ComingSoon icon={<Target />} title="صيد النقاط" copy="أصب مواضع الحروف بأعلى دقة." />
            <ComingSoon icon={<Star />} title="الحرف المثالي" copy="أتقن حرفًا واحدًا دون أخطاء." />
            <ComingSoon icon={<Gamepad2 />} title="لا ترفع القلم" copy="أكمل المسار بحركة واحدة." />
            <ComingSoon icon={<BookOpenText />} title="ذاكرة الخطاط" copy="شاهد العبارة ثم اكتبها من الذاكرة." />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="game-menu-shell" dir="rtl">
      <MenuHeader xp={state.trainingXp} level={level} />
      <section className="home-menu">
        <nav className="game-tabs" aria-label="أقسام قلم">
          <button className="active" type="button">الرئيسية</button>
          <button type="button" onClick={() => openCanvas('training')}>التدريب</button>
          <button type="button" onClick={() => setMode('challenges')}>التحديات</button>
        </nav>

        <div className="home-menu-heading">
          <div><span>أهلًا بعودتك</span><h1>اختر وجهتك</h1></div>
          <p>أكمل رحلتك، افتح اللوحة، أو ادخل ميدان التحديات.</p>
        </div>

        <section className="game-tile-grid" aria-label="قائمة أطوار قلم">
          <button className="game-tile journey-tile" type="button" onClick={() => openCanvas('training')}>
            <span className="tile-corner-label"><Map aria-hidden="true" /> رحلتك الحالية</span>
            <div className="journey-emblem"><span>ق</span><i>{level}</i></div>
            <div className="journey-copy"><small>{journey.title}</small><strong>{activeLesson.title}</strong><p>{activeLesson.objective}</p></div>
            <div className="journey-progress"><span><b>{progress}%</b> من الرحلة</span><i><b style={{ width: `${progress}%` }} /></i><small>{completedCount} من {journeyLessons.length} درسًا</small></div>
            <span className="tile-enter">واصل التدريب <ArrowLeft aria-hidden="true" /></span>
          </button>

          <button className="game-tile quick-tile free-tile" type="button" onClick={() => openCanvas('free')}>
            <span className="quick-tile-icon"><PenTool aria-hidden="true" /></span>
            <span><small>مساحة مفتوحة</small><strong>السبورة الحرة</strong><p>اكتب وارسم بلا قيود.</p></span>
            <ArrowLeft className="quick-arrow" aria-hidden="true" />
          </button>

          <button className="game-tile quick-tile custom-tile" type="button" onClick={() => openCanvas('custom-training')}>
            <span className="quick-tile-icon"><NotebookPen aria-hidden="true" /></span>
            <span><small>اختر عبارتك</small><strong>التدريب الحر</strong><p>أنشئ نموذجك وتدرّب عليه.</p></span>
            <ArrowLeft className="quick-arrow" aria-hidden="true" />
          </button>

          <button className="game-tile challenges-banner" type="button" onClick={() => setMode('challenges')}>
            <span className="challenges-mark"><Flame aria-hidden="true" /></span>
            <span className="challenges-copy"><small>ميدان قلم</small><strong>التحديات والألعاب</strong><p>اختبر سرعتك ودقتك واجمع أعلى تقييم.</p></span>
            <span className="challenges-count"><b>1</b><small>لعبة متاحة</small></span>
            <span className="tile-enter">استعرض التحديات <ArrowLeft aria-hidden="true" /></span>
          </button>
        </section>
      </section>
      <footer className="game-menu-footer"><span><i /> جاهز للكتابة</span><span>استخدم القلم أو اللمس أو الفأرة</span></footer>
    </main>
  );
}

function MenuHeader({ xp, level, onHome }: { xp: number; level: number; onHome?: () => void }) {
  return (
    <header className="game-menu-header">
      <button className="menu-brand" type="button" onClick={onHome} disabled={!onHome}>
        <span>ق</span><div><strong>قلم</strong><small>مساحة الخط العربي</small></div>
      </button>
      <div className="player-strip"><span className="player-level">المستوى <b>{level}</b></span><span className="player-xp"><Sparkles aria-hidden="true" /><b>{xp}</b> XP</span></div>
    </header>
  );
}

function ComingSoon({ icon, title, copy }: { icon: React.ReactNode; title: string; copy: string }) {
  return (
    <article className="challenge-tile challenge-tile-locked">
      <span className="locked-icon">{icon}</span>
      <span className="challenge-copy"><small>قادم لاحقًا</small><strong>{title}</strong><p>{copy}</p></span>
      <span className="coming-label"><LockKeyhole aria-hidden="true" /> قادم لاحقًا</span>
    </article>
  );
}
