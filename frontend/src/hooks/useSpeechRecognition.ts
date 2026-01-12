"use client";
import { useState, useEffect, useCallback } from "react";

// Define the interface for the browser's SpeechRecognition API
interface IWindow extends Window {
  webkitSpeechRecognition: any;
  SpeechRecognition: any;
}

export default function useSpeechRecognition() {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    // Check browser compatibility
    const { webkitSpeechRecognition, SpeechRecognition } = window as unknown as IWindow;
    const SpeechRecognitionApi = SpeechRecognition || webkitSpeechRecognition;

    if (!SpeechRecognitionApi) {
      console.error("Browser does not support Speech Recognition.");
      return;
    }

    const recognitionInstance = new SpeechRecognitionApi();
    recognitionInstance.continuous = true; // Keep listening even if user pauses
    recognitionInstance.interimResults = true; // Show results while talking
    recognitionInstance.lang = "en-US";

    recognitionInstance.onresult = (event: any) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        finalTranscript += event.results[i][0].transcript;
      }
      setText(finalTranscript);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    setRecognition(recognitionInstance);
  }, []);

  const startListening = useCallback(() => {
    if (recognition) {
      setText(""); // Clear previous text
      recognition.start();
      setIsListening(true);
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  }, [recognition]);

  return { text, isListening, startListening, stopListening, hasRecognitionSupport: !!recognition };
}