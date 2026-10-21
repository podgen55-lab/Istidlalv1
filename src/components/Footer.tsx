/**
 * Footer Component for ISTIDLAL
 * يبرز إعداد الأستاذ فنكوح عبد الرحيم والمرجعية البيداغوجية الرسمية
 */
import React from 'react';
import { Sparkles, ShieldCheck, BookOpen, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/80 text-slate-400 text-xs py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-slate-800">
        {/* Col 1: Platform & Author */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <span className="w-6 h-6 rounded-md bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xs">
              إ
            </span>
            <span>استدلال | ISTIDLAL</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            منصة الأستاذ الذكي لمادة علوم الطبيعة والحياة لمرافقة تلاميذ البكالوريا بالجزائر.
            فلسفتنا: تمكين التلميذ من أن "يفهم عن نفسه وبنفسه" دون تقديم حلول جاهزة.
          </p>
          <div className="pt-1 text-emerald-400 font-bold text-xs flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>إعداد وإشراف: الأستاذ فنكوح عبد الرحيم</span>
          </div>
        </div>

        {/* Col 2: Pedagogical Framework */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-200 font-semibold text-xs">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>المرجعية المنهجية الرسمية</span>
          </div>
          <ul className="space-y-1.5 text-slate-400 text-[11px] leading-relaxed">
            <li>• دليل بناء الاختبارات الرسمي للبكالوريا (أكتوبر 2017).</li>
            <li>• المذكرات المنهجية للمفتشية العامة للبيداغوجيا (2021-2022).</li>
            <li>• شبكات التقويم المعياري بمؤشرات مجزأة (0.25 لكل مؤشر).</li>
            <li>• التمييز بين المهمات البسيطة والمهمات المركبة والاستدلال العلمي.</li>
          </ul>
        </div>

        {/* Col 3: Principles & Privacy */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-slate-200 font-semibold text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>مبادئ الاستعمال والخصوصية</span>
          </div>
          <ul className="space-y-1.5 text-slate-400 text-[11px] leading-relaxed">
            <li>• <strong className="text-slate-300">صفر بيانات وهمية:</strong> سجلك نظيف تماماً حتى ترفع تمرينك الحقيقي.</li>
            <li>• <strong className="text-slate-300">خصوصية تامة:</strong> تعزل بيانات كل تلميذ بالكامل مع إمكانية حذفها بأي لحظة.</li>
            <li>• <strong className="text-slate-300">ذاكرة تعليمية تراكمية:</strong> يتعلم الأستاذ من أخطائك ليوجهك بدقة في تمرينك القادم.</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
        <div>
          جميع الحقوق محفوظة © {new Date().getFullYear()} - منصة استدلال (مادة علوم الطبيعة والحياة)
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <Award className="w-3.5 h-3.5 text-emerald-400" />
          <span>المعدّ والمشرف البيداغوجي: فنكوح عبد الرحيم</span>
        </div>
      </div>
    </footer>
  );
};
