"use client";
import { motion } from "framer-motion";
import { Mic, Square } from "lucide-react";

interface ResponseBoxProps {
  isRecording: boolean;
  onToggleRecording: () => void;
  disabled: boolean;
}

export default function ResponseBox({ isRecording, onToggleRecording, disabled }: ResponseBoxProps) {
  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onToggleRecording}
        disabled={disabled}
        className={`
          relative flex items-center justify-center w-20 h-20 rounded-full shadow-2xl transition-all
          ${isRecording ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-500"}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        {/* Animated Ring when recording */}
        {isRecording && (
          <motion.div
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute w-full h-full rounded-full bg-red-500"
          />
        )}
        
        {isRecording ? (
          <Square className="w-8 h-8 text-white z-10" fill="currentColor" />
        ) : (
          <Mic className="w-10 h-10 text-white z-10" />
        )}
      </motion.button>
      
      <p className="text-gray-400 text-sm font-medium">
        {isRecording ? "Listening..." : "Tap to Answer"}
      </p>
    </div>
  );
}