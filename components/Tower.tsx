"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "@/lib/scrollState";
import { chapters } from "@/lib/chapters";

/**
 * A growing tower in the background — one block per chapter entered.
 * Blocks reveal as the visitor scrolls into each chapter's progress range.
 */
export function Tower() {
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(() => {
    const t = scrollState.progress;
    chapters.forEach((ch, i) => {
      const mesh = meshRefs.current[i];
      if (mesh) mesh.visible = t >= ch.progressStart;
    });
  });

  return (
    <group position={[20, 0, -22]}>
      {chapters.map((ch, i) => (
        <mesh
          key={ch.name}
          ref={(el) => {
            meshRefs.current[i] = el;
          }}
          position={[0, i * 3.2 + 1.6, 0]}
          visible={false}
        >
          <boxGeometry args={[3, 3, 3]} />
          <meshStandardMaterial color={ch.palette.accent} />
        </mesh>
      ))}
    </group>
  );
}
