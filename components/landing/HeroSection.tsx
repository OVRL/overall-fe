"use client";

import { motion } from "motion/react";

import Image from "next/image";
import LandingStartForm from "./LandingStartForm";

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-dvh shrink-0 overflow-hidden flex flex-col items-center justify-center bg-black">
      <Image
        src="/images/landing_background_image.webp"
        alt="Hero Background"
        fill
        quality={100}
        className="object-cover"
      />
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(118.28% 50% at 50% 50%, rgba(0, 0, 0, 0.00) 0%, #000 100%)",
        }}
      />
      <div className="relative flex flex-col gap-12 justify-center w-full max-w-md h-153 px-4 sm:px-6">
        <LandingStartForm />

        {/* Videos - Positioned Relative to Card */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute top-0 right-full mr-8 w-48 lg:w-80 hidden lg:block mix-blend-screen pointer-events-none"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/videos/img_video1.mp4" type="video/mp4" />
          </video>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="absolute bottom-20 left-full w-48 lg:w-70 hidden lg:block mix-blend-screen pointer-events-none"
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/videos/img_video2.mp4" type="video/mp4" />
          </video>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
