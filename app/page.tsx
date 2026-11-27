"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollState } from "@/lib/scrollState";
import { FallbackList } from "@/components/FallbackList";

gsap.registerPlugin(ScrollTrigger);

const SceneCanvas = dynamic(() => import("@/components/Scene"), { ssr: false });

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webgl, setWebgl] = useState<boolean | null>(null);

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

  /* Loading state */
  if (webgl === null) {
    return <div className="h-screen bg-[#1a1a2e]" />;
  }

  /* No WebGL → accessible fallback */
  if (!webgl) {
    return <FallbackList />;
  }

  return (
    <div ref={containerRef} style={{ height: "500vh" }}>
      {/* Fixed 3D canvas */}
      <div className="fixed inset-0" style={{ pointerEvents: "none" }}>
        <SceneCanvas />
      </div>
    </div>
  );
}
