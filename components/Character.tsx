"use client";

import { useEffect, useRef, useState } from "react";
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
  const dupattaSwayRef = useRef<THREE.Group>(null!);
  const torsoBobRef = useRef<THREE.Group>(null!);

  const prevT = useRef(0);
  const walkCycle = useRef(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* Reusable math vectors to avoid per-frame allocations */
  const _pt = useRef(new THREE.Vector3());
  const _tg = useRef(new THREE.Vector3());
  const _cam = useRef(new THREE.Vector3());

  useFrame(({ camera }) => {
    const t = Math.min(Math.max(scrollState.progress, 0), 0.999);

    curve.getPointAt(t, _pt.current);
    curve.getTangentAt(t, _tg.current);

    const pt = _pt.current;
    const tg = _tg.current;

    /* ---- Character Position & Smooth Facing ---- */
    groupRef.current.position.set(pt.x, pt.y + 0.05, pt.z);

    const targetHeading = Math.atan2(tg.x, tg.z);
    groupRef.current.rotation.y = targetHeading;

    /* ---- Walk Animation Driven by Scroll Speed ---- */
    const delta = Math.abs(t - prevT.current);
    prevT.current = t;

    if (!reducedMotion) {
      walkCycle.current += delta * 320;
      const swing = Math.sin(walkCycle.current);
      const bob = Math.abs(Math.sin(walkCycle.current * 2)) * 0.04;

      // Torso subtle bob
      if (torsoBobRef.current) {
        torsoBobRef.current.position.y = bob;
      }

      // Natural limb swing
      if (leftLegRef.current && rightLegRef.current) {
        leftLegRef.current.rotation.x = swing * 0.55;
        rightLegRef.current.rotation.x = -swing * 0.55;
      }
      if (leftArmRef.current && rightArmRef.current) {
        leftArmRef.current.rotation.x = -swing * 0.38;
        rightArmRef.current.rotation.x = swing * 0.38;
      }

      // Dupatta gentle fabric flow in motion
      if (dupattaSwayRef.current) {
        dupattaSwayRef.current.rotation.z = Math.sin(walkCycle.current * 0.8) * 0.12;
        dupattaSwayRef.current.rotation.x = 0.2 + delta * 8;
      }
    } else {
      // Resting poised posture when reduced motion is preferred
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
      if (leftArmRef.current) leftArmRef.current.rotation.x = 0;
      if (rightArmRef.current) rightArmRef.current.rotation.x = 0;
    }

    /* ---- Smooth Third-Person Camera Tracking ---- */
    const isMobile = window.innerWidth < 768;
    const camDist = isMobile ? 12.5 : 9.5;
    const camHeight = isMobile ? 6.5 : 5.2;

    _cam.current.set(
      pt.x - tg.x * camDist,
      pt.y + camHeight,
      pt.z - tg.z * camDist,
    );

    const lerpRate = reducedMotion ? 0.04 : 0.08;
    camera.position.lerp(_cam.current, lerpRate);
    camera.lookAt(pt.x, pt.y + 1.25, pt.z);
  });

  /* Color Palette for Elegant Indian Attire */
  const skinColor = "#D89A7B"; // Warm natural Indian skin tone
  const hairColor = "#1A1412"; // Deep black/espresso hair
  const kurtaColor = "#0E4D64"; // Royal teal silk kurta
  const goldZari = "#F5B041"; // Shimmering gold border / embroidery / jewelry
  const dupattaColor = "#9B2335"; // Deep crimson silk dupatta / chunni
  const churidarColor = "#EAE6DF"; // Off-white/cream churidar trousers
  const juttiColor = "#9B2335"; // Traditional matching embroidered footwear

  return (
    <group ref={groupRef}>
      <group ref={torsoBobRef}>
        {/* ========================================================= */}
        {/*  HEAD & REFINED HAIR STYLING                              */}
        {/* ========================================================= */}
        {/* Slender neck */}
        <mesh position={[0, 1.48, 0]}>
          <cylinderGeometry args={[0.055, 0.065, 0.14, 12]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>

        {/* Head */}
        <mesh position={[0, 1.63, 0]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color={skinColor} roughness={0.6} />
        </mesh>

        {/* Hair: Crown / Front hairline */}
        <mesh position={[0, 1.67, 0.02]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color={hairColor} roughness={0.8} />
        </mesh>

        {/* Hair: Elegant traditional chignon / low bun at back */}
        <mesh position={[0, 1.62, -0.13]}>
          <sphereGeometry args={[0.075, 12, 12]} />
          <meshStandardMaterial color={hairColor} roughness={0.8} />
        </mesh>
        {/* Golden hair accessory ring (Gajra / Bun pin accent) */}
        <mesh position={[0, 1.62, -0.13]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.076, 0.012, 8, 16]} />
          <meshStandardMaterial color={goldZari} metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Traditional red Bindi on forehead */}
        <mesh position={[0, 1.66, 0.125]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshStandardMaterial color="#B01424" roughness={0.4} />
        </mesh>

        {/* Gold Jhumka earrings */}
        <group position={[-0.135, 1.58, 0]}>
          <mesh>
            <sphereGeometry args={[0.016, 8, 8]} />
            <meshStandardMaterial color={goldZari} metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.025, 0]}>
            <coneGeometry args={[0.02, 0.035, 8]} />
            <meshStandardMaterial color={goldZari} metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
        <group position={[0.135, 1.58, 0]}>
          <mesh>
            <sphereGeometry args={[0.016, 8, 8]} />
            <meshStandardMaterial color={goldZari} metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.025, 0]}>
            <coneGeometry args={[0.02, 0.035, 8]} />
            <meshStandardMaterial color={goldZari} metalness={0.8} roughness={0.2} />
          </mesh>
        </group>

        {/* ========================================================= */}
        {/*  UPPER BODY: ELEGANT SILK KURTA & ZARI WORK               */}
        {/* ========================================================= */}
        {/* Fitted silk kurti torso */}
        <mesh position={[0, 1.25, 0]}>
          <cylinderGeometry args={[0.13, 0.155, 0.36, 16]} />
          <meshStandardMaterial color={kurtaColor} roughness={0.45} />
        </mesh>

        {/* Gold embroidered neckline border (Zari yoke) */}
        <mesh position={[0, 1.36, 0.08]} rotation-x={0.15}>
          <boxGeometry args={[0.14, 0.1, 0.02]} />
          <meshStandardMaterial color={goldZari} metalness={0.7} roughness={0.3} />
        </mesh>

        {/* Waist / Kurta Flare (Flared silhouette down to mid-thigh) */}
        <mesh position={[0, 0.95, 0]}>
          <cylinderGeometry args={[0.155, 0.23, 0.35, 16]} />
          <meshStandardMaterial color={kurtaColor} roughness={0.45} />
        </mesh>

        {/* Golden hem border at the base of the kurta */}
        <mesh position={[0, 0.78, 0]}>
          <cylinderGeometry args={[0.228, 0.235, 0.025, 16]} />
          <meshStandardMaterial color={goldZari} metalness={0.7} roughness={0.3} />
        </mesh>

        {/* ========================================================= */}
        {/*  TRADITIONAL DUPATTA / CHUNNI (GRACEFULLY DRAPED)         */}
        {/* ========================================================= */}
        {/* Draped pleated shoulder sash across chest */}
        <mesh position={[-0.04, 1.22, 0.06]} rotation-z={-0.35} rotation-y={0.2}>
          <boxGeometry args={[0.1, 0.42, 0.035]} />
          <meshStandardMaterial color={dupattaColor} roughness={0.5} />
        </mesh>

        {/* Trailing dupatta fabric flowing behind shoulder */}
        <group ref={dupattaSwayRef} position={[-0.15, 1.35, -0.06]}>
          <mesh position={[0, -0.4, -0.05]} rotation-x={0.15}>
            <boxGeometry args={[0.11, 0.75, 0.025]} />
            <meshStandardMaterial color={dupattaColor} roughness={0.5} />
          </mesh>
          {/* Gold lace border on trailing dupatta */}
          <mesh position={[0, -0.77, -0.05]} rotation-x={0.15}>
            <boxGeometry args={[0.115, 0.035, 0.03]} />
            <meshStandardMaterial color={goldZari} metalness={0.7} roughness={0.3} />
          </mesh>
        </group>

        {/* ========================================================= */}
        {/*  ARMS WITH TRADITIONAL BANGLES (CHOODIYAN)                */}
        {/* ========================================================= */}
        {/* Left Arm (Pivots at shoulder) */}
        <group ref={leftArmRef} position={[-0.19, 1.36, 0]}>
          {/* Upper arm (Sleeve) */}
          <mesh position={[0, -0.12, 0]}>
            <cylinderGeometry args={[0.042, 0.04, 0.24, 10]} />
            <meshStandardMaterial color={kurtaColor} roughness={0.45} />
          </mesh>
          {/* Forearm (Skin) */}
          <mesh position={[0, -0.28, 0]}>
            <cylinderGeometry args={[0.036, 0.032, 0.22, 10]} />
            <meshStandardMaterial color={skinColor} roughness={0.6} />
          </mesh>
          {/* Golden bangles stacked at wrist */}
          <mesh position={[0, -0.36, 0]} rotation-x={Math.PI / 2}>
            <torusGeometry args={[0.038, 0.009, 8, 16]} />
            <meshStandardMaterial color={goldZari} metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.38, 0]} rotation-x={Math.PI / 2}>
            <torusGeometry args={[0.038, 0.009, 8, 16]} />
            <meshStandardMaterial color={goldZari} metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Hand */}
          <mesh position={[0, -0.42, 0]}>
            <sphereGeometry args={[0.035, 10, 10]} />
            <meshStandardMaterial color={skinColor} roughness={0.6} />
          </mesh>
        </group>

        {/* Right Arm */}
        <group ref={rightArmRef} position={[0.19, 1.36, 0]}>
          {/* Upper arm (Sleeve) */}
          <mesh position={[0, -0.12, 0]}>
            <cylinderGeometry args={[0.042, 0.04, 0.24, 10]} />
            <meshStandardMaterial color={kurtaColor} roughness={0.45} />
          </mesh>
          {/* Forearm (Skin) */}
          <mesh position={[0, -0.28, 0]}>
            <cylinderGeometry args={[0.036, 0.032, 0.22, 10]} />
            <meshStandardMaterial color={skinColor} roughness={0.6} />
          </mesh>
          {/* Golden bangles stacked at wrist */}
          <mesh position={[0, -0.36, 0]} rotation-x={Math.PI / 2}>
            <torusGeometry args={[0.038, 0.009, 8, 16]} />
            <meshStandardMaterial color={goldZari} metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, -0.38, 0]} rotation-x={Math.PI / 2}>
            <torusGeometry args={[0.038, 0.009, 8, 16]} />
            <meshStandardMaterial color={goldZari} metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Hand */}
          <mesh position={[0, -0.42, 0]}>
            <sphereGeometry args={[0.035, 10, 10]} />
            <meshStandardMaterial color={skinColor} roughness={0.6} />
          </mesh>
        </group>
      </group>

      {/* ========================================================= */}
      {/*  LOWER BODY: FITTED CHURIDAR TROUSERS & JUTTIS            */}
      {/* ========================================================= */}
      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.08, 0.76, 0]}>
        <mesh position={[0, -0.32, 0]}>
          <cylinderGeometry args={[0.048, 0.04, 0.65, 10]} />
          <meshStandardMaterial color={churidarColor} roughness={0.7} />
        </mesh>
        {/* Traditional embroidered Jutti footwear */}
        <mesh position={[0, -0.66, 0.04]} rotation-x={-0.15}>
          <boxGeometry args={[0.08, 0.055, 0.17]} />
          <meshStandardMaterial color={juttiColor} roughness={0.5} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.08, 0.76, 0]}>
        <mesh position={[0, -0.32, 0]}>
          <cylinderGeometry args={[0.048, 0.04, 0.65, 10]} />
          <meshStandardMaterial color={churidarColor} roughness={0.7} />
        </mesh>
        {/* Traditional embroidered Jutti footwear */}
        <mesh position={[0, -0.66, 0.04]} rotation-x={-0.15}>
          <boxGeometry args={[0.08, 0.055, 0.17]} />
          <meshStandardMaterial color={juttiColor} roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}
