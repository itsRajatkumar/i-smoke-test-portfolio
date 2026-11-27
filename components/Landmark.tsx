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

/* ================================================================== */
/*  1. SCHOOLHOUSE (Red-brick, pitched roof, clock/bell tower)        */
/* ================================================================== */
function SchoolBuilding({ hovered, accent }: { hovered: boolean; accent: string }) {
  return (
    <group>
      {/* Foundation steps */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[2.2, 0.2, 1.8]} />
        <meshStandardMaterial color="#8D6E63" roughness={0.8} />
      </mesh>

      {/* Main brick school block */}
      <mesh position={[0, 1.0, 0]}>
        <boxGeometry args={[1.9, 1.6, 1.5]} />
        <meshStandardMaterial
          color={hovered ? "#C0392B" : "#A93226"}
          roughness={0.7}
        />
      </mesh>

      {/* Pitched Terracotta Roof */}
      <mesh position={[0, 2.1, 0]} rotation-y={Math.PI / 4}>
        <coneGeometry args={[1.55, 0.9, 4]} />
        <meshStandardMaterial color="#D35400" roughness={0.6} />
      </mesh>

      {/* Bell / Clock Cupola on Roof */}
      <mesh position={[0, 2.7, 0]}>
        <boxGeometry args={[0.45, 0.5, 0.45]} />
        <meshStandardMaterial color="#FDFEFE" roughness={0.3} />
      </mesh>
      {/* Cupola Spire */}
      <mesh position={[0, 3.1, 0]}>
        <coneGeometry args={[0.3, 0.45, 4]} />
        <meshStandardMaterial color="#B7950B" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Clock Face */}
      <mesh position={[0, 2.7, 0.23]}>
        <circleGeometry args={[0.13, 16]} />
        <meshBasicMaterial color="#F4D03F" />
      </mesh>

      {/* School windows (grid of 4 multipane windows on facade) */}
      {[-0.5, 0.5].map((x) =>
        [0.6, 1.3].map((y) => (
          <mesh key={`${x}-${y}`} position={[x, y, 0.76]}>
            <planeGeometry args={[0.32, 0.42]} />
            <meshStandardMaterial
              color="#E8F8F5"
              emissive="#AED6F1"
              emissiveIntensity={hovered ? 0.8 : 0.3}
            />
          </mesh>
        )),
      )}

      {/* Front Entrance Archway & Door */}
      <mesh position={[0, 0.45, 0.77]}>
        <planeGeometry args={[0.38, 0.65]} />
        <meshStandardMaterial color="#5D4037" roughness={0.6} />
      </mesh>

      {/* Flagpole on the side */}
      <mesh position={[1.15, 1.2, 0.7]}>
        <cylinderGeometry args={[0.02, 0.02, 2.4, 8]} />
        <meshStandardMaterial color="#BDC3C7" metalness={0.8} />
      </mesh>
      <mesh position={[1.3, 2.2, 0.7]}>
        <boxGeometry args={[0.3, 0.18, 0.01]} />
        <meshStandardMaterial color={accent} />
      </mesh>
    </group>
  );
}

/* ================================================================== */
/*  2. COLLEGE CAMPUS (Collegiate portico, white pillars, rotunda dome)*/
/* ================================================================== */
function CollegeBuilding({ hovered, accent }: { hovered: boolean; accent: string }) {
  return (
    <group>
      {/* Classical podium & entrance stairs */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[2.8, 0.3, 2.2]} />
        <meshStandardMaterial color="#E0E0E0" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.075, 1.15]}>
        <boxGeometry args={[1.4, 0.15, 0.4]} />
        <meshStandardMaterial color="#D5D8DC" roughness={0.6} />
      </mesh>

      {/* Central collegiate academic hall */}
      <mesh position={[0, 1.25, -0.2]}>
        <boxGeometry args={[2.5, 1.9, 1.5]} />
        <meshStandardMaterial color="#FDFEFE" roughness={0.5} />
      </mesh>

      {/* Classical Portico Pediment */}
      <mesh position={[0, 2.35, 0.65]} rotation-z={Math.PI / 2}>
        <coneGeometry args={[0.45, 1.6, 3]} />
        <meshStandardMaterial color="#EAECEE" roughness={0.5} />
      </mesh>

      {/* 4 Grand Classical Pillars across entrance */}
      {[-0.6, -0.2, 0.2, 0.6].map((x, i) => (
        <mesh key={i} position={[x, 1.15, 0.65]}>
          <cylinderGeometry args={[0.065, 0.075, 1.8, 12]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.4} />
        </mesh>
      ))}

      {/* Central Academic Rotunda / Copper Dome */}
      <mesh position={[0, 2.35, -0.2]}>
        <cylinderGeometry args={[0.7, 0.75, 0.4, 16]} />
        <meshStandardMaterial color="#F2F3F4" roughness={0.5} />
      </mesh>
      <mesh position={[0, 2.75, -0.2]}>
        <sphereGeometry args={[0.7, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={hovered ? "#48C9B0" : "#16A085"}
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>

      {/* Stately collegiate windows along left and right wings */}
      {[-0.95, 0.95].map((x) =>
        [0.7, 1.4].map((y) => (
          <mesh key={`${x}-${y}`} position={[x, y, 0.56]}>
            <planeGeometry args={[0.3, 0.45]} />
            <meshStandardMaterial
              color="#D4E6F1"
              emissive="#85C1E9"
              emissiveIntensity={hovered ? 0.8 : 0.3}
            />
          </mesh>
        )),
      )}
    </group>
  );
}

/* ================================================================== */
/*  3. B-SCHOOL MANAGEMENT INSTITUTE (Pergola courtyard & modern brick)*/
/* ================================================================== */
function BSchoolBuilding({ hovered, accent }: { hovered: boolean; accent: string }) {
  return (
    <group>
      {/* Stone terrace base */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[2.6, 0.2, 2.4]} />
        <meshStandardMaterial color="#795548" roughness={0.8} />
      </mesh>

      {/* Executive Classroom Wing (Left tiered block) */}
      <mesh position={[-0.6, 0.9, 0]}>
        <boxGeometry args={[1.2, 1.4, 1.8]} />
        <meshStandardMaterial color="#BCAAA4" roughness={0.7} />
      </mesh>

      {/* Modern Brick Faculty/Library Tower (Right taller block) */}
      <mesh position={[0.65, 1.4, -0.1]}>
        <boxGeometry args={[1.0, 2.4, 1.5]} />
        <meshStandardMaterial
          color={hovered ? "#D35400" : "#A04000"}
          roughness={0.6}
        />
      </mesh>

      {/* Stone Pergola courtyard roof slats */}
      {[-0.3, 0, 0.3, 0.6].map((z, idx) => (
        <mesh key={idx} position={[-0.6, 1.68, z]}>
          <boxGeometry args={[1.3, 0.08, 0.1]} />
          <meshStandardMaterial color="#4E342E" roughness={0.7} />
        </mesh>
      ))}

      {/* Tinted glass ribbon windows */}
      <mesh position={[-0.6, 1.0, 0.91]}>
        <planeGeometry args={[0.9, 0.4]} />
        <meshStandardMaterial
          color="#34495E"
          emissive="#5DADE2"
          emissiveIntensity={hovered ? 0.7 : 0.25}
        />
      </mesh>
      <mesh position={[0.65, 1.6, 0.66]}>
        <planeGeometry args={[0.7, 1.4]} />
        <meshStandardMaterial
          color="#2C3E50"
          emissive="#5DADE2"
          emissiveIntensity={hovered ? 0.7 : 0.25}
        />
      </mesh>
    </group>
  );
}

/* ================================================================== */
/*  4. CORPORATE HEADQUARTERS (Multi-story reflective glass tower)    */
/* ================================================================== */
function CorporateBuilding({ hovered, accent }: { hovered: boolean; accent: string }) {
  return (
    <group>
      {/* Granite plaza base */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[2.4, 0.2, 2.2]} />
        <meshStandardMaterial color="#37474F" roughness={0.7} />
      </mesh>

      {/* Main glass office tower */}
      <mesh position={[0, 1.6, 0]}>
        <boxGeometry args={[1.8, 3.0, 1.6]} />
        <meshStandardMaterial
          color="#1A5276"
          roughness={0.1}
          metalness={0.85}
          emissive="#2980B9"
          emissiveIntensity={hovered ? 0.5 : 0.15}
        />
      </mesh>

      {/* Horizontal & vertical floor mullions (Steel grid) */}
      {[0.7, 1.3, 1.9, 2.5].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <boxGeometry args={[1.84, 0.05, 1.64]} />
          <meshStandardMaterial color="#ECEFF1" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}

      {/* Ground floor executive glass reception lobby & canopy */}
      <mesh position={[0, 0.55, 0.85]}>
        <boxGeometry args={[1.2, 0.08, 0.4]} />
        <meshStandardMaterial color="#263238" metalness={0.8} />
      </mesh>

      {/* Rooftop HVAC penthouse & communications antenna */}
      <mesh position={[0.2, 3.25, 0]}>
        <boxGeometry args={[0.7, 0.35, 0.7]} />
        <meshStandardMaterial color="#546E7A" roughness={0.5} />
      </mesh>
      <mesh position={[-0.4, 3.5, 0.2]}>
        <cylinderGeometry args={[0.02, 0.03, 0.9, 8]} />
        <meshStandardMaterial color="#ECEFF1" metalness={0.9} />
      </mesh>
      <mesh position={[-0.4, 3.95, 0.2]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#E74C3C" />
      </mesh>
    </group>
  );
}

/* ================================================================== */
/*  5. TECH STARTUP HUB / INNOVATION LOFT (Asymmetrical studio loft)  */
/* ================================================================== */
function StartupBuilding({ hovered, accent }: { hovered: boolean; accent: string }) {
  return (
    <group>
      {/* Industrial concrete plinth */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[2.5, 0.2, 2.2]} />
        <meshStandardMaterial color="#212121" roughness={0.8} />
      </mesh>

      {/* Lower brick/timber studio workshop */}
      <mesh position={[-0.3, 0.75, 0]}>
        <boxGeometry args={[1.5, 1.1, 1.7]} />
        <meshStandardMaterial color="#5D4037" roughness={0.7} />
      </mesh>

      {/* Cantilevered upper glass innovation box (asymmetrical offset) */}
      <mesh position={[0.3, 1.65, 0.1]}>
        <boxGeometry args={[1.5, 1.1, 1.6]} />
        <meshStandardMaterial
          color={hovered ? "#E67E22" : "#D35400"}
          roughness={0.3}
          metalness={0.4}
        />
      </mesh>

      {/* Panoramic studio display windows */}
      <mesh position={[0.3, 1.65, 0.91]}>
        <planeGeometry args={[1.2, 0.75]} />
        <meshStandardMaterial
          color="#FAD7A0"
          emissive="#F39C12"
          emissiveIntensity={hovered ? 0.9 : 0.4}
        />
      </mesh>

      {/* Rooftop Pergola / Creative Patio Terrace on lower box */}
      <mesh position={[-0.3, 1.35, 0]}>
        <boxGeometry args={[1.3, 0.05, 1.5]} />
        <meshStandardMaterial color="#424242" roughness={0.5} />
      </mesh>
      {[-0.4, 0, 0.4].map((z, idx) => (
        <mesh key={idx} position={[-0.3, 1.65, z]}>
          <boxGeometry args={[1.2, 0.04, 0.06]} />
          <meshStandardMaterial color="#E67E22" />
        </mesh>
      ))}
    </group>
  );
}

/* ================================================================== */
/*  6. GLOBAL LEADERSHIP SKYSCRAPER (High-rise tiered glass tower)    */
/* ================================================================== */
function GlobalLeadershipBuilding({ hovered, accent }: { hovered: boolean; accent: string }) {
  return (
    <group>
      {/* Dark polished granite plaza */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[2.5, 0.2, 2.5]} />
        <meshStandardMaterial color="#1A252F" roughness={0.5} />
      </mesh>

      {/* Tier 1 base tower */}
      <mesh position={[0, 1.1, 0]}>
        <boxGeometry args={[1.8, 1.8, 1.8]} />
        <meshStandardMaterial
          color="#1B2631"
          metalness={0.9}
          roughness={0.1}
          emissive="#2C3E50"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Tier 2 middle tower */}
      <mesh position={[0, 2.4, 0]}>
        <boxGeometry args={[1.4, 1.6, 1.4]} />
        <meshStandardMaterial
          color="#283747"
          metalness={0.9}
          roughness={0.1}
          emissive="#34495E"
          emissiveIntensity={hovered ? 0.6 : 0.25}
        />
      </mesh>

      {/* Tier 3 upper crown with angled glass slant */}
      <mesh position={[0, 3.45, 0]}>
        <boxGeometry args={[1.0, 0.9, 1.0]} />
        <meshStandardMaterial
          color="#5D6D7E"
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>

      {/* Executive Rooftop Helipad / Spire */}
      <mesh position={[0, 3.92, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.05, 16]} />
        <meshStandardMaterial color="#A29BFE" emissive="#6C5CE7" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0, 4.3, 0]}>
        <cylinderGeometry args={[0.02, 0.04, 0.8, 8]} />
        <meshStandardMaterial color="#DFE6E9" metalness={0.9} />
      </mesh>
    </group>
  );
}

/* ================================================================== */
/*  7. FRACTIONAL CMO ERA (Futuristic high-tech floating glass pavilion) */
/* ================================================================== */
function FractionalCMOBuilding({ hovered, accent }: { hovered: boolean; accent: string }) {
  return (
    <group>
      {/* Illuminated neon base plinth */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[2.5, 0.2, 2.2]} />
        <meshStandardMaterial color="#0A192F" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <boxGeometry args={[2.55, 0.04, 2.25]} />
        <meshBasicMaterial color="#00CEC9" />
      </mesh>

      {/* Cantilevered floating glass lower deck */}
      <mesh position={[-0.2, 0.9, 0]}>
        <boxGeometry args={[1.6, 1.2, 1.6]} />
        <meshStandardMaterial
          color="#00CEC9"
          emissive="#00B894"
          emissiveIntensity={hovered ? 0.6 : 0.25}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Floating upper luxury terrace box */}
      <mesh position={[0.25, 1.9, 0]}>
        <boxGeometry args={[1.5, 1.0, 1.5]} />
        <meshStandardMaterial
          color="#81ECEC"
          emissive="#00CEC9"
          emissiveIntensity={hovered ? 0.7 : 0.3}
          roughness={0.1}
          metalness={0.9}
        />
      </mesh>

      {/* Glowing neon architectural accent lines */}
      <mesh position={[0.25, 2.42, 0]}>
        <boxGeometry args={[1.52, 0.04, 1.52]} />
        <meshBasicMaterial color="#55EFC4" />
      </mesh>
    </group>
  );
}

/* ================================================================== */
/*  MASTER LANDMARK COMPONENT (Picks archetype based on chapter/type)  */
/* ================================================================== */
export function Landmark({ position, station, accentColor, onSelect }: Props) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Group>(null!);

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

  // Pick distinct architectural building archetype
  const renderBuilding = () => {
    switch (station.chapter) {
      case "School":
        return <SchoolBuilding hovered={hovered} accent={accentColor} />;
      case "College":
        return <CollegeBuilding hovered={hovered} accent={accentColor} />;
      case "B-schools":
        return <BSchoolBuilding hovered={hovered} accent={accentColor} />;
      case "Corporate":
        return <CorporateBuilding hovered={hovered} accent={accentColor} />;
      case "Entrepreneur":
        return <StartupBuilding hovered={hovered} accent={accentColor} />;
      case "Global leadership":
        return <GlobalLeadershipBuilding hovered={hovered} accent={accentColor} />;
      case "Fractional CMO era":
      default:
        return <FractionalCMOBuilding hovered={hovered} accent={accentColor} />;
    }
  };

  // Adjust height of floating billboard according to building height
  const billboardHeight =
    station.chapter === "Global leadership"
      ? 4.8
      : station.chapter === "Corporate"
      ? 4.2
      : station.chapter === "School"
      ? 3.6
      : station.chapter === "College"
      ? 3.4
      : 3.1;

  return (
    <group
      ref={meshRef}
      position={position}
      scale={hovered ? [1.08, 1.08, 1.08] : [1, 1, 1]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
    >
      {/* Procedural architectural building model */}
      {renderBuilding()}

      {/* Floating landmark beacon/marker */}
      <mesh position={[0, billboardHeight - 0.45, 0]}>
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
      <Billboard position={[0, billboardHeight, 0]} follow={true}>
        {/* Signboard Backing Pill for maximum contrast & visibility */}
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[2.8, 0.65]} />
          <meshBasicMaterial
            color="#0b1118"
            transparent={true}
            opacity={hovered ? 0.94 : 0.84}
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
