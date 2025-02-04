"use client"

import { useRef, useMemo } from "react"
import { Canvas, useLoader, useThree } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"

const TerrainMesh = ({ elevationData }) => {
  const meshRef = useRef()
  const gridSize = Math.sqrt(elevationData.length)
  const spacing = 20

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(gridSize * spacing, gridSize * spacing, gridSize - 1, gridSize - 1)
    const vertices = geo.attributes.position.array
    const elevationScale = 30

    let minElevation = Number.POSITIVE_INFINITY
    let maxElevation = Number.NEGATIVE_INFINITY

    for (let i = 0; i < elevationData.length; i++) {
      const elevation = elevationData[i] * elevationScale
      vertices[i * 3 + 2] = elevation
      minElevation = Math.min(minElevation, elevation)
      maxElevation = Math.max(maxElevation, elevation)
    }

    console.log("Elevation range:", minElevation, "to", maxElevation)

    geo.computeVertexNormals()
    return geo
  }, [elevationData, gridSize])

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial color="#228B22" side={THREE.DoubleSide} /> {/* Forest Green color */}
    </mesh>
  )
}

const Scene = () => {
  const { camera } = useThree()
  const elevationData = useLoader(THREE.FileLoader, "/data.json", (loader) => {
    loader.setResponseType("json")
  })

  useMemo(() => {
    camera.position.set(0, 200, 200)
    camera.lookAt(0, 0, 0)
  }, [camera])

  if (!elevationData || !elevationData.points) {
    console.error("No elevation data found.")
    return null
  }

  const points = elevationData.points.map((p) => p.elevation)

  return (
    <>
      <color attach="background" args={["#87CEEB"]} /> {/* Sky Blue background */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[0, 50, 50]} intensity={1} />
      <TerrainMesh elevationData={points} />
      <OrbitControls enableZoom={true} maxPolarAngle={Math.PI / 2} minDistance={50} maxDistance={500} />
    </>
  )
}

const Terrain = () => {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Canvas camera={{ position: [0, 200, 200], fov: 75, near: 0.1, far: 1000 }}>
        <Scene />
      </Canvas>
    </div>
  )
}

export default Terrain

