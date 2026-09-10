import type { Metadata } from 'next';
import { Amiri, Aref_Ruqaa, Geist_Mono, IBM_Plex_Sans_Arabic, Katibeh, Reem_Kufi } from 'next/font/google';
import './globals.css';

const arabicSans = IBM_Plex_Sans_Arabic({
  variable: '--font-arabic-sans',
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '600', '700'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const naskhFont = Amiri({ variable: '--font-training-naskh', subsets: ['arabic'], weight: ['400'] });
const ruqahFont = Aref_Ruqaa({ variable: '--font-training-ruqah', subsets: ['arabic'], weight: ['400'] });
const diwaniFont = Katibeh({ variable: '--font-training-diwani', subsets: ['arabic'], weight: ['400'] });
const kufiFont = Reem_Kufi({ variable: '--font-training-kufi', subsets: ['arabic'] });

export const metadata: Metadata = {
  title: 'Qalam Canvas | لوحة الخط العربي',
  description: 'مساحة رقمية للكتابة والتدرب على الخط العربي بقلم قصب يحاكي الضغط والميل.',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${arabicSans.variable} ${geistMono.variable} ${naskhFont.variable} ${ruqahFont.variable} ${diwaniFont.variable} ${kufiFont.variable}`}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
