"use client";
import { useState } from "react";
import TerrainScene from "../components/terrain";
import Image from "next/image";
import bg from "../../public/bg-demo.png";

const Demo = () => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [showTerrain, setShowTerrain] = useState(false);
  const handleCalculate = async () => {
    if (latitude.trim() && longitude.trim()) {
      setShowTerrain(true);
      const response = await fetch(
        "https://robust-fresh-coral.ngrok-free.app/elevation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lat: parseFloat(latitude),
            lng: parseFloat(longitude),
            area: 4,
          }),
        }
      );
      const data = await response.json();
      console.log("Elevation Data:", data);

      setShowTerrain(true);
    }
  };

  return (
    <div className="relative h-screen overflow-hidden ">
      <Image
        src={bg}
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
      <div className="relative z-30 h-full items-center justify-start w-full flex flex-row text-black">
        <div className="w-[40vw] h-[50vh] p-8 bg-black/70 z-40 flex items-center justify-center">
          <div className="space-y-4 w-[50vw] text-3xl">
            <div>
              <label className="block mb-2 text-white">Latitude</label>
              <input
                type="text"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="w-full p-2 border rounded z-50"
                placeholder="Enter latitude"
              />
            </div>
            <div>
              <label className="block mb-2 text-white">Longitude</label>
              <input
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="w-full p-2 border rounded z-50"
                placeholder="Enter longitude"
              />
            </div>
            <button
              onClick={handleCalculate}
              className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 z-50"
            >
              Calculate
            </button>
          </div>
        </div>
        <div className="w-[60vw] z-20">{showTerrain && <TerrainScene />}</div>
      </div>
    </div>
  );
};

export default Demo;
