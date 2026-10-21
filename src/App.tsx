/**
 * Main App Component for ISTIDLAL | استدلال
 * الأستاذ الذكي لمادة علوم الطبيعة والحياة للبكالوريا الجزائرية
 * إعداد وإشراف: الأستاذ فنكوح عبد الرحيم
 */
import React, { useState, useEffect } from 'react';
import {
  Camera,
  Brain,
  MessageSquare,
  FileCheck2,
  Award,
  BrainCircuit,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

import {
  User,
  PedagogicalMemory,
  SavedExerciseAttempt,
  ExerciseVisionData,
  SocraticMessage,
  GradingResult,
} from './types';
import { StorageService } from './services/storageService';
import { ApiClient } from './services/apiClient';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';

import { Step1Upload } from './components/Step1Upload';
import { Step2VisionAnalysis } from './components/Step2VisionAnalysis';
import { Step3SocraticChat } from './components/Step3SocraticChat';
import { Step4AnswerUpload } from './components/Step4AnswerUpload';
import { Step5Grading } from './components/Step5Grading';
import { Step6DiagnosticAndMemory } from './components/Step6DiagnosticAndMemory';

import { HistoryTab } from './components/HistoryTab';
import { ProgressAndMemoryTab } from './components/ProgressAndMemoryTab';
import { AboutAndAuthTab } from './components/AboutAndAuthTab';

export default function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'session' | 'history' | 'progress' | 'about'>('session');

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<User>(() => StorageService.getCurrentUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Pedagogical Memory & Attempts
  const [pedagogicalMemory, setPedagogicalMemory] = useState<PedagogicalMemory>(() =>
    StorageService.getPedagogicalMemory(currentUser.id)
  );
  const [attempts, setAttempts] = useState<SavedExerciseAttempt[]>(() =>
    StorageService.getSavedAttempts(currentUser.id)
  );

  // Current Session Steps: 1 to 6
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Session Data
  const [exerciseImage, setExerciseImage] = useState<string | null>(null);
  const [visionData, setVisionData] = useState<ExerciseVisionData | null>(null);
  const [chatHistory, setChatHistory] = useState<SocraticMessage[]>([]);
  const [answerImage, setAnswerImage] = useState<string | null>(null);
  const [studentAnswerText, setStudentAnswerText] = useState<string>('');
  const [gradingResult, setGradingResult] = useState<GradingResult | null>(null);

  // Sync memory & attempts when currentUser changes
  useEffect(() => {
    setPedagogicalMemory(StorageService.getPedagogicalMemory(currentUser.id));
    setAttempts(StorageService.getSavedAttempts(currentUser.id));
  }, [currentUser.id]);

  // Handle Login & Migration
  const handleSuccessLogin = (newUser: User) => {
    StorageService.migrateGuestDataToUser(currentUser.id, newUser);
    setCurrentUser(newUser);
    setPedagogicalMemory(StorageService.getPedagogicalMemory(newUser.id));
    setAttempts(StorageService.getSavedAttempts(newUser.id));
  };

  // Handle Logout
  const handleLogout = () => {
    const guest = StorageService.logoutUser();
    setCurrentUser(guest);
    setPedagogicalMemory(StorageService.getPedagogicalMemory(guest.id));
    setAttempts(StorageService.getSavedAttempts(guest.id));
  };

  // Handle Clear User Data
  const handleClearData = () => {
    StorageService.clearUserData(currentUser.id);
    setPedagogicalMemory(StorageService.getPedagogicalMemory(currentUser.id));
    setAttempts([]);
    handleStartNewExercise();
  };

  // Step 1: User selected and confirmed an exercise image
  const handleExerciseImageSelected = async (imageBase64: string) => {
    setExerciseImage(imageBase64);
    setIsProcessing(true);
    setGlobalError(null);

    try {
      const data = await ApiClient.analyzeExerciseImage(imageBase64);
      setVisionData(data);
      setCurrentStep(2);
    } catch (err: any) {
      console.error('Vision agent error:', err);
      setGlobalError(err.message || 'تعذر تحليل صورة التمرين. تأكد من وضوح السندات وحاول مجدداً.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Step 4: Submit student's handwritten answer text for grading
  const handleAnswerSubmitForGrading = async (text: string, imgBase64?: string) => {
    if (!visionData) return;
    setStudentAnswerText(text);
    if (imgBase64) setAnswerImage(imgBase64);
    setIsProcessing(true);
    setGlobalError(null);

    try {
      const result = await ApiClient.gradeAndDiagnose({
        exerciseData: visionData,
        studentAnswerText: text,
        maxScore: visionData.maxScore,
        pedagogicalMemory,
      });

      setGradingResult(result);
      setCurrentStep(5);

      // Save attempt and update memory
      const newAttempt: SavedExerciseAttempt = {
        id: 'attempt_' + Date.now(),
        userId: currentUser.id,
        date: new Date().toLocaleDateString('ar-DZ', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        exerciseImage: exerciseImage || undefined,
        answerImage: imgBase64 || answerImage || undefined,
        studentAnswerText: text,
        visionData,
        chatHistory,
        gradingResult: result,
      };

      StorageService.saveAttempt(currentUser.id, newAttempt);
      setAttempts(StorageService.getSavedAttempts(currentUser.id));
      setPedagogicalMemory(StorageService.getPedagogicalMemory(currentUser.id));
    } catch (err: any) {
      console.error('Grading agent error:', err);
      setGlobalError(err.message || 'تعذر تصحيح الإجابة. يرجى إعادة المحاولة.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset to Step 1 for a new exercise
  const handleStartNewExercise = () => {
    setCurrentStep(1);
    setExerciseImage(null);
    setVisionData(null);
    setChatHistory([]);
    setAnswerImage(null);
    setStudentAnswerText('');
    setGradingResult(null);
    setGlobalError(null);
    setActiveTab('session');
  };

  // Steps configuration for linear breadcrumb
  const stepsList = [
    { num: 1, label: 'تصوير التمرين', icon: Camera },
    { num: 2, label: 'فهم الأستاذ', icon: Brain },
    { num: 3, label: 'المرافقة السقراطية', icon: MessageSquare },
    { num: 4, label: 'تصوير الإجابة', icon: FileCheck2 },
    { num: 5, label: 'التصحيح والعلامة', icon: Award },
    { num: 6, label: 'التقرير والذاكرة', icon: BrainCircuit },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Global Error Banner */}
        {globalError && (
          <div className="bg-rose-950/40 border border-rose-500/40 text-rose-200 p-4 rounded-2xl text-xs sm:text-sm flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{globalError}</span>
            </div>
            <button
              onClick={() => setGlobalError(null)}
              className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-900"
            >
              إغلاق
            </button>
          </div>
        )}

        {/* TAB 1: Exercise Session (6-Step Linear Flow) */}
        {activeTab === 'session' && (
          <div className="space-y-6">
            {/* Linear Step Indicator (Mobile-friendly horizontal scroll / wrap) */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3 sm:p-4 shadow-lg overflow-x-auto no-scrollbar">
              <div className="flex items-center justify-between min-w-[620px] sm:min-w-0 gap-2">
                {stepsList.map((st, idx) => {
                  const Icon = st.icon;
                  const isActive = currentStep === st.num;
                  const isCompleted = currentStep > st.num;
                  const isClickable = isCompleted || isActive;

                  return (
                    <React.Fragment key={st.num}>
                      <button
                        type="button"
                        disabled={!isClickable}
                        onClick={() => {
                          if (isCompleted) setCurrentStep(st.num);
                        }}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition text-xs font-semibold select-none ${
                          isActive
                            ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                            : isCompleted
                            ? 'bg-slate-950 text-emerald-400 hover:bg-slate-800 border border-emerald-500/30'
                            : 'bg-slate-950/40 text-slate-500 border border-slate-800/80 cursor-not-allowed'
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 bg-black/20">
                          {st.num}
                        </span>
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="whitespace-nowrap">{st.label}</span>
                      </button>

                      {idx < stepsList.length - 1 && (
                        <div
                          className={`flex-1 h-0.5 mx-1 min-w-[12px] transition ${
                            currentStep > st.num ? 'bg-emerald-500/50' : 'bg-slate-800'
                          }`}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* STEP 1: Upload Exercise */}
            {currentStep === 1 && (
              <Step1Upload
                pedagogicalMemory={pedagogicalMemory}
                onImageSelected={handleExerciseImageSelected}
                isLoading={isProcessing}
              />
            )}

            {/* STEP 2: Teacher Understanding & Decomposition */}
            {currentStep === 2 && visionData && (
              <Step2VisionAnalysis
                visionData={visionData}
                onUpdateVisionData={setVisionData}
                onProceedToChat={() => setCurrentStep(3)}
                onBackToUpload={() => setCurrentStep(1)}
              />
            )}

            {/* STEP 3: Adaptive Socratic Dialogue */}
            {currentStep === 3 && visionData && (
              <Step3SocraticChat
                exerciseData={visionData}
                pedagogicalMemory={pedagogicalMemory}
                chatHistory={chatHistory}
                onUpdateChatHistory={setChatHistory}
                onProceedToAnswerUpload={() => setCurrentStep(4)}
                onBackToVision={() => setCurrentStep(2)}
              />
            )}

            {/* STEP 4: Answer Upload & OCR */}
            {currentStep === 4 && (
              <Step4AnswerUpload
                onProceedToGrading={handleAnswerSubmitForGrading}
                onBackToChat={() => setCurrentStep(3)}
                isLoading={isProcessing}
              />
            )}

            {/* STEP 5: Standardized Grading & Model Answer */}
            {currentStep === 5 && gradingResult && visionData && (
              <Step5Grading
                gradingResult={gradingResult}
                exerciseData={visionData}
                studentAnswerText={studentAnswerText}
                onProceedToDiagnostic={() => setCurrentStep(6)}
              />
            )}

            {/* STEP 6: Diagnostic Report & Memory Update */}
            {currentStep === 6 && gradingResult && visionData && (
              <Step6DiagnosticAndMemory
                gradingResult={gradingResult}
                exerciseData={visionData}
                pedagogicalMemory={pedagogicalMemory}
                onStartNewExercise={handleStartNewExercise}
              />
            )}
          </div>
        )}

        {/* TAB 2: History (سجل محاولاتي) */}
        {activeTab === 'history' && (
          <HistoryTab
            attempts={attempts}
            onGoToSession={() => setActiveTab('session')}
          />
        )}

        {/* TAB 3: Progress & Memory (تطوري وذاكرة الأستاذ) */}
        {activeTab === 'progress' && (
          <ProgressAndMemoryTab
            pedagogicalMemory={pedagogicalMemory}
            onGoToSession={() => setActiveTab('session')}
          />
        )}

        {/* TAB 4: About & Account (عن المنصة والحساب) */}
        {activeTab === 'about' && (
          <AboutAndAuthTab
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onLogout={handleLogout}
            onClearData={handleClearData}
          />
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccessLogin={handleSuccessLogin}
      />

      {/* Official Footer */}
      <Footer />
    </div>
  );
}
