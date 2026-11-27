"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollState } from "@/lib/scrollState";
import { FallbackList } from "@/components/FallbackList";
import { YearCounter } from "@/components/YearCounter";
import { InfoCard } from "@/components/InfoCard";
import { ContactForm } from "@/components/ContactForm";
import { StationData, getChapterAtProgress } from "@/lib/chapters";
import { trackEvent } from "@/lib/analytics";

gsap.registerPlugin(ScrollTrigger);

const SceneCanvas = dynamic(() => import("@/components/Scene"), { ssr: false });

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const [selectedStation, setSelectedStation] = useState<StationData | null>(null);
  const [activeAccent, setActiveAccent] = useState<string>("#FF8A65");
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [inFinalChapter, setInFinalChapter] = useState(false);

  /* Analytics dwell time tracking refs */
  const activeChapterRef = useRef<string>("School");
  const chapterEnterTimeRef = useRef<number>(Date.now());
  const milestonesReached = useRef<Set<number>>(new Set());

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

  /* Initial visit event */
  useEffect(() => {
    trackEvent("chapter_enter", { chapter: "School", initial: true });
    chapterEnterTimeRef.current = Date.now();

    const handleBeforeUnload = () => {
      const dwell = Date.now() - chapterEnterTimeRef.current;
      trackEvent("chapter_dwell_ms", {
        chapter: activeChapterRef.current,
        dwell_ms: dwell,
      });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
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
        const p = self.progress;
        scrollState.progress = p;

        // 1. Chapter enter / dwell tracking
        const ch = getChapterAtProgress(p);
        if (ch.name !== activeChapterRef.current) {
          const dwell = Date.now() - chapterEnterTimeRef.current;
          trackEvent("chapter_dwell_ms", {
            chapter: activeChapterRef.current,
            dwell_ms: dwell,
          });

          activeChapterRef.current = ch.name;
          chapterEnterTimeRef.current = Date.now();
          trackEvent("chapter_enter", { chapter: ch.name });
        }

        // 2. Final chapter detection (shows contact dock)
        setInFinalChapter(p >= 0.88);

        // 3. Scroll depth milestones (25%, 50%, 75%, 100%)
        const milestones = [
          { pct: 25, val: 0.25 },
          { pct: 50, val: 0.5 },
          { pct: 75, val: 0.75 },
          { pct: 100, val: 0.98 },
        ];

        milestones.forEach((m) => {
          if (p >= m.val && !milestonesReached.current.has(m.pct)) {
            milestonesReached.current.add(m.pct);
            trackEvent("scroll_depth", { depth: `${m.pct}%` });
          }
        });
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
    trackEvent("station_open", {
      station: station.name,
      chapter: station.chapter,
    });
  }, []);

  const handleCloseCard = useCallback(() => {
    setSelectedStation(null);
  }, []);

  const handleOpenContact = useCallback(() => {
    setIsContactOpen(true);
    trackEvent("cta_click", { button: "contact_modal_trigger" });
  }, []);

  const handleCloseContact = useCallback(() => {
    setIsContactOpen(false);
  }, []);

  /* Loading state */
  if (webgl === null) {
    return <div className="h-screen bg-[#1a1a2e]" />;
  }

  /* No WebGL → accessible fallback */
  if (!webgl) {
    return (
      <div className="min-h-screen bg-[#1a1a2e]">
        <FallbackList />
        <div className="max-w-2xl mx-auto px-6 pb-20">
          <ContactForm />
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ height: "650vh" }}>
      {/* Fixed 3D canvas */}
      <div className="fixed inset-0 z-0">
        <SceneCanvas onSelectStation={handleSelectStation} />
      </div>

      {/* Floating HUD: Year counter, Era indicator, Brand */}
      <YearCounter />

      {/* Top Action CTA: Contact Sonia */}
      <div className="fixed top-6 right-6 z-40 flex items-center gap-3">
        <button
          onClick={handleOpenContact}
          className="text-xs font-bold tracking-wide uppercase px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-md transition-all active:scale-95 cursor-pointer shadow-lg"
        >
          Contact Sonia
        </button>
      </div>

      {/* Final Scene Contact Form Section (revealed as visitor reaches i-SmokeStack era) */}
      <div
        className={`fixed bottom-6 right-6 z-40 transition-all duration-700 ease-out max-w-sm hidden sm:block ${
          inFinalChapter && !isContactOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        <ContactForm />
      </div>

      {/* Full Contact Form Modal (triggered by button or mobile) */}
      {isContactOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
          onClick={handleCloseContact}
        >
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg">
            <ContactForm isModal onClose={handleCloseContact} />
          </div>
        </div>
      )}

      {/* Interactive Station Info Card */}
      <InfoCard
        station={selectedStation}
        onClose={handleCloseCard}
        accentColor={activeAccent}
      />
    </div>
  );
}
