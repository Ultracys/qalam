'use client';

import { useState } from 'react';
import { BookOpen, Castle, Check, ChevronLeft, Flag, GraduationCap, LockKeyhole, Map, Mountain, Palmtree, PenLine, Sparkles, Star, Store, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { canvasStore, useCanvasStore } from '@/store/canvasStore';
import { getLesson, getNextLesson, trainingChapters, trainingLessons } from '@/lib/trainingJourney';

export function ModeSelector() {
  const { mode } = useCanvasStore();
  return <div className="mode-selector" aria-label="طور اللوحة">
    <Button type="button" variant={mode === 'free' ? 'default' : 'ghost'} onClick={() => canvasStore.set({ mode: 'free' })}><PenLine />الحر</Button>
    <Button type="button" variant={mode === 'training' ? 'default' : 'ghost'} onClick={() => canvasStore.set({ mode: 'training' })}><GraduationCap />الرحلة</Button>
  </div>;
}

function Stars({ count }: { count: number }) {
  return <span className="lesson-stars" aria-label={`${count} من 3 نجوم`}>
    {[1, 2, 3].map((star) => <Star key={star} className={star <= count ? 'earned' : ''} />)}
  </span>;
}

export function TrainingSettings() {
  const state = useCanvasStore();
  const [showMap, setShowMap] = useState(false);
  const [result, setResult] = useState<{ stars: number; message: string } | null>(null);
  const active = getLesson(state.activeLessonId);
  const activeIndex = trainingLessons.findIndex((item) => item.id === active.id);
  const completedCount = Object.keys(state.completedLessons).length;
  const progress = Math.round((completedCount / trainingLessons.length) * 100);

  const selectLesson = (lessonId: string) => {
    const lessonIndex = trainingLessons.findIndex((item) => item.id === lessonId);
    const unlocked = lessonIndex === 0 || Boolean(state.completedLessons[trainingLessons[lessonIndex - 1].id]);
    if (!unlocked) return;
    const lesson = getLesson(lessonId);
    canvasStore.set({ activeLessonId: lesson.id, trainingText: lesson.text, practice: lesson.style, templateOpacity: lesson.chapter === 4 ? 11 : 18, strokes: [], redoStack: [] });
    setResult(null);
    setShowMap(false);
  };

  const finishLesson = () => {
    const strokeCount = state.strokes.length;
    const pointCount = state.strokes.reduce((total, stroke) => total + stroke.points.length, 0);
    if (!strokeCount) return;
    const completionRatio = Math.min(1, strokeCount / active.minStrokes);
    const detailRatio = Math.min(1, pointCount / Math.max(24, active.minStrokes * 8));
    const stars = completionRatio >= 1 && detailRatio >= 0.75 ? 3 : completionRatio >= 0.55 ? 2 : 1;
    canvasStore.completeLesson(active.id, stars, active.xp);
    setResult({ stars, message: stars === 3 ? 'إتقان جميل! يدك أصبحت أكثر ثباتًا.' : stars === 2 ? 'أحسنت. أعدها لاحقًا لتحصل على النجمة الثالثة.' : 'بداية موفقة. جرّب ضربات أكثر قبل الانتقال.' });
  };

  const nextLesson = getNextLesson(active.id);
  const isCompleted = Boolean(state.completedLessons[active.id]);

  return <section className="training-journey" aria-label="رحلة التدريب">
    <header className="journey-header">
      <div><span className="eyebrow"><Map /> رحلة الخطاط</span><strong>المستوى {Math.min(10, Math.floor(state.trainingXp / 250) + 1)}</strong></div>
      <span className="xp-badge"><Sparkles /> {state.trainingXp} XP</span>
    </header>
    <div className="journey-progress" aria-label={`أنجزت ${progress}%`}><span style={{ width: `${progress}%` }} /></div>
    <small className="journey-progress-label">{completedCount} من {trainingLessons.length} مرحلة</small>

    <article className="current-mission">
      <div className="mission-number">{activeIndex + 1}</div>
      <div className="mission-copy"><small>الفصل {active.chapter} · المهمة الحالية</small><h3>{active.title}</h3></div>
      <Stars count={state.completedLessons[active.id] ?? 0} />
      <p className="mission-story"><BookOpen /> {active.story}</p>
      <div className="mission-objective"><span>الهدف</span>{active.objective}</div>
      <div className="mission-text">{active.text}</div>
    </article>

    <div className="template-control">
      <span><span>وضوح النموذج</span><b>{state.templateOpacity}%</b></span>
      <Slider aria-label="وضوح نموذج التدريب" min={5} max={38} value={state.templateOpacity} onValueChange={(value) => canvasStore.set({ templateOpacity: typeof value === 'number' ? value : value[0] })} />
    </div>

    {result ? <output className="lesson-result">
      <Trophy /><div><Stars count={result.stars} /><p>{result.message}</p></div>
      {nextLesson && <Button size="sm" onClick={() => selectLesson(nextLesson.id)}>التالي <ChevronLeft /></Button>}
    </output> : <Button className="finish-lesson" disabled={!state.strokes.length} onClick={finishLesson}><Check /> {isCompleted ? 'قيّم المحاولة مجددًا' : 'أنهيت المهمة'}</Button>}

    <Button type="button" variant="outline" className="map-toggle" onClick={() => setShowMap(true)}><Map /> افتح خريطة المغامرة</Button>

    <Dialog open={showMap} onOpenChange={setShowMap}>
      <DialogContent className="adventure-map-dialog">
        <DialogHeader className="adventure-map-header">
          <div><span className="map-kicker"><Map /> خريطة كنز الخطاط</span><DialogTitle>رحلتك من أول نقطة إلى الإجازة</DialogTitle></div>
          <DialogDescription>اتبع المسار، أنجز التحديات، وافتح بيئة جديدة في كل فصل.</DialogDescription>
          <div className="map-total-progress"><span><Trophy /> {completedCount}/{trainingLessons.length}</span><div><i style={{ width: `${progress}%` }} /></div><b>{progress}%</b></div>
        </DialogHeader>
        <div className="adventure-scroll">
          <div className="treasure-route" aria-label="مسار رحلة الخطاط">
            {trainingChapters.map((chapter) => {
              const ChapterIcon = [Palmtree, Store, Castle, Mountain][chapter.id - 1];
              const environmentNames = ['واحة البدايات', 'سوق الكلمات', 'قصر الحروف', 'قمة الإجازة'];
              return <section key={chapter.id} className={`adventure-region region-${chapter.id}`}>
                <div className="region-scenery" aria-hidden="true"><ChapterIcon /><span>{environmentNames[chapter.id - 1]}</span></div>
                <header className="region-heading">
                  <span>الفصل {chapter.id}</span><h3>{chapter.title}</h3><p>{chapter.subtitle}</p>
                </header>
                <div className="region-story"><BookOpen />{chapter.story}</div>
                <div className="adventure-path">
                  {chapter.lessons.map((lesson, lessonPosition) => {
                    const index = trainingLessons.findIndex((item) => item.id === lesson.id);
                    const unlocked = index === 0 || Boolean(state.completedLessons[trainingLessons[index - 1].id]);
                    const stars = state.completedLessons[lesson.id] ?? 0;
                    return <div key={lesson.id} className={`path-stop stop-${lessonPosition + 1}`}>
                      <button type="button" className={`map-node ${lesson.id === active.id ? 'active' : ''} ${stars ? 'complete' : ''}`} disabled={!unlocked} onClick={() => selectLesson(lesson.id)} aria-label={`${lesson.title}${unlocked ? '' : '، مقفلة'}`}>
                        {unlocked ? stars ? <Check /> : lesson.order : <LockKeyhole />}
                        {lesson.id === active.id && <span className="current-flag"><Flag /></span>}
                      </button>
                      <div className="stop-label"><b>{lesson.title}</b><small>{lesson.text}</small>{stars > 0 && <Stars count={stars} />}</div>
                    </div>;
                  })}
                </div>
              </section>;
            })}
            <div className="treasure-finish"><Trophy /><div><strong>إجازة الخطاط</strong><span>الكنز الأخير</span></div></div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </section>;
}
