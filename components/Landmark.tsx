"use client";

import { useRef, useState } from "react";
import { Text } from "@react-three/drei";
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
      <mesh position={[0, height / 2, 0]}>
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
      <mesh position={[0, height + 0.5, 0]}>
        <octahedronGeometry args={[0.18, 0]} />
        <meshStandardMaterial
          color={hovered ? "#ffffff" : accentColor}
          emissive={accentColor}
          emissiveIntensity={hovered ? 1 : 0.4}
        />
      </mesh>

      {/* Floating station title */}
      <Text
        position={[0, height + 0.9, 0]}
        fontSize={0.24}
        color={hovered ? "#38E8D0" : "white"}
        anchorX="center"
        anchorY="bottom"
        outlineWidth={0.03}
        outlineColor="#000000"
        maxWidth={3}
        textAlign="center"
      >
        {station.name}
      </Text>
    </group>
  );
}
