"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";

interface TerrainPoint {
  location: {
    lat: number;
    lng: number;
  };
  elevation: number;
  resolution: number;
}

interface TerrainData {
  center: {
    lat: number;
    lng: number;
  };
  area_km2: number;
  step_m: number;
  points_count: number;
  points: TerrainPoint[];
}

interface TerrainDimensions {
  width: number;
  height: number;
  maxElevation: number;
  elevationScale: number;
}

const fetchData = async () => {
  try {
    const response = await fetch("/data/data2.json");
    const data: TerrainData = await response.json();
    return {
      points: data.points,
      gridSize: Math.sqrt(data.points_count),
      step: data.step_m,
    };
  } catch (error) {
    console.error("Error loading terrain data:", error);
    return null;
  }
};

const smoothElevationData = (
  points: TerrainPoint[],
  gridSize: number,
  kernelSize = 3
) => {
  const smoothedPoints = [...points];
  const halfKernel = Math.floor(kernelSize / 2);

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      let sum = 0;
      let count = 0;

      for (let ky = -halfKernel; ky <= halfKernel; ky++) {
        for (let kx = -halfKernel; kx <= halfKernel; kx++) {
          const nx = x + kx;
          const ny = y + ky;

          if (nx >= 0 && nx < gridSize && ny >= 0 && ny < gridSize) {
            sum += points[ny * gridSize + nx].elevation;
            count++;
          }
        }
      }

      smoothedPoints[y * gridSize + x].elevation = sum / count;
    }
  }

  return smoothedPoints;
};

const calculateElevationScale = (points: TerrainPoint[]) => {
  if (points.length === 0) return 1;

  let minElevation = Infinity;
  let maxElevation = -Infinity;

  // Find min and max elevations in a single pass
  for (const point of points) {
    if (point.elevation < minElevation) minElevation = point.elevation;
    if (point.elevation > maxElevation) maxElevation = point.elevation;
  }

  const elevationRange = maxElevation - minElevation;
  const targetRange = 2000; // Similar to your original scale

  return targetRange / elevationRange;
};

const Terrain: React.FC<{
  onDimensionsCalculated: (dimensions: TerrainDimensions) => void;
}> = ({ onDimensionsCalculated }) => {
  const [terrainMesh, setTerrainMesh] = useState<THREE.Mesh | null>(null);

  useEffect(() => {
    const loadTerrain = async () => {
      const data = await fetchData();
      if (!data) return;

      const { points, gridSize, step } = data;

      // Smooth the elevation data
      const smoothedPoints = smoothElevationData(points, gridSize, 5);
      const elevationScale = calculateElevationScale(smoothedPoints);

      // Create geometry with adjusted dimensions
      const terrainWidth = gridSize * step;
      const terrainHeight = gridSize * step;
      const geometry = new THREE.PlaneGeometry(
        terrainWidth,
        terrainHeight,
        gridSize - 1,
        gridSize - 1
      );

      // Update vertices
      const vertices = geometry.attributes.position.array as Float32Array;
      const colors = new Float32Array(vertices.length);

      // Find elevation range for color mapping
      let minElevation = Infinity;
      let maxElevation = -Infinity;

      // Find min and max in a single pass
      for (const point of smoothedPoints) {
        if (point.elevation < minElevation) minElevation = point.elevation;
        if (point.elevation > maxElevation) maxElevation = point.elevation;
      }

      const elevationRange = maxElevation - minElevation;

      // Update vertices and colors
      for (let i = 0; i < smoothedPoints.length; i++) {
        const vertexIndex = i * 3;
        const elevation = smoothedPoints[i].elevation;

        // Apply elevation scale to vertex height
        vertices[vertexIndex + 2] = elevation * elevationScale;

        // Calculate color based on elevation
        const normalizedElevation = (elevation - minElevation) / elevationRange;
        colors[vertexIndex] = 0.2 + normalizedElevation * 0.3; // R
        colors[vertexIndex + 1] = 0.4 + normalizedElevation * 0.4; // G
        colors[vertexIndex + 2] = 0.2; // B
      }

      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      geometry.computeVertexNormals();

      // Create mesh
      const mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshStandardMaterial({
          vertexColors: true,
          side: THREE.DoubleSide,
          roughness: 0.8,
          metalness: 0.2,
        })
      );

      mesh.rotation.x = -Math.PI / 2;
      setTerrainMesh(mesh);

      // Notify parent component about terrain dimensions
      onDimensionsCalculated({
        width: terrainWidth,
        height: terrainHeight,
        maxElevation: maxElevation * elevationScale,
        elevationScale: elevationScale,
      });
    };

    loadTerrain();
  }, [onDimensionsCalculated]);

  return terrainMesh ? <primitive object={terrainMesh} /> : null;
};

const TerrainScene: React.FC = () => {
  const [cameraSettings, setCameraSettings] = useState({
    position: [10000, 15000, -2000],
    fov: 60,
  });

  const handleDimensionsCalculated = (dimensions: TerrainDimensions) => {
    // Calculate camera position and FOV based on terrain dimensions
    const maxDimension = Math.max(dimensions.width, dimensions.height);
    const distance = maxDimension * 2; // Increased distance for better overview
    const elevation = Math.max(dimensions.maxElevation * 3, distance); // Ensure enough height to see everything

    // Use a wider FOV and position the camera further back
    const fov = 60; // Fixed FOV for consistent viewing

    setCameraSettings({
      position: [0, elevation, distance] as [number, number, number],
      fov: fov,
    });
  };

  return (
    <div className="w-full h-screen bg-gray-900">
      <Canvas
        camera={{
          position: cameraSettings.position,
          fov: cameraSettings.fov,
          far: 1000000, // Increased far plane for larger scenes
        }}
        shadows
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[500, 1000, 500]} intensity={1} />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={100}
          maxDistance={100000} // Increased max distance
          maxPolarAngle={Math.PI / 2.1} // Prevent camera from going below the ground
        />
        <Environment preset="sunset" />
        <Terrain onDimensionsCalculated={handleDimensionsCalculated} />
      </Canvas>
    </div>
  );
};

export default TerrainScene;
