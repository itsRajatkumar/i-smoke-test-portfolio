"use client";

import { useEffect, useState } from "react";
import { scrollState } from "@/lib/scrollState";
import { getChapterAtProgress, getYearAtProgress } from "@/lib/chapters";

export function YearCounter() {
  const [year, setYear] = useState(1999);
  const [chapterName, setChapterName] = useState("School");
  const [accentColor, setAccentColor] = useState("#FF8A65");
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    let animId: number;
    let prevYear = 1999;
    let prevChapter = "";

    const check = () => {
      const p = scrollState.progress;
      const currentYear = getYearAtProgress(p);
      const ch = getChapterAtProgress(p);

      if (currentYear !== prevYear) {
        prevYear = currentYear;
        setYear(currentYear);
      }

      if (ch.name !== prevChapter) {
        prevChapter = ch.name;
        setChapterName(ch.name);
        setAccentColor(ch.palette.accent);
      }

      if (p > 0.02 && showHint) {
        setShowHint(false);
      }

      animId = requestAnimationFrame(check);
    };

    animId = requestAnimationFrame(check);
    return () => cancelAnimationFrame(animId);
  }, [showHint]);

  return (
    <>
      {/* Top-left Year HUD */}
      <div className="fixed top-6 left-6 z-40 pointer-events-none select-none">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-5xl md:text-6xl font-black tracking-tighter text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
            {year}
          </span>
          <div className="flex flex-col">
            <span
              className="text-xs font-bold uppercase tracking-widest drop-shadow-md"
              style={{ color: accentColor }}
            >
              Era
            </span>
            <span className="text-sm font-semibold text-white/90 drop-shadow-md">
              {chapterName}
            </span>
          </div>
        </div>
      </div>

      {/* Top-right Profile Badge */}
      <div className="fixed top-6 right-6 z-40 pointer-events-none select-none hidden sm:block text-right">
        <h1 className="text-base font-bold text-white drop-shadow-md">
          Soniaa S.
        </h1>
        <p className="text-xs text-neutral-300 max-w-xs drop-shadow-md line-clamp-1">
          Fractional CMO · Crafting Brands People Can Feel
        </p>
      </div>

      {/* Floating scroll prompt at start */}
      {showHint && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 pointer-events-none select-none text-center animate-bounce">
          <p className="text-xs tracking-wider uppercase font-semibold text-white/90 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
            Scroll to walk through journey ↓
          </p>
        </div>
      )}
    </>
  );
}
