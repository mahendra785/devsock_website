import { useEffect, useRef } from "react";
import Globe from "globe.gl";
import earth from "../../public/earth-blue-marble.jpg";
const GlobeComponent = () => {
  const globeRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef<number>(0);

  useEffect(() => {
    if (globeRef.current) {
      const myGlobe = new Globe(globeRef.current)
        .globeImageUrl(earth.src)
        .backgroundColor("rgba(0,0,0,0)");

      myGlobe.pointOfView({ lat: 0, lng: 0, altitude: 1.5 });

      // Add continuous rotation
      const animate = () => {
        rotationRef.current = requestAnimationFrame(animate);
        myGlobe.pointOfView({
          lat: 0,
          lng: (Date.now() * 0.03) % 360,
          altitude: 1.5,
        });
      };

      animate();

      // Cleanup animation on unmount
      return () => {
        cancelAnimationFrame(rotationRef.current);
      };
    }
  }, []);

  return (
    <div
      ref={globeRef}
      className="scale-[0.87] ml-24 mt-12 absolute -translate-x-1/2 flex top-0 "
    />
  );
};

export default GlobeComponent;
