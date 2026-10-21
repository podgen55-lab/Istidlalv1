/**
 * Client API services for ISTIDLAL 4 Specialized AI Agents
 * Calls backend endpoints (/api/agents/*)
 * إعداد: فنكوح عبد الرحيم
 */

import {
  ExerciseVisionData,
  PedagogicalMemory,
  SocraticMessage,
  GradingResult,
} from '../types';

export interface VisionAgentResponse extends ExerciseVisionData {}

export interface SocraticAgentResponse {
  reply: string;
  pedagogicalNote?: string;
  suggestedQuickReplies?: string[];
}

export interface OCRAgentResponse {
  transcribedText: string;
  confidenceNote?: string;
  detectedDrawingsOrSchemes?: string;
}

export const ApiClient = {
  /**
   * AGENT 1: VisionExerciseAgent
   */
  async analyzeExerciseImage(imageBase64: string, mimeType = 'image/jpeg'): Promise<VisionAgentResponse> {
    const res = await fetch('/api/agents/vision-exercise', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, mimeType }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'فشل في تحليل صورة التمرين');
    }

    return await res.json();
  },

  /**
   * AGENT 2: SocraticTutorAgent
   */
  async chatWithTutor(params: {
    exerciseData: ExerciseVisionData;
    chatHistory: SocraticMessage[];
    studentMessage: string;
    pedagogicalMemory: PedagogicalMemory;
  }): Promise<SocraticAgentResponse> {
    const res = await fetch('/api/agents/socratic-tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'فشل في التواصل مع الأستاذ السقراطي');
    }

    return await res.json();
  },

  /**
   * AGENT 3: HandwritingOCRAgent
   */
  async transcribeHandwriting(imageBase64: string, mimeType = 'image/jpeg'): Promise<OCRAgentResponse> {
    const res = await fetch('/api/agents/handwriting-ocr', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, mimeType }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'فشل في قراءة الخط اليدوي للورقة');
    }

    return await res.json();
  },

  /**
   * AGENT 4: GradingAndMemoryAgent
   */
  async gradeAndDiagnose(params: {
    exerciseData: ExerciseVisionData;
    studentAnswerText: string;
    maxScore: number;
    pedagogicalMemory: PedagogicalMemory;
  }): Promise<GradingResult> {
    const res = await fetch('/api/agents/grading-and-memory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'فشل في تصحيح الإجابة وتحديث الذاكرة');
    }

    return await res.json();
  },
};
