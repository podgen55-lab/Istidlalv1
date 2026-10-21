/**
 * Step 4: Photograph Student's Handwritten Answer & OCR Review
 * الخطوة 4: تصوير ورقة إجابة التلميذ المكتوبة بخط اليد وقراءتها بدقة
 * إعداد: فنكوح عبد الرحيم
 */
import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  FileCheck2,
  Sliders,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Edit,
  Sparkles,
  HelpCircle,
  Type,
} from 'lucide-react';
import { ApiClient } from '../services/apiClient';
import { ImageAdjusterModal } from './ImageAdjusterModal';

interface Props {
  onProceedToGrading: (answerText: string, answerImageBase64?: string) => void;
  onBackToChat: () => void;
  isLoading: boolean;
}

export const Step4AnswerUpload: React.FC<Props> = ({
  onProceedToGrading,
  onBackToChat,
  isLoading,
}) => {
  const [answerImage, setAnswerImage] = useState<string | null>(null);
  const [transcribedText, setTranscribedText] = useState<string>('');
  const [ocrConfidence, setOcrConfidence] = useState<string | null>(null);
  const [detectedDrawings, setDetectedDrawings] = useState<string | null>(null);
  const [isOcrProcessing, setIsOcrProcessing] = useState<boolean>(false);
  const [isAdjusterOpen, setIsAdjusterOpen] = useState<boolean>(false);
  const [inputMode, setInputMode] = useState<'upload' | 'text'>('upload');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setAnswerImage(base64);
      runOcr(base64);
    };
    reader.readAsDataURL(file);
  };

  const runOcr = async (base64Data: string) => {
    setIsOcrProcessing(true);
    try {
      const res = await ApiClient.transcribeHandwriting(base64Data);
      setTranscribedText(res.transcribedText || '');
      setOcrConfidence(res.confidenceNote || null);
      setDetectedDrawings(res.detectedDrawingsOrSchemes || null);
    } catch (err: any) {
      console.error('OCR Error:', err);
      // Fallback empty prompt for student
      setTranscribedText(
        'تعذر استخراج النص تلقائياً بجودة عالية. يرجى كتابة أو تعديل إجابتك هنا يدوياً قبل التصحيح.'
      );
    } finally {
      setIsOcrProcessing(false);
    }
  };

  const handleSubmit = () => {
    if (!transcribedText.trim()) return;
    onProceedToGrading(transcribedText, answerImage || undefined);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToChat}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                الخطوة 4 من 6
              </span>
              <span className="text-xs text-slate-400">
                تسجيل إجابة التلميذ
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-white mt-0.5">
              صوّر ورقة إجابتك أو كراسك بخط اليد
            </h2>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setInputMode('upload')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              inputMode === 'upload'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>تصوير الخط اليدوي</span>
          </button>
          <button
            type="button"
            onClick={() => setInputMode('text')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              inputMode === 'text'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>كتابة الإجابة مباشرة</span>
          </button>
        </div>
      </div>

      {inputMode === 'upload' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl">
          {!answerImage ? (
            <div className="space-y-6">
              <div className="text-center space-y-2 max-w-md mx-auto">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto">
                  <Camera className="w-6 h-6" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  التقط صورة واضحة لما كتبته في كراسك
                </h3>
                <p className="text-xs text-slate-400">
                  سيقوم "وكيل قراءة الخط اليدوي" باستخراج حلك بالكامل لتراجعه قبل التصحيح الرسمي.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-2 p-5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 text-slate-200 transition"
                >
                  <Camera className="w-6 h-6 text-emerald-400" />
                  <span className="text-xs sm:text-sm font-bold">
                    فتح الكاميرا للتصوير
                  </span>
                  <span className="text-[10px] text-slate-400">
                    تصوير مباشر لكراسك
                  </span>
                </button>
                <input
                  type="file"
                  ref={cameraInputRef}
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleImageFile(f);
                  }}
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-2 p-5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 text-slate-200 transition"
                >
                  <Upload className="w-6 h-6 text-blue-400" />
                  <span className="text-xs sm:text-sm font-bold">
                    تحميل صورة الورقة
                  </span>
                  <span className="text-[10px] text-slate-400">
                    ملف من الجهاز
                  </span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleImageFile(f);
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Preview */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                    <FileCheck2 className="w-4 h-4" />
                    صورة ورقة الإجابة
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAdjusterOpen(true)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs"
                  >
                    <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                    تحسين التباين
                  </button>
                </div>

                <div className="bg-slate-950 rounded-xl border border-slate-800 p-2 flex items-center justify-center max-h-72 overflow-hidden">
                  <img
                    src={answerImage}
                    alt="Answer sheet"
                    className="max-h-64 object-contain rounded"
                  />
                </div>

                <div className="flex justify-between items-center text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setAnswerImage(null);
                      setTranscribedText('');
                    }}
                    className="text-rose-400 hover:text-rose-300"
                  >
                    إلغاء وإعادة التصوير
                  </button>
                  <button
                    type="button"
                    onClick={() => runOcr(answerImage)}
                    disabled={isOcrProcessing}
                    className="text-teal-400 hover:text-teal-300 flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    إعادة قراءة الخط
                  </button>
                </div>
              </div>

              {/* Extracted Text */}
              <div className="space-y-3 flex flex-col">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                    <Edit className="w-4 h-4" />
                    النص المستخرج من خط يدك (قابـل للتعديل)
                  </span>
                  {isOcrProcessing && (
                    <span className="text-[11px] text-amber-400 flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      جاري فك رموز الخط...
                    </span>
                  )}
                </div>

                <textarea
                  value={transcribedText}
                  onChange={(e) => setTranscribedText(e.target.value)}
                  placeholder="سيظهر هنا النص المستخرج من كراسك، ويمكنك تعديله أو تصحيحه..."
                  rows={9}
                  className="w-full flex-1 bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 leading-relaxed font-sans"
                />

                {ocrConfidence && (
                  <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                    <strong>ملاحظة وضوح الخط:</strong> {ocrConfidence}
                  </div>
                )}
                {detectedDrawings && (
                  <div className="text-[11px] text-blue-300 bg-blue-950/20 p-2 rounded-lg border border-blue-500/20">
                    <strong>الرسومات أو المخططات المرصودة:</strong> {detectedDrawings}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Direct text typing mode */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Type className="w-4 h-4 text-emerald-400" />
              <span>كتابة الإجابة مباشرة</span>
            </h3>
            <p className="text-xs text-slate-400">
              اكتب استغلالك للوثائق (التعريف، قراءة المعطيات والدلالة، الاستنتاج) ثم التركيب أو النص العلمي.
            </p>
          </div>

          <textarea
            value={transcribedText}
            onChange={(e) => setTranscribedText(e.target.value)}
            placeholder="اكتب إجابتك هنا كاملة ومفصلة..."
            rows={12}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-xs sm:text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 leading-relaxed"
          />
        </div>
      )}

      {/* Bottom Submit Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            تأكد من مراجعة النص قبل إرساله؛ سيتم تقييمك بدقة على كل مصطلح علمي وخطوة استدلالية.
          </span>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!transcribedText.trim() || isLoading || isOcrProcessing}
          className="w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>جاري التصحيح المعياري وفق شبكة البكالوريا...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>بدء التصحيح المعياري ومنح العلامة (الخطوة 5)</span>
              <ArrowLeft className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Image Adjuster Modal */}
      {answerImage && (
        <ImageAdjusterModal
          isOpen={isAdjusterOpen}
          imageSrc={answerImage}
          onClose={() => setIsAdjusterOpen(false)}
          onApply={(adjusted) => {
            setAnswerImage(adjusted);
            setIsAdjusterOpen(false);
            runOcr(adjusted);
          }}
          title="تحسين تباين ورقة الإجابة لتسهيل قراءة الخط اليدوي"
        />
      )}
    </div>
  );
};
