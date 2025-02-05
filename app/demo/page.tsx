"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import bg from "../../public/bg-demo.png";
import TerrainScene from "../components/terrain";
import Map from "../components/Map";
import Modal from "../components/modal";
import { MapIcon, Wind } from "lucide-react";

interface Coordinate {
  latitude: number;
  longitude: number;
}

const Demo = () => {
  const [latitude, setLatitude] = useState("0");
  const [longitude, setLongitude] = useState("0");
  const [area, setArea] = useState("0");
  const [showMap, setShowMap] = useState(false);
  const [showTerrain, setShowTerrain] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleCalculate = () => {
    setShowTerrain(true);
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const sampleCoordinates: Coordinate[] = [
    { latitude: 51.5074, longitude: -0.1278 },
    { latitude: 51.5084, longitude: -0.1268 },
    { latitude: 51.5094, longitude: -0.1258 },
    { latitude: 51.5064, longitude: -0.1288 },
    { latitude: 51.5054, longitude: -0.1298 },
  ];

  return (
    <div className="relative min-h-screen overflow-y-auto">
      <Image
        src={bg || "/placeholder.svg"}
        alt="Full screen background"
        fill
        priority
        className="absolute z-0 inset-0 object-cover"
      />
      <nav className="absolute z-40 w-full p-4 md:p-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <Image
              src="/logo.svg"
              height={40}
              width={40}
              alt="logo"
              className="z-50"
            />
            <h1 className="text-2xl md:text-4xl font-extrabold text-white z-50">
              Find Me A Breeze
            </h1>
          </div>
        </div>
      </nav>
      <div className="relative z-30 min-h-screen flex flex-col">
        <div className="flex-grow flex items-center">
          <div className="w-[30vw] h-[55vh] px-8 bg-[#DFF4D1] text-black z-40 rounded-r-2xl flex flex-col justify-center">
            <h2 className="text-2xl text-left font-extrabold mb-8">
              Enter Location Details
            </h2>
            <div className="space-y-4 w-full text-3xl items-center justify-center">
              <div>
                <label className="block mb-2">Latitude</label>
                <input
                  type="text"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-full text-lg p-2 border rounded z-50"
                  placeholder="Enter latitude"
                />
              </div>
              <div>
                <label className="block mb-2">Longitude</label>
                <input
                  type="text"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-full text-lg p-2 border rounded z-50"
                  placeholder="Enter longitude"
                />
              </div>
              <div>
                <label className="block mb-2 text-md">Area</label>
                <input
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full text-lg p-2 border rounded z-50"
                  placeholder="Enter Area"
                />
              </div>
              <div className="flex justify-center">
                <button
                  onClick={handleCalculate}
                  className="w-[15vw] rounded-xl p-2 bg-black text-white hover:bg-black/70 z-50"
                >
                  Generate!
                </button>
              </div>
            </div>
          </div>
          <div className="flex-grow">
            {showTerrain ? (
              <TerrainScene
                lat={Number.parseFloat(latitude)}
                long={Number.parseFloat(longitude)}
                area={Number.parseFloat(area)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white"></div>
            )}
          </div>
        </div>

        {showTerrain && (
          <div ref={resultsRef} className="w-full bg-[#161616] p-6 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">
                  Turbine Cluster Coordinates
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {Array(7)
                    .fill("XXXXXXX")
                    .map((coord, i) => (
                      <div
                        key={i}
                        className="text-gray-100 bg-gray-800 p-2 rounded"
                      >
                        {coord}
                      </div>
                    ))}
                </div>
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => setShowMap(true)}
                    className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors duration-300"
                  >
                    <MapIcon size={24} />
                    <span>Show Map</span>
                  </button>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Statistics</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 bg-gray-800 p-3 rounded-lg">
                    <Wind className="text-blue-500" size={24} />
                    <p className="text-lg font-semibold text-gray-100">
                      Wind Speed: 20 km/hr
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 bg-gray-800 p-3 rounded-lg">
                    <Wind className="text-green-500" size={24} />
                    <p className="text-lg font-semibold text-gray-100">
                      Wind Direction: 90°
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={showMap}
        onClose={() => setShowMap(false)}
        title="Turbine Cluster Map"
      >
        <div className="w-full h-[60vh]">
          <Map coordinates={sampleCoordinates} />
        </div>
      </Modal>
    </div>
  );
};

export default Demo;
