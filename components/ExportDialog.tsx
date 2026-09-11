'use client';

import { Download, FileImage, FolderOpen, Save, Shapes } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function ExportDialog({
  onPng,
  onSvg,
  onProjectSave,
  onProjectOpen,
}: {
  onPng: (transparent: boolean) => void;
  onSvg: () => void;
  onProjectSave: () => void;
  onProjectOpen: (file?: File) => void;
}) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button className="tool-button primary-tool" aria-label="تصدير" />
        }
      >
        <Download />
        <span>تصدير</span>
      </DialogTrigger>
      <DialogContent dir="rtl">
        <DialogHeader>
          <DialogTitle>تصدير اللوحة</DialogTitle>
          <DialogDescription>
            اختر الصيغة المناسبة. ملف SVG يحفظ الضربات كأشكال متجهة.
          </DialogDescription>
        </DialogHeader>
        <div className="export-options">
          <Button variant="outline" onClick={onProjectSave}>
            <Save />
            حفظ ملف المشروع
          </Button>
          <label className="project-open-button">
            <FolderOpen />
            فتح ملف مشروع
            <input
              type="file"
              accept=".qalam,.json,application/json"
              onChange={(event) => {
                onProjectOpen(event.target.files?.[0]);
                event.currentTarget.value = '';
              }}
            />
          </label>
          <span className="export-separator">تصدير صورة</span>
          <Button variant="outline" onClick={() => onPng(false)}>
            <FileImage />
            PNG بخلفية
          </Button>
          <Button variant="outline" onClick={() => onPng(true)}>
            <FileImage />
            PNG شفافة
          </Button>
          <Button variant="outline" onClick={onSvg}>
            <Shapes />
            SVG متجه
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
