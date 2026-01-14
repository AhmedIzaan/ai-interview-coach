"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Briefcase, Volume2, ArrowRight } from "lucide-react";

export default function SetupPage() {
    const router = useRouter();
    const [customRole, setCustomRole] = useState("");
    const [selectedTone, setSelectedTone] = useState("professional");

    const suggestedRoles = [
        "Software Engineer",
        "Data Scientist",
        "Product Manager",
        "DevOps Engineer",
        "Marketing Manager",
        "Sales Representative",
        "HR Manager",
        "Financial Analyst",
    ];

    const tones = [
        { value: "professional", label: "Professional", description: "Formal and business-like" },
        { value: "friendly", label: "Friendly", description: "Warm and encouraging" },
        { value: "strict", label: "Strict", description: "Direct and challenging" },
        { value: "casual", label: "Casual", description: "Relaxed and conversational" },
    ];

    const handleStart = () => {
        const roleToUse = customRole.trim() || "Software Engineer";
        router.push(`/practise?role=${encodeURIComponent(roleToUse)}&tone=${selectedTone}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-3xl bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 md:p-12"
            >
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Customize Your Interview
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Tell us what role you're practicing for and choose your interviewer's style
                    </p>
                </div>

                {/* Role Selection */}
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-4">
                        <Briefcase className="w-5 h-5 text-blue-400" />
                        <h2 className="text-xl font-semibold text-white">Enter Your Role</h2>
                    </div>

                    {/* Custom Role Input */}
                    <input
                        type="text"
                        value={customRole}
                        onChange={(e) => setCustomRole(e.target.value)}
                        placeholder="e.g., Software Engineer, Teacher, Doctor, etc."
                        className="w-full p-4 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all mb-4 text-lg"
                    />

                    {/* Suggested Roles */}
                    <div className="mb-2">
                        <p className="text-sm text-gray-400 mb-2">Or choose a suggestion:</p>
                        <div className="flex flex-wrap gap-2">
                            {suggestedRoles.map((role) => (
                                <button
                                    key={role}
                                    onClick={() => setCustomRole(role)}
                                    className="px-3 py-1.5 rounded-full text-sm bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10 transition-all"
                                >
                                    {role}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tone Selection */}
                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-4">
                        <Volume2 className="w-5 h-5 text-blue-400" />
                        <h2 className="text-xl font-semibold text-white">Interviewer Tone</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tones.map((tone) => (
                            <button
                                key={tone.value}
                                onClick={() => setSelectedTone(tone.value)}
                                className={`p-5 rounded-lg text-left transition-all ${selectedTone === tone.value
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 border-2 border-blue-400"
                                    : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                                    }`}
                            >
                                <div className="font-semibold text-lg mb-1">{tone.label}</div>
                                <div className={`text-sm ${selectedTone === tone.value ? 'text-blue-100' : 'text-gray-400'}`}>
                                    {tone.description}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Start Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleStart}
                    className="w-full bg-blue-600 text-white font-bold text-lg py-5 rounded-full hover:bg-blue-500 transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-500/30"
                >
                    Start Interview
                    <ArrowRight className="w-5 h-5" />
                </motion.button>

                {/* Summary */}
                <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-gray-400 text-sm text-center">
                        You'll be interviewed for <span className="text-white font-semibold">{customRole || "Software Engineer"}</span> with a{" "}
                        <span className="text-white font-semibold">{selectedTone}</span> tone
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
