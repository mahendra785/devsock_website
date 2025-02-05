"use client";
import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
// Define the SVG icons for different types of markers
const qrIcon = L.icon({
  iconUrl: "/green-marker.svg",
  iconSize: [15, 41],
});

const responseIcon = L.icon({
  iconUrl: "/red-marker.svg",
  iconSize: [15, 41],
});
const icon = L.icon({
  iconUrl: "/icon.svg",
  iconSize: [15, 41],
});

// Define the types for coordinates
interface Coordinate {
  latitude: number;
  longitude: number;
}

interface MapProps {
  coordinates: Coordinate[];
}

const Map: React.FC<MapProps> = ({ coordinates }) => {
  useEffect(() => {
    // Initialize the map
    const map = L.map("mapWrap").setView(
      [coordinates[0].latitude, coordinates[0].longitude],
      19
    );

    // Add tile layer (OpenStreetMap)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add markers to map
    coordinates.forEach(({ latitude, longitude }) => {
      const marker = L.marker([latitude, longitude], {
        icon: icon,
      }).addTo(map);

      // Set zoom level on marker click
      marker.on("click", () => {
        map.setView([latitude, longitude], 14);
      });
    });

    // Cleanup on component unmount
    return () => {
      map.remove();
    };
  }, [coordinates]);

  return <div id="mapWrap" style={{ width: "100%", height: "400px" }}></div>;
};

export default Map;
