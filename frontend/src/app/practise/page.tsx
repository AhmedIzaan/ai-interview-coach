"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import QuestionCard from "@/components/QuestionCard";
import ResponseBox from "@/components/ResponseBox";
import ResultPanel from "@/components/ResultPanel";
import useSpeechRecognition from "@/hooks/useSpeechRecognition";
import { speak } from "@/utils/textToSpeech";
import { startInterview, submitAnswer, getFinalFeedback, QuestionResponse, FeedbackResponse } from "@/utils/api";
import { Loader2 } from "lucide-react";

export default function PracticePage() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "Software Engineer";
  const tone = searchParams.get("tone") || "professional";

  const { text, isListening, startListening, stopListening, hasRecognitionSupport } = useSpeechRecognition();

  // App State
  const [view, setView] = useState<"question" | "final-feedback">("question");
  const [loading, setLoading] = useState(true);
  const [stepCount, setStepCount] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [totalQuestions, setTotalQuestions] = useState(5);

  // Data State
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [finalFeedback, setFinalFeedback] = useState<FeedbackResponse | null>(null);

  // Initialize interview on load
  useEffect(() => {
    const initInterview = async () => {
      try {
        const data = await startInterview(role, tone);
        setSessionId(data.session_id);
        setCurrentQuestion(data.next_question);
        setTotalQuestions(data.total_questions);
        setLoading(false);
        setTimeout(() => speak(data.next_question), 500);
      } catch (error) {
        console.error("Failed to start interview:", error);
        setLoading(false);
      }
    };
    initInterview();
  }, [role, tone]);

  // Handle Recording Logic
  const handleToggleRecording = async () => {
    if (isListening) {
      stopListening();

      if (!text || text.length < 5) return;
      if (!sessionId) return;

      setLoading(true);

      try {
        const data = await submitAnswer(text, stepCount, role, tone, sessionId, currentQuestion);

        if (data.is_complete) {
          // Interview complete - get final feedback
          const feedback = await getFinalFeedback(sessionId);
          setFinalFeedback(feedback);
          setView("final-feedback");
          speak(feedback.feedback.final_verdict);
        } else {
          // Move directly to next question - NO FEEDBACK
          setCurrentQuestion(data.next_question);
          setStepCount(data.current_question);
          setTimeout(() => speak(data.next_question), 300);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to process answer. Please try again.");
      } finally {
        setLoading(false);
      }

    } else {
      startListening();
    }
  };

  // Handle restart interview
  const handleRestart = () => {
    window.location.reload();
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex flex-col items-center justify-center p-4">

      {/* HEADER: Progress */}
      <div className="absolute top-6 left-6 text-gray-400 font-mono text-sm">
        Question {stepCount + 1} / {totalQuestions}
      </div>

      {/* --- VIEW 1: QUESTION --- */}
      {view === "question" && (
        <>
          {loading && !currentQuestion ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              <p className="text-gray-400">Starting interview...</p>
            </div>
          ) : (
            <>
              <QuestionCard question={currentQuestion} />

              {/* Live Transcription Box */}
              <div className={`mt-6 h-16 text-center transition-opacity duration-300 ${isListening ? 'opacity-100' : 'opacity-0'}`}>
                <p className="text-gray-400 text-sm mb-2">Listening...</p>
                <p className="text-xl text-white font-medium">"{text}"</p>
              </div>

              {loading ? (
                <div className="mt-8 flex flex-col items-center gap-2">
                  <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                  <p className="text-gray-400 text-sm">Processing...</p>
                </div>
              ) : (
                <ResponseBox
                  isRecording={isListening}
                  onToggleRecording={handleToggleRecording}
                  disabled={!hasRecognitionSupport}
                />
              )}
            </>
          )}
        </>
      )}

      {/* --- VIEW 2: FINAL FEEDBACK --- */}
      {view === "final-feedback" && finalFeedback && (
        <div className="flex flex-col items-center w-full max-w-4xl space-y-6">
          <h1 className="text-4xl font-bold text-white mb-4">Interview Complete! 🎉</h1>

          {/* Overall Score */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-2xl w-full text-center">
            <p className="text-white/80 text-sm uppercase mb-2">Overall Score</p>
            <p className="text-6xl font-bold text-white">{finalFeedback.feedback.overall_score}/10</p>
            <p className="text-white/90 mt-2">{finalFeedback.feedback.final_verdict}</p>
          </div>

          {/* Strengths */}
          <div className="bg-white/5 border border-green-500/30 p-6 rounded-xl w-full">
            <h3 className="text-green-400 font-bold text-lg mb-3">✅ Strengths</h3>
            <ul className="space-y-2">
              {finalFeedback.feedback.strengths.map((strength, i) => (
                <li key={i} className="text-gray-300">• {strength}</li>
              ))}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="bg-white/5 border border-yellow-500/30 p-6 rounded-xl w-full">
            <h3 className="text-yellow-400 font-bold text-lg mb-3">💡 Areas for Improvement</h3>
            <ul className="space-y-2">
              {finalFeedback.feedback.improvements.map((improvement, i) => (
                <li key={i} className="text-gray-300">• {improvement}</li>
              ))}
            </ul>
          </div>

          {/* Detailed Feedback */}
          <div className="bg-white/5 border border-white/10 p-6 rounded-xl w-full">
            <h3 className="text-white font-bold text-lg mb-3">📝 Detailed Feedback</h3>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">{finalFeedback.feedback.detailed_feedback}</p>
          </div>

          <button
            onClick={handleRestart}
            className="mt-8 px-8 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-500 hover:scale-105 transition-all shadow-lg shadow-blue-500/30"
          >
            Try Another Interview
          </button>
        </div>
      )}

    </main>
  );
}