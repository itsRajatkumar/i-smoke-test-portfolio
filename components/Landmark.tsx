"use client";

import { useRef, useState } from "react";
import { Text, Billboard } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { StationData } from "@/lib/chapters";

interface Props {
  position: [number, number, number];
  station: StationData;
  accentColor: string;
  onSelect: (station: StationData) => void;
}

export function Landmark({ position, station, accentColor, onSelect }: Props) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Group>(null!);
  const height = 2;

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = "auto";
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect(station);
  };

  // Generate initials for the 3D landmark badge
  const initials = station.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <group
      ref={meshRef}
      position={position}
      scale={hovered ? [1.12, 1.12, 1.12] : [1, 1, 1]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* Building base */}
      <mesh position={[0, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, height, 1.2]} />
        <meshStandardMaterial
          color={hovered ? "#ffffff" : accentColor}
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      {/* Roof accent block */}
      <mesh position={[0, height + 0.15, 0]}>
        <boxGeometry args={[1.4, 0.3, 1.4]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={hovered ? 0.6 : 0.2}
          toneMapped={false}
        />
      </mesh>

      {/* Floating landmark beacon/marker */}
      <mesh position={[0, height + 0.45, 0]}>
        <octahedronGeometry args={[0.18, 0]} />
        <meshStandardMaterial
          color={hovered ? "#ffffff" : accentColor}
          emissive={accentColor}
          emissiveIntensity={hovered ? 1 : 0.4}
        />
      </mesh>

      {/* ========================================================= */}
      {/*  BILLBOARD: Always faces camera directly from any angle   */}
      {/* ========================================================= */}
      <Billboard position={[0, height + 0.95, 0]} follow={true}>
        {/* Signboard Backing Pill for maximum contrast & visibility */}
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[2.8, 0.65]} />
          <meshBasicMaterial
            color="#0b1118"
            transparent={true}
            opacity={hovered ? 0.92 : 0.82}
          />
        </mesh>

        {/* Brand/Initials Badge */}
        <mesh position={[-1.05, 0, 0]}>
          <circleGeometry args={[0.2, 24]} />
          <meshBasicMaterial color={hovered ? "#38E8D0" : accentColor} />
        </mesh>
        <Text
          position={[-1.05, 0, 0.01]}
          fontSize={0.15}
          color="#0b1118"
          anchorX="center"
          anchorY="middle"
          fontWeight="bold"
        >
          {initials}
        </Text>

        {/* Station Name - Always camera facing */}
        <Text
          position={[0.1, 0.07, 0]}
          fontSize={0.2}
          color={hovered ? "#38E8D0" : "#ffffff"}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.02}
          outlineColor="#000000"
          maxWidth={2.0}
          textAlign="left"
        >
          {station.name}
        </Text>

        {/* Role or Years subtext */}
        <Text
          position={[0.1, -0.14, 0]}
          fontSize={0.12}
          color="#A0AEC0"
          anchorX="center"
          anchorY="middle"
          maxWidth={2.0}
          textAlign="left"
        >
          {station.start} – {station.end}
        </Text>
      </Billboard>
    </group>
  );
}
