"use client"

import { useRef, useMemo } from "react"
import { Canvas, useLoader, useThree } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import * as THREE from "three"

const getMinMax = (array, key) => {
  if (!array || !Array.isArray(array) || array.length === 0) {
    console.error("Invalid or empty array passed to getMinMax")
    return { min: 0, max: 0 }
  }

  return array.reduce(
    (acc, obj) => {
      const value = obj.location[key] // Access nested location data
      if (obj && typeof value === 'number') {
        acc.min = Math.min(acc.min, value)
        acc.max = Math.max(acc.max, value)
      }
      return acc
    },
    { min: Number.POSITIVE_INFINITY, max: Number.NEGATIVE_INFINITY }
  )
}

const TerrainMesh = ({ points }) => {
  const meshRef = useRef()
  const spacing = 20
  const elevationScale = 30

  if (!points || !Array.isArray(points)) {
    console.error("Invalid points data:", points)
    return null
  }

  // Get min/max lat/lon for normalization
  const { min: minLat, max: maxLat } = getMinMax(points, "lat")
  const { min: minLon, max: maxLon } = getMinMax(points, "lng")

  console.log("Bounds:", {
    lat: { min: minLat, max: maxLat },
    lng: { min: minLon, max: maxLon }
  })

  const geometry = useMemo(() => {
    const widthSegments = Math.floor(Math.sqrt(points.length))
    const heightSegments = widthSegments

    console.log("Creating geometry with segments:", widthSegments, heightSegments)

    const geo = new THREE.PlaneGeometry(
      Math.max(1, (maxLon - minLon) * spacing),
      Math.max(1, (maxLat - minLat) * spacing),
      widthSegments - 1,
      heightSegments - 1
    )

    const positions = geo.attributes.position.array
    let minElevation = Number.POSITIVE_INFINITY
    let maxElevation = Number.NEGATIVE_INFINITY

    // Create lookup for fast coordinate to elevation mapping
    const coordToElevation = new Map()
    points.forEach(point => {
      const key = `${point.location.lat},${point.location.lng}`
      coordToElevation.set(key, point.elevation)
    })

    // Map vertices to elevation values
    for (let i = 0; i < heightSegments; i++) {
      for (let j = 0; j < widthSegments; j++) {
        const vertexIndex = (i * widthSegments + j) * 3

        // Calculate interpolated lat/lng for this vertex
        const lat = minLat + (maxLat - minLat) * (i / (heightSegments - 1))
        const lng = minLon + (maxLon - minLon) * (j / (widthSegments - 1))

        // Find closest point in our data
        const key = `${lat},${lng}`
        const elevation = coordToElevation.get(key) || 0
        positions[vertexIndex + 2] = elevation * elevationScale

        minElevation = Math.min(minElevation, elevation * elevationScale)
        maxElevation = Math.max(maxElevation, elevation * elevationScale)
      }
    }

    console.log("Elevation range:", minElevation, "to", maxElevation)
    geo.computeVertexNormals()
    return geo
  }, [points, minLat, maxLat, minLon, maxLon])

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <primitive object={geometry} attach="geometry" />
      <meshPhongMaterial 
        color="#228B22" 
        side={THREE.DoubleSide}
        flatShading={true}
        shininess={0}
      />
    </mesh>
  )
}

const Scene = () => {
  const { camera } = useThree()
  const elevationData = useLoader(THREE.FileLoader, "/mahendra.json", (loader) => {
    loader.setResponseType("json")
  })

  useMemo(() => {
    camera.position.set(0, 200, 200)
    camera.lookAt(0, 0, 0)
  }, [camera])

  if (!elevationData) {
    console.error("No elevation data found")
    return null
  }

  const parsedData = typeof elevationData === 'string' ? JSON.parse(elevationData) : elevationData

  if (!parsedData.points || !Array.isArray(parsedData.points)) {
    console.error("Invalid elevation data format")
    return null
  }

  return (
    <>
      <color attach="background" args={["#87CEEB"]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[1, 1, 1]} intensity={0.8} />
      <TerrainMesh points={parsedData.points} />
      <OrbitControls 
        enabled={true} 
        enableZoom={true} 
        maxPolarAngle={Math.PI / 2} 
        minDistance={50} 
        maxDistance={500}
      />
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