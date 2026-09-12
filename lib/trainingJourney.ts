import type { PracticeStyle } from '@/types/brush';

export type JourneyStyle = Exclude<PracticeStyle, 'none'>;

export type TrainingLesson = {
  id: string;
  journey: JourneyStyle;
  chapter: number;
  order: number;
  title: string;
  story: string;
  objective: string;
  text: string;
  style: JourneyStyle;
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

export type CalligraphyJourney = {
  id: JourneyStyle;
  name: string;
  title: string;
  description: string;
  difficulty: string;
  chapters: TrainingChapter[];
};

type LessonSeed = [title: string, text: string, objective: string];

const letterLessons: LessonSeed[] = [
  ['الهمزة والألف', 'ء  أ  إ  آ  ا  ـا', 'أتقن الهمزة والألف بأشكالهما، والألف أول الكلمة وآخرها.'],
  ['عائلة الباء', 'ب  بـ  ـبـ  ـب   ت  ث', 'اكتب الباء والتاء والثاء منفصلة وفي أول ووسط وآخر الكلمة.'],
  ['عائلة الجيم', 'ج  جـ  ـجـ  ـج   ح  خ', 'ثبّت شكل الوعاء وميّز الجيم والحاء والخاء بالنقاط.'],
  ['عائلة الدال', 'د  ـد   ذ  ـذ', 'تدرّب على الدال والذال منفصلتين ومتصلتين بما قبلهما.'],
  ['عائلة الراء', 'ر  ـر   ز  ـز', 'اضبط نزول الراء والزاي وموضع النقطة في آخر الكلمة.'],
  ['عائلة السين', 'س  سـ  ـسـ  ـس   ش', 'وازن أسنان السين والشين في المواضع الأربعة.'],
  ['عائلة الصاد', 'ص  صـ  ـصـ  ـص   ض', 'حافظ على اتساع الصاد والضاد واتصال جسمهما.'],
  ['عائلة الطاء', 'ط  طـ  ـطـ  ـط   ظ', 'وازن القائم مع جسم الطاء والظاء في كل موضع.'],
  ['عائلة العين', 'ع  عـ  ـعـ  ـع   غ', 'ميّز رأس العين المفتوح وأشكالها الوسطية والنهائية.'],
  ['الفاء والقاف', 'ف  فـ  ـفـ  ـف   ق', 'أتقن وعاء الفاء والقاف واختلاف النقاط والختام.'],
  ['حرف الكاف', 'ك  كـ  ـكـ  ـك', 'اكتب الكاف بأشكالها الأربعة مع ضبط الهمزة الداخلية.'],
  ['حرف اللام', 'ل  لـ  ـلـ  ـل   لا', 'أتقن امتداد اللام واتصالها ووصلة اللام ألف.'],
  ['حرف الميم', 'م  مـ  ـمـ  ـم', 'وازن رأس الميم وذيلها في البداية والوسط والنهاية.'],
  ['حرف النون', 'ن  نـ  ـنـ  ـن', 'حافظ على وعاء النون ومركز النقطة في كل موضع.'],
  ['الهاء والتاء المربوطة', 'ه  هـ  ـهـ  ـه   ة  ـة', 'ميّز أشكال الهاء والتاء المربوطة داخل الكلمات ونهايتها.'],
  ['الواو والهمزة', 'و  ـو   ؤ  ـؤ', 'اضبط دوران الواو وموضع الهمزة واتصالها بما قبلها.'],
  ['عائلة الياء', 'ي  يـ  ـيـ  ـي   ى  ئ', 'أتقن الياء والألف المقصورة والهمزة على نبرة في كل موضع.'],
];

const connectionLessons: LessonSeed[] = [
  ['وصلات بائية', 'ببا  تبي  يثبت  بيت', 'تدرّب على الوصلات بين الباء والتاء والثاء وبقية الحروف.'],
  ['وصلات جيمية', 'حجا  نجم  فجر  بحث', 'حافظ على وضوح عائلة الجيم عند الاتصال قبلًا وبعدًا.'],
  ['الحروف القاطعة', 'دار  ورد  زاد  أريد', 'تعلّم أين ينقطع الاتصال بعد ا د ذ ر ز و.'],
  ['وصلات سنية', 'سلم  شمس  يسير  نقش', 'اضبط أسنان السين والشين داخل الكلمة.'],
  ['وصلات عميقة', 'صبر  ضياء  طيب  عظيم', 'وازن الحروف العريضة مع الحروف التالية لها.'],
  ['وصلات حلقية', 'علم  غيم  فعل  نفع', 'أتقن انتقال القلم من العين والغين وإليهما.'],
  ['وصلات فاء وقاف', 'فكر  قلب  رفيق  أفق', 'اضبط الأوعية والنقاط دون أن يختل خط الأساس.'],
  ['وصلات لينة', 'كلمة  هدية  مياه  ليل', 'اربط الكاف واللام والميم والهاء والياء بسلاسة.'],
];

const wordLessons: LessonSeed[] = [
  ['كلمات قصيرة', 'قلم   حبر   خط', 'اكتب كلمات من ثلاثة أحرف مع مسافات متزنة.'],
  ['كلمات العلم', 'كتاب   مدرسة   معرفة', 'حافظ على وضوح الحروف في كلمات تعليمية شائعة.'],
  ['كلمات القيم', 'صدق   صبر   كرم', 'وازن الحروف الصاعدة والهابطة في كل كلمة.'],
  ['كلمات الطبيعة', 'شمس   قمر   سحاب', 'تدرّب على تنوع الوصلات والأوعية.'],
  ['كلمات بهمزة', 'أمانة   إبداع   سؤال', 'أتقن مواضع الهمزة فوق الألف وتحته وعلى الواو.'],
  ['كلمات بالتاء والهاء', 'رحمة   هدية   حياة', 'ميّز التاء المربوطة والهاء في نهاية الكلمات.'],
  ['كلمات طويلة', 'الاستقامة   المستقبَل', 'حافظ على الإيقاع في الكلمات الممتدة.'],
  ['ميزان المسافات', 'العلم   نور   والجهل   ظلام', 'وحّد المسافة داخل الكلمة وبين الكلمات.'],
];

const compositionLessons: LessonSeed[] = [
  ['جملة على السطر', 'العلم نور', 'اكتب جملة قصيرة على خط أساس ثابت.'],
  ['الصعود والنزول', 'بالصبر تبلغ المنى', 'وازن القوائم والذيول من غير ازدحام.'],
  ['جملة متوسطة', 'خير الكلام ما قل ودل', 'حافظ على الإيقاع والمسافات في جملة كاملة.'],
  ['التشكيل', 'رَبِّ زِدْنِي عِلْمًا', 'ضع الحركات بعد اكتمال بنية الحروف دون ازدحام.'],
  ['التكوين المتوازن', 'ومن طلب العلا سهر الليالي', 'وزّع الكتل والفراغات في عبارة طويلة.'],
  ['لوحة الحكمة', 'لكل مجتهد نصيب', 'اصنع لوحة تجمع الوضوح والجمال والشخصية.'],
  ['اختبار الإجازة', 'الجمال في حسن التناسب', 'اكتب بلا اعتماد كامل على النموذج وأثبت إتقانك.'],
];

const journeyInfo: Array<[JourneyStyle, string, string, string, string]> = [
  ['naskh', 'النسخ', 'رحلة الناسخ', 'ابدأ بالخط الأوضح والأكثر ملاءمة للتعلّم والقراءة.', 'مبتدئ'],
  ['ruqah', 'الرقعة', 'رحلة الكاتب', 'تعلّم خطًا سريعًا عمليًا بإيقاع واضح وحروف مختصرة.', 'متوسط'],
  ['diwani', 'الديواني', 'رحلة الديوان', 'أتقن الليونة والميل والوصلات المنسابة والتكوين الزخرفي.', 'متقدم'],
  ['kufi', 'الكوفي', 'رحلة البنّاء', 'ابنِ الحروف على ميزان هندسي وتكوينات قوية.', 'متقدم'],
];

function createChapter(style: JourneyStyle, chapter: number, title: string, subtitle: string, story: string, seeds: LessonSeed[]): TrainingChapter {
  return {
    id: chapter,
    title,
    subtitle,
    story,
    lessons: seeds.map(([lessonTitle, text, objective], index) => ({
      id: `${style}-c${chapter}-l${index + 1}`,
      journey: style,
      chapter,
      order: index + 1,
      title: lessonTitle,
      story: chapter === 1 ? `يفتح المعلم سجل الحروف عند ${lessonTitle}، ويطلب منك دراسة بنيتها قبل الكتابة.` : `وصلت إلى تحدي ${lessonTitle}. راقب الميزان ثم اكتب بهدوء.` ,
      objective,
      text,
      style,
      minStrokes: Math.max(4, 4 + chapter * 2 + Math.floor(index / 2)),
      xp: 40 + chapter * 25 + index * 5,
    })),
  };
}

export const calligraphyJourneys: CalligraphyJourney[] = journeyInfo.map(([id, name, title, description, difficulty]) => ({
  id,
  name,
  title,
  description,
  difficulty,
  chapters: [
    createChapter(id, 1, 'أسرار الحروف', 'كل حرف منفردًا وفي أول ووسط وآخر الكلمة', 'تبدأ من الصفر: تتعلم بنية الحروف العربية كلها، مجمّعة بحسب العائلات المتشابهة.', letterLessons),
    createChapter(id, 2, 'فن الوصل', 'من الحرف المنفرد إلى الكلمة المتماسكة', 'تتعلم كيف تتغير الحروف عند اتصالها، ومتى يستمر القلم ومتى ينقطع.', connectionLessons),
    createChapter(id, 3, 'صناعة الكلمات', 'إيقاع الحروف والمسافات والنقاط', 'تنتقل من أشكال الحروف إلى كلمات حقيقية، قصيرة ثم طويلة ومتنوعة.', wordLessons),
    createChapter(id, 4, 'مجلس الخطاطين', 'الجمل والتشكيل والتكوين والإجازة', 'تكتب الجمل واللوحات، وتتعلم التشكيل وتوزيع المساحات حتى اختبار الإجازة.', compositionLessons),
  ],
}));

export function getJourney(style: JourneyStyle) {
  return calligraphyJourneys.find((journey) => journey.id === style) ?? calligraphyJourneys[0];
}

export const trainingLessons = calligraphyJourneys.flatMap((journey) => journey.chapters.flatMap((chapter) => chapter.lessons));

export function getLesson(id: string) {
  return trainingLessons.find((lesson) => lesson.id === id) ?? trainingLessons[0];
}

export function getNextLesson(id: string) {
  const lesson = getLesson(id);
  const journeyLessons = getJourney(lesson.journey).chapters.flatMap((chapter) => chapter.lessons);
  const index = journeyLessons.findIndex((item) => item.id === lesson.id);
  return journeyLessons[index + 1] ?? null;
}
