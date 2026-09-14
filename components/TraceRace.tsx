'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, Clock3, Gauge, RotateCcw, ShieldCheck, Trophy } from 'lucide-react';

const WIDTH = 960;
const HEIGHT = 400;
const ROUND_SECONDS = 55;
const FIRE_GRACE_SECONDS = 4;

const CHALLENGES = [
  { text: 'العِلْمُ نُورٌ وَالجَهْلُ ظَلَامٌ', font: '--font-training-naskh', fontName: 'خط النسخ' },
  { text: 'مَنْ جَدَّ وَجَدَ وَمَنْ زَرَعَ حَصَدَ', font: '--font-training-ruqah', fontName: 'خط الرقعة' },
  { text: 'خَيْرُ الكَلَامِ مَا قَلَّ وَدَلَّ', font: '--font-training-diwani', fontName: 'الخط الديواني' },
  { text: 'الصَّبْرُ مِفْتَاحُ الفَرَجِ', font: '--font-training-kufi', fontName: 'الخط الكوفي' },
  { text: 'بِالعِلْمِ نَبْنِي المُسْتَقْبَلَ', font: '--font-training-naskh', fontName: 'خط النسخ' },
] as const;

type Point = { x: number; y: number };
type GameState = 'ready' | 'running' | 'finished';
type Challenge = (typeof CHALLENGES)[number];
type MaskScore = { accuracy: number; coverage: number; precision: number };
type RaceResult = MaskScore & { timeScore: number; total: number; elapsed: number; caught: boolean };

function scoreLabel(score: number) {
  if (score >= 92) return 'خطّاط استثنائي';
  if (score >= 82) return 'إتقان رائع';
  if (score >= 70) return 'أداء متقن';
  if (score >= 55) return 'بداية قوية';
  return 'محاولة واعدة';
}

export function TraceRace({ onExit }: { onExit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inkRef = useRef<HTMLCanvasElement | null>(null);
  const targetRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<Point | null>(null);
  const startedAtRef = useRef(0);
  const lastLiveScoreRef = useRef(0);
  const correctProgressRef = useRef(0);
  const challengeRef = useRef<Challenge>(CHALLENGES[0]);
  const [challenge, setChallenge] = useState<Challenge>(CHALLENGES[0]);
  const [gameState, setGameState] = useState<GameState>('ready');
  const [secondsLeft, setSecondsLeft] = useState(ROUND_SECONDS);
  const [correctProgress, setCorrectProgress] = useState(0);
  const [liveAccuracy, setLiveAccuracy] = useState(0);
  const [fireProgress, setFireProgress] = useState(0);
  const [result, setResult] = useState<RaceResult | null>(null);

  const renderTarget = useCallback((context: CanvasRenderingContext2D, mask = false) => {
    context.clearRect(0, 0, WIDTH, HEIGHT);
    if (!mask) {
      context.fillStyle = '#fffdf7';
      context.fillRect(0, 0, WIDTH, HEIGHT);
      context.strokeStyle = '#176b5a22';
      context.lineWidth = 1.5;
      [125, 205, 285].forEach((y, index) => {
        context.setLineDash(index === 1 ? [9, 10] : []);
        context.beginPath();
        context.moveTo(44, y);
        context.lineTo(WIDTH - 44, y);
        context.stroke();
      });
      context.setLineDash([]);
    }

    const selected = challengeRef.current;
    const family = getComputedStyle(document.body).getPropertyValue(selected.font).trim() || 'serif';
    let size = selected.font === '--font-training-kufi' ? 65 : 82;
    context.font = `${size}px ${family}`;
    while (context.measureText(selected.text).width > WIDTH - 120 && size > 42) {
      size -= 2;
      context.font = `${size}px ${family}`;
    }
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.direction = 'rtl';
    context.lineWidth = mask ? 22 : 1;
    context.strokeStyle = mask ? '#fff' : '#176b5a30';
    context.fillStyle = mask ? '#fff' : '#176b5a55';
    if (mask) context.strokeText(selected.text, WIDTH / 2, 207);
    context.fillText(selected.text, WIDTH / 2, 207);
  }, []);

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    const ink = inkRef.current;
    if (!canvas || !ink) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    renderTarget(context);
    context.drawImage(ink, 0, 0);
  }, [renderTarget]);

  const resetCanvases = useCallback(() => {
    if (!inkRef.current) {
      inkRef.current = document.createElement('canvas');
      inkRef.current.width = WIDTH;
      inkRef.current.height = HEIGHT;
    }
    if (!targetRef.current) {
      targetRef.current = document.createElement('canvas');
      targetRef.current.width = WIDTH;
      targetRef.current.height = HEIGHT;
    }
    inkRef.current.getContext('2d')?.clearRect(0, 0, WIDTH, HEIGHT);
    const targetContext = targetRef.current.getContext('2d');
    if (targetContext) renderTarget(targetContext, true);
    paint();
  }, [paint, renderTarget]);

  useEffect(() => {
    void document.fonts.ready.then(resetCanvases);
  }, [resetCanvases]);

  const analyzeMasks = useCallback((): MaskScore => {
    const inkContext = inkRef.current?.getContext('2d');
    const targetContext = targetRef.current?.getContext('2d');
    if (!inkContext || !targetContext) return { accuracy: 0, coverage: 0, precision: 0 };
    const ink = inkContext.getImageData(0, 0, WIDTH, HEIGHT).data;
    const target = targetContext.getImageData(0, 0, WIDTH, HEIGHT).data;
    let inkPixels = 0;
    let targetPixels = 0;
    let overlap = 0;
    for (let index = 3; index < ink.length; index += 16) {
      const hasInk = ink[index] > 28;
      const hasTarget = target[index] > 28;
      if (hasInk) inkPixels += 1;
      if (hasTarget) targetPixels += 1;
      if (hasInk && hasTarget) overlap += 1;
    }
    const precision = inkPixels ? overlap / inkPixels : 0;
    const coverage = targetPixels ? Math.min(1, overlap / (targetPixels * 0.38)) : 0;
    return {
      precision: Math.round(precision * 100),
      coverage: Math.round(coverage * 100),
      accuracy: Math.round((precision * 0.76 + coverage * 0.24) * 100),
    };
  }, []);

  const finishGame = useCallback((caught = false) => {
    if (!startedAtRef.current) return;
    const elapsed = Math.min(ROUND_SECONDS, (Date.now() - startedAtRef.current) / 1000);
    const score = analyzeMasks();
    const timeScore = Math.round(Math.max(0, Math.min(100, 118 - (elapsed / ROUND_SECONDS) * 68)));
    setResult({ ...score, timeScore, total: Math.round(score.accuracy * 0.72 + timeScore * 0.28), elapsed, caught });
    setGameState('finished');
    drawingRef.current = false;
    lastPointRef.current = null;
  }, [analyzeMasks]);

  useEffect(() => {
    if (gameState !== 'running') return;
    const timer = window.setInterval(() => {
      const elapsed = (Date.now() - startedAtRef.current) / 1000;
      const left = Math.max(0, ROUND_SECONDS - elapsed);
      const chaseElapsed = Math.max(0, elapsed - FIRE_GRACE_SECONDS);
      const nextFireProgress = Math.min(100, (chaseElapsed / (ROUND_SECONDS - FIRE_GRACE_SECONDS)) * 100);
      setSecondsLeft(Math.ceil(left));
      setFireProgress(nextFireProgress);
      if (left <= 0) finishGame(false);
      else if (chaseElapsed > 0 && nextFireProgress >= Math.max(22, correctProgressRef.current + 10)) finishGame(true);
    }, 100);
    return () => window.clearInterval(timer);
  }, [finishGame, gameState]);

  const startGame = () => {
    const currentIndex = CHALLENGES.indexOf(challengeRef.current);
    let nextIndex = Math.floor(Math.random() * CHALLENGES.length);
    if (nextIndex === currentIndex) nextIndex = (nextIndex + 1) % CHALLENGES.length;
    const nextChallenge = CHALLENGES[nextIndex];
    challengeRef.current = nextChallenge;
    setChallenge(nextChallenge);
    resetCanvases();
    setResult(null);
    setCorrectProgress(0);
    correctProgressRef.current = 0;
    setLiveAccuracy(0);
    setFireProgress(0);
    setSecondsLeft(ROUND_SECONDS);
    startedAtRef.current = Date.now();
    setGameState('running');
  };

  const pointFromEvent = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: ((event.clientX - rect.left) / rect.width) * WIDTH, y: ((event.clientY - rect.top) / rect.height) * HEIGHT };
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (gameState !== 'running') return;
    event.preventDefault();
    try { event.currentTarget.setPointerCapture(event.pointerId); } catch { /* assisted input */ }
    drawingRef.current = true;
    lastPointRef.current = pointFromEvent(event);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current || gameState !== 'running') return;
    event.preventDefault();
    const next = pointFromEvent(event);
    const previous = lastPointRef.current;
    const context = inkRef.current?.getContext('2d');
    if (!previous || !context) return;
    context.strokeStyle = '#13251f';
    context.lineWidth = Math.max(5, 11 * (event.pressure || 0.55));
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.beginPath();
    context.moveTo(previous.x, previous.y);
    context.lineTo(next.x, next.y);
    context.stroke();
    lastPointRef.current = next;
    paint();

    const now = performance.now();
    if (now - lastLiveScoreRef.current > 120) {
      lastLiveScoreRef.current = now;
      const score = analyzeMasks();
      correctProgressRef.current = score.coverage;
      setCorrectProgress(score.coverage);
      setLiveAccuracy(score.accuracy);
    }
  };

  const endStroke = () => {
    drawingRef.current = false;
    lastPointRef.current = null;
    if (gameState === 'running') {
      const score = analyzeMasks();
      correctProgressRef.current = score.coverage;
      setCorrectProgress(score.coverage);
      setLiveAccuracy(score.accuracy);
    }
  };

  return (
    <main className="race-shell" dir="rtl">
      <header className="race-topbar">
        <button className="race-exit" type="button" onClick={onExit}><ArrowRight aria-hidden="true" /> التحديات</button>
        <div className="race-title"><span>سباق القلم</span><small>{gameState === 'running' ? challenge.fontName : 'جملة وخط عشوائيان كل مرة'}</small></div>
        <div className={`race-timer ${secondsLeft <= 10 ? 'danger' : ''}`}><Clock3 aria-hidden="true" /><strong>{secondsLeft.toString().padStart(2, '0')}</strong><span>ثانية</span></div>
      </header>

      <section className="race-board race-board-direct">
        <div className="race-live-stats">
          <span><b>{correctProgress}%</b> مكتوب بشكل صحيح</span>
          <i><b style={{ width: `${correctProgress}%` }} /></i>
          <span>دقة الحبر <b>{liveAccuracy}%</b></span>
        </div>
        <div className="race-instruction"><strong>اكتب فوق الجملة الشفافة</strong><span>الكتابة خارج المسار لا تزيد تقدمك.</span></div>
        <div className="race-canvas-wrap race-canvas-danger">
          <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} aria-label="منطقة تحدي الكتابة فوق الجملة" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={endStroke} onPointerCancel={endStroke} onContextMenu={(event) => event.preventDefault()} />

          {gameState === 'running' && (
            <div className="race-fire-wall" style={{ right: `${fireProgress}%` }} aria-hidden="true">
              <div className="fire-glow" />
              <div className="fire-core">{Array.from({ length: 14 }, (_, index) => <i key={index} />)}</div>
              <div className="fire-embers">{Array.from({ length: 12 }, (_, index) => <i key={index} />)}</div>
            </div>
          )}

          {gameState === 'ready' && (
            <div className="race-overlay">
              <span className="race-overlay-icon"><span className="mini-flame" /></span>
              <h1>جملة جديدة كل مرة</h1>
              <p>لديك {ROUND_SECONDS} ثانية. التقدم يتحرك فقط عندما يصيب حبرك مسار الكتابة الشفافة.</p>
              <button type="button" onClick={startGame}>ابدأ السباق</button>
            </div>
          )}

          {gameState === 'finished' && result && (
            <div className="race-overlay race-result">
              <span className="result-kicker"><Trophy aria-hidden="true" /> {result.caught ? 'أمسكت بك النار' : 'انتهى السباق'}</span>
              <div className="result-score"><strong>{result.total}</strong><span>/ 100</span></div>
              <h2>{result.caught ? 'اكتب على المسار أسرع في المحاولة القادمة' : scoreLabel(result.total)}</h2>
              <div className="result-metrics">
                <div><ShieldCheck aria-hidden="true" /><span>دقة المسار</span><strong>{result.accuracy}%</strong></div>
                <div><Gauge aria-hidden="true" /><span>تغطية الجملة</span><strong>{result.coverage}%</strong></div>
                <div><Clock3 aria-hidden="true" /><span>الوقت</span><strong>{result.elapsed.toFixed(1)}ث</strong></div>
              </div>
              <button type="button" onClick={startGame}><RotateCcw aria-hidden="true" /> جملة جديدة</button>
            </div>
          )}
        </div>

        <div className="race-status-row"><span><i className="status-dot" /> {gameState === 'running' ? `النار تلاحقك · ${challenge.fontName}` : gameState === 'finished' ? 'اكتمل التحدي' : 'بانتظارك'}</span><span>النتيجة = 72% دقة + 28% سرعة</span>{gameState === 'running' && <button type="button" onClick={() => finishGame(false)}>أنهيت الكتابة</button>}</div>
      </section>
    </main>
  );
}
