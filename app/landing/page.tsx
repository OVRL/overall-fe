"use client";

import localFont from "next/font/local";
import HeroSection from "@/components/landing/HeroSection";
import Player2Section from "@/components/landing/Player2Section";
import Player5Section from "@/components/landing/Player5Section";
import PlayerDiveSection from "@/components/landing/PlayerDiveSection";
import SpecialtiesSection from "@/components/landing/SpecialtiesSection";

const paperlogy = localFont({
  src: [
    {
      path: "../../styles/fonts/Paperlogy/Paperlogy-1Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../styles/fonts/Paperlogy/Paperlogy-2ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../styles/fonts/Paperlogy/Paperlogy-3Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../styles/fonts/Paperlogy/Paperlogy-4Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../styles/fonts/Paperlogy/Paperlogy-5Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../styles/fonts/Paperlogy/Paperlogy-6SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../styles/fonts/Paperlogy/Paperlogy-7Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../styles/fonts/Paperlogy/Paperlogy-8ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../../styles/fonts/Paperlogy/Paperlogy-9Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-paperlogy",
});

export default function LandingPage() {
  return (
    <main
      className={`bg-black min-h-screen font-sans ${paperlogy.variable} ${paperlogy.className} flex flex-col w-full overflow-x-hidden`}
    >
      <HeroSection />
      <Player2Section />
      <Player5Section />
      <PlayerDiveSection />
      <SpecialtiesSection />
      <footer className="py-10 bg-black text-center text-[var(--color-gray-800)] text-sm">
        © 2024 OVR Platform. All rights reserved.
      </footer>
    </main>
  );
}
