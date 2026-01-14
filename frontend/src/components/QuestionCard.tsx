"use client";
import { motion } from "framer-motion";

interface QuestionCardProps {
  question: string;
}

export default function QuestionCard({ question }: QuestionCardProps) {
  // Parse markdown-style bold text (**text**) to actual bold
  const parseBold = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, index) =>
      index % 2 === 1 ? <strong key={index}>{part}</strong> : part
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-xl max-w-3xl w-full"
    >
      <h2 className="text-gray-200 text-sm font-semibold uppercase tracking-wider mb-3">
        AI Interviewer
      </h2>
      <p className="text-xl md:text-2xl font-medium text-white leading-relaxed">
        {parseBold(question)}
      </p>
    </motion.div>
  );
}