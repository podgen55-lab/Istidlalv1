/**
 * Image Adjuster Modal
 * Enables students to enhance contrast, brightness, rotate and preview exercise or handwriting images
 * إعداد: فنكوح عبد الرحيم
 */
import React, { useState, useRef, useEffect } from 'react';
import { RotateCw, Sun, Contrast, Check, X, Sliders, RefreshCw } from 'lucide-react';

interface Props {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
  onApply: (adjustedBase64: string) => void;
  title?: string;
}

export const ImageAdjusterModal: React.FC<Props> = ({
  isOpen,
  imageSrc,
  onClose,
  onApply,
  title = 'تحسين وضوح الصورة قبل الإرسال',
}) => {
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(110);
  const [rotation, setRotation] = useState<number>(0);
  const [grayscale, setGrayscale] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setBrightness(105);
      setContrast(120);
      setRotation(0);
      setGrayscale(false);
    }
  }, [isOpen]);

  if (!isOpen || !imageSrc) return null;

  const handleApply = () => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        onApply(imageSrc);
        return;
      }

      const isRotated90or270 = rotation % 180 !== 0;
      canvas.width = isRotated90or270 ? img.height : img.width;
      canvas.height = isRotated90or270 ? img.width : img.height;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);

      const filterParts: string[] = [
        `brightness(${brightness}%)`,
        `contrast(${contrast}%)`,
      ];
      if (grayscale) filterParts.push('grayscale(100%)');
      ctx.filter = filterParts.join(' ');

      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();

      const adjustedUrl = canvas.toDataURL('image/jpeg', 0.9);
      onApply(adjustedUrl);
    };
  };

  const rotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setRotation(0);
    setGrayscale(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-base sm:text-lg">
            <Sliders className="w-5 h-5" />
            <span>{title}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview Area */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-950/50 min-h-[260px]">
          <div className="relative max-h-[50vh] flex items-center justify-center">
            <img
              src={imageSrc}
              alt="Preview"
              className="max-h-[48vh] max-w-full rounded-lg object-contain transition-all"
              style={{
                filter: `brightness(${brightness}%) contrast(${contrast}%) ${
                  grayscale ? 'grayscale(100%)' : ''
                }`,
                transform: `rotate(${rotation}deg)`,
              }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Brightness */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs sm:text-sm text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-400" />
                  السطوع: {brightness}%
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="180"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
              />
            </div>

            {/* Contrast */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs sm:text-sm text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Contrast className="w-4 h-4 text-blue-400" />
                  التباين (لتوضيح الخط والأرقام): {contrast}%
                </span>
              </div>
              <input
                type="range"
                min="60"
                max="200"
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
              />
            </div>
          </div>

          {/* Quick Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={rotate}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm flex items-center gap-1.5 transition border border-slate-700"
              >
                <RotateCw className="w-4 h-4 text-emerald-400" />
                تدوير 90°
              </button>
              <button
                type="button"
                onClick={() => setGrayscale((prev) => !prev)}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm flex items-center gap-1.5 transition border ${
                  grayscale
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                أبيض وأسود
              </button>
              <button
                type="button"
                onClick={resetFilters}
                className="px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1 transition"
                title="إعادة ضبط"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                إعادة ضبط
              </button>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs sm:text-sm text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="flex-1 sm:flex-initial px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-500 hover:bg-emerald-600 text-slate-950 flex items-center justify-center gap-1.5 transition shadow-lg shadow-emerald-500/20"
              >
                <Check className="w-4 h-4" />
                تأكيد واعتماد الصورة
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
