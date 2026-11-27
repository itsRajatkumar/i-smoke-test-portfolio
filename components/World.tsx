"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "@/lib/scrollState";
import { getChapterAtProgress, chapters, PATH_COORDS } from "@/lib/chapters";

export function World() {
  const { scene } = useThree();
  const ambientRef = useRef<THREE.AmbientLight>(null!);
  const prevChapterName = useRef("");
  const [reducedMotion, setReducedMotion] = useState(false);

  const targetBg = useRef(new THREE.Color(chapters[0].palette.bg));
  const targetFog = useRef(new THREE.Color(chapters[0].palette.fog));
  const targetAmbient = useRef(new THREE.Color(chapters[0].palette.ambient));

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* Set initial background & fog */
  useEffect(() => {
    scene.background = new THREE.Color(chapters[0].palette.bg);
    scene.fog = new THREE.Fog(chapters[0].palette.fog, 12, 68);
  }, [scene]);

  /* Smooth palette transitions each frame */
  useFrame(() => {
    const chapter = getChapterAtProgress(scrollState.progress);

    if (chapter.name !== prevChapterName.current) {
      prevChapterName.current = chapter.name;
      targetBg.current.set(chapter.palette.bg);
      targetFog.current.set(chapter.palette.fog);
      targetAmbient.current.set(chapter.palette.ambient);
    }

    const lerpSpeed = reducedMotion ? 0.1 : 0.035;

    (scene.background as THREE.Color).lerp(targetBg.current, lerpSpeed);

    if (scene.fog) {
      (scene.fog as THREE.Fog).color.lerp(targetFog.current, lerpSpeed);
    }

    if (ambientRef.current) {
      ambientRef.current.color.lerp(targetAmbient.current, lerpSpeed);
    }
  });

  /* Scatter decorative low-poly trees and garden stones along the path */
  const foliage = useMemo(() => {
    const items: Array<{
      pos: [number, number, number];
      type: "tree" | "stone";
      scale: number;
    }> = [];

    PATH_COORDS.forEach(([x, , z], idx) => {
      if (idx % 2 === 0) {
        // Place on either side of the path at comfortable distance
        items.push({
          pos: [x + 6 + (idx % 3), 0, z - 7 - (idx % 4)],
          type: "tree",
          scale: 0.8 + (idx % 4) * 0.2,
        });
        items.push({
          pos: [x - 5 - (idx % 2), 0, z + 6 + (idx % 3)],
          type: "stone",
          scale: 0.6 + (idx % 3) * 0.25,
        });
      }
    });

    return items;
  }, []);

  return (
    <>
      <ambientLight
        ref={ambientRef}
        intensity={0.8}
        color={chapters[0].palette.ambient}
      />
      <directionalLight
        position={[25, 35, 15]}
        intensity={1.3}
        castShadow={false}
      />

      {/* Ground plane */}
      <mesh rotation-x={-Math.PI / 2} position={[20, -0.12, 0]}>
        <planeGeometry args={[300, 300]} />
        <meshStandardMaterial color="#4A6B36" roughness={0.9} />
      </mesh>

      {/* Decorative low-poly foliage along the path */}
      {foliage.map((item, i) => (
        <group
          key={i}
          position={item.pos}
          scale={[item.scale, item.scale, item.scale]}
        >
          {item.type === "tree" ? (
            <>
              {/* Trunk */}
              <mesh position={[0, 0.8, 0]}>
                <cylinderGeometry args={[0.18, 0.25, 1.6, 6]} />
                <meshStandardMaterial color="#5C4033" roughness={0.9} />
              </mesh>
              {/* Foliage canopy */}
              <mesh position={[0, 2.3, 0]}>
                <coneGeometry args={[1.1, 2.2, 6]} />
                <meshStandardMaterial color="#2E5A27" roughness={0.8} />
              </mesh>
            </>
          ) : (
            /* Low-poly garden stone */
            <mesh position={[0, 0.25, 0]}>
              <dodecahedronGeometry args={[0.45, 0]} />
              <meshStandardMaterial color="#707B7C" roughness={0.9} />
            </mesh>
          )}
        </group>
      ))}
    </>
  );
}
