"use client";
import Image from "next/image";
import bg from "../public/bg.png";
import GlobeComponent from "./components/Globe";

const Page = () => {
  return (
    <div className="flex flex-col overflow-y-auto overflow-x-hidden w-[99vw]">
      {/* Section 1 */}

      <div className="relative h-screen w-[99vw]">
        {/* Background Image */}
        <Image
          src={bg}
          alt="Full screen background"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0"
        />

        {/* Globe Positioned in the Background */}
        <div className="z-40 absolute inset-0 flex justify-start bg-transparent pr-96 items-start">
          <div className="w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] pr-96">
            <GlobeComponent />
          </div>
        </div>

        {/* Overlay Content */}
        <div className="relative flex flex-col h-full">
          {/* Navbar */}
          <div className="z-50 absolute top-0 h-[10vh] left-0 right-0 flex justify-between items-center p-6">
            <div className="flex flex-row space-x-4 text-4xl font-extrabold px-8">
              <div>
                <Image src="/logo.svg" height={50} width={50} alt="logo" />
              </div>
              <div className="rem">Find Me A Breeze</div>
            </div>
            <div className="flex space-x-6">
              <button className="hover:bg-white/10 rounded-xl p-3">
                Something
              </button>
              <button className="hover:bg-white/10 rounded-xl p-3">
                About Us
              </button>
              <button className="hover:bg-white/10 rounded-xl p-3">
                Get Started
              </button>
            </div>
          </div>

          {/* Centered Content */}
          <div className="flex flex-grow flex-col text-end justify-center items-end pr-12 space-y-8">
            <div className="hammersmith text-white text-7xl w-[45vw] space-y-4">
              <div className="flex flex-row space-x-4 justify-end ">
                <p>Empowering</p>
                <p className="text-[#80bf58]">Wind</p>
              </div>
              <div className="flex flex-col space-y-4">
                <p> Energy for a Cleaner</p>
                <div className="flex flex-row justify-end space-x-4">
                  <p className="text-[#80bf58]">Greener</p> <p>Future</p>
                </div>
              </div>
            </div>

            <p className="w-[45vw] text-2xl pt-4">
              Utilising Global Satellite Data for Topological and Meterological
              Analysis. We optimize any given region for the best wind energy
              output.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2 */}
      <div className="relative h-screen w-[99vw]">
        <Image
          src={bg}
          alt="Full screen background"
          layout="fill"
          objectFit="fill"
          className="absolute inset-0"
        />
        <div className="relative z-10 flex flex-row h-full justify-between">
          <div className="text-black w-[23vw] h-[20vh] bg-[#80BF58] p-3 text-2xl text-center flex items-center justify-center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod
          </div>
          <div className="text-black w-[23vw] h-[20vh] bg-[#B6E597] p-3 text-2xl text-center flex items-center justify-center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod
          </div>
          <div className="text-black w-[23vw] h-[20vh] bg-[#DFF4D1] p-3 text-2xl text-center flex items-center justify-center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
