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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl border border-white/20 bg-[#121624]/95 p-6 text-white shadow-2xl backdrop-blur-xl transition-all"
        style={{ borderColor: `${accentColor}66` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top header: Chapter badge + Close */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <span
            className="text-xs uppercase font-extrabold tracking-wider px-3 py-1 rounded-full bg-white/10"
            style={{ color: accentColor }}
          >
            {station.chapter}
          </span>
          <button
            onClick={onClose}
            aria-label="Close station details"
            className="p-1.5 rounded-full hover:bg-white/15 text-neutral-400 hover:text-white transition-colors cursor-pointer"
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

        {/* Station name, optional logo, & role */}
        <div className="mt-4 flex items-start gap-4">
          {station.logo && (
            <div className="w-12 h-12 shrink-0 rounded-xl bg-white/10 p-1.5 border border-white/10 flex items-center justify-center overflow-hidden">
              <img
                src={station.logo}
                alt={`${station.name} logo`}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-white tracking-tight">
              {station.name}
            </h2>
            <p className="text-sm font-medium text-neutral-300 mt-1">
              {station.role}
            </p>
          </div>
        </div>

        {/* Years & Location */}
        <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-neutral-300">
          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
            <span>📅</span>
            <span>
              {station.start} – {station.end}
            </span>
          </div>

          {station.place && (
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
              <span>📍</span>
              <span>{station.place}</span>
            </div>
          )}

          {station.website && (
            <a
              href={station.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-[#00CEC9] hover:bg-white/10 transition-colors"
            >
              <span>🔗</span>
              <span>Visit Website ↗</span>
            </a>
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

        {/* Optional skill tags if present */}
        {station.skills && station.skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {station.skills.map((skill) => (
              <span
                key={skill}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/10 text-neutral-300"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Footer close */}
        <div className="mt-5 text-right">
          <button
            onClick={onClose}
            className="text-xs font-semibold px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
