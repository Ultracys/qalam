import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'اختبار القلم الإلكتروني',
  description:
    'اختبر دعم متصفحك لضغط القلم الإلكتروني وميله واللمس قبل استخدام لوحة قلم.',
  alternates: { canonical: '/diagnostics' },
  robots: { index: false, follow: true },
};

export default function DiagnosticsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
