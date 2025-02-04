"use client";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Corrected import for app directory
import bg from "../../public/bg.png";
import GlobeComponent from "../components/Globe";

const Page1 = () => {
  const router = useRouter();

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background Image */}
      <Image
        src={bg}
        alt="Full screen background"
        fill
        priority
        className="absolute inset-0 object-cover"
      />

      {/* Navbar */}
      <nav className="z-50 relative w-full p-4 md:p-6">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <Image src="/logo.svg" height={40} width={40} alt="logo" />
            <h1 className="text-2xl md:text-4xl font-extrabold text-white">
              Find Me A Breeze
            </h1>
          </div>
          <div className="flex space-x-2 md:space-x-6">
            <button className="text-sm md:text-xl text-white hover:bg-white/10 rounded-xl p-2 md:p-3">
              Something
            </button>
            <button
              onClick={() => router.push("/demo")}
              className="text-sm md:text-xl text-white hover:bg-[#80bf58] p-2 mx-4 rounded-xl md:p-3"
            >
              Demo
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow flex flex-col-reverse md:flex-row items-center justify-center container mx-auto px-4">
        {/* Globe Component - Hidden on small screens */}
        <div className="hidden md:block w-1/2 justify-start items-center">
          <div className="flex flex-row max-w-[800px] aspect-square">
            <GlobeComponent />
          </div>
        </div>

        {/* Text Content */}
        <div className="w-full z-50 md:w-1/2 text-center md:text-right space-y-4 md:space-y-8">
          <div className="text-white text-3xl md:text-5xl xl:text-7xl space-y-2 hammersmith">
            <div className="flex flex-row justify-center md:justify-end space-x-2 md:space-x-4">
              <p>Empowering</p>
              <p className="text-[#80bf58]">Wind</p>
            </div>
            <div className="flex flex-col space-y-2">
              <p>Energy for a Cleaner</p>
              <div className="flex flex-row justify-center md:justify-end space-x-2 md:space-x-4">
                <p className="text-[#80bf58]">Greener</p>
                <p>Future</p>
              </div>
            </div>
          </div>

          <p className="text-base md:text-xl lg:text-2xl text-white">
            Utilising Global Satellite Data for Topological and Meteorological
            Analysis. We optimize any given region for the best wind energy
            output.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page1;
