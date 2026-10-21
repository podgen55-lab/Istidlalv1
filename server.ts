/**
 * Fullstack server for ISTIDLAL platform
 * الأستاذ الذكي لمادة علوم الطبيعة والحياة للبكالوريا الجزائرية
 * إعداد: فنكوح عبد الرحيم
 */
import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize GoogleGenAI SDK
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for model name: prefer user specified gemini-2.5-flash, with gemini-3.8-flash as fallback
const MODEL_NAME = 'gemini-2.5-flash';

// Clean JSON response helper
function parseJsonFromText(rawText: string) {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```\s*$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/```\s*$/, '');
  }
  return JSON.parse(cleaned);
}

// Check health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasApiKey: !!apiKey });
});

/**
 * AGENT 1: VisionExerciseAgent
 * يستقبل صورة التمرين، يحللها وفق المنهجية الرسمية (دليل 2017 ومذكرات 2021-2022)
 */
app.post('/api/agents/vision-exercise', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'صورة التمرين مطلوبة' });
    }

    const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');

    const prompt = `
أنت "وكيل الرؤية وفهم التمرين" التابع لمنصة "استدلال" (الأستاذ الذكي لمادة علوم الطبيعة والحياة للبكالوريا الجزائرية - إعداد: فنكوح عبد الرحيم).
أمامك صورة لتمرين في مادة علوم الطبيعة والحياة (شعبة علوم تجريبية أو رياضيات).

المطلوب منك تفكيك وتحليل هذا التمرين بدقة وبنائه في هيكل JSON منظم.

المرجعية المنهجية الرسمية:
- دليل بناء اختبار البكالوريا (أكتوبر 2017)
- التوجيهات الوزارية والمذكرات المنهجية للمفتشية العامة للبيداغوجيا (2021-2022) حول استغلال الوثائق (التعريف بالوثيقة -> تفكيك المعطيات مع الدلالة العلمية -> الاستنتاج الجزئي) والمهمات المركبة (الربط والدمج / التركيب).

أنماط التمارين الرسمية:
1. التمرين الأول (5 نقاط): استرجاع منظم للموارد (نص علمي مهيكل بمقدمة ومشكل، عرض، خاتمة).
2. التمرين الثاني (7 نقاط): ممارسة الاستدلال العلمي (حل مشكل علمي عبر جزأين، استغلال الوثائق ثم التركيب).
3. التمرين الثالث (8 نقاط): المسعى العلمي التجريبي (اقتراح واختبار الفرضيات، وتركيب مخطط أو حصيلة في الجزء 3).

المطلوب إخراج JSON صالح فقط بالشكل التالي دون أي نصوص قبله أو بعده:
{
  "title": "عنوان موجز معبر عن موضوع التمرين",
  "domain": "المجال والوحدة التعلمية (مثلاً: تركيب البروتين / المناعة / الاتصال العصبي / التحولات الطاقوية / الجيولوجيا)",
  "exerciseType": "exercise_1" أو "exercise_2" أو "exercise_3",
  "exerciseTypeLabel": "التمرين 1 (5 نقاط): استرجاع منظم للموارد" أو "التمرين 2 (7 نقاط): استدلال علمي" أو "التمرين 3 (8 نقاط): مسعى علمي تجريبي",
  "maxScore": 5 أو 7 أو 8,
  "contextAndDocuments": [
    {
      "documentId": "وثيقة 1 / شكل أ / إلخ",
      "documentTitle": "عنوان الوثيقة أو الشكل",
      "description": "وصف دقيق لطبيعة السند (منحنى بياني، جدول نتائج تجريبية، رسم تخطيطي تفسيري...)",
      "experimentalConditions": "الشروط والمتغيرات التجريبية الموجودة في السند",
      "observations": "الملاحظات والنتائج المسجلة",
      "expectedDeductionFocus": "الهدف الاستنتاجي المنهجي المستهدف من هذه الوثيقة (دون إعطاء الحل النهائي)"
    }
  ],
  "instructions": [
    {
      "number": 1,
      "text": "نص التعليمة كما وردت في التمرين بالضبط",
      "actionVerb": "الفعل الأدائي (مثال: حلل، فسر، اشرح، بين، اقترح فرضية...)",
      "taskType": "مهمة بسيطة" أو "مهمة مركبة",
      "requiredSteps": [
        "الخطوة 1: التعريف بالوثيقة وتحديد المتغيرات",
        "الخطوة 2: قراءة المعطيات وربطها بالدلالة العلمية",
        "الخطوة 3: استخراج الاستنتاج الجزئي",
        "الخطوة 4: التركيب والإجابة المباشرة عن المشكل المطروح"
      ]
    }
  ],
  "methodologyBreakdown": {
    "summary": "ملخص توجيهي للمهمة المطلوبة من التلميذ وفق المنهجية الرسمية",
    "commonPitfallsToAvoid": [
      "القفز المباشر إلى الاستنتاج دون ربط الملاحظة بالدلالة العلمية",
      "تكرار الأرقام دون ذكر دلالتها البيولوجية",
      "إهمال شروط الوسط"
    ],
    "officialGuidelinesNote": "تنبيه التلميذ إلى طريقة صياغة الإجابة وفق معايير التقييم الرسمية لوزارة التربية الوطنية"
  }
}
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = parseJsonFromText(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('VisionExerciseAgent Error:', error);
    return res.status(500).json({
      error: 'فشل في قراءة صورة التمرين بواسطة الذكاء الاصطناعي',
      details: error?.message || String(error),
    });
  }
});

/**
 * AGENT 2: SocraticTutorAgent
 * المحاور السقراطي الموجه: لا يقدم الحل أبداً، يوجه التلميذ تدريجياً ويوظف ذاكرته التعليمية
 */
app.post('/api/agents/socratic-tutor', async (req, res) => {
  try {
    const {
      exerciseData,
      chatHistory = [],
      studentMessage,
      pedagogicalMemory,
    } = req.body;

    const systemInstruction = `
أنت "الأستاذ الذكي لمادة علوم الطبيعة والحياة" (منصة استدلال - إعداد: فنكوح عبد الرحيم) للتعليم الثانوي بالجزائر (3 ثانوي - بكالوريا).
فلسفتك الأساسية الصارمة: تمكين التلميذ من أن "يفهم عن نفسه وبنفسه".
قاعدة حديدية مطلقة: لا تعطِ الإجابة المباشرة أو الحل الجاهز أو الاستنتاج النهائي قط تحت أي ظرف!

مرجعيتك المنهجية الرسمية:
- دليل بناء الاختبارات الرسمي (أكتوبر 2017)
- مذكرات المفتشية العامة للبيداغوجيا (2021-2022) المتعلقة بالمهمات البسيطة والمركبة
- خطوات استغلال الوثيقة: 
  1. التعريف بالوثيقة (تقديم السند: تمثل الوثيقة... حيث نلاحظ...)
  2. تفكيك المعطيات وربطها بالدلالة العلمية (ملاحظة + دلالة: ما يدل على...)
  3. الخروج باستنتاج مبرر يجيب عن جزء من المشكل.

كيف تتفاعل مع التلميذ:
1. توظيف الذاكرة التعليمية السابقة:
   - إذا تضمنت الذاكرة التعليمية للتلميذ ملاحظات سابقة (مثلاً: تسرع في الاستنتاج دون تبرير، أو نسيان شروط الوسط، أو ضعف في الربط السببي)، ابدأ المحادثة أو وجه التلميذ بلطف بالانتباه إليها.
2. التدرج السقراطي (Scaffolding):
   - في التحليل: اطلب منه أولاً التعريف بالوثيقة، ثم قراءة المتغيرات والشروط بدقة، ثم اسأله عما تدل عليه كل تغيرات، ثم ما يستنتجه.
   - في التفسير: اطلب منه الربط السببي للإجابة عن "كيف ولماذا".
   - في الفرضية: وجّهه لربط مشكل الوثيقة بمعارفه ليقدم حلاً مؤقتاً قابلاً للاختبار.
3. اللهجة والأسلوب:
   - لغة عربية علمية فصيحة، مشجعة، تربوية، دقيقة وواضحة تناسب تلميذ بكالوريا جزائري.

المطلوب إخراج JSON فقط:
{
  "reply": "نص رد الأستاذ التوجيهي والمشجع بصيغة سقراطية تدعو التلميذ للتفكير والإجابة",
  "pedagogicalNote": "ملاحظة بيداغوجية سريعة حول الخطوة المنهجية الحالية للتلميذ",
  "suggestedQuickReplies": [
    "الوثيقة تمثل منحنى تغيرات تركيز...",
    "ألاحظ أنه عند إضافة المادة س يحدث...",
    "أستنتج أن المادة تؤثر على..."
  ]
}
`;

    const userPrompt = `
معطيات التمرين الحالي:
العنوان: ${exerciseData?.title || 'تمرين بكالوريا'}
المجال: ${exerciseData?.domain || ''}
النمط: ${exerciseData?.exerciseTypeLabel || ''}
الوثائق والتعليمات:
${JSON.stringify(exerciseData?.contextAndDocuments || [], null, 2)}
التعليمات:
${JSON.stringify(exerciseData?.instructions || [], null, 2)}

الذاكرة التعليمية للتلميذ (Pedagogical Memory):
${JSON.stringify(pedagogicalMemory || {}, null, 2)}

سجل المحادثة حتى الآن:
${chatHistory.map((m: any) => `${m.role === 'user' ? 'التلميذ' : 'الأستاذ'}: ${m.content}`).join('\n')}

رسالة التلميذ الحالية:
${studentMessage || 'مرحباً أستاذ، أريد أن تبدأ معي في حل هذا التمرين وتوجهني خطوة بخطوة.'}
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const parsed = parseJsonFromText(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('SocraticTutorAgent Error:', error);
    return res.status(500).json({
      error: 'فشل في محاورة الأستاذ السقراطي',
      details: error?.message || String(error),
    });
  }
});

/**
 * AGENT 3: HandwritingOCRAgent
 * قراءة خط يد التلميذ أو رسمه على كراسه بدقة
 */
app.post('/api/agents/handwriting-ocr', async (req, res) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg' } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'صورة إجابة التلميذ مطلوبة' });
    }

    const cleanBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');

    const prompt = `
أنت "وكيل قراءة خط اليد والرسم العلمي" لمنصة استدلال (مادة علوم الطبيعة والحياة - بكالوريا الجزائر).
أمامك صورة لورقة إجابة أو كراس تلميذ بخط اليد باللغة العربية (مع مصطلحات ورسومات علمية).

مهمتك:
1. استخراج النص المكتوب بخط اليد بأعلى درجات الدقة والأمانة العلمية، وتصحيح الكلمات غير الواضحة سياقياً مع احترام أسلوب التلميذ.
2. رصد أي رسومات تخطيطية أو بيانات أو مخططات مرسومة ووصفها بدقة داخل النص.

المطلوب إخراج JSON فقط:
{
  "transcribedText": "النص الكامل المستخرج من إجابة التلميذ مع المحافظة على الترقيم والفقرات كما كتبها التلميذ",
  "confidenceNote": "ملاحظة حول مدى وضوح الخط وجودة الصورة",
  "detectedDrawingsOrSchemes": "وصف لأي رسومات تخطيطية أو جداول رسمها التلميذ إن وجدت"
}
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = parseJsonFromText(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('HandwritingOCRAgent Error:', error);
    return res.status(500).json({
      error: 'فشل في قراءة الخط اليدوي للتلميذ',
      details: error?.message || String(error),
    });
  }
});

/**
 * AGENT 4: GradingAndMemoryAgent
 * تصحيح إجابة التلميذ وفق شبكة معيارية رسمية (0.25 لكل مؤشر) وتوليد التقرير التشخيصي وتحديث الذاكرة
 */
app.post('/api/agents/grading-and-memory', async (req, res) => {
  try {
    const {
      exerciseData,
      studentAnswerText,
      maxScore = 5,
      pedagogicalMemory = {},
    } = req.body;

    if (!studentAnswerText) {
      return res.status(400).json({ error: 'نص إجابة التلميذ مطلوب للتصحيح' });
    }

    const prompt = `
أنت "وكيل التصحيح المعياري وتحديث الذاكرة التعليمية" لمنصة "استدلال | ISTIDLAL" 
الأستاذ الذكي لمادة علوم الطبيعة والحياة للبكالوريا الجزائرية (إعداد: فنكوح عبد الرحيم).

مهمتك:
1. تصحيح إجابة التلميذ وفق شبكة تقويم معيارية ومؤشرات مجزأة بدقة (بخطوات 0.25 نقطة).
2. تقديم تقرير تشخيصي لما وراء المعرفة (Metacognition) تحت عنوان "تشخيص تعثرك":
   - [الجانب المعرفي]: هل وظف المصطلحات الدقيقة وغابت عنه مفاهيم محددة؟
   - [الجانب المنهجي/الإجرائي]: هل تعثر في خطوات الفعل الأدائي (مثلاً: حلل دون استنتاج، أو فسر دون ربط سببي، أو لم يربط بين الملاحظة ودلالتها)؟
   - [الجانب الاستدلالي]: هل ربط النتائج بالحل المنطقي للمشكل؟
   - [نصيحة عملية ملموسة ترفع نقطته في المرة القادمة].
3. تقديم الإجابة النموذجية المهيكلة الكاملة للتمرين.
4. تحديث "الذاكرة التعليمية للأستاذ" (Pedagogical Memory) للتلميذ:
   - تحديث نسب التمكن العلمي والمنهجي (من 0 إلى 100).
   - تحديث المهارات بدرجة الثقة (confidenceScore من 0.1 إلى 1.0)، عدد الأدلة (evidenceCount)، والدليل الملموس من هذه المحاولة (recentEvidence).
   - صياغة توجيه الأستاذ الصريح للجلسة القادمة (nextSessionDirective).

العلامة القصوى للتمرين: ${maxScore} نقاط.
معطيات التمرين والوثائق:
${JSON.stringify(exerciseData || {}, null, 2)}

إجابة التلميذ المراد تصحيحها:
${studentAnswerText}

الذاكرة التعليمية السابقة للتلميذ:
${JSON.stringify(pedagogicalMemory || {}, null, 2)}

المطلوب إخراج JSON مطابق لهذا الهيكل بدقة تامة:
{
  "awardedScore": 3.75, // رقم دقيق بمضاعفات 0.25 لا يتجاوز maxScore
  "maxScore": ${maxScore},
  "overallFeedback": "تعليق تربوي ومشجع شامل من الأستاذ يثمن المجهود ويوضح المحطة الأساسية",
  "rubricBreakdown": [
    {
      "criterionName": "استغلال الوثيقة 1 (الشكل أ): التعريف وتفكيك المعطيات والدلالة",
      "taskType": "استغلال وثيقة",
      "studentExtract": "ما كتبه التلميذ بخصوص هذا المؤشر",
      "correction": "التصويب والملاحظة الدقيقة لما فات التلميذ كتابته",
      "earnedScore": 0.75,
      "maxScore": 1.0,
      "status": "partial" // "mastered" أو "partial" أو "incorrect"
    }
  ],
  "modelAnswer": {
    "introduction": "مقدمة نموذجية إذا كان نصاً علمياً أو تمهيد للحل",
    "documentExploitation": [
      {
        "documentTitle": "الوثيقة 1",
        "definition": "تمثل الوثيقة...",
        "dataAnalysisWithSignificance": "حيث نلاحظ... مما يدل على...",
        "deduction": "ومنه نستنتج أن..."
      }
    ],
    "synthesis": "فقرة التركيب والربط أو حل المشكل العلمي المطروح",
    "conclusion": "خاتمة أو إجابة مختصرة عن المشكل",
    "fullFormattedText": "نص الإجابة النموذجية الكاملة المهيكلة بطريقة منسقة"
  },
  "diagnosticReport": {
    "strengths": [
      "احترام خطوات التعريف بالوثيقة بدقة",
      "استعمال المصطلحات العلمية السليمة (مثال: الموقع الفعال، التخصص الوظيفي)"
    ],
    "weaknesses": [
      "إغفال ذكر الدلالة العلمية للزيادة المسجلة في الوسط",
      "صياغة استنتاج وصفي وليس معلومة مبررة"
    ],
    "cognitiveAspect": "تحليل الجانب المعرفي والمفاهيمي لإجابة التلميذ",
    "methodologicalAspect": "تحليل الجانب المنهجي والإجرائي وخطوات استغلال الوثائق والمهمة المركبة",
    "reasoningAspect": "تحليل الجانب الاستدلالي والربط المنطقي",
    "actionableAdvice": "نصيحة عملية ملموسة محددة ترفع نقطتك بمقدار نقطة على الأقل في الامتحان القادم"
  },
  "memoryUpdate": {
    "scientificMastery": 75,
    "methodologyMastery": 68,
    "skillsUpdated": [
      {
        "id": "doc-exploitation",
        "name": "استغلال الوثائق (تعريف + دلالة + استنتاج)",
        "category": "methodology",
        "status": "improving",
        "confidenceScore": 0.7,
        "evidenceCount": 1,
        "recentEvidence": "قام بالتعريف بالوثيقة لكنه أهمل الدلالة وقفز للاستنتاج"
      },
      {
        "id": "scientific-vocabulary",
        "name": "التوظيف الدقيق للمصطلحات التخصصية",
        "category": "cognitive",
        "status": "mastered",
        "confidenceScore": 0.85,
        "evidenceCount": 1,
        "recentEvidence": "وظف مفاهيم التخصص الوظيفي للبروتينات وشروط الوسط بدقة"
      },
      {
        "id": "synthesis-link",
        "name": "الربط والدمج في المهمة المركبة",
        "category": "reasoning",
        "status": "struggling",
        "confidenceScore": 0.45,
        "evidenceCount": 1,
        "recentEvidence": "واجه صعوبة في صياغة فقرة تركيبية تجمع استنتاجات الوثيقتين"
      }
    ],
    "overcomeDefectsAdded": [
      "تجاوز خطأ إهمال شروط الوسط الذي كان يقع فيه سابقاً"
    ],
    "nextSessionDirective": "في تمرينك القادم: قبل أن تكتب الاستنتاج، اسأل نفسك دائماً 'ماذا تدل هذه النتيجة علمياً؟' ولا تقفز مباشرة للخلاصة."
  }
}
`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = parseJsonFromText(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('GradingAndMemoryAgent Error:', error);
    return res.status(500).json({
      error: 'فشل في التصحيح المعياري للإجابة',
      details: error?.message || String(error),
    });
  }
});

// Vite or Static assets handling
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ISTIDLAL server running on http://localhost:${PORT}`);
  });
}

startServer();
