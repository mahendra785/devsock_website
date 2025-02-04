"use client";
import Image from "next/image";
import bg from "../../public/bg.png";
import InfoCard from "../components/infocard";
const Page2 = () => {
  return (
    <div className="relative h-screen w-full">
      {/* Section 2 */}
      <div className="relative h-screen ">
        <Image
          src={bg}
          alt="Full screen background"
          layout="fill"
          objectFit="fill"
          className="absolute inset-0"
        />
        <div className="flex flex-col h-full pt-12 z-50">
          <div className="relative z-10 flex flex-row items-start justify-between">
            <InfoCard
              backgroundColor="#80BF58"
              text="Cutting-edge satellite technology for precise wind analysis"
            />
            <InfoCard
              backgroundColor="#B6E597"
              text="Advanced algorithms to identify optimal turbine locations"
            />
            <InfoCard
              backgroundColor="#DFF4D1"
              text="Sustainable energy solutions for a greener tomorrow"
            />
          </div>
          <div className="text-white z-50 flex flex-col space-y-12 items-center justify-center h-full">
            <div className="text-3xl md:text-5xl lg:text-7xl max-w-[65vw] text-center hammersmith">
              <p>
                Turning wind into <span className="text-[#80bf58]">watts</span>,
                because <span className="text-[#80bf58]">sustainability</span>{" "}
                should never be a <span className="text-[#80bf58]">breeze</span>
                .
              </p>
            </div>
            <div>
              <p className="text-lg w-[40vw] text-center">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et eiusmod tempor incididunt
                ut labore et
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page2;
