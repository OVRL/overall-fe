"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import imgPlayerDive from "@/public/images/player/player_dive.svg";
import Icon from "../Icon";

const PlayerDiveSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, margin: "-20% 0px" });

  return (
    <section
      ref={ref}
      className="w-full py-24 md:py-40 bg-black overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center font-paperlogy">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.8 }}
          className="order-2 md:order-1"
        >
          <h3 className="text-Label-AccentPrimary text-2xl font-bold mb-4">
            통합 모션 히스토리
          </h3>
          <h2 className="text-3xl md:text-5xl leading-10 font-semibold text-Label-Tertiary md:leading-15">
            경기 상세 기록과 시즌별 통계,
            <br />
            팀 성장 승리의 순간부터
            <br />
            특별한 기록까지{" "}
            <span className="text-white">팀의 모든 역사를 영원히 아카이브</span>
          </h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 100, y: 50 }}
          animate={
            isInView
              ? { opacity: 1, x: 0, y: 0 }
              : { opacity: 0, x: 100, y: 50 }
          }
          transition={{ duration: 1, type: "spring", bounce: 0.4 }}
          className="order-1 md:order-2 flex justify-center"
        >
          <Icon
            src={imgPlayerDive}
            alt="Player Dive"
            nofill
            className="relative h-auto w-100 md:w-full"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default PlayerDiveSection;
