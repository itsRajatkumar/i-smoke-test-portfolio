"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { scrollState } from "@/lib/scrollState";

interface Props {
  curve: THREE.CatmullRomCurve3;
}

export function Character({ curve }: Props) {
  const groupRef = useRef<THREE.Group>(null!);
  const leftArmRef = useRef<THREE.Group>(null!);
  const rightArmRef = useRef<THREE.Group>(null!);
  const leftLegRef = useRef<THREE.Group>(null!);
  const rightLegRef = useRef<THREE.Group>(null!);

  const prevT = useRef(0);
  const walkCycle = useRef(0);

  /* Reusable vectors — no per-frame allocation */
  const _pt = useRef(new THREE.Vector3());
  const _tg = useRef(new THREE.Vector3());
  const _cam = useRef(new THREE.Vector3());

  useFrame(({ camera }) => {
    const t = Math.min(Math.max(scrollState.progress, 0), 0.999);

    curve.getPointAt(t, _pt.current);
    curve.getTangentAt(t, _tg.current);

    const pt = _pt.current;
    const tg = _tg.current;

    /* ---- character position & facing ---- */
    groupRef.current.position.set(pt.x, pt.y + 0.12, pt.z);
    groupRef.current.rotation.y = Math.atan2(tg.x, tg.z);

    /* ---- walk animation (scroll-speed driven) ---- */
    const delta = Math.abs(t - prevT.current);
    prevT.current = t;
    walkCycle.current += delta * 300;

    const swing = Math.sin(walkCycle.current);
    leftLegRef.current.rotation.x  =  swing * 0.6;
    rightLegRef.current.rotation.x = -swing * 0.6;
    leftArmRef.current.rotation.x  = -swing * 0.4;
    rightArmRef.current.rotation.x =  swing * 0.4;

    /* ---- third-person camera follow ---- */
    _cam.current.set(
      pt.x - tg.x * 10,
      pt.y + 6,
      pt.z - tg.z * 10,
    );
    camera.position.lerp(_cam.current, 0.08);
    camera.lookAt(pt.x, pt.y + 1.2, pt.z);
  });

  return (
    <group ref={groupRef}>
      {/* Head */}
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color="#FFB74D" />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[0.35, 0.5, 0.2]} />
        <meshStandardMaterial color="#42A5F5" />
      </mesh>

      {/* Left arm (pivots at shoulder) */}
      <group ref={leftArmRef} position={[-0.25, 1.3, 0]}>
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.4, 8]} />
          <meshStandardMaterial color="#FFB74D" />
        </mesh>
      </group>

      {/* Right arm */}
      <group ref={rightArmRef} position={[0.25, 1.3, 0]}>
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.4, 8]} />
          <meshStandardMaterial color="#FFB74D" />
        </mesh>
      </group>

      {/* Left leg (pivots at hip) */}
      <group ref={leftLegRef} position={[-0.1, 0.7, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.5, 8]} />
          <meshStandardMaterial color="#5D4037" />
        </mesh>
      </group>

      {/* Right leg */}
      <group ref={rightLegRef} position={[0.1, 0.7, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.5, 8]} />
          <meshStandardMaterial color="#5D4037" />
        </mesh>
      </group>
    </group>
  );
}
