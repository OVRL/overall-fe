"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import imgPlayer5 from "@/public/images/player/img_player-5.svg";
import Icon from "../Icon";

const Player5Section = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-20% 0px" });

  return (
    <section
      ref={ref}
      className="w-full py-24 md:py-40 bg-black overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center font-paperlogy">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={
            isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
          }
          transition={{ duration: 0.8, type: "spring" }}
          className="flex justify-center"
        >
          <Icon
            src={imgPlayer5}
            alt="Player 5"
            nofill
            className="relative w-auto h-100 md:h-184"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-Label-AccentPrimary text-2xl font-bold mb-4">
            완벽한 경기 관리
          </h3>
          <h2 className="text-3xl md:text-5xl leading-10 font-semibold text-Label-Tertiary md:leading-15">
            <span className="text-white">경기 일정</span> 등록부터 참석 투표,
            <br />
            <span className="text-white">실시간 포메이션 구성</span>까지
            <br />
            모든 준비를 완벽하게.
          </h2>
        </motion.div>
      </div>
    </section>
  );
};

export default Player5Section;
