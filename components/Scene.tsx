"use client";

import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { PATH_COORDS, chapters } from "@/lib/chapters";
import { World } from "./World";
import { Character } from "./Character";
import { Landmark } from "./Landmark";
import { Tower } from "./Tower";

/* ------------------------------------------------------------------ */
/*  Precomputed landmark placement data                                */
/* ------------------------------------------------------------------ */

interface LandmarkEntry {
  stationName: string;
  stationStart: number;
  chapterIndex: number;
  position: [number, number, number];
  accentColor: string;
}

/* ------------------------------------------------------------------ */
/*  Experience (lives inside <Canvas>)                                 */
/* ------------------------------------------------------------------ */

function Experience() {
  const curve = useMemo(() => {
    const pts = PATH_COORDS.map(([x, y, z]) => new THREE.Vector3(x, y, z));
    return new THREE.CatmullRomCurve3(pts);
  }, []);

  /* Compute landmark world positions from their chapter progress ranges */
  const landmarks: LandmarkEntry[] = useMemo(() => {
    return chapters.flatMap((ch, chIdx) =>
      ch.stations.map((station, sIdx) => {
        const range = ch.progressEnd - ch.progressStart;
        const count = ch.stations.length;
        const t = ch.progressStart + (range * (sIdx + 1)) / (count + 1);
        const clamped = Math.min(t, 0.999);

        const point = curve.getPointAt(clamped);
        const tangent = curve.getTangentAt(clamped);

        // Perpendicular offset in the XZ plane
        const nx = -tangent.z;
        const nz = tangent.x;
        const len = Math.sqrt(nx * nx + nz * nz) || 1;
        const side = sIdx % 2 === 0 ? 1 : -1;
        const offset = 3.5;

        return {
          stationName: station.name,
          stationStart: station.start,
          chapterIndex: chIdx,
          position: [
            point.x + (nx / len) * offset * side,
            0,
            point.z + (nz / len) * offset * side,
          ] as [number, number, number],
          accentColor: ch.palette.accent,
        };
      }),
    );
  }, [curve]);

  return (
    <>
      <World />

      {/* Visible path (brown tube along the curve) */}
      <mesh>
        <tubeGeometry args={[curve, 300, 0.12, 8, false]} />
        <meshStandardMaterial color="#8B6914" />
      </mesh>

      <Character curve={curve} />

      {/* Slice 1: landmarks for first 3 chapters (School, College, B-schools) */}
      {landmarks
        .filter((l) => l.chapterIndex < 3)
        .map((l) => (
          <Landmark
            key={`${l.stationName}-${l.stationStart}`}
            position={l.position}
            name={l.stationName}
            accentColor={l.accentColor}
          />
        ))}

      <Tower />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Canvas wrapper (default export for dynamic import)                 */
/* ------------------------------------------------------------------ */

export default function SceneCanvas() {
  return (
    <Canvas
      camera={{ position: [-46, 6, -8], fov: 60, near: 0.1, far: 200 }}
      gl={{ antialias: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <Experience />
    </Canvas>
  );
}
