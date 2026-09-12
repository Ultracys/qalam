import type { PracticeStyle } from '@/types/brush';

export type TrainingLesson = {
  id: string;
  chapter: number;
  order: number;
  title: string;
  story: string;
  objective: string;
  text: string;
  style: Exclude<PracticeStyle, 'none'>;
  minStrokes: number;
  xp: number;
};

export type TrainingChapter = {
  id: number;
  title: string;
  subtitle: string;
  story: string;
  lessons: TrainingLesson[];
};

const lesson = (
  id: string,
  chapter: number,
  order: number,
  title: string,
  story: string,
  objective: string,
  text: string,
  style: TrainingLesson['style'],
  minStrokes: number,
  xp: number,
): TrainingLesson => ({ id, chapter, order, title, story, objective, text, style, minStrokes, xp });

export const trainingChapters: TrainingChapter[] = [
  {
    id: 1,
    title: 'بداية الأثر',
    subtitle: 'تعلّم كيف يمسك الحبر طريقه',
    story: 'وصلت إلى دكّان الورّاق يونس، ولم يمنحك القلم بعد. قال: من عرف النقطة، عرف سرّ الحرف.',
    lessons: [
      lesson('c1-l1', 1, 1, 'النقطة الأولى', 'يضع يونس أمامك قصبة وورقة بيضاء.', 'اصنع نقاطًا متقاربة وثابتة العرض.', '•••', 'ruqah', 3, 40),
      lesson('c1-l2', 1, 2, 'ميزان الألف', 'يرسم المعلم خطًا قائمًا ويطلب منك ألا يتردد سنّك.', 'حافظ على اتجاه واحد ووقفة واضحة.', 'ا ا ا', 'naskh', 3, 50),
      lesson('c1-l3', 1, 3, 'انحناءة الباء', 'بدأ أول حرف يتشكل؛ خط مستقيم ونقطة تحفظ هويته.', 'وازن بين امتداد السطر وموضع النقطة.', 'ب ب ب', 'naskh', 4, 60),
      lesson('c1-l4', 1, 4, 'عهد القلم', 'يناولك يونس قلمك الأول بعد أن رأى ثبات يدك.', 'اكتب كلمة قصيرة من دون استعجال.', 'قلم', 'ruqah', 4, 80),
    ],
  },
  {
    id: 2,
    title: 'سوق الكلمات',
    subtitle: 'صِل الحروف واجعلها تتنفس',
    story: 'تخرج إلى سوق المدينة. كل لافتة ناقصة، ومهمتك أن تعيد للكلمات اتزانها وجمالها.',
    lessons: [
      lesson('c2-l1', 2, 1, 'وصل الحروف', 'صاحب المكتبة يريد اسمًا يُقرأ من بعيد.', 'صل الحروف مع بقاء خط الأساس ثابتًا.', 'كتب', 'naskh', 5, 90),
      lesson('c2-l2', 2, 2, 'إيقاع الرقعة', 'ينتظرك ناسخ سريع، لكنه لا يضحي بالوضوح.', 'اكتب بخفة وحافظ على حجم الحروف.', 'موعد', 'ruqah', 5, 100),
      lesson('c2-l3', 2, 3, 'ميزان المسافات', 'تزدحم الكلمات حين تغيب المسافة الصحيحة.', 'اترك فراغًا بصريًا متوازنًا بين الكلمات.', 'باب العلم', 'naskh', 7, 110),
      lesson('c2-l4', 2, 4, 'لافتة السوق', 'حان وقت كتابة اللافتة التي ستبقى في قلب السوق.', 'اكتب العبارة كاملة على سطر واحد.', 'العلم نور', 'ruqah', 8, 130),
    ],
  },
  {
    id: 3,
    title: 'ديوان الأمير',
    subtitle: 'تعلّم الإيقاع والزخرفة والانسياب',
    story: 'وصل جمال كتابتك إلى الديوان. أمامك رسائل تحتاج يدًا تعرف متى تمتد ومتى تنحني.',
    lessons: [
      lesson('c3-l1', 3, 1, 'انسياب الديواني', 'الرسالة الأولى رقيقة، وحروفها تميل كأغصان الصفصاف.', 'اتبع الميل وحافظ على سلاسة الوصلات.', 'سلام', 'diwani', 6, 150),
      lesson('c3-l2', 3, 2, 'هيبة الثلث', 'عنوان المرسوم يحتاج حروفًا طويلة واثقة.', 'وازن الامتداد الرأسي مع اتساع الحروف.', 'عدل', 'thuluth', 6, 170),
      lesson('c3-l3', 3, 3, 'هندسة الكوفي', 'بوابة الديوان تنتظر نقشًا ثابت البنيان.', 'ابنِ الحروف بزوايا وإيقاع هندسي.', 'علم', 'kufi', 7, 190),
      lesson('c3-l4', 3, 4, 'خاتم الديوان', 'سيُختم المرسوم بعبارة من يدك.', 'اجمع الثبات والإيقاع في عبارة رسمية.', 'بالعدل يدوم الملك', 'thuluth', 10, 220),
    ],
  },
  {
    id: 4,
    title: 'إجازة الخطاط',
    subtitle: 'اصنع أسلوبك وأثبت إتقانك',
    story: 'عدت إلى معلمك بعد رحلة طويلة. بقيت ثلاث لوحات واختبار أخير لتحصل على الإجازة.',
    lessons: [
      lesson('c4-l1', 4, 1, 'دقة الناسخ', 'تنقل حكمةً ستبقى لمن يأتي بعدك.', 'حافظ على الوضوح والنسب في نص أطول.', 'خير الكلام ما قل ودل', 'naskh', 12, 250),
      lesson('c4-l2', 4, 2, 'روح القصبة', 'لا نموذج كامل هذه المرة؛ عليك أن تثق بعينك.', 'خفّض وضوح النموذج واكتب بثقة.', 'ومن طلب العلا سهر الليالي', 'ruqah', 12, 280),
      lesson('c4-l3', 4, 3, 'لوحة المعرض', 'تختار أجمل ما تعلمته ليُعلّق في مجلس الخطاطين.', 'اكتب بتكوين متوازن ولمسة شخصية.', 'لكل مجتهد نصيب', 'diwani', 14, 320),
      lesson('c4-l4', 4, 4, 'الإجازة', 'يقف يونس صامتًا. هذه اللوحة وحدها ستتكلم عن رحلتك.', 'أنجز عبارتك الأخيرة بأفضل اتزان ممكن.', 'رب زدني علما', 'thuluth', 16, 500),
    ],
  },
];

export const trainingLessons = trainingChapters.flatMap((chapter) => chapter.lessons);

export function getLesson(id: string) {
  return trainingLessons.find((item) => item.id === id) ?? trainingLessons[0];
}

export function getNextLesson(id: string) {
  const index = trainingLessons.findIndex((item) => item.id === id);
  return trainingLessons[index + 1] ?? null;
}
