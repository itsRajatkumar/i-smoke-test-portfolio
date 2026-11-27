"use client";

import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { PATH_COORDS, chapters, StationData } from "@/lib/chapters";
import { World } from "./World";
import { Character } from "./Character";
import { Landmark } from "./Landmark";
import { Tower } from "./Tower";
import { ISmokeStackTower } from "./ISmokeStackTower";

/* ------------------------------------------------------------------ */
/*  Precomputed landmark placement data                                */
/* ------------------------------------------------------------------ */

interface LandmarkEntry {
  station: StationData;
  chapterIndex: number;
  position: [number, number, number];
  accentColor: string;
}

/* ------------------------------------------------------------------ */
/*  Experience (lives inside <Canvas>)                                 */
/* ------------------------------------------------------------------ */

interface ExperienceProps {
  onSelectStation: (station: StationData) => void;
}

function Experience({ onSelectStation }: ExperienceProps) {
  const curve = useMemo(() => {
    const pts = PATH_COORDS.map(([x, y, z]) => new THREE.Vector3(x, y, z));
    return new THREE.CatmullRomCurve3(pts);
  }, []);

  /* Compute landmark world positions for all 7 chapters */
  const landmarks: LandmarkEntry[] = useMemo(() => {
    return chapters.flatMap((ch, chIdx) =>
      ch.stations.map((station, sIdx) => {
        const range = ch.progressEnd - ch.progressStart;
        const count = ch.stations.length;
        const t = ch.progressStart + (range * (sIdx + 1)) / (count + 1);
        const clamped = Math.min(Math.max(t, 0.01), 0.985);

        const point = curve.getPointAt(clamped);
        const tangent = curve.getTangentAt(clamped);

        // Perpendicular offset in the XZ plane
        const nx = -tangent.z;
        const nz = tangent.x;
        const len = Math.sqrt(nx * nx + nz * nz) || 1;
        const side = sIdx % 2 === 0 ? 1 : -1;
        const offset = 3.6;

        return {
          station,
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

      {/* Visible path (brown/golden tube along the curve) */}
      <mesh>
        <tubeGeometry args={[curve, 350, 0.16, 8, false]} />
        <meshStandardMaterial color="#A0782A" roughness={0.6} />
      </mesh>

      <Character curve={curve} />

      {/* Render interactive landmarks for ALL stations */}
      {landmarks.map((l) => (
        <Landmark
          key={`${l.station.name}-${l.station.start}`}
          position={l.position}
          station={l.station}
          accentColor={l.accentColor}
          onSelect={onSelectStation}
        />
      ))}

      {/* Monolithic growing chapter tower */}
      <Tower />

      {/* i-SmokeStack destination tower at the end of the path */}
      <ISmokeStackTower position={[80, 0, 0]} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Canvas wrapper (default export for dynamic import)                 */
/* ------------------------------------------------------------------ */

interface SceneCanvasProps {
  onSelectStation: (station: StationData) => void;
}

export default function SceneCanvas({ onSelectStation }: SceneCanvasProps) {
  return (
    <Canvas
      camera={{ position: [-46, 6, -8], fov: 60, near: 0.1, far: 250 }}
      gl={{ antialias: true, alpha: false }}
      style={{ width: "100%", height: "100%" }}
    >
      <Experience onSelectStation={onSelectStation} />
    </Canvas>
  );
}
