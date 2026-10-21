/**
 * Step 1: Upload Exercise Image
 * الخطوة 1: تصوير التمرين (كاميرا / ملف / لصق لقطة شاشة) + تحسين الوضوح والترحيب الذكي
 * إعداد: فنكوح عبد الرحيم
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  Upload,
  Clipboard,
  Sparkles,
  Sliders,
  AlertCircle,
  FileText,
  Loader2,
  HelpCircle,
  ArrowLeft,
  GraduationCap,
} from 'lucide-react';
import { PedagogicalMemory } from '../types';
import { ImageAdjusterModal } from './ImageAdjusterModal';

interface Props {
  pedagogicalMemory: PedagogicalMemory;
  onImageSelected: (imageBase64: string) => void;
  isLoading: boolean;
}

export const Step1Upload: React.FC<Props> = ({
  pedagogicalMemory,
  onImageSelected,
  isLoading,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAdjusterOpen, setIsAdjusterOpen] = useState<boolean>(false);
  const [pasteNotice, setPasteNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  // Listen for paste (Ctrl+V) anywhere on this step
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (isLoading) return;
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              const base64 = event.target?.result as string;
              setSelectedImage(base64);
              setPasteNotice('تم لصق لقطة الشاشة من الحافظة بنجاح!');
              setTimeout(() => setPasteNotice(null), 3000);
            };
            reader.readAsDataURL(file);
          }
          break;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [isLoading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = () => {
    if (!selectedImage || isLoading) return;
    onImageSelected(selectedImage);
  };

  const isNewStudent = pedagogicalMemory.totalExercisesSolved === 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Smart Welcome Card */}
      {isNewStudent ? (
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 border border-emerald-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  أهلاً بك في منصة استدلال | ISTIDLAL
                </h2>
                <span className="text-[11px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  تلميذ جديد
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                هذه المنصة صُممت خصيصاً لترافقك في حل تمارينك الخاصة بمادة علوم الطبيعة والحياة.
                لن نعطيك الحل الجاهز؛ بل سأحاورك سقراطياً لتستخرج الدلالة والاستنتاج بنفسك، ثم أصحح خط يدك وفق شبكة التنقيط الرسمية للبكالوريا (بخطوات 0.25 نقطة).
              </p>
              <div className="text-xs font-semibold text-emerald-400 pt-1">
                إشراف: الأستاذ فنكوح عبد الرحيم
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-teal-950/40 border border-teal-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-white">
                  مرحباً بعودتك! توجيه الأستاذ من جلستك السابقة:
                </h2>
                <span className="text-xs font-mono text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-md border border-teal-500/30">
                  {pedagogicalMemory.totalExercisesSolved} تمارين سابقة مكتملة
                </span>
              </div>
              <p className="text-xs sm:text-sm text-teal-200 bg-slate-950/60 p-3 rounded-xl border border-teal-500/20 leading-relaxed font-medium">
                "{pedagogicalMemory.nextSessionDirective || 'انتبه إلى خطوات استغلال الوثائق ولا تقفز مباشرة إلى الاستنتاج دون ربط الملاحظة بالدلالة العلمية.'}"
              </p>
              <div className="text-[11px] text-slate-400 pt-1">
                صوّر تمرينك الجديد لنستمر في صقل مهاراتك الاستدلالية!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Upload Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-1">
            <Camera className="w-6 h-6" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white">
            الخطوة 1: صوّر أو ارفع موضوع التمرين
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            تأكد من وضوح السندات (المنحنيات، الجداول، الرسوم التخطيطية) ونص التعليمة.
          </p>
        </div>

        {/* 3 Upload Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto">
          {/* Camera */}
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-2.5 p-4 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-700/80 hover:border-emerald-500/50 text-slate-200 transition group"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 group-hover:bg-emerald-500/20 text-emerald-400 flex items-center justify-center transition">
              <Camera className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-center">
              تصوير بالكاميرا
            </span>
            <span className="text-[10px] text-slate-400 text-center">
              مباشرة من كراسك أو ورقتك
            </span>
          </button>
          <input
            type="file"
            ref={cameraInputRef}
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* File Upload */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-2.5 p-4 rounded-xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-700/80 hover:border-emerald-500/50 text-slate-200 transition group"
          >
            <div className="w-10 h-10 rounded-full bg-blue-500/10 group-hover:bg-blue-500/20 text-blue-400 flex items-center justify-center transition">
              <Upload className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-center">
              تحميل صورة أو ملف
            </span>
            <span className="text-[10px] text-slate-400 text-center">
              PNG, JPG, WebP
            </span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Paste Clipboard */}
          <div className="flex flex-col items-center justify-center gap-2.5 p-4 rounded-xl bg-slate-950/70 border border-slate-700/80 text-slate-200 text-center relative overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Clipboard className="w-5 h-5" />
            </div>
            <span className="text-xs sm:text-sm font-bold">
              لصق لقطة شاشة
            </span>
            <span className="text-[10px] text-slate-400">
              اضغط <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[9px] border border-slate-700">Ctrl+V</kbd>
            </span>
          </div>
        </div>

        {/* Paste notification message */}
        {pasteNotice && (
          <div className="max-w-md mx-auto p-2 text-center text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg animate-in fade-in">
            {pasteNotice}
          </div>
        )}

        {/* Selected Image Preview & Enhancement Card */}
        {selectedImage && (
          <div className="max-w-xl mx-auto bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300 pb-2 border-b border-slate-800">
              <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                <FileText className="w-4 h-4" />
                معاينة صورة التمرين المختارة
              </span>
              <button
                type="button"
                onClick={() => setIsAdjusterOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700"
              >
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                تحسين التباين والسطوع والتدوير
              </button>
            </div>

            <div className="relative max-h-72 overflow-hidden rounded-lg flex items-center justify-center bg-slate-900 border border-slate-800/80">
              <img
                src={selectedImage}
                alt="Exercise preview"
                className="max-h-72 max-w-full object-contain"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="text-xs text-rose-400 hover:text-rose-300 transition"
              >
                حذف واختيار صورة أخرى
              </button>

              <button
                type="button"
                onClick={handleContinue}
                disabled={isLoading}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جاري تحليل التمرين عبر وكيل الرؤية...</span>
                  </>
                ) : (
                  <>
                    <span>إرسال التمرين وتحليله منهجياً</span>
                    <ArrowLeft className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Guidance Hint */}
        <div className="max-w-2xl mx-auto flex items-start gap-2.5 text-[11px] text-slate-400 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
          <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p>
            <strong>نصيحة الأستاذ:</strong> تأكد أن أرقام الوثائق والمنحنيات وأسماء الشروط التجريبية ظاهرة بوضوح حتى يتمكن "وكيل الرؤية" من تفكيكها بدقة ومساعدتك في خطوات الاستدلال.
          </p>
        </div>
      </div>

      {/* Image Adjuster Modal */}
      {selectedImage && (
        <ImageAdjusterModal
          isOpen={isAdjusterOpen}
          imageSrc={selectedImage}
          onClose={() => setIsAdjusterOpen(false)}
          onApply={(adjusted) => {
            setSelectedImage(adjusted);
            setIsAdjusterOpen(false);
          }}
          title="تحسين وضوح وتباين تمرينك"
        />
      )}
    </div>
  );
};
