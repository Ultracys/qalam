'use client';

import { useState } from 'react';
import { ArrowRight, BookOpen, Castle, Check, ChevronLeft, Flag, LockKeyhole, Map, Mountain, Palmtree, Sparkles, Star, Store, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { canvasStore, useCanvasStore } from '@/store/canvasStore';
import { calligraphyJourneys, getJourney, getLesson, getNextLesson } from '@/lib/trainingJourney';

function Stars({ count }: { count: number }) {
  return <span className="lesson-stars" aria-label={`${count} من 3 نجوم`}>
    {[1, 2, 3].map((star) => <Star key={star} className={star <= count ? 'earned' : ''} />)}
  </span>;
}

export function TrainingSettings() {
  const state = useCanvasStore();
  const [showMap, setShowMap] = useState(true);
  const [briefLessonId, setBriefLessonId] = useState<string | null>(null);
  const [result, setResult] = useState<{ stars: number; message: string } | null>(null);
  const journey = getJourney(state.trainingJourney);
  const journeyLessons = journey.chapters.flatMap((chapter) => chapter.lessons);
  const activeCandidate = getLesson(state.activeLessonId);
  const active = activeCandidate.journey === journey.id ? activeCandidate : journeyLessons[0];
  const activeIndex = journeyLessons.findIndex((item) => item.id === active.id);
  const completedCount = journeyLessons.filter((lesson) => state.completedLessons[lesson.id]).length;
  const progress = Math.round((completedCount / journeyLessons.length) * 100);

  const selectLesson = (lessonId: string) => {
    const lessonIndex = journeyLessons.findIndex((item) => item.id === lessonId);
    const unlocked = lessonIndex === 0 || Boolean(state.completedLessons[journeyLessons[lessonIndex - 1].id]);
    if (!unlocked) return;
    setBriefLessonId(lessonId);
  };

  const startLesson = (lessonId: string) => {
    const lesson = getLesson(lessonId);
    canvasStore.set({ activeLessonId: lesson.id, trainingText: lesson.text, practice: lesson.style, templateOpacity: lesson.chapter === 4 ? 11 : 18, strokes: [], redoStack: [] });
    setResult(null);
    setBriefLessonId(null);
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
      <div><span className="eyebrow"><Map /> {journey.title}</span><strong>المستوى {Math.min(20, Math.floor(state.trainingXp / 500) + 1)}</strong></div>
      <span className="xp-badge"><Sparkles /> {state.trainingXp} XP</span>
    </header>
    <div className="journey-progress" aria-label={`أنجزت ${progress}%`}><span style={{ width: `${progress}%` }} /></div>
    <small className="journey-progress-label">{completedCount} من {journeyLessons.length} مرحلة في خط {journey.name}</small>

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
      {nextLesson && <Button size="sm" onClick={() => { setBriefLessonId(nextLesson.id); setShowMap(true); }}>التالي <ChevronLeft /></Button>}
    </output> : <Button className="finish-lesson" disabled={!state.strokes.length} onClick={finishLesson}><Check /> {isCompleted ? 'قيّم المحاولة مجددًا' : 'أنهيت المهمة'}</Button>}

    <Button type="button" variant="outline" className="map-toggle" onClick={() => setShowMap(true)}><Map /> افتح خريطة المغامرة</Button>

    <Dialog open={showMap} onOpenChange={setShowMap}>
      <DialogContent className={`adventure-map-dialog ${briefLessonId ? 'showing-brief' : ''}`}>
        {briefLessonId ? (() => {
          const brief = getLesson(briefLessonId);
          return <div className="lesson-briefing">
            <button type="button" className="brief-back" onClick={() => setBriefLessonId(null)}><ArrowRight /> العودة للخريطة</button>
            <span className="brief-chapter">الفصل {brief.chapter} · المرحلة {brief.order}</span>
            <div className="brief-icon"><Flag /></div>
            <h2>{brief.title}</h2>
            <p className="brief-story">{brief.story}</p>
            <div className="brief-objective"><span>هدف المرحلة</span><strong>{brief.objective}</strong></div>
            <div className="brief-example"><span>ستتدرب على</span><b>{brief.text}</b></div>
            <div className="brief-meta"><span>{brief.xp} XP</span><span>{brief.minStrokes} ضربات مستهدفة</span></div>
            <Button size="lg" className="start-adventure-button" onClick={() => startLesson(brief.id)}>ابدأ المرحلة <ChevronLeft /></Button>
          </div>;
        })() : <>
        <DialogHeader className="adventure-map-header">
          <div><span className="map-kicker"><Map /> أكاديمية قلم</span><DialogTitle>{journey.title}</DialogTitle></div>
          <DialogDescription>{journey.description}</DialogDescription>
          <div className="map-total-progress"><span><Trophy /> {completedCount}/{journeyLessons.length}</span><div><i style={{ width: `${progress}%` }} /></div><b>{progress}%</b></div>
        </DialogHeader>
        <nav className="journey-selector" aria-label="اختر رحلة الخط">
          {calligraphyJourneys.map((option) => {
            const optionLessons = option.chapters.flatMap((chapter) => chapter.lessons);
            const done = optionLessons.filter((lesson) => state.completedLessons[lesson.id]).length;
            return <button key={option.id} type="button" className={option.id === journey.id ? 'active' : ''} onClick={() => {
              canvasStore.set({ trainingJourney: option.id, activeLessonId: optionLessons[0].id });
              setBriefLessonId(null);
            }}><span>خط {option.name}</span><small>{done}/{optionLessons.length} · {option.difficulty}</small></button>;
          })}
        </nav>
        <div className="adventure-scroll">
          <div className="treasure-route" aria-label="مسار رحلة الخطاط">
            {journey.chapters.map((chapter) => {
              const ChapterIcon = [Palmtree, Store, Castle, Mountain][chapter.id - 1];
              const environmentNames = ['واحة البدايات', 'سوق الكلمات', 'قصر الحروف', 'قمة الإجازة'];
              return <section key={chapter.id} className={`adventure-region region-${chapter.id}`}>
                <div className="region-scenery" aria-hidden="true"><ChapterIcon /><span>{environmentNames[chapter.id - 1]}</span></div>
                <header className="region-heading">
                  <span>الفصل {chapter.id}</span><h3>{chapter.title}</h3><p>{chapter.subtitle}</p>
                </header>
                <div className="region-story"><BookOpen />{chapter.story}</div>
                <div className="adventure-path curriculum-path">
                  {chapter.lessons.map((lesson, lessonPosition) => {
                    const index = journeyLessons.findIndex((item) => item.id === lesson.id);
                    const unlocked = index === 0 || Boolean(state.completedLessons[journeyLessons[index - 1].id]);
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
        </>}
      </DialogContent>
    </Dialog>
  </section>;
}

export function CustomTrainingSettings() {
  const { trainingText, trainingRepeat, templateOpacity, templateSize } = useCanvasStore();
  const sliderValue = (value: number | readonly number[]) => typeof value === 'number' ? value : value[0];
  return <section className="custom-training-settings" aria-label="إعدادات التدريب الحر">
    <div className="custom-training-heading"><div><span>تدريبك الحر</span><small>اكتب أي حرف أو كلمة أو جملة</small></div><Sparkles /></div>
    <Textarea aria-label="النص المراد التدرب عليه" dir="rtl" maxLength={80} rows={3} placeholder="مثال: من جدّ وجد" value={trainingText} onChange={(event) => canvasStore.set({ trainingText: event.target.value })} />
    <div className="repeat-picker" aria-label="عدد مرات التكرار">
      <span>التكرار في كل سطر</span>
      <div>{[1, 2, 3, 4, 5].map((count) => <button key={count} type="button" className={trainingRepeat === count ? 'active' : ''} onClick={() => canvasStore.set({ trainingRepeat: count })}>{count}</button>)}</div>
    </div>
    <div className="template-control"><span><span>حجم النموذج</span><b>{templateSize}px</b></span><Slider aria-label="حجم نموذج التدريب" min={48} max={180} value={templateSize} onValueChange={(value) => canvasStore.set({ templateSize: sliderValue(value) })} /></div>
    <div className="template-control"><span><span>وضوح النموذج</span><b>{templateOpacity}%</b></span><Slider aria-label="وضوح نموذج التدريب" min={5} max={45} value={templateOpacity} onValueChange={(value) => canvasStore.set({ templateOpacity: sliderValue(value) })} /></div>
  </section>;
}
