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
  const [finalTranscript, setFinalTranscript] = useState("");

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
      let interimTranscript = "";
      let newFinalTranscript = "";

      // Only process results from resultIndex onwards (new results only)
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          newFinalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      // Update final transcript state if we have new final results
      if (newFinalTranscript) {
        setFinalTranscript((prev) => prev + newFinalTranscript);
      }

      // Combine finalized text with interim results for display
      setFinalTranscript((currentFinal) => {
        setText(currentFinal + interimTranscript);
        return currentFinal;
      });
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    recognitionInstance.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    setRecognition(recognitionInstance);
  }, []);

  const startListening = useCallback(() => {
    if (recognition) {
      setText(""); // Clear previous text
      setFinalTranscript(""); // Clear final transcript
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