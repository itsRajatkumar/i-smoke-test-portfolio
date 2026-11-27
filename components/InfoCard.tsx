"use client";

import { useEffect } from "react";
import { StationData } from "@/lib/chapters";

interface Props {
  station: StationData | null;
  onClose: () => void;
  accentColor?: string;
}

export function InfoCard({ station, onClose, accentColor = "#00CEC9" }: Props) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!station) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-white/20 bg-[#121624]/90 p-6 text-white shadow-2xl backdrop-blur-xl transition-all"
        style={{ borderColor: `${accentColor}55` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top header: Chapter badge + Close */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <span
            className="text-xs uppercase font-semibold tracking-wider px-2.5 py-1 rounded-full bg-white/10"
            style={{ color: accentColor }}
          >
            {station.chapter}
          </span>
          <button
            onClick={onClose}
            aria-label="Close station details"
            className="p-1 rounded-full hover:bg-white/15 text-neutral-400 hover:text-white transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Station name & role */}
        <div className="mt-4">
          <h2 className="text-xl font-bold text-white tracking-tight">
            {station.name}
          </h2>
          <p className="text-sm font-medium text-neutral-300 mt-1">
            {station.role}
          </p>
        </div>

        {/* Years & Location */}
        <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-neutral-400">
          <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-md">
            <span>📅</span>
            <span>
              {station.start} – {station.end}
            </span>
          </div>

          {station.place && (
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-md">
              <span>📍</span>
              <span>{station.place}</span>
            </div>
          )}
        </div>

        {/* Note if present */}
        {station.note && (
          <div className="mt-4 pt-3 border-t border-white/10">
            <p className="text-xs leading-relaxed text-neutral-300 italic">
              "{station.note}"
            </p>
          </div>
        )}

        {/* Footer close hint */}
        <div className="mt-5 text-right">
          <button
            onClick={onClose}
            className="text-xs font-semibold px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
