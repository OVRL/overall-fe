"use client";

import { motion } from "motion/react";
import HeroBackground from "./HeroBackground";
import Button from "../ui/Button";

const HeroSection = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center bg-black">
      <HeroBackground />

      <div className="z-10 relative flex flex-col gap-12 justify-center w-md h-153">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-full max-w-xl bg-surface-tertiary/60 backdrop-blur-md rounded-2xl p-8.25 flex flex-col items-center gap-6 shadow-2xl text-center"
        >
          <h1 className="text-[2.5rem] font-bold text-white leading-tight font-paperlogy">
            완전히 새로워질
            <br />
            <span className="text-Fill_AccentPrimary">축구 관리 플랫폼</span>
          </h1>
          <p className="text-[oklch(0.7_0_0)] text-base leading-6 font-pretendard">
            팀 코드를 입력하여 시작하세요
          </p>
          <div className="w-full flex flex-col gap-4 font-pretendard">
            <div className="flex flex-col gap-2 text-left">
              <label className="text-white font-medium leading-6 ">
                팀 코드
              </label>
              <input
                type="text"
                placeholder="예: TEAM2025"
                className="h-12.5 bg-surface-elevated rounded-[0.625rem] w-full flex items-center px-4 py-3 text-white border border-[oklch(0.27_0_0)]"
              />
            </div>
          </div>
          <Button size="m" className="w-full h-12">
            시작하기
          </Button>

          <div className="border-t border-[oklch(0.27_0_0)] pt-6.25 w-full font-pretendard">
            <p className="text-[oklch(0.7_0_0)] text-sm leading-5 mb-4">
              아직 팀이 없으신가요?
            </p>
            <Button variant="line" size="m" className="w-full h-12 text-white">
              새 팀 만들기
            </Button>
          </div>
        </motion.div>

        <p className="font-pretendard text-sm leading-5 text-gray-900 w-full text-center">
          아마추어 축구팀을 위한 포메이션 관리 플랫폼
        </p>

        {/* Videos - Positioned Relative to Card */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute top-0 right-full mr-8 w-48 md:w-80 rounded-xl overflow-hidden shadow-2xl bg-gray-900 hidden md:block"
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
          className="absolute bottom-20 left-full ml-8 w-48 md:w-80 rounded-xl overflow-hidden shadow-2xl bg-gray-900 hidden md:block"
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
