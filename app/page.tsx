"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollState } from "@/lib/scrollState";
import { FallbackList } from "@/components/FallbackList";
import { YearCounter } from "@/components/YearCounter";
import { InfoCard } from "@/components/InfoCard";
import { StationData, getChapterAtProgress } from "@/lib/chapters";

gsap.registerPlugin(ScrollTrigger);

const SceneCanvas = dynamic(() => import("@/components/Scene"), { ssr: false });

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [selectedStation, setSelectedStation] = useState<StationData | null>(null);
  const [activeAccent, setActiveAccent] = useState<string>("#FF8A65");

  /* Detect WebGL support */
  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      const gl = c.getContext("webgl") || c.getContext("experimental-webgl");
      setWebgl(!!gl);
    } catch {
      setWebgl(false);
    }
  }, []);

  /* Set up ScrollTrigger once WebGL is confirmed */
  useEffect(() => {
    if (!webgl || !containerRef.current) return;

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
      onUpdate: (self) => {
        scrollState.progress = self.progress;
      },
    });

    return () => {
      st.kill();
    };
  }, [webgl]);

  const handleSelectStation = useCallback((station: StationData) => {
    const ch = getChapterAtProgress(scrollState.progress);
    setActiveAccent(ch.palette.accent);
    setSelectedStation(station);
  }, []);

  const handleCloseCard = useCallback(() => {
    setSelectedStation(null);
  }, []);

  /* Loading state */
  if (webgl === null) {
    return <div className="h-screen bg-[#1a1a2e]" />;
  }

  /* No WebGL → accessible fallback */
  if (!webgl) {
    return <FallbackList />;
  }

  return (
    <div ref={containerRef} style={{ height: "650vh" }}>
      {/* Fixed 3D canvas */}
      <div className="fixed inset-0 z-0">
        <SceneCanvas onSelectStation={handleSelectStation} />
      </div>

      {/* Floating HUD: Year counter, Era indicator, Brand */}
      <YearCounter />

      {/* Interactive Station Info Card */}
      <InfoCard
        station={selectedStation}
        onClose={handleCloseCard}
        accentColor={activeAccent}
      />
    </div>
  );
}
