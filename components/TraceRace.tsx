'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, Clock3, Flame, Gauge, RotateCcw, ShieldCheck, Trophy } from 'lucide-react';

const WIDTH = 960;
const HEIGHT = 440;
const ROUND_SECONDS = 55;
const TARGET_LINES = ['وَخَيْرُ جَلِيسٍ فِي الزَّمَانِ كِتَابُ', 'بِالعِلْمِ نَبْنِي لِلغَدِ أَبْوَابُ'];

type Point = { x: number; y: number };
type GameState = 'ready' | 'running' | 'finished';
type RaceResult = { accuracy: number; coverage: number; timeScore: number; total: number; elapsed: number };

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
  const [gameState, setGameState] = useState<GameState>('ready');
  const [secondsLeft, setSecondsLeft] = useState(ROUND_SECONDS);
  const [inkProgress, setInkProgress] = useState(0);
  const [result, setResult] = useState<RaceResult | null>(null);

  const renderTarget = useCallback((context: CanvasRenderingContext2D, mask = false) => {
    context.clearRect(0, 0, WIDTH, HEIGHT);
    if (!mask) {
      context.fillStyle = '#fffdf7';
      context.fillRect(0, 0, WIDTH, HEIGHT);
      context.strokeStyle = '#1f3c3230';
      context.lineWidth = 1;
      for (let x = 48; x < WIDTH; x += 48) {
        context.beginPath(); context.moveTo(x, 0); context.lineTo(x, HEIGHT); context.stroke();
      }
      for (let y = 44; y < HEIGHT; y += 44) {
        context.beginPath(); context.moveTo(0, y); context.lineTo(WIDTH, y); context.stroke();
      }
    }
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.direction = 'rtl';
    const ruqahFont = getComputedStyle(document.body)
      .getPropertyValue('--font-training-ruqah')
      .trim();
    context.font = `72px ${ruqahFont || 'serif'}`;
    context.lineWidth = mask ? 20 : 1;
    context.strokeStyle = mask ? '#fff' : '#176b5a38';
    context.fillStyle = mask ? '#fff' : '#176b5a4d';
    TARGET_LINES.forEach((line, index) => {
      const y = 160 + index * 145;
      if (mask) context.strokeText(line, WIDTH / 2, y);
      context.fillText(line, WIDTH / 2, y);
    });
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

  const calculateScore = useCallback((elapsed: number): RaceResult => {
    const inkContext = inkRef.current?.getContext('2d');
    const targetContext = targetRef.current?.getContext('2d');
    if (!inkContext || !targetContext) return { accuracy: 0, coverage: 0, timeScore: 0, total: 0, elapsed };
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
    const coverage = targetPixels ? Math.min(1, overlap / (targetPixels * 0.42)) : 0;
    const accuracy = Math.round((precision * 0.72 + coverage * 0.28) * 100);
    const timeScore = Math.round(Math.max(0, Math.min(100, 120 - (elapsed / ROUND_SECONDS) * 70)));
    return {
      accuracy,
      coverage: Math.round(coverage * 100),
      timeScore,
      total: Math.round(accuracy * 0.72 + timeScore * 0.28),
      elapsed,
    };
  }, []);

  const finishGame = useCallback(() => {
    if (!startedAtRef.current) return;
    const elapsed = Math.min(ROUND_SECONDS, (Date.now() - startedAtRef.current) / 1000);
    setResult(calculateScore(elapsed));
    setGameState('finished');
    drawingRef.current = false;
    lastPointRef.current = null;
  }, [calculateScore]);

  useEffect(() => {
    if (gameState !== 'running') return;
    const timer = window.setInterval(() => {
      const elapsed = (Date.now() - startedAtRef.current) / 1000;
      const left = Math.max(0, ROUND_SECONDS - elapsed);
      setSecondsLeft(Math.ceil(left));
      if (left <= 0) finishGame();
    }, 100);
    return () => window.clearInterval(timer);
  }, [finishGame, gameState]);

  const startGame = () => {
    resetCanvases();
    setResult(null);
    setInkProgress(0);
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
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Some assisted-input tools do not register an active native pointer.
    }
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
    setInkProgress((current) => Math.max(current, Math.min(100, ((WIDTH - next.x) / (WIDTH - 100)) * 100)));
    paint();
  };

  const endStroke = () => {
    drawingRef.current = false;
    lastPointRef.current = null;
  };

  const fireProgress = Math.max(1, Math.min(96, ((ROUND_SECONDS - secondsLeft) / ROUND_SECONDS) * 100 - 2));

  return (
    <main className="race-shell" dir="rtl">
      <header className="race-topbar">
        <button className="race-exit" type="button" onClick={onExit}><ArrowRight aria-hidden="true" /> الأطوار</button>
        <div className="race-title"><span>سباق القلم</span><small>التحدي الأول · بيت الحكمة</small></div>
        <div className={`race-timer ${secondsLeft <= 10 ? 'danger' : ''}`}><Clock3 aria-hidden="true" /><strong>{secondsLeft.toString().padStart(2, '0')}</strong><span>ثانية</span></div>
      </header>

      <section className="race-board">
        <div className="race-track" aria-label="تقدم السباق">
          <div className="race-track-line" />
          <div className="race-fire" style={{ right: `${fireProgress}%` }}><Flame aria-hidden="true" /></div>
          <div className="race-pen" style={{ right: `${Math.max(3, inkProgress)}%` }}><span>ق</span></div>
          <span className="race-start-label">البداية</span><span className="race-finish-label"><Trophy aria-hidden="true" /> النهاية</span>
        </div>

        <div className="race-instruction"><strong>اكتب فوق العبارة الشفافة</strong><span>الدقة أهم من السرعة—ولا تدع النار تلحق بك.</span></div>
        <div className="race-canvas-wrap">
          <canvas
            ref={canvasRef}
            width={WIDTH}
            height={HEIGHT}
            aria-label="منطقة تحدي الكتابة فوق العبارة"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={endStroke}
            onPointerCancel={endStroke}
            onContextMenu={(event) => event.preventDefault()}
          />

          {gameState === 'ready' && (
            <div className="race-overlay">
              <span className="race-overlay-icon"><Flame aria-hidden="true" /></span>
              <h1>جاهز للسباق؟</h1>
              <p>عند البدء لديك {ROUND_SECONDS} ثانية لتتبع البيتين بأعلى دقة ممكنة.</p>
              <button type="button" onClick={startGame}>ابدأ الآن</button>
            </div>
          )}

          {gameState === 'finished' && result && (
            <div className="race-overlay race-result">
              <span className="result-kicker"><Trophy aria-hidden="true" /> انتهى السباق</span>
              <div className="result-score"><strong>{result.total}</strong><span>/ 100</span></div>
              <h2>{scoreLabel(result.total)}</h2>
              <div className="result-metrics">
                <div><ShieldCheck aria-hidden="true" /><span>دقة المسار</span><strong>{result.accuracy}%</strong></div>
                <div><Gauge aria-hidden="true" /><span>تغطية العبارة</span><strong>{result.coverage}%</strong></div>
                <div><Clock3 aria-hidden="true" /><span>الوقت</span><strong>{result.elapsed.toFixed(1)}ث</strong></div>
              </div>
              <button type="button" onClick={startGame}><RotateCcw aria-hidden="true" /> أعد التحدي</button>
            </div>
          )}
        </div>

        <div className="race-status-row">
          <span><i className="status-dot" /> {gameState === 'running' ? 'السباق جارٍ' : gameState === 'finished' ? 'اكتمل التحدي' : 'بانتظارك'}</span>
          <span>النتيجة = 72% دقة + 28% سرعة</span>
          {gameState === 'running' && <button type="button" onClick={finishGame}>أنهيت الكتابة</button>}
        </div>
      </section>
    </main>
  );
}
