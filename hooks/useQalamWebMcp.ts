'use client';

import { useEffect } from 'react';
import { canvasStore } from '@/store/canvasStore';

type ModelContext = { registerTool: (tool: Record<string, unknown>, options?: { signal: AbortSignal }) => void | Promise<void> };

export function useQalamWebMcp() {
  useEffect(() => {
    const context = (document as Document & { modelContext?: ModelContext }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const report = (error: unknown) => console.warn('تعذر تسجيل أداة Qalam Canvas', error);
    try {
      void Promise.resolve(context.registerTool({
        name: 'configure_qalam_brush', title: 'ضبط قلم القصب',
        description: 'يضبط عرض سن قلم القصب وزاويته ولون الحبر في لوحة الخط الحالية.',
        inputSchema: { type: 'object', properties: { nibWidth: { type: 'number', minimum: 4, maximum: 34 }, nibAngle: { type: 'number', minimum: 0, maximum: 90 }, color: { type: 'string', pattern: '^#[0-9a-fA-F]{6}$' } }, additionalProperties: false },
        annotations: { readOnlyHint: false, untrustedContentHint: false },
        execute(input: unknown) {
          if (!input || typeof input !== 'object') throw new Error('يلزم تمرير إعداد واحد على الأقل.');
          const values = input as { nibWidth?: number; nibAngle?: number; color?: string };
          if (values.nibWidth !== undefined && (values.nibWidth < 4 || values.nibWidth > 34)) throw new Error('عرض السن خارج المجال.');
          if (values.nibAngle !== undefined && (values.nibAngle < 0 || values.nibAngle > 90)) throw new Error('زاوية السن خارج المجال.');
          if (values.color !== undefined && !/^#[0-9a-fA-F]{6}$/.test(values.color)) throw new Error('صيغة اللون غير صحيحة.');
          canvasStore.setBrush(values);
          return { status: 'updated', brush: canvasStore.getState().brush };
        },
      }, { signal: lifecycle.signal })).catch(report);
    } catch (error) { report(error); }
    return () => lifecycle.abort();
  }, []);
}
