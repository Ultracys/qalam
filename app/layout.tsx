import type { Metadata } from 'next';
import { Noto_Kufi_Arabic, Geist_Mono } from 'next/font/google';
import './globals.css';

const arabicSans = Noto_Kufi_Arabic({
  variable: '--font-arabic-sans',
  subsets: ['arabic'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Qalam Canvas | لوحة الخط العربي',
  description: 'مساحة رقمية للكتابة والتدرب على الخط العربي بقلم قصب يحاكي الضغط والميل.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${arabicSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
