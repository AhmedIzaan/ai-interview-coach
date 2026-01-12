"use client";
import { motion } from "framer-motion";

interface ResultPanelProps {
  feedback: string;
  sentiment: string;
}

export default function ResultPanel({ feedback, sentiment }: ResultPanelProps) {
  // Simple color mapping based on sentiment
  const getColors = () => {
    if (sentiment === "POSITIVE") return "bg-green-500/20 border-green-500/50 text-green-200";
    if (sentiment === "NEGATIVE") return "bg-red-500/20 border-red-500/50 text-red-200";
    return "bg-blue-500/20 border-blue-500/50 text-blue-200";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`mt-8 p-6 rounded-xl border backdrop-blur-sm max-w-2xl w-full ${getColors()}`}
    >
      <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
        <span>📝</span> Feedback ({sentiment})
      </h3>
      <p className="text-lg leading-relaxed opacity-90">
        {feedback}
      </p>
    </motion.div>
  );
}