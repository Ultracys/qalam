'use client';

import { Download, FileImage, Shapes } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export function ExportDialog({ onPng, onSvg }: { onPng: (transparent: boolean) => void; onSvg: () => void }) {
  return (
    <Dialog>
      <DialogTrigger render={<Button className="tool-button primary-tool" aria-label="تصدير" />}><Download /><span>تصدير</span></DialogTrigger>
      <DialogContent dir="rtl">
        <DialogHeader><DialogTitle>تصدير اللوحة</DialogTitle><DialogDescription>اختر الصيغة المناسبة. ملف SVG يحفظ الضربات كأشكال متجهة.</DialogDescription></DialogHeader>
        <div className="export-options">
          <Button variant="outline" onClick={() => onPng(false)}><FileImage />PNG بخلفية</Button>
          <Button variant="outline" onClick={() => onPng(true)}><FileImage />PNG شفافة</Button>
          <Button variant="outline" onClick={onSvg}><Shapes />SVG متجه</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
