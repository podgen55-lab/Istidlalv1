/**
 * Types for ISTIDLAL platform
 * الأستاذ الذكي لمادة علوم الطبيعة والحياة - بكالوريا الجزائر
 * إعداد: فنكوح عبد الرحيم
 */

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isGuest?: boolean;
  createdAt: string;
}

export type ExerciseType = 'exercise_1' | 'exercise_2' | 'exercise_3';

export interface ExerciseVisionData {
  title: string;
  domain: string; // المجال والوحدة التعلمية (مثال: تركيب البروتين، المناعة، الاتصال العصبي)
  exerciseType: ExerciseType;
  exerciseTypeLabel: string; // e.g. "التمرين 1 (5 نقاط): استرجاع منظم للموارد"
  maxScore: 5 | 7 | 8;
  contextAndDocuments: {
    documentId: string;
    documentTitle: string;
    description: string;
    experimentalConditions: string;
    observations: string;
    expectedDeductionFocus: string;
  }[];
  instructions: {
    number: number;
    text: string;
    actionVerb: string; // حلل، فسر، اشرح، بين، اقترح فرضية...
    taskType: 'مهمة بسيطة' | 'مهمة مركبة';
    requiredSteps: string[];
  }[];
  methodologyBreakdown: {
    summary: string;
    commonPitfallsToAvoid: string[];
    officialGuidelinesNote: string;
  };
}

export interface SocraticMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  quickReplies?: string[];
  pedagogicalNote?: string;
}

export interface RubricItem {
  criterionName: string;
  taskType: 'استغلال وثيقة' | 'ربط وتركيب' | 'نص علمي' | 'فرضية' | 'تفسير سببي';
  studentExtract: string;
  correction: string;
  earnedScore: number;
  maxScore: number;
  status: 'mastered' | 'partial' | 'incorrect';
}

export interface DiagnosticReport {
  strengths: string[];
  weaknesses: string[];
  cognitiveAspect: string; // الجانب المعرفي
  methodologicalAspect: string; // الجانب المنهجي / الإجرائي
  reasoningAspect: string; // الجانب الاستدلالي
  actionableAdvice: string; // نصيحة عملية ملموسة ترفع العلامة
}

export interface MemorySkill {
  id: string;
  name: string;
  category: 'methodology' | 'cognitive' | 'reasoning';
  status: 'mastered' | 'improving' | 'struggling';
  confidenceScore: number; // 0.1 to 1.0 (10% to 100%)
  evidenceCount: number;
  recentEvidence: string;
}

export interface PedagogicalMemory {
  userId: string;
  totalExercisesSolved: number;
  scientificMastery: number; // 0 to 100
  methodologyMastery: number; // 0 to 100
  averageScore: number;
  scoreHistory: {
    date: string;
    score: number;
    maxScore: number;
    title: string;
    exerciseType: string;
  }[];
  skills: MemorySkill[];
  overcomeDefects: string[];
  nextSessionDirective: string;
  lastUpdated: string;
}

export interface GradingResult {
  awardedScore: number;
  maxScore: number;
  overallFeedback: string;
  rubricBreakdown: RubricItem[];
  modelAnswer: {
    introduction?: string;
    documentExploitation?: {
      documentTitle: string;
      definition: string;
      dataAnalysisWithSignificance: string;
      deduction: string;
    }[];
    synthesis?: string; // التركيب أو حل المشكل
    conclusion?: string;
    fullFormattedText?: string;
  };
  diagnosticReport: DiagnosticReport;
  memoryUpdate: {
    scientificMastery: number;
    methodologyMastery: number;
    skillsUpdated: MemorySkill[];
    overcomeDefectsAdded?: string[];
    nextSessionDirective: string;
  };
}

export interface SavedExerciseAttempt {
  id: string;
  userId: string;
  date: string;
  exerciseImage?: string; // base64 or preview url
  answerImage?: string;
  studentAnswerText: string;
  visionData: ExerciseVisionData;
  chatHistory: SocraticMessage[];
  gradingResult: GradingResult;
}
