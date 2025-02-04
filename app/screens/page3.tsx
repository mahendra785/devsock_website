"use client";
import Image from "next/image";
import bg from "@/public/bg.png";
import { Instagram, Linkedin } from "lucide-react";
import { DiscIcon as Discord } from "lucide-react";

const Page3 = () => {
  return (
    <div className="relative h-screen w-screen">
      {/* Background Image */}
      <Image
        src={bg || "/placeholder.svg"}
        alt="Full screen background"
        fill
        className="absolute inset-0 object-cover"
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <div className="flex-1 flex flex-row items-start justify-between gap-8 py-24">
          {/* Text Content */}
          <div className="w-full md:w-1/2 space-y-20 px-24">
            <div className="text-5xl md:text-8xl font-bold text-white">
              About us
            </div>
            <div className="max-w-6xl space-y-6 text-2xl">
              <p className="text-white/90 ">
                em ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et eiusmod tempor incididunt
                ut labore et labore et eiusmod tempor incididunt ut labore et
              </p>
              <p className="text-white/90">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et eiusmod tempor incididunt
                ut labore et
              </p>
            </div>
          </div>

          {/* Wind Icon */}
          <div className="w-full md:w-1/3 pr-24 flex flex-col h-full items-center ">
            <Image
              src="/wind.svg"
              width={300}
              height={300}
              alt="Wind icon"
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 w-full h-[12vh] bg-[#b6e597]">
          <div className="container mx-auto h-full px-6 flex flex-col md:flex-row justify-center md:justify-between items-center">
            {/* Social Icons */}
            <div className="flex items-center gap-6">
              <a href="#" className="text-black hover:text-black/70">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-black hover:text-black/70">
                <Discord size={24} />
              </a>
              <a href="#" className="text-black hover:text-black/70">
                <Linkedin size={24} />
              </a>
            </div>
            {/* Copyright Text */}
            <p className="text-black text-sm mt-4 md:mt-0">
              Copyright 2025-2027 Tenretni Dab | All Rights Reserved | Powered
              by TD
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page3;
