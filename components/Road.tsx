"use client";

import { useMemo } from "react";
import * as THREE from "three";

interface Props {
  curve: THREE.CatmullRomCurve3;
}

/**
 * Procedural asphalt roadway following the CatmullRom curve.
 * Features dark asphalt surface, concrete curbs, and dashed yellow center markings.
 */
export function Road({ curve }: Props) {
  const { roadGeo, curbGeo, dashGeo } = useMemo(() => {
    const segments = 450;
    const points = curve.getPoints(segments);
    const roadWidth = 2.4;
    const curbWidth = 0.2;
    const halfRoad = roadWidth / 2;

    // Buffers for asphalt road
    const roadPositions: number[] = [];
    const roadIndices: number[] = [];
    const roadNormals: number[] = [];

    // Buffers for curbs
    const curbPositions: number[] = [];
    const curbIndices: number[] = [];

    // Buffers for dashed center line
    const dashPositions: number[] = [];
    const dashIndices: number[] = [];

    for (let i = 0; i <= segments; i++) {
      const u = i / segments;
      const pt = points[i];
      const tangent = curve.getTangentAt(u).normalize();

      // Perpendicular vector in horizontal XZ plane
      const nx = -tangent.z;
      const nz = tangent.x;
      const len = Math.sqrt(nx * nx + nz * nz) || 1;
      const normX = nx / len;
      const normZ = nz / len;

      const y = pt.y + 0.02; // Slightly above ground plane to prevent z-fighting

      // 1. Asphalt Road vertices (Left, Right)
      const rLx = pt.x - normX * halfRoad;
      const rLz = pt.z - normZ * halfRoad;
      const rRx = pt.x + normX * halfRoad;
      const rRz = pt.z + normZ * halfRoad;

      roadPositions.push(rLx, y, rLz);
      roadPositions.push(rRx, y, rRz);
      roadNormals.push(0, 1, 0, 0, 1, 0);

      // 2. Curb vertices (Left outer, Left inner, Right inner, Right outer)
      const curbY = y + 0.04;
      const cL_out_x = pt.x - normX * (halfRoad + curbWidth);
      const cL_out_z = pt.z - normZ * (halfRoad + curbWidth);
      const cR_out_x = pt.x + normX * (halfRoad + curbWidth);
      const cR_out_z = pt.z + normZ * (halfRoad + curbWidth);

      curbPositions.push(cL_out_x, curbY, cL_out_z);
      curbPositions.push(rLx, curbY, rLz);
      curbPositions.push(rRx, curbY, rRz);
      curbPositions.push(cR_out_x, curbY, cR_out_z);

      // 3. Center line vertices (dashed: on for 3 segments, off for 3 segments)
      const dashWidth = 0.08;
      const dashY = y + 0.005;
      const dLx = pt.x - normX * (dashWidth / 2);
      const dLz = pt.z - normZ * (dashWidth / 2);
      const dRx = pt.x + normX * (dashWidth / 2);
      const dRz = pt.z + normZ * (dashWidth / 2);

      dashPositions.push(dLx, dashY, dLz);
      dashPositions.push(dRx, dashY, dRz);

      // Connect quads
      if (i > 0) {
        // Road surface indices
        const rCurrentL = i * 2;
        const rCurrentR = i * 2 + 1;
        const rPrevL = (i - 1) * 2;
        const rPrevR = (i - 1) * 2 + 1;

        roadIndices.push(rPrevL, rPrevR, rCurrentL);
        roadIndices.push(rPrevR, rCurrentR, rCurrentL);

        // Curb indices
        const cCurrent = i * 4;
        const cPrev = (i - 1) * 4;

        // Left curb
        curbIndices.push(cPrev, cPrev + 1, cCurrent);
        curbIndices.push(cPrev + 1, cCurrent + 1, cCurrent);

        // Right curb
        curbIndices.push(cPrev + 2, cPrev + 3, cCurrent + 2);
        curbIndices.push(cPrev + 3, cCurrent + 3, cCurrent + 2);

        // Dashed markings (alternating blocks of 3 segments)
        if (Math.floor(i / 3) % 2 === 0) {
          const dCurrentL = i * 2;
          const dCurrentR = i * 2 + 1;
          const dPrevL = (i - 1) * 2;
          const dPrevR = (i - 1) * 2 + 1;

          dashIndices.push(dPrevL, dPrevR, dCurrentL);
          dashIndices.push(dPrevR, dCurrentR, dCurrentL);
        }
      }
    }

    const road = new THREE.BufferGeometry();
    road.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(roadPositions, 3),
    );
    road.setAttribute(
      "normal",
      new THREE.Float32BufferAttribute(roadNormals, 3),
    );
    road.setIndex(roadIndices);

    const curb = new THREE.BufferGeometry();
    curb.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(curbPositions, 3),
    );
    curb.setIndex(curbIndices);
    curb.computeVertexNormals();

    const dash = new THREE.BufferGeometry();
    dash.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(dashPositions, 3),
    );
    dash.setIndex(dashIndices);
    dash.computeVertexNormals();

    return { roadGeo: road, curbGeo: curb, dashGeo: dash };
  }, [curve]);

  return (
    <group>
      {/* 1. Dark Asphalt Road Bed */}
      <mesh geometry={roadGeo} receiveShadow>
        <meshStandardMaterial
          color="#24282F"
          roughness={0.92}
          metalness={0.08}
        />
      </mesh>

      {/* 2. Concrete Curbs / Edges */}
      <mesh geometry={curbGeo}>
        <meshStandardMaterial color="#B0B7BD" roughness={0.8} />
      </mesh>

      {/* 3. Dashed Yellow Highway Centerline */}
      <mesh geometry={dashGeo}>
        <meshBasicMaterial color="#F4D03F" />
      </mesh>
    </group>
  );
}
