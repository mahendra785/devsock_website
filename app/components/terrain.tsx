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

interface FetchOptions {
  endpoint?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
}

interface ElevationRequest {
  lat: number;
  lng: number;
  area: number;
}

const API_BASE_URL = "https://pangolin-enormous-briefly.ngrok-free.app";

// Generic fetch function that can be used for any API endpoint
const fetchFromAPI = async <T,>({
  endpoint = "/data/data.json",
  method = "GET",
  body,
  headers = {},
}: FetchOptions = {}): Promise<T> => {
  try {
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${API_BASE_URL}${endpoint}`;

    const requestOptions: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      ...(body && { body: JSON.stringify(body) }),
    };

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
};

// Function to fetch elevation data from the API
const fetchElevationData = async (
  params: ElevationRequest
): Promise<TerrainData> => {
  return fetchFromAPI<TerrainData>({
    endpoint: "/elevation",
    method: "POST",
    body: {
      lat: params.lat,
      lng: params.lng,
      area: params.area,
    },
  });
};

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

// Specific function to fetch terrain data
const fetchTerrainData = async (location?: {
  lat: number;
  lng: number;
  area: number;
}): Promise<{
  points: TerrainPoint[];
  gridSize: number;
  step: number;
} | null> => {
  try {
    let data: TerrainData;

    if (location) {
      data = await fetchElevationData({
        lat: location.lat,
        lng: location.lng,
        area: location.area, // Default area, adjust as needed
      });
    } else {
      // Fallback to default location if none provided
      data = await fetchElevationData({
        lat: 17.926609,
        lng: 73.807198,
        area: 8,
      });
    }

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

  for (const point of points) {
    if (point.elevation < minElevation) minElevation = point.elevation;
    if (point.elevation > maxElevation) maxElevation = point.elevation;
  }

  const elevationRange = maxElevation - minElevation;
  const targetRange = 800;

  return targetRange / elevationRange;
};

const Terrain: React.FC<{
  onDimensionsCalculated: (dimensions: TerrainDimensions) => void;
}> = ({ onDimensionsCalculated }) => {
  const [terrainMesh, setTerrainMesh] = useState<THREE.Mesh | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTerrain = async () => {
      try {
        const data = await fetchTerrainData();
        console.log("HHUHUH", data);
        // var fs = require('fs');
        // fs.writeFile("test.txt", data, function(err) {
        //     if (err) {
        //         console.log(err);
        //     }
        // });
        if (!data) {
          setError("Failed to load terrain data");
          return;
        }

        const { points, gridSize } = data;

        const step = 20;
        console.log(step);

        const smoothedPoints = smoothElevationData(points, gridSize, 5);
        const elevationScale = calculateElevationScale(smoothedPoints);

        const terrainWidth = gridSize * step;
        const terrainHeight = gridSize * step;
        const geometry = new THREE.PlaneGeometry(
          terrainWidth,
          terrainHeight,
          gridSize - 1,
          gridSize - 1
        );

        const vertices = geometry.attributes.position.array as Float32Array;
        const colors = new Float32Array(vertices.length);

        let minElevation = Infinity;
        let maxElevation = -Infinity;

        for (const point of smoothedPoints) {
          if (point.elevation < minElevation) minElevation = point.elevation;
          if (point.elevation > maxElevation) maxElevation = point.elevation;
        }

        const elevationRange = maxElevation - minElevation;

        for (let i = 0; i < smoothedPoints.length; i++) {
          const vertexIndex = i * 3;
          const elevation = smoothedPoints[i].elevation;

          vertices[vertexIndex + 2] = elevation * elevationScale;

          const normalizedElevation =
            (elevation - minElevation) / elevationRange;
          colors[vertexIndex] = 0.2 + normalizedElevation * 0.3;
          colors[vertexIndex + 1] = 0.4 + normalizedElevation * 0.4;
          colors[vertexIndex + 2] = 0.2;
        }

        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        geometry.computeVertexNormals();

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

        onDimensionsCalculated({
          width: terrainWidth,
          height: terrainHeight,
          maxElevation: maxElevation * elevationScale,
          elevationScale: elevationScale,
        });
      } catch (err) {
        setError("Error generating terrain mesh");
        console.error(err);
      }
    };

    loadTerrain();
  }, []);

  if (error) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    );
  }

  return terrainMesh ? <primitive object={terrainMesh} /> : null;
};

interface CameraSettings {
  position: [number, number, number];
  fov: number;
}

interface TerrainSceneProps {
  lat?: number;
  long?: number;
  area?: number;
}

const TerrainScene: React.FC<TerrainSceneProps> = ({ lat, long, area }) => {
  const [cameraSettings, setCameraSettings] = useState<CameraSettings>({
    position: [0, 2000, 2000],
    fov: 60,
  });

  const handleDimensionsCalculated = (dimensions: TerrainDimensions) => {
    console.log("dimensions", dimensions);
    // const maxDimension = Math.max(dimensions.width, dimensions.height)
    const maxDimension = 2020;
    console.log(maxDimension);
    const distance = maxDimension * 2;
    const elevation = Math.max(dimensions.maxElevation * 3, distance);
    console.log(elevation);
    const fov = 60;

    setCameraSettings({
      position: [0, 20000, 20000],
      fov: fov,
    });

    console.log(cameraSettings.position);
  };

  return (
    <div className="w-full h-screen">
      <Canvas
        camera={{
          position: cameraSettings.position,
          fov: cameraSettings.fov,
          far: 1000000,
        }}
        shadows
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[500, 1000, 500]} intensity={1} />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={100}
          maxDistance={100000}
          maxPolarAngle={Math.PI / 2.1}
        />
        <Environment preset="sunset" />
        <Terrain onDimensionsCalculated={handleDimensionsCalculated} />
      </Canvas>
    </div>
  );
};

export default TerrainScene;
