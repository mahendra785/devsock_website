import { useEffect, useRef } from "react";
import Globe from "globe.gl";

const GlobeComponent = () => {
  const globeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (globeRef.current) {
      // Use 'new' to instantiate the Globe

      const myGlobe = new Globe(globeRef.current) // Bind globe to container
        .globeImageUrl(
          "//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        ) // Dark mode earth
        .backgroundColor("rgba(0,0,0,0)") // Black background
        .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png"); // Topology effect

      // Optionally, configure the globe further
      myGlobe.pointOfView({ lat: 0, lng: 0, altitude: 1.5 });
    }
  }, []);

  return (
    <div
      ref={globeRef}
      className="scale-[0.8] mt-12 relative -translate-x-3/4 pr-96"
    />
  );
};

export default GlobeComponent;
