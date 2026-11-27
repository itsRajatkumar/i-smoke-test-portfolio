"use client";

import { Text } from "@react-three/drei";

interface Props {
  position: [number, number, number];
  name: string;
  accentColor: string;
}

export function Landmark({ position, name, accentColor }: Props) {
  const height = 2;

  return (
    <group position={position}>
      {/* Building body */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[1.2, height, 1.2]} />
        <meshStandardMaterial color={accentColor} />
      </mesh>

      {/* Roof accent strip */}
      <mesh position={[0, height + 0.15, 0]}>
        <boxGeometry args={[1.4, 0.3, 1.4]} />
        <meshStandardMaterial color={accentColor} toneMapped={false} />
      </mesh>

      {/* Floating label */}
      <Text
        position={[0, height + 0.8, 0]}
        fontSize={0.22}
        color="white"
        anchorX="center"
        anchorY="bottom"
        outlineWidth={0.025}
        outlineColor="#000000"
        maxWidth={3}
        textAlign="center"
      >
        {name}
      </Text>
    </group>
  );
}
