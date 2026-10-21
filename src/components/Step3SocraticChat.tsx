/**
 * Step 3: Adaptive Socratic Dialogue (المرافقة السقراطية المتكيفة)
 * يحاور التلميذ خطوة بخطوة دون إعطاء الحل، ويوظف ذاكرته التعليمية السابقة
 * إعداد: فنكوح عبد الرحيم
 */
import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  Loader2,
  Sparkles,
  HelpCircle,
  PenTool,
  ArrowRight,
  GraduationCap,
  Lightbulb,
} from 'lucide-react';
import {
  ExerciseVisionData,
  PedagogicalMemory,
  SocraticMessage,
} from '../types';
import { ApiClient } from '../services/apiClient';

interface Props {
  exerciseData: ExerciseVisionData;
  pedagogicalMemory: PedagogicalMemory;
  chatHistory: SocraticMessage[];
  onUpdateChatHistory: (history: SocraticMessage[]) => void;
  onProceedToAnswerUpload: () => void;
  onBackToVision: () => void;
}

export const Step3SocraticChat: React.FC<Props> = ({
  exerciseData,
  pedagogicalMemory,
  chatHistory,
  onUpdateChatHistory,
  onProceedToAnswerUpload,
  onBackToVision,
}) => {
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [quickReplies, setQuickReplies] = useState<string[]>([
    'كيف أبدأ بالتعريف بالوثيقة بالشكل الصحيح؟',
    'ما هي الشروط التجريبية الأساسية التي يجب أن أركز عليها؟',
    'ما الفرق بين قراءة المعطيات واستخراج الدلالة العلمية؟',
  ]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isSending]);

  // Initial welcome message from Socratic tutor if chat is empty
  useEffect(() => {
    if (chatHistory.length === 0) {
      let welcomeText = `أهلاً بك يا بني في تمرين: "${exerciseData.title}".\nأنا هنا لأرافقك خطوة بخطوة حتى تصل إلى الحل بنفسك ولن أمنحك الإجابة الجاهزة.`;

      if (pedagogicalMemory.totalExercisesSolved > 0 && pedagogicalMemory.nextSessionDirective) {
        welcomeText += `\n\n📌 تذكر وصيتي لك من الجلسة السابقة: "${pedagogicalMemory.nextSessionDirective}"`;
      }

      welcomeText += `\n\nفلنبدأ بالتعليمة الأولى: كيف تعرّف بالوثيقة الأولى، وما هو المتغير والشروط التجريبية الموضحة فيها؟`;

      const initialMsg: SocraticMessage = {
        id: 'msg_' + Date.now(),
        role: 'assistant',
        content: welcomeText,
        timestamp: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' }),
        pedagogicalNote: 'الخطوة 1: التعريف بالوثيقة وقراءة شروط الوسط',
      };
      onUpdateChatHistory([initialMsg]);
    }
  }, [exerciseData.title]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText.trim();
    if (!text || isSending) return;

    const userMsg: SocraticMessage = {
      id: 'msg_user_' + Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...chatHistory, userMsg];
    onUpdateChatHistory(newHistory);
    setInputText('');
    setIsSending(true);

    try {
      const response = await ApiClient.chatWithTutor({
        exerciseData,
        chatHistory: newHistory,
        studentMessage: text,
        pedagogicalMemory,
      });

      const assistantMsg: SocraticMessage = {
        id: 'msg_assistant_' + Date.now(),
        role: 'assistant',
        content: response.reply,
        timestamp: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' }),
        pedagogicalNote: response.pedagogicalNote,
        quickReplies: response.suggestedQuickReplies,
      };

      onUpdateChatHistory([...newHistory, assistantMsg]);

      if (response.suggestedQuickReplies && response.suggestedQuickReplies.length > 0) {
        setQuickReplies(response.suggestedQuickReplies);
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: SocraticMessage = {
        id: 'msg_err_' + Date.now(),
        role: 'assistant',
        content: 'عذراً يا بني، حدث انقطاع في الاتصال. حاول إعادة صياغة إجابتك أو الضغط على أحد أزرار المساعدة السريعة.',
        timestamp: new Date().toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' }),
      };
      onUpdateChatHistory([...newHistory, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Top Transition Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onBackToVision}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
            title="الرجوع لتفاصيل التمرين"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                الخطوة 3: المرافقة السقراطية المتكيفة
              </span>
              <span className="text-xs text-slate-400">
                حوار توجيهي مستمر
              </span>
            </div>
            <div className="text-xs text-slate-300 font-semibold truncate max-w-sm mt-0.5">
              {exerciseData.title}
            </div>
          </div>
        </div>

        {/* Big Action: Student Finished Writing */}
        <button
          type="button"
          onClick={onProceedToAnswerUpload}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition group"
        >
          <PenTool className="w-4 h-4 group-hover:rotate-12 transition" />
          <span>انتهيت من كتابة الحل في الكراس ➔ تصوير الإجابة</span>
        </button>
      </div>

      {/* Chat Area */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl flex flex-col h-[520px] shadow-xl overflow-hidden">
        {/* Messages container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {chatHistory.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[88%] sm:max-w-[80%] ${
                  isUser ? 'mr-auto flex-row-reverse' : 'ml-auto'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                    isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 shadow-md'
                  }`}
                >
                  {isUser ? 'أنت' : 'الأستاذ'}
                </div>

                {/* Content */}
                <div className="space-y-1">
                  {msg.pedagogicalNote && !isUser && (
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      <Lightbulb className="w-3 h-3 text-amber-400" />
                      <span>{msg.pedagogicalNote}</span>
                    </div>
                  )}

                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-slate-950/80 text-slate-200 border border-slate-800 rounded-tl-none shadow-sm'
                    }`}
                  >
                    {msg.content}
                  </div>

                  <div className={`text-[10px] text-slate-500 px-1 ${isUser ? 'text-left' : 'text-right'}`}>
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isSending && (
            <div className="flex gap-3 max-w-[80%] ml-auto animate-pulse">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-2xl rounded-tl-none text-xs text-slate-400">
                الأستاذ يقرأ إجابتك ويجهز سؤاله التوجيهي التالي...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        {quickReplies.length > 0 && (
          <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-[10px] text-slate-500 shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              اقتراحات سريعة:
            </span>
            {quickReplies.map((reply, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(reply)}
                disabled={isSending}
                className="shrink-0 px-2.5 py-1 rounded-lg text-[11px] bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-emerald-300 border border-slate-700/80 hover:border-emerald-500/40 transition"
              >
                {reply}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="اكتب إجابتك أو استفسارك المنهجي للأستاذ..."
            disabled={isSending}
            className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="w-10 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center disabled:opacity-40 transition shrink-0 shadow-md shadow-emerald-500/20"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4 rotate-180" />
            )}
          </button>
        </form>
      </div>

      {/* Socratic philosophy reminder banner */}
      <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <GraduationCap className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          <strong>تذكير مهم:</strong> عندما تكتمل قناعتك بالحل وتكتب إجابتك على كراسك، اضغط على زر "انتهيت من كتابة الحل في الكراس" بالأعلى لنصحح ورقتك خطوة بخطوة.
        </span>
      </div>
    </div>
  );
};
