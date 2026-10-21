/**
 * Step 5: Official Standardized Grading & Model Answer Comparison
 * الخطوة 5: التصحيح المعياري (0.25 لكل مؤشر) ومقارنة إجابة التلميذ بالإجابة النموذجية
 * إعداد: فنكوح عبد الرحيم
 */
import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  ArrowLeft,
  Sparkles,
  BookOpen,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { GradingResult, ExerciseVisionData } from '../types';

interface Props {
  gradingResult: GradingResult;
  exerciseData: ExerciseVisionData;
  studentAnswerText: string;
  onProceedToDiagnostic: () => void;
}

export const Step5Grading: React.FC<Props> = ({
  gradingResult,
  exerciseData,
  studentAnswerText,
  onProceedToDiagnostic,
}) => {
  const [activeView, setActiveView] = useState<'rubric' | 'model' | 'comparison'>('rubric');
  const [showFullStudentAnswer, setShowFullStudentAnswer] = useState(false);

  const percentage = Math.round(
    (gradingResult.awardedScore / gradingResult.maxScore) * 100
  );

  const getScoreColor = () => {
    if (percentage >= 80) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (percentage >= 50) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Score Header Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                الخطوة 5: التصحيح المعياري الرسمي
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {exerciseData.exerciseTypeLabel}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white">
              تقييم إجابتك في: {exerciseData.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              "{gradingResult.overallFeedback}"
            </p>
          </div>

          {/* Big Score Badge */}
          <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center min-w-[130px] shrink-0 ${getScoreColor()}`}>
            <span className="text-xs text-slate-400 font-bold">العلامة الممنوحة</span>
            <div className="flex items-baseline gap-1 my-1">
              <span className="text-3xl sm:text-4xl font-black tracking-tight">
                {gradingResult.awardedScore.toFixed(2)}
              </span>
              <span className="text-sm text-slate-400 font-bold">
                / {gradingResult.maxScore}
              </span>
            </div>
            <span className="text-xs font-mono font-bold">
              {percentage}% إنجاز
            </span>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 pt-5 mt-4 border-t border-slate-800 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveView('rubric')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition shrink-0 ${
              activeView === 'rubric'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>جدول المؤشرات والمعايير ({gradingResult.rubricBreakdown.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('model')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition shrink-0 ${
              activeView === 'model'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>الإجابة النموذجية المهيكلة</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('comparison')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition shrink-0 ${
              activeView === 'comparison'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>مقارنة ما كتبته بالإجابة الكاملة</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: Rubric Breakdown */}
      {activeView === 'rubric' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>تفكيك الدرجات وفق مؤشرات وزارة التربية الوطنية (0.25 لكل مؤشر دقيق)</span>
            <span>عدد المؤشرات: {gradingResult.rubricBreakdown.length}</span>
          </div>

          <div className="space-y-3">
            {gradingResult.rubricBreakdown.map((item, idx) => {
              const isMastered = item.status === 'mastered';
              const isPartial = item.status === 'partial';

              return (
                <div
                  key={idx}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 transition hover:border-slate-700"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2.5">
                      {isMastered ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : isPartial ? (
                        <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                      )}
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          {item.criterionName}
                        </h4>
                        <span className="text-[11px] text-slate-400">
                          نوع المهمة: {item.taskType}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                        isMastered
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : isPartial
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                      }`}>
                        {isMastered ? 'متقن تماماً' : isPartial ? 'إجابة ناقصة' : 'غير متقن'}
                      </span>
                      <span className="text-xs font-mono font-bold bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-emerald-400">
                        +{item.earnedScore.toFixed(2)} / {item.maxScore.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    {/* Student extract */}
                    <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1">
                      <span className="text-[11px] text-slate-400 font-bold block">
                        ما ورد في إجابتك:
                      </span>
                      <p className="text-slate-300 italic leading-relaxed">
                        "{item.studentExtract || 'لم تذكر هذا المؤشر في إجابتك'}"
                      </p>
                    </div>

                    {/* Correction */}
                    <div className="bg-emerald-950/20 p-3 rounded-xl border border-emerald-500/20 space-y-1">
                      <span className="text-[11px] text-emerald-400 font-bold block">
                        تصويب الأستاذ وما كان ينبغي كتابته:
                      </span>
                      <p className="text-emerald-200/90 leading-relaxed">
                        {item.correction}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: Model Answer */}
      {activeView === 'model' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <span>الإجابة النموذجية المهيكلة وفق المنهجية الرسمية</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              طريقة الصياغة المثالية التي تضمن لك العلامة الكاملة في شهادة البكالوريا.
            </p>
          </div>

          {/* Intro if available */}
          {gradingResult.modelAnswer?.introduction && (
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1.5">
              <span className="text-xs font-bold text-emerald-400">المقدمة وطرح المشكل العلمي:</span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {gradingResult.modelAnswer.introduction}
              </p>
            </div>
          )}

          {/* Document Exploitation */}
          {gradingResult.modelAnswer?.documentExploitation &&
            gradingResult.modelAnswer.documentExploitation.length > 0 && (
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-300 block">
                  استغلال السندات والوثائق (تعريف + دلالة + استنتاج جزئي):
                </span>
                {gradingResult.modelAnswer.documentExploitation.map((doc, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2.5"
                  >
                    <div className="text-xs font-bold text-teal-400 pb-1 border-b border-slate-800">
                      {doc.documentTitle}
                    </div>
                    <div className="text-xs text-slate-300 space-y-1.5 leading-relaxed">
                      <div>
                        <strong className="text-slate-400">1. التعريف بالسند:</strong>{' '}
                        {doc.definition}
                      </div>
                      <div>
                        <strong className="text-slate-400">2. التحليل والدلالة العلمية:</strong>{' '}
                        {doc.dataAnalysisWithSignificance}
                      </div>
                      <div className="text-emerald-300 bg-emerald-950/30 p-2 rounded-lg border border-emerald-500/20">
                        <strong className="text-emerald-400">3. الاستنتاج الجزئي:</strong>{' '}
                        {doc.deduction}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          {/* Synthesis / Resolution */}
          {gradingResult.modelAnswer?.synthesis && (
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1.5">
              <span className="text-xs font-bold text-purple-400">
                التركيب والربط (حل المشكل العلمي):
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {gradingResult.modelAnswer.synthesis}
              </p>
            </div>
          )}

          {/* Conclusion */}
          {gradingResult.modelAnswer?.conclusion && (
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1.5">
              <span className="text-xs font-bold text-blue-400">الخاتمة:</span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {gradingResult.modelAnswer.conclusion}
              </p>
            </div>
          )}

          {/* Full text fallback if structured is brief */}
          {gradingResult.modelAnswer?.fullFormattedText && (
            <div className="bg-slate-950/90 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-400">النص الكامل المنسق:</span>
              <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                {gradingResult.modelAnswer.fullFormattedText}
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: Comparison */}
      {activeView === 'comparison' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Student answer */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300 pb-2 border-b border-slate-800">
              <span>ورقة إجابتك المكتوبة</span>
              <span className="text-[11px] text-slate-500 font-mono">
                {studentAnswerText.length} حرف
              </span>
            </div>
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800 whitespace-pre-wrap max-h-96 overflow-y-auto">
              {studentAnswerText}
            </div>
          </div>

          {/* Model solution summary */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-400 pb-2 border-b border-slate-800">
              <span>ما كان ينتظره المصحح</span>
              <span className="text-[11px] text-emerald-500/80 font-bold">العلامة الكاملة</span>
            </div>
            <div className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800 whitespace-pre-wrap max-h-96 overflow-y-auto">
              {gradingResult.modelAnswer?.fullFormattedText ||
                gradingResult.modelAnswer?.synthesis ||
                'راجع تبويب الإجابة النموذجية أعلاه للاطلاع على الهيكلة الكاملة.'}
            </div>
          </div>
        </div>
      )}

      {/* Student answer collapsible summary toggle */}
      <div className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-3">
        <button
          type="button"
          onClick={() => setShowFullStudentAnswer((prev) => !prev)}
          className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 transition"
        >
          <span>عرض نص إجابتك الكاملة التي تم تصحيحها</span>
          {showFullStudentAnswer ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {showFullStudentAnswer && (
          <div className="mt-3 p-3 bg-slate-950 rounded-lg text-xs text-slate-300 whitespace-pre-wrap border border-slate-800">
            {studentAnswerText}
          </div>
        )}
      </div>

      {/* Bottom Action: Proceed to Diagnostic & Memory */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-xl">
        <div className="text-xs text-slate-400">
          الخطوة التالية تكشف لك التقرير التشخيصي (لما وراء المعرفة) وتحديث مهاراتك في ذاكرة الأستاذ.
        </div>

        <button
          type="button"
          onClick={onProceedToDiagnostic}
          className="w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition"
        >
          <Sparkles className="w-4 h-4" />
          <span>الاطلاع على التقرير التشخيصي وتحديث الذاكرة (الخطوة 6)</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
