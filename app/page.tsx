import { CalligraphyCanvas } from '@/components/CalligraphyCanvas';

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'قلم',
  alternateName: 'Qalam Canvas',
  url: 'https://qalam-canvas.vercel.app/',
  description:
    'لوحة مجانية للتدرب على الخط العربي بقلم قصب رقمي يحاكي الضغط والميل.',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'أي نظام يدعم متصفح ويب حديث',
  inLanguage: 'ar',
  isAccessibleForFree: true,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'SAR' },
  featureList: [
    'التدرب على خط الرقعة والنسخ والثلث والديواني',
    'محاكاة عرض سن قلم القصب وزاويته',
    'دعم ضغط القلم الإلكتروني وميله',
    'تصدير الرسومات بصيغتي PNG وSVG',
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
      <CalligraphyCanvas />
    </>
  );
}
