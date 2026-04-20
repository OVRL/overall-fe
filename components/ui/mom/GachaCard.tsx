'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';

export interface GachaCardProps {
  id: string | number;
  name: string;
  position?: string | null;
  number?: number | null;
  profileImage?: string | null;
  /** 각 카드별 랜덤 떠다니기 딜레이 (애니메이션 자연스러움 목적) */
  delay?: number;
}

export default function GachaCard({ id, name, position, number, profileImage, delay = 0 }: GachaCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // 클릭 시 뒤집기 (한 번 뒤집으면 끝)
  const handleFlip = () => {
    if (!isFlipped) setIsFlipped(true);
  };

  return (
    <div className="relative w-[304px] h-[399px] perspective-[1000px]" onClick={handleFlip}>
      {/* 떠다니는 애니메이션은 상위 래퍼에 적용 */}
      <motion.div
        className="w-full h-full relative"
        animate={{
          y: [-10, 10, -10],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay,
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* 뒤집기 애니메이션을 적용하는 래퍼 */}
        <motion.div
          className="w-full h-full relative shadow-[0px_0px_30px_0px_var(--primaryalpha\/primaryalpha60,rgba(184,255,18,0.6))] rounded-[38px] cursor-pointer"
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 200, damping: 20 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* ======== 뒷면 (Back Face - 뒤집히기 전 덮인 상태) ======== */}
          <div
            className="absolute inset-0 w-full h-full rounded-[38px] flex items-center justify-center border-2 border-[var(--primaryalpha\/primaryalpha70,rgba(184,255,18,0.7))] overflow-hidden"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(0deg)' }}
          >
            {/* 배경 이미지 */}
            <Image
              src="/images/card-bgs/normal-green.webp"
              alt="Card Background"
              fill
              className="object-cover opacity-50 select-none pointer-events-none"
              sizes="304px"
              priority
            />
            {/* 로고 부유 */}
            <div className="w-[240px] h-[246px] relative z-10">
              <Image 
                src="/icons/logo_OVR.svg" 
                alt="OVR Logo" 
                fill 
                className="object-contain select-none pointer-events-none" 
                priority 
              />
            </div>
          </div>

          {/* ======== 앞면 (Front Face - 뒤집힌 후 선수 정보) ======== */}
          <div
            className="absolute inset-0 w-full h-full rounded-[38px] overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            {/* 앞면 카드 배경 */}
            <Image
              src="/images/card-bgs/normal-green.webp"
              alt="Front Background"
              fill
              className="object-cover absolute select-none pointer-events-none"
              sizes="304px"
              priority
            />
            
            {/* 선수 이미지 그라데이션 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.8)] via-[rgba(0,0,0,0.2)] to-[rgba(0,0,0,0.4)] pointer-events-none" />
            
            {/* 선수 실사 */}
            {profileImage && (
              <div className="absolute w-[430px] h-[430px] -left-[20px] top-[36px] pointer-events-none">
                <Image
                  src={profileImage}
                  alt={name}
                  fill
                  className="object-contain z-0 select-none pointer-events-none"
                  sizes="430px"
                />
              </div>
            )}

            {/* 하단 딤 처리 */}
            <div className="absolute bottom-0 left-0 right-0 h-[166px] bg-gradient-to-b from-transparent to-black pointer-events-none z-10" />

            {/* 등번호 및 포지션 */}
            <div className="absolute top-[19px] left-[19px] flex flex-col items-center w-[71px] z-20 pointer-events-none">
              <div className="relative w-full h-[76px] drop-shadow-[0px_9.5px_19px_rgba(0,0,0,0.15)] flex justify-center">
                <span className="text-white text-[57px] font-bold leading-[76px]">
                  {number ?? '-'}
                </span>
              </div>
              <div className="bg-[#74ea76] opacity-90 px-[9.5px] py-[2.4px] rounded-[4px] shadow-[0px_4.75px_23.75px_rgba(0,0,0,0.3)] mt-[-10px] z-10 flex items-center justify-center">
                <span className="text-white font-semibold text-[28px] leading-none">
                  {position ?? 'UKN'}
                </span>
              </div>
            </div>

            {/* 이름 */}
            <div className="absolute bottom-[19px] left-1/2 -translate-x-1/2 w-[266px] flex justify-center drop-shadow-[0px_9.5px_19px_rgba(0,0,0,0.15)] z-20 pointer-events-none">
              <span className="text-white text-[42px] font-bold drop-shadow-[0px_9.5px_9.5px_rgba(0,0,0,0.4)] whitespace-nowrap">
                {name}
              </span>
            </div>

            {/* Glow 이펙트 연출용 (뒤집히자마자 발생) */}
            {isFlipped && (
               <motion.div
                  className="absolute inset-0 rounded-[38px] pointer-events-none border-2 border-[#c8fd48]"
                  initial={{ boxShadow: "inset 0px 0px 0px rgba(184,255,18,0)", opacity: 1 }}
                  animate={{ 
                    boxShadow: ["inset 0px 0px 100px rgba(184,255,18,0.8)", "inset 0px 0px 20px rgba(184,255,18,0.0)"],
                    opacity: [1, 0]
                  }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
               />
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
