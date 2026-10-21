/**
 * About & Account Management Tab: عن المنصة والحساب
 * يعرض هوية المنصة وإشراف الأستاذ فنكوح عبد الرحيم ونظام المصادقة بحساب Google
 * إعداد: فنكوح عبد الرحيم
 */
import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  BookOpen,
  ShieldCheck,
  User,
  LogIn,
  LogOut,
  Trash2,
  CheckCircle2,
  Brain,
  MessageSquare,
  FileCheck2,
  GraduationCap,
} from 'lucide-react';
import { User as UserType } from '../types';

interface Props {
  currentUser: UserType;
  onOpenAuth: () => void;
  onLogout: () => void;
  onClearData: () => void;
}

export const AboutAndAuthTab: React.FC<Props> = ({
  currentUser,
  onOpenAuth,
  onLogout,
  onClearData,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Official Identity Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-slate-950 font-black text-3xl shadow-lg shadow-emerald-500/20 shrink-0">
              إ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  استـدلال | ISTIDLAL
                </h2>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500/30">
                  v2.5 Bac
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                أستاذ ذكي يوجّه تلميذ البكالوريا ويصحح إجابته (مادة علوم الطبيعة والحياة)
              </p>
            </div>
          </div>

          <div className="bg-slate-950/80 px-4 py-2.5 rounded-xl border border-emerald-500/30 text-right">
            <div className="text-[11px] text-slate-400">الإشراف البيداغوجي العام</div>
            <div className="text-sm font-black text-emerald-300 flex items-center gap-1.5 justify-end">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>إعداد: فنكوح عبد الرحيم</span>
            </div>
          </div>
        </div>

        {/* Platform Overview */}
        <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            <strong>نبذة عن المنصة:</strong> منصة ذكية ترافق تلميذ البكالوريا (شعبتي علوم تجريبية ورياضيات) في حل تمارينه الخاصة؛ تفهم الوثائق المصوّرة، تحاوره سقراطياً دون إعطائه الحل الجاهز، تصحح إجابته المكتوبة بخط اليد بدقة وفق شبكة تنقيط رسمية (0.25 لكل مؤشر)، وتتذكر نقاط قوته وضعفه في ذاكرة تعليمية تراكمية ومستمرة.
          </p>
          <p className="text-slate-400">
            فلسفتنا الجوهرية الصارمة: <strong>أن يفهم التلميذ عن نفسه وبنفسه</strong>. الأستاذ لا يلقن الإجابة بل يطرح الأسئلة الذكية التي تدفع التلميذ إلى تفكيك السند واستخراج الدلالة والوصول إلى الاستنتاج والتركيب.
          </p>
        </div>
      </div>

      {/* The 4 Specialized Agents Architecture */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-emerald-400" />
            <span>هندسة الوكلاء الأربعة المتخصصين (The 4 Specialized AI Agents)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            منظومة ذكاء اصطناعي متعددة الوكلاء متوافقة كلياً مع المنهجية الرسمية للبكالوريا الجزائرية.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Agent 1 */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-teal-400">
              <span className="w-6 h-6 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center text-xs">1</span>
              <span>وكيل الرؤية وفهم التمرين (VisionExerciseAgent)</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              يقرأ صورة السندات والشروط التجريبية والمنحنيات ويفكك الفعل الأدائي ويصنف المهمة (بسيطة أم مركبة) وفق دليل 2017 ومذكرات 2022 دون إعطاء الحل.
            </p>
          </div>

          {/* Agent 2 */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs">2</span>
              <span>الوكيل السقراطي الموجه (SocraticTutorAgent)</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              يوظف ذاكرة التلميذ السابقة، ويقود حواراً استدراجياً سقراطياً متدرجاً (التعريف، قراءة المتغيرات، الدلالة، الاستنتاج) ممتنعاً عن منح الإجابة الجاهزة قط.
            </p>
          </div>

          {/* Agent 3 */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-blue-400">
              <span className="w-6 h-6 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center text-xs">3</span>
              <span>وكيل قراءة الخط اليدوي (HandwritingOCRAgent)</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              يتعرف بدقة فائقة على الخط اليدوي العربي والرموز والمخططات في ورقة التلميذ أو كراسه ليتمكن من مراجعتها قبل إرسالها للتصحيح.
            </p>
          </div>

          {/* Agent 4 */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 font-bold text-purple-400">
              <span className="w-6 h-6 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center text-xs">4</span>
              <span>وكيل التصحيح المعياري وتحديث الذاكرة (GradingAndMemoryAgent)</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              يقسم العلامة بدقة 0.25 لكل مؤشر، ويقارن بالحل النموذجي، ويصدر تقرير "تشخيص تعثرك" لما وراء المعرفة، ويحدث سجل المهارات ودرجات الثقة.
            </p>
          </div>
        </div>
      </div>

      {/* Official Curriculum References */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-400" />
          <span>المرجعية البيداغوجية والوزارية المعتمدة</span>
        </h3>
        <ul className="text-xs sm:text-sm text-slate-300 space-y-2 leading-relaxed">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>دليل بناء الاختبارات لمادة علوم الطبيعة والحياة (أكتوبر 2017):</strong> معايير تصميم مواضيع البكالوريا، تدرج الصعوبة، وصياغة التعليمات.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>المذكرات المنهجية للمفتشية العامة للبيداغوجيا (2021-2022):</strong> ضوابط التمييز بين المهمة البسيطة (مؤشر مباشر) والمهمة المركبة (استغلال وثائق متعددة ثم التركيب للإجابة عن المشكل).
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>خطوات استغلال الوثائق الثلاث:</strong> التعريف بالسند ➔ تفكيك المعطيات مع الدلالة العلمية ➔ استخراج الاستنتاج الجزئي المبرر.
            </span>
          </li>
        </ul>
      </div>

      {/* Account & Privacy Management Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-400" />
            <span>إدارة الحساب وسجل التلميذ</span>
          </h3>
          <span className="text-xs text-slate-400">عزل كامل لبيانات كل تلميذ</span>
        </div>

        {/* Current User Info */}
        <div className="bg-slate-950/80 p-4 sm:p-5 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-base border border-emerald-500/30 shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">{currentUser.name}</h4>
                {currentUser.isGuest ? (
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
                    جلسة زائر مؤقتة
                  </span>
                ) : (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                    حساب Google موثق
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{currentUser.email}</p>
            </div>
          </div>

          {currentUser.isGuest ? (
            <button
              type="button"
              onClick={onOpenAuth}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition"
            >
              <LogIn className="w-4 h-4" />
              <span>تسجيل الدخول بحساب Google لحفظ سجلك</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onLogout}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>تسجيل الخروج</span>
            </button>
          )}
        </div>

        {/* Danger zone: Clear data */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-bold text-slate-300 block">حذف السجل بالكامل والبدء من الصفر</span>
            <span className="text-slate-500">
              يقوم بحذف جميع التمارين المحلولة والذاكرة التعليمية المسجلة لهذا الحساب نهائياً.
            </span>
          </div>

          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onClearData();
                  setConfirmDelete(false);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold transition"
              >
                تأكيد الحذف النهائي
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
              >
                إلغاء
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="px-4 py-2 rounded-xl bg-rose-950/30 hover:bg-rose-950/60 text-rose-300 border border-rose-500/30 font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>مسح سجلي التعليمي</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
