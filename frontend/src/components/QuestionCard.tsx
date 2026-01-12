"use client";
import { motion } from "framer-motion";

interface QuestionCardProps {
  question: string;
}

export default function QuestionCard({ question }: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-xl max-w-2xl w-full"
    >
      <h2 className="text-gray-200 text-sm font-semibold uppercase tracking-wider mb-4">
        AI Interviewer
      </h2>
      <p className="text-3xl md:text-4xl font-bold text-white leading-tight">
        {question}
      </p>
    </motion.div>
  );
}