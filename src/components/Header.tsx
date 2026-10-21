/**
 * Header Component for ISTIDLAL
 * يعرض هوية المنصة وإشراف الأستاذ فنكوح عبد الرحيم وأقسام التنقل والحساب
 */
import React from 'react';
import {
  Compass,
  History,
  BrainCircuit,
  Info,
  UserCheck,
  LogIn,
  Sparkles,
} from 'lucide-react';
import { User } from '../types';

interface Props {
  activeTab: 'session' | 'history' | 'progress' | 'about';
  setActiveTab: (tab: 'session' | 'history' | 'progress' | 'about') => void;
  currentUser: User;
  onOpenAuth: () => void;
}

export const Header: React.FC<Props> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuth,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      {/* Top Banner with Author Credential */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/60 border-b border-emerald-900/40 px-4 py-1 text-xs flex items-center justify-between text-slate-300">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            بكالوريا الجزائر 🇩🇿
          </span>
          <span className="hidden sm:inline text-slate-400">
            وفق دليل بناء الاختبارات الرسمي (2017) ومذكرات المهمات المركبة (2021-2022)
          </span>
        </div>
        <div className="font-semibold text-emerald-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>إعداد وإشراف: الأستاذ فنكوح عبد الرحيم</span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div
          onClick={() => setActiveTab('session')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition">
            <span className="text-slate-950 font-black text-xl sm:text-2xl">إ</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                <span>اسـتـدلال</span>
                <span className="text-xs font-mono font-normal text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                  ISTIDLAL
                </span>
              </h1>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 hidden xs:block">
              الأستاذ الذكي لمادة علوم الطبيعة والحياة للبكالوريا
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('session')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
              activeTab === 'session'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>جلسة التمرين</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
              activeTab === 'history'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <History className="w-4 h-4" />
            <span>سجل محاولاتي</span>
          </button>

          <button
            onClick={() => setActiveTab('progress')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
              activeTab === 'progress'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span>تطوري وذاكرة الأستاذ</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition ${
              activeTab === 'about'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>عن المنصة والحساب</span>
          </button>
        </nav>

        {/* User Account / Auth Button */}
        <div className="flex items-center gap-2">
          {currentUser.isGuest ? (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 text-xs sm:text-sm font-bold transition shadow-sm"
              title="دخول لحفظ بياناتك"
            >
              <LogIn className="w-4 h-4" />
              <span>دخول بحساب Google</span>
            </button>
          ) : (
            <div
              onClick={() => setActiveTab('about')}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 cursor-pointer transition"
              title={currentUser.email}
            >
              <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-xs">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-right">
                <div className="text-xs font-bold text-slate-200 truncate max-w-[110px]">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <UserCheck className="w-3 h-3" />
                  حساب محفوظ
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800/80 bg-slate-950/90 py-1.5 px-2">
        <button
          onClick={() => setActiveTab('session')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-medium transition ${
            activeTab === 'session' ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>التمرين</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-medium transition ${
            activeTab === 'history' ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <History className="w-4 h-4" />
          <span>سجلي</span>
        </button>

        <button
          onClick={() => setActiveTab('progress')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-medium transition ${
            activeTab === 'progress' ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <BrainCircuit className="w-4 h-4" />
          <span>تطوري</span>
        </button>

        <button
          onClick={() => setActiveTab('about')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-medium transition ${
            activeTab === 'about' ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>عن المنصة</span>
        </button>
      </div>
    </header>
  );
};
