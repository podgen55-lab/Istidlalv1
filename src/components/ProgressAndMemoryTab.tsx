/**
 * Progress & Teacher Memory Tab: تطوري وذاكرة الأستاذ
 * يعرض لوحة تقدم التلميذ، درجات الثقة في المهارات، والأدلة المرصودة
 * إعداد: فنكوح عبد الرحيم
 */
import React from 'react';
import {
  BrainCircuit,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ShieldCheck,
  Calendar,
  Sparkles,
  Camera,
} from 'lucide-react';
import { PedagogicalMemory } from '../types';

interface Props {
  pedagogicalMemory: PedagogicalMemory;
  onGoToSession: () => void;
}

export const ProgressAndMemoryTab: React.FC<Props> = ({
  pedagogicalMemory,
  onGoToSession,
}) => {
  const isNewStudent = pedagogicalMemory.totalExercisesSolved === 0;

  if (isNewStudent) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 sm:p-12 text-center space-y-4 shadow-xl max-w-xl mx-auto my-8">
        <div className="w-14 h-14 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
          <BrainCircuit className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-base sm:text-lg font-bold text-white">
            الذاكرة التعليمية قيد التهيئة
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            المنصة لا تولد أي مهارات أو نسب وهمية. بمجرد أن ترفع تمرينك الأول وتكتب حلك، سيبدأ الأستاذ في بناء خريطة مهاراتك ورصد أدلتك التعليمية بدقة.
          </p>
        </div>
        <div className="pt-2">
          <button
            type="button"
            onClick={onGoToSession}
            className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 inline-flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition"
          >
            <Camera className="w-4 h-4" />
            <span>حل تمرينك الأول لبدء ذاكرة الأستاذ</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Solved */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>التمارين المحلولة</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {pedagogicalMemory.totalExercisesSolved}
          </div>
          <p className="text-[11px] text-emerald-400">
            تمارين حقيقية رفعتها وصححتها
          </p>
        </div>

        {/* Average Score */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>معدل العلامات العام</span>
            <TrendingUp className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {pedagogicalMemory.averageScore}%
          </div>
          <p className="text-[11px] text-teal-400">
            متوسط درجاتك عبر المحاولات
          </p>
        </div>

        {/* Scientific Mastery */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>التمكن العلمي والمفاهيمي</span>
            <Sparkles className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">
            {pedagogicalMemory.scientificMastery}%
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-400 h-full rounded-full"
              style={{ width: `${pedagogicalMemory.scientificMastery}%` }}
            />
          </div>
        </div>

        {/* Methodology Mastery */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>منهجية الاستدلال والربط</span>
            <BrainCircuit className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-400 font-mono">
            {pedagogicalMemory.methodologyMastery}%
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-purple-400 h-full rounded-full"
              style={{ width: `${pedagogicalMemory.methodologyMastery}%` }}
            />
          </div>
        </div>
      </div>

      {/* Teacher's Next Directive Card */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950/30 to-slate-900 border border-teal-500/30 rounded-2xl p-5 sm:p-6 shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-teal-400">
          <ShieldCheck className="w-4 h-4" />
          <span>توجيه الأستاذ المستمر لجلساتك:</span>
        </div>
        <p className="text-xs sm:text-sm text-teal-100 leading-relaxed font-medium">
          "{pedagogicalMemory.nextSessionDirective || 'استمر في تفكيك معطيات السند وربطها بالدلالة البيولوجية قبل صياغة الاستنتاج.'}"
        </p>
      </div>

      {/* Skills breakdown with Confidence & Evidence */}
      {pedagogicalMemory.skills.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-emerald-400" />
                <span>سجل المهارات المعتمدة ودرجة ثقة الأستاذ فيها (Confidence %)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                تتطور درجة الثقة بعدد التمارين التي أثبت فيها التلميذ إتقانه أو تعثره.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {pedagogicalMemory.skills.length} مهارات مرصودة
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {pedagogicalMemory.skills.map((skill) => {
              const confPercent = Math.round(skill.confidenceScore * 100);
              const isMastered = skill.status === 'mastered';
              const isImproving = skill.status === 'improving';

              return (
                <div
                  key={skill.id}
                  className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-white line-clamp-1">
                        {skill.name}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 ${
                        isMastered
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : isImproving
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                      }`}>
                        {isMastered ? 'متقنة' : isImproving ? 'في تحسن' : 'بحاجة لتدريب'}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed italic bg-slate-900/60 p-2 rounded-lg border border-slate-800/80">
                      "{skill.recentEvidence || 'تم رصد هذه المهارة في إجابتك الأخيرة.'}"
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-900">
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>درجة الثقة: {confPercent}%</span>
                      <span>الأدلة المرصودة: {skill.evidenceCount}</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          confPercent >= 75
                            ? 'bg-emerald-400'
                            : confPercent >= 50
                            ? 'bg-amber-400'
                            : 'bg-rose-400'
                        }`}
                        style={{ width: `${confPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Overcome Defects */}
      {pedagogicalMemory.overcomeDefects.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>الأخطاء والعثرات التي نجحت في تجاوزها بفضل المرافقة:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {pedagogicalMemory.overcomeDefects.map((defect, idx) => (
              <div
                key={idx}
                className="bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-200 p-2.5 rounded-xl flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span>{defect}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Score Progression History */}
      {pedagogicalMemory.scoreHistory.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-300 pb-2 border-b border-slate-800">
            <span className="font-bold flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-400" />
              تطور العلامات عبر الزمن
            </span>
            <span className="text-slate-500">
              {pedagogicalMemory.scoreHistory.length} محاولات
            </span>
          </div>

          <div className="space-y-2">
            {pedagogicalMemory.scoreHistory.map((h, i) => (
              <div
                key={i}
                className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-200 block">{h.title}</span>
                  <span className="text-[10px] text-slate-500">
                    {h.date} • {h.exerciseType}
                  </span>
                </div>
                <div className="text-emerald-400 font-mono font-bold text-sm">
                  {h.score} / {h.maxScore}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
