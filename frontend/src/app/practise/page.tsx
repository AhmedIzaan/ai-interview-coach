"use client";

import { useState, useEffect } from "react";
import QuestionCard from "@/components/QuestionCard";
import ResponseBox from "@/components/ResponseBox";
import ResultPanel from "@/components/ResultPanel";
import useSpeechRecognition from "@/hooks/useSpeechRecognition"; // Import the hook
import { speak } from "@/utils/textToSpeech"; // Import the speaker

export default function Home() {
  const { text, isListening, startListening, stopListening, hasRecognitionSupport } = useSpeechRecognition();
  const [currentStep, setCurrentStep] = useState<"question" | "feedback">("question");

  // Hardcoded for now (we will fetch from backend later)
  const question = "Tell me about a time you solved a complex technical problem.";

  // Speak the question when the component mounts
  useEffect(() => {
    // Small delay to ensure browser is ready
    const timer = setTimeout(() => {
      speak(question);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleRecording = () => {
    if (isListening) {
      stopListening();
      // If we have text, simulate sending it to backend
      if (text.length > 5) {
         setCurrentStep("feedback");
      }
    } else {
      startListening();
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex flex-col items-center justify-center p-4">
      
      {/* 1. The Question */}
      <QuestionCard question={question} />

      {/* Show what the user is saying (Real-time transcription) */}
      {isListening && (
        <div className="mt-4 p-4 bg-gray-800/50 rounded-lg max-w-lg w-full text-center text-gray-300 animate-pulse">
           Using Microphone: {text || "Listening..."}
        </div>
      )}

      {/* 2. The Feedback */}
      {currentStep === "feedback" && (
        <ResultPanel 
          sentiment="POSITIVE"
          feedback={`You said: "${text}". That is a great start! (This is a dummy analysis)`}
        />
      )}

      {/* 3. The Mic Button */}
      {currentStep === "question" && (
        <ResponseBox 
          isRecording={isListening} 
          onToggleRecording={handleToggleRecording} 
          disabled={!hasRecognitionSupport}
        />
      )}

      {/* Reset Button */}
      {currentStep === "feedback" && (
        <button 
          onClick={() => {
            setCurrentStep("question");
            speak(question); // Speak it again on reset
          }}
          className="mt-8 px-6 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition"
        >
          Next Question →
        </button>
      )}

    </main>
  );
}