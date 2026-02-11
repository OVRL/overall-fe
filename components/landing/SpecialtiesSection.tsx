"use client";

import { useRef } from "react";
import { StaticImageData } from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import Icon from "@/components/Icon";
import imgBall from "@/public/images/soccer_ball.svg";
import imgShoe from "@/public/images/soccer_shoe.svg";
import imgGoalpost from "@/public/images/soccer_goalpost.svg";
import aiStart from "@/public/icons/star_ai.svg";
import shield from "@/public/icons/shield.svg";
import trophy from "@/public/icons/trophy.svg";

const FeatureItem = ({
  iconSrc,
  title,
  description,
  index,
  iconSrc2,
}: {
  iconSrc: StaticImageData;
  title: string;
  description: string;
  index: number;
  iconSrc2: StaticImageData;
}) => {
  return (
    <div className="relative pl-12 md:pl-20 py-12">
      {/* Dot on the timeline - absolute positioned relative to the container */}
      <div className="absolute left-[-9px] top-12 md:left-[-11px] w-5 h-5 md:w-6 md:h-6 bg-green-500 rounded-full border-4 border-black z-20" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-100px" }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="flex flex-col md:flex-row items-start md:items-center gap-6"
      >
        <div>
          <div className="w-16 h-16 rounded-2xl bg-Fill_AccentPrimary mb-6 p-4">
            <Icon src={iconSrc2} alt={title} nofill width={32} height={32} />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
            {title}
          </h3>
          <p className="text-Label-Tertiary text-sm md:text-base leading-relaxed max-w-md">
            {description}
          </p>
        </div>

        <Icon
          src={iconSrc}
          alt={title}
          nofill
          className="w-10 h-auto md:w-md"
        />
      </motion.div>
    </div>
  );
};

const SpecialtiesSection = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 0.5], ["0%", "100%"]);

  return (
    <section
      className="w-full py-24 md:py-40 bg-black overflow-hidden relative"
      ref={containerRef}
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-bold text-white">
            OVR만의 <span className="text-Label-AccentPrimary">특별함</span>
          </h2>
        </div>

        <div className="relative  mx-auto border-l-2 border-gray-1000 pl-0 ml-4 md:ml-0">
          {/* Active Line */}
          <motion.div
            className="absolute left-[-2px] top-0 w-[2px] bg-green-500 z-10 origin-top"
            style={{ height: lineHeight }}
          />

          <FeatureItem
            index={0}
            iconSrc={imgBall}
            title="나만의 OVR 점수"
            description="경기/매너/참여도 등 다양한 지표를 분석하여 나만의 객관적인 실력을 확인해보세요."
            iconSrc2={aiStart}
          />
          <FeatureItem
            index={1}
            iconSrc={imgShoe}
            title="시즌별 선수 카드"
            description="나의 기록이 담긴, 세상에 하나뿐인 시즌별 선수 카드를 소장하고 공유해보세요."
            iconSrc2={shield}
          />
          <FeatureItem
            index={2}
            iconSrc={imgGoalpost}
            title="팀 히스토리 시각화"
            description="팀의 소중한 역사와 기록을 한눈에 보기 쉽게 시각화하여 팀원들과 공유하세요."
            iconSrc2={trophy}
          />
        </div>
      </div>
    </section>
  );
};

export default SpecialtiesSection;
