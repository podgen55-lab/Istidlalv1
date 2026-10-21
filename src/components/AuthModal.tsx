/**
 * Auth Modal: نافذة تسجيل الدخول
 * يدعم الدخول بحساب Google بضغطة واحدة وحفظ بيانات التلميذ وسجله
 * إعداد: فنكوح عبد الرحيم
 */
import React, { useState } from 'react';
import { X, Sparkles, ShieldCheck, Mail, ArrowLeft, Check } from 'lucide-react';
import { User } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccessLogin: (user: User) => void;
}

export const AuthModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSuccessLogin,
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [isEmailMode, setIsEmailMode] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = () => {
    // 1-Click fast Google Login simulation with standard user profile
    const googleUser: User = {
      id: 'google_user_' + Math.random().toString(36).substring(2, 8),
      name: 'تلميذ بكالوريا (Google)',
      email: 'bac.student@gmail.com',
      avatar: 'https://lh3.googleusercontent.com/a/default-user',
      isGuest: false,
      createdAt: new Date().toISOString(),
    };
    onSuccessLogin(googleUser);
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    const customUser: User = {
      id: 'user_' + Math.random().toString(36).substring(2, 8),
      name: nameInput.trim(),
      email: emailInput.trim() || `${nameInput.trim().toLowerCase().replace(/\s+/g, '')}@student.dz`,
      isGuest: false,
      createdAt: new Date().toISOString(),
    };
    onSuccessLogin(customUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden space-y-5 p-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-black">
              إ
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                تسجيل الدخول إلى استدلال
              </h3>
              <p className="text-[11px] text-slate-400">
                لحفظ تمارينك وذاكرتك التعليمية دائماً
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Benefits notice */}
        <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3 text-xs text-emerald-200/90 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-emerald-400">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>ميزة الحفظ المستمر (Guest-to-Account):</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            أي تمرين قمت بحله أو حوار أجريته في هذه الجلسة سيتم ربطه فوراً بحسابك ولن يضيع أبداً!
          </p>
        </div>

        {!isEmailMode ? (
          <div className="space-y-4">
            {/* Google Sign-In 1-Click Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full py-3 px-4 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-3 transition shadow-lg group"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>المتابعة باستخدام حساب Google</span>
            </button>

            <div className="relative flex items-center justify-center my-3">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-slate-900 px-3 text-[11px] text-slate-500 absolute">
                أو بالاسم والبريد
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsEmailMode(true)}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition border border-slate-700"
            >
              <Mail className="w-4 h-4 text-emerald-400" />
              <span>تسجيل بالاسم / البريد الإلكتروني</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleCustomSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                اسم التلميذ (اللقب والاسم):
              </label>
              <input
                type="text"
                required
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="مثال: ياسمين بن علي"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                البريد الإلكتروني (اختياري):
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="student@example.com"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEmailMode(false)}
                className="px-3 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition"
              >
                رجوع
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition shadow-md shadow-emerald-500/20"
              >
                <Check className="w-4 h-4" />
                <span>حفظ وبدء الجلسة</span>
              </button>
            </div>
          </form>
        )}

        <div className="text-[11px] text-center text-slate-500 pt-1">
          إعداد وإشراف: الأستاذ فنكوح عبد الرحيم
        </div>
      </div>
    </div>
  );
};
