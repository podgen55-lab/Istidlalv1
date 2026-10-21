/**
 * History Tab: سجل محاولاتي
 * يعرض التمارين التي حلها التلميذ فعلياً فقط (صفر بيانات وهمية مسبقة)
 * إعداد: فنكوح عبد الرحيم
 */
import React, { useState } from 'react';
import {
  History,
  Calendar,
  Award,
  ChevronLeft,
  FileText,
  Camera,
  Layers,
  Sparkles,
  ArrowRight,
  X,
} from 'lucide-react';
import { SavedExerciseAttempt } from '../types';

interface Props {
  attempts: SavedExerciseAttempt[];
  onOpenSessionWithAttempt?: (attempt: SavedExerciseAttempt) => void;
  onGoToSession: () => void;
}

export const HistoryTab: React.FC<Props> = ({
  attempts,
  onGoToSession,
}) => {
  const [selectedAttempt, setSelectedAttempt] = useState<SavedExerciseAttempt | null>(null);

  if (attempts.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 sm:p-12 text-center space-y-4 shadow-xl max-w-xl mx-auto my-8">
        <div className="w-14 h-14 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
          <History className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-base sm:text-lg font-bold text-white">
            سجل محاولاتك فارغ تماماً
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            وفق ميثاق المنصة الصارم (صفر بيانات وهمية مسبقة)، لن تظهر هنا أي بيانات أو علامات حتى تقوم بحل تمرينك الأول بنفسك.
          </p>
        </div>
        <div className="pt-2">
          <button
            type="button"
            onClick={onGoToSession}
            className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 inline-flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition"
          >
            <Camera className="w-4 h-4" />
            <span>تصوير أول تمرين لبدء سجلك</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white">سجل محاولاتي وتصحيحاتي السابقة</h2>
            <p className="text-xs text-slate-400">
              إجمالي التمارين المحلولة والمصححة: {attempts.length} تمرين
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onGoToSession}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center gap-1.5 transition"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>حل تمرين جديد</span>
        </button>
      </div>

      {/* Attempts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {attempts.map((attempt) => {
          const percentage = Math.round(
            (attempt.gradingResult.awardedScore / attempt.gradingResult.maxScore) * 100
          );
          return (
            <div
              key={attempt.id}
              onClick={() => setSelectedAttempt(attempt)}
              className="bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 space-y-3 cursor-pointer transition shadow-lg group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {attempt.visionData.exerciseTypeLabel}
                  </span>
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition line-clamp-1">
                    {attempt.visionData.title}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-0.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{attempt.date}</span>
                    <span>•</span>
                    <span>{attempt.visionData.domain || 'علوم الطبيعة والحياة'}</span>
                  </div>
                </div>

                <div className="text-left shrink-0">
                  <div className="text-lg font-black text-emerald-400 font-mono">
                    {attempt.gradingResult.awardedScore} / {attempt.gradingResult.maxScore}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono text-left">
                    {percentage}%
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 line-clamp-2 italic">
                "{attempt.gradingResult.overallFeedback}"
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <span className="flex items-center gap-1 text-[11px]">
                  <Layers className="w-3.5 h-3.5 text-teal-400" />
                  {attempt.gradingResult.rubricBreakdown.length} مؤشرات مصححة
                </span>
                <span className="text-emerald-400 group-hover:translate-x-[-2px] transition flex items-center gap-1 text-xs font-semibold">
                  <span>مراجعة التفاصيل</span>
                  <ChevronLeft className="w-4 h-4" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Attempt Details Modal */}
      {selectedAttempt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
              <div>
                <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {selectedAttempt.visionData.exerciseTypeLabel}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                  {selectedAttempt.visionData.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAttempt(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              {/* Score & General feedback */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">العلامة المسجلة</span>
                  <div className="text-2xl font-black text-emerald-400 font-mono">
                    {selectedAttempt.gradingResult.awardedScore} / {selectedAttempt.gradingResult.maxScore}
                  </div>
                </div>
                <div className="text-xs text-slate-400 text-left">
                  <span>تاريخ المحاولة: {selectedAttempt.date}</span>
                </div>
              </div>

              {/* Rubric Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300">
                  جدول مؤشرات التنقيط الرسمية:
                </h4>
                <div className="space-y-2">
                  {selectedAttempt.gradingResult.rubricBreakdown.map((r, i) => (
                    <div
                      key={i}
                      className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs space-y-1.5"
                    >
                      <div className="flex justify-between items-center text-slate-200 font-bold">
                        <span>{r.criterionName}</span>
                        <span className="text-emerald-400 font-mono">
                          +{r.earnedScore} / {r.maxScore}
                        </span>
                      </div>
                      <div className="text-slate-400">
                        <strong className="text-slate-300">ما كتبته:</strong> "{r.studentExtract}"
                      </div>
                      <div className="text-emerald-300/90">
                        <strong className="text-emerald-400">التصويب:</strong> {r.correction}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Diagnostic report summary */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-purple-400">
                  ملخص تقرير ما وراء المعرفة لتلك المحاولة:
                </h4>
                <div className="text-xs text-slate-300 space-y-1.5">
                  <div>
                    <strong className="text-teal-400">الجانب المعرفي:</strong>{' '}
                    {selectedAttempt.gradingResult.diagnosticReport.cognitiveAspect}
                  </div>
                  <div>
                    <strong className="text-blue-400">الجانب المنهجي:</strong>{' '}
                    {selectedAttempt.gradingResult.diagnosticReport.methodologicalAspect}
                  </div>
                  <div>
                    <strong className="text-purple-400">الجانب الاستدلالي:</strong>{' '}
                    {selectedAttempt.gradingResult.diagnosticReport.reasoningAspect}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedAttempt(null)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
