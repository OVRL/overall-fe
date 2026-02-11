"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import imgPlayer2 from "@/public/images/player/img_player-2.svg";
import Icon from "../Icon";

const Player2Section = () => {
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
            편리한 팀 관리
          </h3>
          <h2 className="text-3xl md:text-5xl leading-10 font-semibold text-Label-Tertiary md:leading-15">
            <span className="text-white">선수 추가부터 기록 관리</span>까지
            <br />
            모든 것을 한 곳에서 간편하게
            <br />
            직관적인 인터페이스로
            <br />
            관리하세요.
          </h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="order-1 md:order-2 flex justify-center"
        >
          <Icon
            src={imgPlayer2}
            alt="Player 2"
            nofill
            className="relative w-auto h-100 md:h-184"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Player2Section;
