/**
 * Step 2: Teacher Understanding & Exercise Breakdown
 * الخطوة 2: فهم الأستاذ للتمرين وتفكيك الفعل الأدائي والسندات
 * إعداد: فنكوح عبد الرحيم
 */
import React, { useState } from 'react';
import {
  Brain,
  Layers,
  HelpCircle,
  FileSearch,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Edit3,
  Award,
  Sparkles,
} from 'lucide-react';
import { ExerciseVisionData } from '../types';

interface Props {
  visionData: ExerciseVisionData;
  onUpdateVisionData: (updated: ExerciseVisionData) => void;
  onProceedToChat: () => void;
  onBackToUpload: () => void;
}

export const Step2VisionAnalysis: React.FC<Props> = ({
  visionData,
  onUpdateVisionData,
  onProceedToChat,
  onBackToUpload,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(visionData.title);
  const [editedDomain, setEditedDomain] = useState(visionData.domain);

  const handleSaveEdit = () => {
    onUpdateVisionData({
      ...visionData,
      title: editedTitle,
      domain: editedDomain,
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  فهم الأستاذ للتمرين
                </span>
                <span className="text-xs font-mono text-slate-400">
                  الخطوة 2 من 6
                </span>
              </div>
              {isEditing ? (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-sm text-white font-bold w-full max-w-sm"
                  />
                  <input
                    type="text"
                    value={editedDomain}
                    onChange={(e) => setEditedDomain(e.target.value)}
                    placeholder="المجال / الوحدة"
                    className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-300"
                  />
                  <button
                    onClick={handleSaveEdit}
                    className="px-3 py-1 bg-emerald-500 text-slate-950 text-xs font-bold rounded-lg"
                  >
                    حفظ
                  </button>
                </div>
              ) : (
                <h2 className="text-lg sm:text-xl font-black text-white mt-0.5 flex items-center gap-2">
                  <span>{visionData.title}</span>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-slate-500 hover:text-slate-300 p-1 transition"
                    title="تعديل العنوان"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </h2>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-teal-500/10 text-teal-300 border border-teal-500/30">
              <Award className="w-3.5 h-3.5" />
              {visionData.exerciseTypeLabel}
            </span>
            <span className="px-2.5 py-1 rounded-xl text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
              المجال: {visionData.domain || 'علوم الطبيعة والحياة'}
            </span>
          </div>
        </div>

        {/* Action Verbs & Instructions Decomposition */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>تفكيك التعليمات والأفعال الأدائية (دليل بناء الاختبار 2017 ومذكرات 2022)</span>
          </h3>

          <div className="space-y-3">
            {visionData.instructions.map((inst, idx) => (
              <div
                key={idx}
                className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center text-xs font-bold">
                      {inst.number || idx + 1}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {inst.text}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                      الفعل الأدائي: {inst.actionVerb}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                      inst.taskType === 'مهمة مركبة'
                        ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                        : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    }`}>
                      {inst.taskType}
                    </span>
                  </div>
                </div>

                {/* Steps required */}
                {inst.requiredSteps && inst.requiredSteps.length > 0 && (
                  <div className="pt-1.5 border-t border-slate-900/90">
                    <div className="text-[11px] text-slate-400 font-semibold mb-1">
                      الخطوات المنهجية الرسمية للإجابة عن هذه التعليمة:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {inst.requiredSteps.map((step, sIdx) => (
                        <div
                          key={sIdx}
                          className="flex items-start gap-1.5 text-xs text-slate-300 bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-800/80"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Deconstructed Documents */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <FileSearch className="w-4 h-4 text-emerald-400" />
            <span>السندات والوثائق المستخرجة من التمرين</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {visionData.contextAndDocuments.map((doc, idx) => (
              <div
                key={idx}
                className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-3.5 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-400 pb-1.5 border-b border-slate-800/80">
                    <span>{doc.documentId || `سند ${idx + 1}`}</span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      {doc.documentTitle}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 pt-1.5 leading-relaxed">
                    {doc.description}
                  </p>
                  {doc.experimentalConditions && (
                    <div className="text-[11px] text-slate-400 mt-2 bg-slate-900/70 p-2 rounded-lg border border-slate-800">
                      <strong className="text-slate-300">الشروط التجريبية:</strong>{' '}
                      {doc.experimentalConditions}
                    </div>
                  )}
                  {doc.observations && (
                    <div className="text-[11px] text-slate-400 mt-1.5 bg-slate-900/70 p-2 rounded-lg border border-slate-800">
                      <strong className="text-slate-300">النتائج والملاحظات:</strong>{' '}
                      {doc.observations}
                    </div>
                  )}
                </div>

                <div className="text-[11px] text-teal-300 bg-teal-950/30 border border-teal-500/20 p-2 rounded-lg mt-2">
                  <span className="font-bold">المقصد المنهجي للاستنتاج:</span>{' '}
                  {doc.expectedDeductionFocus}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Common Pitfalls Card */}
        {visionData.methodologyBreakdown?.commonPitfallsToAvoid?.length > 0 && (
          <div className="bg-amber-950/20 border border-amber-500/30 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>فخاخ وأخطاء شائعة احذر الوقوع فيها في هذا النمط:</span>
            </div>
            <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
              {visionData.methodologyBreakdown.commonPitfallsToAvoid.map(
                (pitfall, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {pitfall}
                  </li>
                )
              )}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBackToUpload}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs sm:text-sm text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition flex items-center justify-center gap-1.5"
          >
            <ArrowRight className="w-4 h-4" />
            <span>تصوير تمرين آخر</span>
          </button>

          <button
            type="button"
            onClick={onProceedToChat}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>الانتقال للمرافقة السقراطية (الخطوة 3)</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
