import type { Metadata } from 'next';
import {
  Amiri,
  Aref_Ruqaa,
  Geist_Mono,
  IBM_Plex_Sans_Arabic,
  Katibeh,
  Reem_Kufi,
} from 'next/font/google';
import './globals.css';

const siteUrl = 'https://qalam-canvas.vercel.app';

const arabicSans = IBM_Plex_Sans_Arabic({
  variable: '--font-arabic-sans',
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const naskhFont = Amiri({
  variable: '--font-training-naskh',
  subsets: ['arabic'],
  weight: ['400'],
});
const ruqahFont = Aref_Ruqaa({
  variable: '--font-training-ruqah',
  subsets: ['arabic'],
  weight: ['400'],
});
const diwaniFont = Katibeh({
  variable: '--font-training-diwani',
  subsets: ['arabic'],
  weight: ['400'],
});
const kufiFont = Reem_Kufi({
  variable: '--font-training-kufi',
  subsets: ['arabic'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'قلم | لوحة مجانية للتدرب على الخط العربي',
    template: '%s | قلم',
  },
  description:
    'لوحة خط عربي مجانية على المتصفح تحاكي قلم القصب، مع تمارين للرقعة والنسخ والثلث والديواني، ودعم ضغط القلم وتصدير PNG وSVG.',
  applicationName: 'قلم',
  authors: [{ name: 'قلم' }],
  creator: 'قلم',
  publisher: 'قلم',
  keywords: [
    'الخط العربي',
    'تعلم الخط العربي',
    'تدريب الخط العربي',
    'لوحة خط عربي',
    'قلم القصب',
    'خط الرقعة',
    'خط النسخ',
    'خط الثلث',
    'الخط الديواني',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    url: '/',
    siteName: 'قلم',
    title: 'قلم | لوحة مجانية للتدرب على الخط العربي',
    description:
      'تدرّب على الخط العربي مباشرة في المتصفح بقلم قصب رقمي يستجيب للضغط والميل، وصدّر أعمالك بصيغتي PNG وSVG.',
  },
  twitter: {
    card: 'summary',
    title: 'قلم | لوحة مجانية للتدرب على الخط العربي',
    description:
      'لوحة عربية مجانية للتدرب على الرقعة والنسخ والثلث والديواني بقلم قصب رقمي.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  category: 'education',
  manifest: '/manifest.webmanifest',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${arabicSans.variable} ${geistMono.variable} ${naskhFont.variable} ${ruqahFont.variable} ${diwaniFont.variable} ${kufiFont.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
