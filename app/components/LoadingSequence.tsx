"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export const EASE = [0.16, 1, 0.3, 1] as const;

const PHRASES = [
  "Reading your CV. Properly, not just the keywords.",
  "Counting how many bullets begin with “Responsible for”.",
  "Checking whether page two earns its place.",
  "Looking for the achievement you buried at the bottom.",
  "Cross-examining your dates.",
  "Working out what a recruiter sees in seven seconds.",
  "Deciding whether “passionate self-starter” is doing any work.",
  "Measuring your margins. Yes, really.",
  "Checking what you claim against what you've shown.",
  "Writing this up honestly. Brace yourself.",
];

const PHRASE_DURATION_MS = 3500;
const TOTAL_DURATION_MS = PHRASES.length * PHRASE_DURATION_MS;

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function formatElapsed(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function LoadingSequence() {
  const shouldReduceMotion = useReducedMotion();
  const [phrases, setPhrases] = useState(() => shuffle(PHRASES));
  const [index, setIndex] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (index < phrases.length - 1) {
        setIndex((i) => i + 1);
      } else {
        setPhrases(shuffle(PHRASES));
        setIndex(0);
        setCycle((c) => c + 1);
      }
    }, PHRASE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [index, phrases.length]);

  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => setElapsedMs(Date.now() - start), 250);
    return () => clearInterval(timer);
  }, []);

  const yOffset = shouldReduceMotion ? 0 : 8;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#14213D] px-6">
      <div className="relative flex h-20 w-full max-w-xl items-center justify-center text-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: yOffset }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -yOffset }}
            transition={{ duration: 0.25, ease: EASE }}
            className="absolute inset-0 flex items-center justify-center px-4 font-serif text-[22px] text-[#EFEAE0]"
          >
            {phrases[index]}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="relative mt-8 h-px w-full max-w-[400px] bg-[#24344F]">
        <motion.div
          key={cycle}
          className="absolute left-0 top-0 h-full bg-[#7A2E2E]"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: TOTAL_DURATION_MS / 1000, ease: "linear" }}
        />
      </div>

      <span className="mt-4 text-xs text-[#9AA3B5]">
        {formatElapsed(elapsedMs)}
      </span>
    </div>
  );
}
