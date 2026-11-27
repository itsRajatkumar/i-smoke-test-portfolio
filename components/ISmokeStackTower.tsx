"use client";

import { useRef } from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface Props {
  position: [number, number, number];
}

/**
 * The destination terminal: i-SmokeStack tower with the slogan
 * "Do More by Doing Less", neon cyan-to-lime architectural aesthetic.
 */
export function ISmokeStackTower({ position }: Props) {
  const groupRef = useRef<THREE.Group>(null!);

  return (
    <group ref={groupRef} position={position}>
      {/* Podium base */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[4, 4.5, 0.8, 16]} />
        <meshStandardMaterial color="#0b1b24" roughness={0.4} />
      </mesh>

      {/* Main glass & neon spire tower */}
      <mesh position={[0, 7, 0]}>
        <boxGeometry args={[3.2, 13, 3.2]} />
        <meshStandardMaterial
          color="#00CEC9"
          emissive="#00B894"
          emissiveIntensity={0.25}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Crown / Top Beacon */}
      <mesh position={[0, 14.2, 0]}>
        <coneGeometry args={[1.8, 2.5, 4]} />
        <meshStandardMaterial
          color="#38E8D0"
          emissive="#55EFC4"
          emissiveIntensity={0.8}
          toneMapped={false}
        />
      </mesh>

      {/* Neon light rings */}
      <mesh position={[0, 4.5, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[2.2, 0.08, 8, 32]} />
        <meshStandardMaterial
          color="#00B894"
          emissive="#55EFC4"
          emissiveIntensity={1}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0, 9.5, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[2.2, 0.08, 8, 32]} />
        <meshStandardMaterial
          color="#00CEC9"
          emissive="#81ECEC"
          emissiveIntensity={1}
          toneMapped={false}
        />
      </mesh>

      {/* Tower Title */}
      <Text
        position={[0, 11, 1.8]}
        fontSize={0.5}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#001815"
      >
        i-SmokeStack
      </Text>

      {/* Slogan */}
      <Text
        position={[0, 10.2, 1.8]}
        fontSize={0.25}
        color="#81ECEC"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#001815"
      >
        "Do More by Doing Less"
      </Text>
    </group>
  );
}
