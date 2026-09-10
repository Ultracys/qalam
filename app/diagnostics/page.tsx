'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, PenTool } from 'lucide-react';
import { supportsPointerEvents } from '@/lib/pointerUtils';

type Live = { pressure: number; tiltX: number; tiltY: number; pointerType: string; width: number; height: number };

export default function DiagnosticsPage() {
  const [live, setLive] = useState<Live>({ pressure: 0, tiltX: 0, tiltY: 0, pointerType: '—', width: 0, height: 0 });
  const [capabilities, setCapabilities] = useState({ pointer: false, touch: false, maxTouchPoints: 0 });
  useEffect(() => setCapabilities({ pointer: supportsPointerEvents(), touch: 'ontouchstart' in window, maxTouchPoints: navigator.maxTouchPoints || 0 }), []);
  const update = (event: React.PointerEvent) => setLive({ pressure: event.pressure, tiltX: event.tiltX, tiltY: event.tiltY, pointerType: event.pointerType, width: event.width, height: event.height });
  return <main className="diagnostics-page" dir="rtl"><header><Link href="/"><ArrowRight />العودة للوحة</Link><span className="brand-mark">ق</span></header><section className="diagnostics-card"><div><span className="eyebrow">فحص الجهاز</span><h1>تشخيص القلم الإلكتروني</h1><p>حرّك القلم أو اضغط داخل منطقة الاختبار لقراءة القيم المباشرة.</p></div><div className="capability-grid"><article><span>Pointer Events</span><b className={capabilities.pointer ? 'ok' : 'no'}>{capabilities.pointer ? 'مدعوم' : 'غير مدعوم'}</b></article><article><span>اللمس</span><b className={capabilities.touch ? 'ok' : 'no'}>{capabilities.touch ? 'مدعوم' : 'غير مدعوم'}</b></article><article><span>أقصى نقاط لمس</span><b>{capabilities.maxTouchPoints}</b></article><article><span>الضغط</span><b className={live.pressure > 0 && live.pressure !== .5 ? 'ok' : ''}>{live.pressure > 0 && live.pressure !== .5 ? 'يصل قيمًا متغيرة' : 'اختبر بالقلم'}</b></article><article><span>الميل</span><b className={live.tiltX || live.tiltY ? 'ok' : ''}>{live.tiltX || live.tiltY ? 'يصل' : 'اختبر بالقلم'}</b></article></div><div className="pen-test" onPointerMove={update} onPointerDown={update}><PenTool /><span>منطقة اختبار القلم</span><div className="live-values"><span>Pressure <b>{live.pressure.toFixed(3)}</b></span><span>Tilt X <b>{live.tiltX}°</b></span><span>Tilt Y <b>{live.tiltY}°</b></span><span>Pointer <b>{live.pointerType}</b></span><span>Contact <b>{live.width.toFixed(1)} × {live.height.toFixed(1)}</b></span></div></div></section></main>;
}
