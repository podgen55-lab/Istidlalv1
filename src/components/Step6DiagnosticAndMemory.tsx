/**
 * Step 6: Metacognitive Diagnostic Report & Teacher Memory Update
 * الخطوة 6: التقرير التشخيصي (لما وراء المعرفة) وتحديث الذاكرة التعليمية
 * مع ميزة تصدير وتحميل التقرير بصيغة PDF
 * إعداد: فنكوح عبد الرحيم
 */
import React, { useState, useRef } from 'react';
import {
  BrainCircuit,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Award,
  Download,
  Loader2,
  FileDown,
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  GradingResult,
  ExerciseVisionData,
  PedagogicalMemory,
} from '../types';

interface Props {
  gradingResult: GradingResult;
  exerciseData: ExerciseVisionData;
  pedagogicalMemory: PedagogicalMemory;
  onStartNewExercise: () => void;
}

export const Step6DiagnosticAndMemory: React.FC<Props> = ({
  gradingResult,
  exerciseData,
  pedagogicalMemory,
  onStartNewExercise,
}) => {
  const [copied, setCopied] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);

  const reportContainerRef = useRef<HTMLDivElement | null>(null);

  const diag = gradingResult.diagnosticReport;
  const memUpdate = gradingResult.memoryUpdate;

  const handleCopyReport = () => {
    const reportText = `
══════════════════════════════════════════
📋 تقرير تشخيص إجابة التلميذ - منصة استدلال
══════════════════════════════════════════
التمرين: ${exerciseData.title} (${exerciseData.exerciseTypeLabel})
العلامة الممنوحة: ${gradingResult.awardedScore} / ${gradingResult.maxScore}

1️⃣ نقاط القوة المرصودة:
${diag.strengths.map((s) => `• ${s}`).join('\n')}

2️⃣ الأخطاء العلمية والمنهجية التي ضيعت النقاط:
${diag.weaknesses.map((w) => `• ${w}`).join('\n')}

3️⃣ تشخيص ما وراء المعرفة (Metacognition):
• الجانب المعرفي والمفاهيمي: ${diag.cognitiveAspect}
• الجانب المنهجي والإجرائي: ${diag.methodologicalAspect}
• الجانب الاستدلالي والربط: ${diag.reasoningAspect}

💡 نصيحة عملية ملموسة للمرة القادمة:
${diag.actionableAdvice}

📌 توجيه الأستاذ للجلسة القادمة:
"${memUpdate.nextSessionDirective}"
══════════════════════════════════════════
منصة استدلال | ISTIDLAL - الأستاذ الذكي لمادة علوم الطبيعة والحياة
إعداد وإشراف: الأستاذ فنكوح عبد الرحيم
══════════════════════════════════════════
`.trim();

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleDownloadPdf = async () => {
    if (isGeneratingPdf || !reportContainerRef.current) return;
    setIsGeneratingPdf(true);

    try {
      const element = reportContainerRef.current;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#090d16',
        windowWidth: element.scrollWidth,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;

      // Add extra pages if report is long
      while (heightLeft > 0) {
        position -= pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }

      const safeTitle = (exerciseData.title || 'تمرين')
        .replace(/[/\\?%*:|"<>]/g, '-')
        .trim();
      pdf.save(`تقرير_تشخيص_استدلال_${safeTitle}.pdf`);

      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3500);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner with Action Buttons */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  الخطوة 6: التقرير التشخيصي وتحديث الذاكرة
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {exerciseData.title}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                تقرير تشخيص تعثرك لما وراء المعرفة (Metacognition)
              </h2>
            </div>
          </div>

          {/* Action Buttons: Download PDF, Copy, Start New */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Download PDF Button */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 flex items-center gap-2 transition shadow-md shadow-emerald-500/20 disabled:opacity-60"
              title="تصدير وتحميل التقرير بصيغة PDF للرجوع إليه لاحقاً"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري إنشاء PDF...</span>
                </>
              ) : pdfSuccess ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>تم تحميل PDF بنجاح!</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  <span>تحميل التقرير (PDF)</span>
                </>
              )}
            </button>

            {/* Copy report */}
            <button
              type="button"
              onClick={handleCopyReport}
              className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 transition"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">تم نسخ التقرير!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>نسخ التقرير</span>
                </>
              )}
            </button>

            {/* Start New Exercise */}
            <button
              type="button"
              onClick={onStartNewExercise}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-2 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>تمرين جديد</span>
            </button>
          </div>
        </div>
      </div>

      {/* Printable Report Container (captured by html2canvas for PDF export) */}
      <div ref={reportContainerRef} className="space-y-6 p-1 bg-[#090d16] rounded-2xl">
        {/* Official PDF Document Header Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg">
                إ
              </div>
              <div>
                <div className="text-xs text-emerald-400 font-bold">
                  الجمهورية الجزائرية الديمقراطية الشعبية 🇩🇿
                </div>
                <h3 className="text-base sm:text-lg font-black text-white">
                  منصة استدلال | ISTIDLAL - تقرير التصحيح والتشخيص البيداغوجي
                </h3>
                <div className="text-xs text-slate-400">
                  مادة علوم الطبيعة والحياة • شهادة البكالوريا
                </div>
              </div>
            </div>

            <div className="text-right bg-slate-950/80 px-4 py-2 rounded-xl border border-emerald-500/30">
              <div className="text-[11px] text-slate-400">الإشراف البيداغوجي</div>
              <div className="text-xs sm:text-sm font-black text-emerald-300 flex items-center gap-1.5 justify-end">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>إعداد: فنكوح عبد الرحيم</span>
              </div>
            </div>
          </div>

          {/* Exercise Meta Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            <div>
              <span className="text-slate-500 block text-[11px]">موضوع التمرين:</span>
              <strong className="text-white truncate block">{exerciseData.title}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">نمط التمرين:</span>
              <strong className="text-teal-400">{exerciseData.exerciseTypeLabel}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">العلامة الممنوحة:</span>
              <strong className="text-emerald-400 text-sm font-mono">
                {gradingResult.awardedScore} / {gradingResult.maxScore} نقطة
              </strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">تاريخ التشخيص:</span>
              <strong className="text-slate-300">
                {new Date().toLocaleDateString('ar-DZ', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </strong>
            </div>
          </div>
        </div>

        {/* Strengths & Weaknesses 2-Col Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 space-y-3 shadow-lg">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm border-b border-slate-800 pb-2.5">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>نقاط القوة التي أتقنتها في هذه المحاولة</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {diag.strengths.map((s, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-500/20 leading-relaxed"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="bg-slate-900 border border-rose-500/30 rounded-2xl p-5 space-y-3 shadow-lg">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm border-b border-slate-800 pb-2.5">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>الأخطاء العلمية والمنهجية التي ضيعت عليك النقاط</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300">
              {diag.weaknesses.map((w, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 bg-rose-950/20 p-2.5 rounded-xl border border-rose-500/20 leading-relaxed"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* The 3 Metacognitive Pillars */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>الأبعاد الثلاثة لتشخيص تعثرك المنهجي (وفق توجيهات المفتشية العامة للبيداغوجيا)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Cognitive */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-teal-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-teal-400" />
                1. الجانب المعرفي والمفاهيمي
              </div>
              <p className="text-slate-300 leading-relaxed">
                {diag.cognitiveAspect}
              </p>
            </div>

            {/* Methodological */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-blue-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                2. الجانب المنهجي والإجرائي
              </div>
              <p className="text-slate-300 leading-relaxed">
                {diag.methodologicalAspect}
              </p>
            </div>

            {/* Reasoning */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-purple-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                3. الجانب الاستدلالي والربط
              </div>
              <p className="text-slate-300 leading-relaxed">
                {diag.reasoningAspect}
              </p>
            </div>
          </div>

          {/* Actionable Advice Card */}
          <div className="bg-gradient-to-r from-emerald-950/40 via-slate-950 to-teal-950/40 p-4 rounded-xl border border-emerald-500/30 flex items-start gap-3 mt-4">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold text-emerald-400 block">
                نصيحة عملية ملموسة ترفع علامتك في الامتحان القادم:
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {diag.actionableAdvice}
              </p>
            </div>
          </div>
        </div>

        {/* Teacher's Memory Update Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>كيف تحدّثت «الذاكرة التعليمية للأستاذ» بعد هذه المحاولة؟</span>
            </div>
            <span className="text-xs text-slate-400">
              تراكم ذكي مستمر لمهاراتك بدون بيانات وهمية
            </span>
          </div>

          {/* Mastery Gauges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Scientific Mastery */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">إتقان المعارف والمصطلحات العلمية</span>
                <span className="text-emerald-400 font-mono font-bold">
                  {memUpdate.scientificMastery}%
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${memUpdate.scientificMastery}%` }}
                />
              </div>
            </div>

            {/* Methodology Mastery */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-semibold">إتقان منهجية الاستدلال والمهمات المركبة</span>
                <span className="text-teal-400 font-mono font-bold">
                  {memUpdate.methodologyMastery}%
                </span>
              </div>
              <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-teal-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${memUpdate.methodologyMastery}%` }}
                />
              </div>
            </div>
          </div>

          {/* Skills Tracked with Confidence & Evidence */}
          {memUpdate.skillsUpdated && memUpdate.skillsUpdated.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-300 block">
                المهارات المرصودة والمحدثة في ملفك:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {memUpdate.skillsUpdated.map((skill, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                        <span>{skill.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                          skill.status === 'mastered'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : skill.status === 'improving'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        }`}>
                          {skill.status === 'mastered'
                            ? 'متقنة'
                            : skill.status === 'improving'
                            ? 'في تحسن'
                            : 'بحاجة لتكثيف'}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 mt-2 italic leading-relaxed">
                        "{skill.recentEvidence}"
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>درجة الثقة: {Math.round(skill.confidenceScore * 100)}%</span>
                      <span>الأدلة المرصودة: {skill.evidenceCount || 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Teacher's Next Directive */}
          <div className="bg-slate-950 p-4 rounded-xl border border-teal-500/30 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-400">
              <Award className="w-4 h-4" />
              <span>توجيه الأستاذ المسجل لجلسة تمرينك القادمة:</span>
            </div>
            <p className="text-xs sm:text-sm text-teal-200 font-medium leading-relaxed">
              "{memUpdate.nextSessionDirective}"
            </p>
          </div>
        </div>

        {/* Official Certificate Signature Bar in Printable Report */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            تم إصدار هذا التقرير آلياً عبر منصة <strong>استدلال | ISTIDLAL</strong>
          </div>
          <div className="font-bold text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>إعداد وإشراف: الأستاذ فنكوح عبد الرحيم</span>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-slate-900 rounded-2xl border border-slate-800">
        <div className="text-xs text-slate-400 text-center sm:text-right">
          منصة استدلال | ISTIDLAL — <strong className="text-emerald-400">إعداد وإشراف: الأستاذ فنكوح عبد الرحيم</strong>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Download button also accessible at the bottom */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex-1 sm:flex-initial px-5 py-3 rounded-xl font-bold text-xs sm:text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-2 transition"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>تحميل التقرير (PDF)</span>
          </button>

          <button
            type="button"
            onClick={onStartNewExercise}
            className="flex-1 sm:flex-initial px-7 py-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition"
          >
            <RotateCcw className="w-4 h-4" />
            <span>بدء تمرين جديد</span>
          </button>
        </div>
      </div>
    </div>
  );
};
