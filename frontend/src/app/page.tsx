"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bot, Mic, Sparkles, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">

      {/* 1. Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span>Intervue.</span>
          </div>

          {/* Dummy Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Features</a>
            <a href="#" className="hover:text-white transition-colors">Pricing</a>
            <a href="#" className="hover:text-white transition-colors">About Us</a>
            <a href="#" className="hover:text-white transition-colors">Blog</a>
          </div>

          {/* CTA Button */}
          <div className="flex items-center gap-4">
            <Link href="/practise">
              <button className="bg-white text-black px-5 py-2.5 rounded-full font-semibold hover:bg-gray-200 transition-all text-sm">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <main className="container mx-auto px-6 pt-32 pb-20 text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 text-sm font-medium mb-8"
        >
          <Sparkles className="w-4 h-4" />
          <span>Now with GPT-4 Turbo Integration</span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-br from-white via-gray-300 to-gray-600 bg-clip-text text-transparent"
        >
          Master Your Next <br />
          Technical Interview.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Practice with our AI-powered coach. Get real-time feedback on your tone,
          clarity, and technical accuracy. No more awkward mock interviews.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col md:flex-row items-center justify-center gap-4"
        >
          <Link href="/practise">
            <button className="flex items-center gap-2 bg-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-500 transition-all hover:scale-105 shadow-lg shadow-blue-500/25">
              <Mic className="w-5 h-5" />
              Start Interview
            </button>
          </Link>
          <button className="px-8 py-4 rounded-full font-bold text-lg text-gray-300 hover:text-white border border-white/10 hover:border-white/20 transition-all">
            View Demo
          </button>
        </motion.div>

        {/* 3. Feature Grid (Visual Filler) */}
        <div className="grid md:grid-cols-3 gap-8 mt-32 text-left">
          {[
            { icon: Bot, title: "AI Roleplay", desc: "Simulates real HR and Technical managers." },
            { icon: Mic, title: "Voice Analysis", desc: "Detects nervousness and suggests tone improvements." },
            { icon: Zap, title: "Instant Feedback", desc: "Get graded on your answers immediately." },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (i * 0.1) }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <feature.icon className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

      </main>
    </div>
  );
}