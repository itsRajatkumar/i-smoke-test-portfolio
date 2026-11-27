"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "@/lib/scrollState";
import { getChapterAtProgress, chapters } from "@/lib/chapters";

export function World() {
  const { scene } = useThree();
  const ambientRef = useRef<THREE.AmbientLight>(null!);
  const prevChapterName = useRef("");

  const targetBg = useRef(new THREE.Color(chapters[0].palette.bg));
  const targetFog = useRef(new THREE.Color(chapters[0].palette.fog));
  const targetAmbient = useRef(new THREE.Color(chapters[0].palette.ambient));

  /* Set initial background & fog */
  useEffect(() => {
    scene.background = new THREE.Color(chapters[0].palette.bg);
    scene.fog = new THREE.Fog(chapters[0].palette.fog, 10, 60);
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

    (scene.background as THREE.Color).lerp(targetBg.current, 0.03);

    if (scene.fog) {
      (scene.fog as THREE.Fog).color.lerp(targetFog.current, 0.03);
    }

    if (ambientRef.current) {
      ambientRef.current.color.lerp(targetAmbient.current, 0.03);
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.7} color={chapters[0].palette.ambient} />
      <directionalLight position={[20, 30, 10]} intensity={1.2} />

      {/* Ground plane */}
      <mesh rotation-x={-Math.PI / 2} position={[20, -0.15, 0]}>
        <planeGeometry args={[250, 250]} />
        <meshStandardMaterial color="#7CB342" />
      </mesh>
    </>
  );
}
