'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen,
  Brush,
  Bug,
  Eraser,
  Grid3X3,
  Hand,
  LocateFixed,
  Moon,
  Redo2,
  Sun,
  Trash2,
  Undo2,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { canvasStore, useCanvasStore } from '@/store/canvasStore';
import { ExportDialog } from '@/components/ExportDialog';

export function Toolbar({
  zoom,
  onZoom,
  onResetView,
  onPng,
  onSvg,
  onProjectSave,
  onProjectOpen,
}: {
  zoom: number;
  onZoom: (delta: number) => void;
  onResetView: () => void;
  onPng: (transparent: boolean) => void;
  onSvg: () => void;
  onProjectSave: () => void;
  onProjectOpen: (file?: File) => void;
}) {
  const state = useCanvasStore();
  const toolButton = (
    tool: 'qalam' | 'eraser' | 'pan',
    label: string,
    icon: React.ReactNode,
  ) => (
    <Button
      aria-label={label}
      title={label}
      variant={state.tool === tool ? 'default' : 'ghost'}
      className="icon-tool"
      onClick={() => canvasStore.set({ tool })}
    >
      {icon}
    </Button>
  );
  return (
    <header className="toolbar">
      <div className="brand">
        <Image
          className="brand-logo"
          src="/qalam-logo.svg"
          width={42}
          height={42}
          priority
          alt="شعار قلم"
        />
        <div>
          <h1>قلم</h1>
          <small>لوحة التدريب على الخط العربي</small>
        </div>
      </div>
      <div className="tool-group">
        {toolButton('qalam', 'قلم القصب', <Brush />)}
        {toolButton('eraser', 'الممحاة', <Eraser />)}
        {toolButton('pan', 'تحريك اللوحة', <Hand />)}
        <span className="separator" />
        <Button
          aria-label="تراجع"
          title="تراجع"
          variant="ghost"
          className="icon-tool"
          disabled={!state.strokes.length}
          onClick={() => canvasStore.undo()}
        >
          <Undo2 />
        </Button>
        <Button
          aria-label="إعادة"
          title="إعادة"
          variant="ghost"
          className="icon-tool"
          disabled={!state.redoStack.length}
          onClick={() => canvasStore.redo()}
        >
          <Redo2 />
        </Button>
        <Button
          aria-label="مسح اللوحة"
          title="مسح اللوحة"
          variant="ghost"
          className="icon-tool danger-tool"
          onClick={() => {
            if (confirm('مسح كل الضربات من اللوحة؟')) canvasStore.clear();
          }}
        >
          <Trash2 />
        </Button>
      </div>
      <div className="tool-group end-tools">
        <Button
          aria-label="تصغير"
          variant="ghost"
          className="icon-tool"
          onClick={() => onZoom(-0.15)}
        >
          <ZoomOut />
        </Button>
        <span className="zoom-value">{Math.round(zoom * 100)}%</span>
        <Button
          aria-label="تكبير"
          variant="ghost"
          className="icon-tool"
          onClick={() => onZoom(0.15)}
        >
          <ZoomIn />
        </Button>
        <Button
          aria-label="إعادة ضبط العرض"
          title="إعادة العرض إلى 100%"
          variant="ghost"
          className="icon-tool"
          onClick={onResetView}
        >
          <LocateFixed />
        </Button>
        <Button
          aria-label="شبكة النقاط"
          title="شبكة النقاط"
          variant="ghost"
          className="icon-tool"
          onClick={() => canvasStore.set({ grid: !state.grid })}
        >
          <Grid3X3 />
        </Button>
        <Button
          aria-label="الوضع الليلي"
          title="الوضع الليلي"
          variant="ghost"
          className="icon-tool"
          onClick={() => canvasStore.set({ darkMode: !state.darkMode })}
        >
          {state.darkMode ? <Sun /> : <Moon />}
        </Button>
        <Link
          href="/guide"
          className="diagnostics-link"
          aria-label="دليل التدرب على الخط العربي"
          title="دليل الاستخدام"
        >
          <BookOpen />
        </Link>
        <Link
          href="/diagnostics"
          className="diagnostics-link"
          title="تشخيص القلم"
        >
          <Bug />
        </Link>
        <ExportDialog
          onPng={onPng}
          onSvg={onSvg}
          onProjectSave={onProjectSave}
          onProjectOpen={onProjectOpen}
        />
      </div>
    </header>
  );
}
