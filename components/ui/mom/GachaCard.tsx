"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import MainProfileCard from "@/components/ui/MainProfileCard";
import { cn } from "@/lib/utils";
import type { Position } from "@/types/position";

/** MainProfileCard 기본 너비(w-32) — 뷰포트별 카드 너비에 맞춘 균등 스케일(CSS 변수 --mom-scale) */

function coerceMainPosition(raw?: string | null): Position {
  if (!raw) return "CM";
  return raw as Position;
}

export interface GachaCardProps {
  id: string | number;
  name: string;
  position?: string | null;
  number?: number | null;
  profileImage?: string | null;
  /** 각 카드별 랜덤 떠다니기 딜레이 (애니메이션 자연스러움 목적) */
  delay?: number;
}

export default function GachaCard({
  name,
  position,
  number,
  profileImage,
  delay = 0,
}: GachaCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // 클릭 시 뒤집기 (한 번 뒤집으면 끝)
  const handleFlip = () => {
    if (!isFlipped) setIsFlipped(true);
  };

  /** 모션 공식 문서: transform·opacity는 GPU 친화. 스프링은 저사양·웹뷰에서 부담될 수 있어 감속 모션 시 tween으로 전환 */
  const flipTransition = prefersReducedMotion
    ? { duration: 0.35, ease: "easeOut" as const }
    : { type: "spring" as const, stiffness: 200, damping: 22, mass: 0.85 };

  return (
    <div
      className={cn(
        "relative perspective-distant",
        /* 393px 기준 디자인: w-57·h-75 — 캐러셀(~md 미만). md~lg: 좁은 태블릿 폭에서 3열 줄바꿈 방지용 축소. lg~: 원래 큰 카드 */
        "h-75 w-57 [--mom-scale:1.78125]",
        "md:h-70.5 md:w-54 md:[--mom-scale:2.06]",
        "lg:h-99.75 lg:w-76.5 lg:[--mom-scale:2.375]",
      )}
      onClick={handleFlip}
    >
      {/* 떠다니는 애니메이션: 접근성·웹뷰 부하 시 비활성(Motion 권장 패턴) */}
      <motion.div
        className="relative h-full w-full"
        animate={
          prefersReducedMotion
            ? undefined
            : {
                y: [-10, 10, -10],
              }
        }
        transition={
          prefersReducedMotion
            ? undefined
            : {
                duration: 4.75,
                repeat: Infinity,
                ease: "easeInOut",
                delay: delay,
              }
        }
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* 뒤집기: rotateY 단일 레이어로 합성 레이어 유지(웹뷰에서 유리) */}
        <motion.div
          className={cn(
            /* Figma primaryalpha60 — var(--…/…)는 생성 CSS에서 `/` 파싱 오류 유발 → 동일 rgba 사용 */
            "relative h-full w-full cursor-pointer rounded-[1.78125rem] shadow-[0px_0px_30px_0px_rgba(184,255,18,0.6)] md:rounded-4xl lg:rounded-[2.375rem] will-change-transform",
          )}
          initial={false}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={flipTransition}
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* ======== 뒷면 (Back Face - 뒤집히기 전 덮인 상태) ======== */}
          <div
            className="absolute inset-0 flex h-full w-full items-center justify-center overflow-hidden rounded-[1.78125rem] transition-colors duration-200 hover:border-2 hover:border-[rgba(184,255,18,0.7)] md:rounded-4xl lg:rounded-[2.375rem]"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(0deg)" }}
          >
            {/* 배경 이미지 */}
            <Image
              src="/images/card-bgs/normal-green.webp"
              alt="Card Background"
              fill
              className="pointer-events-none select-none object-cover opacity-50"
              sizes="(max-width:393px) 228px, 304px"
              priority
            />
            {/* 로고 — 애니 WebP(공개 폴더 최적화본·unoptimized로 애니 유지), 감속 모션 시 정적 SVG */}
            <div className="relative z-10 h-46.25 w-45 md:h-55.5 md:w-54 lg:h-61.5 lg:w-60">
              {prefersReducedMotion ? (
                <Image
                  src="/icons/logo_OVR.svg"
                  alt="OVR Logo"
                  fill
                  className="pointer-events-none select-none object-contain"
                  priority
                />
              ) : (
                <Image
                  src="/videos/mom_card_logo.webp"
                  alt="OVR Logo"
                  fill
                  className="pointer-events-none select-none object-contain"
                  sizes="(max-width:640px) 180px, 240px"
                  unoptimized
                  priority
                />
              )}
            </div>
          </div>

          {/* ======== 앞면 (Front Face - 뒤집힌 후 선수 정보) — MainProfileCard를 scale로 MOM 카드 크기에 맞춤 ======== */}
          <div
            className="absolute inset-0 flex h-full w-full items-center justify-center overflow-hidden rounded-[1.78125rem] md:rounded-4xl lg:rounded-[2.375rem]"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div
              className="pointer-events-none shrink-0"
              style={{
                transform: "scale(var(--mom-scale))",
                transformOrigin: "center center",
              }}
            >
              <MainProfileCard
                playerName={name}
                mainPosition={coerceMainPosition(position)}
                backNumber={number ?? 0}
                imgUrl={profileImage}
                imagePriority
              />
            </div>

            {/* Glow 이펙트 (filter/box-shadow는 GPU 비용이 큼 — 감속 모션 시 생략) */}
            {isFlipped && !prefersReducedMotion && (
              <motion.div
                className="pointer-events-none absolute inset-0 rounded-[1.78125rem] border-2 border-[#c8fd48] md:rounded-4xl lg:rounded-[2.375rem]"
                initial={{
                  boxShadow: "inset 0px 0px 0px rgba(184,255,18,0)",
                  opacity: 1,
                }}
                animate={{
                  boxShadow: [
                    "inset 0px 0px 100px rgba(184,255,18,0.8)",
                    "inset 0px 0px 20px rgba(184,255,18,0.0)",
                  ],
                  opacity: [1, 0],
                }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
