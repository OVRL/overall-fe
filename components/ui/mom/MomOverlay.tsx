"use client";

import React, { useMemo, useSyncExternalStore } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import GachaCard, { GachaCardProps } from "./GachaCard";

export interface MomOverlayProps {
  candidates: GachaCardProps[];
  onClose?: () => void; // 나중에 닫기 버튼을 위해 확장 가능한 Props
}

/** @theme --breakpoint-md(48rem) — PC에서 3열 카드가 나란히 들어갈 폭 */
const MQ_MD_UP = "(min-width: 48rem)";

function subscribeMdUp(onStoreChange: () => void) {
  const mq = window.matchMedia(MQ_MD_UP);
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getMdUpSnapshot() {
  return window.matchMedia(MQ_MD_UP).matches;
}

function getMdUpServerSnapshot() {
  return false;
}

function useIsMdUp() {
  return useSyncExternalStore(
    subscribeMdUp,
    getMdUpSnapshot,
    getMdUpServerSnapshot,
  );
}

/**
 * 모바일 Embla 뷰포트 전용 — `overflow:hidden`으로 box-shadow 글로우가 상·하 직각 클립되는 현상 완화.
 * PC처럼 글로우가 검정으로 자연 스며듦처럼 보이도록 렌더 결과만 상·하 페더(PC는 클립 없음이라 불필요).
 */
const MOM_CAROUSEL_VIEWPORT_MASK =
  "linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)";

/** 모바일: 중앙 슬라이드(center)와 동일 기준으로 거리만큼 순차 등장 — 가운데가 가장 먼저 */
function mobileIntroDelaySec(
  idx: number,
  len: number,
  staggerSec: number,
): number {
  const center = Math.min(1, Math.max(0, len - 1));
  return Math.abs(idx - center) * staggerSec;
}

/** 모바일 카드 진입 시 좌우만 살짝 수평 이동(웹뷰 성능 위해 transform 단일 레이어) */
function mobileIntroMotionState(
  prefersReducedMotion: boolean,
  idx: number,
  len: number,
): { initial: Record<string, number>; animate: Record<string, number> } {
  if (prefersReducedMotion) {
    return { initial: { opacity: 0 }, animate: { opacity: 1 } };
  }
  const center = Math.min(1, Math.max(0, len - 1));
  if (idx === center) {
    return {
      initial: { opacity: 0, y: 18 },
      animate: { opacity: 1, y: 0 },
    };
  }
  if (idx < center) {
    return {
      initial: { opacity: 0, y: 14, x: -26 },
      animate: { opacity: 1, y: 0, x: 0 },
    };
  }
  return {
    initial: { opacity: 0, y: 14, x: 26 },
    animate: { opacity: 1, y: 0, x: 0 },
  };
}

type IntroTiming = {
  backdropSec: number;
  titleDelaySec: number;
  titleDurSec: number;
  cardsBaseDelaySec: number;
  staggerSec: number;
  cardDurSec: number;
};

/** 모바일·좁은 화면: 스와이프 캐러셀 */
function MomCarouselMobile({
  candidates,
  prefersReducedMotion,
  timing,
}: {
  candidates: GachaCardProps[];
  prefersReducedMotion: boolean;
  timing: IntroTiming;
}) {
  const startIndex = Math.min(1, Math.max(0, candidates.length - 1));

  const [emblaRef] = useEmblaCarousel({
    align: "center",
    containScroll: false,
    loop: false,
    startIndex,
  });

  const len = candidates.length;

  return (
    <div
      className="w-full max-w-[100vw] overflow-hidden px-3 min-h-106 flex flex-col justify-center"
      ref={emblaRef}
      style={{
        maskImage: MOM_CAROUSEL_VIEWPORT_MASK,
        WebkitMaskImage: MOM_CAROUSEL_VIEWPORT_MASK,
      }}
    >
      <div className="flex touch-pan-y items-center gap-x-8 md:gap-x-10 lg:gap-x-12">
        {candidates.map((candidate, idx) => {
          const { initial, animate } = mobileIntroMotionState(
            prefersReducedMotion,
            idx,
            len,
          );
          const delaySec =
            timing.cardsBaseDelaySec +
            mobileIntroDelaySec(idx, len, timing.staggerSec);

          return (
            <motion.div
              key={candidate.id}
              className="min-w-0 shrink-0 grow-0 select-none py-3"
              initial={initial}
              animate={animate}
              transition={{
                delay: delaySec,
                duration: timing.cardDurSec,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <GachaCard
                {...candidate}
                delay={idx * 0.45} // 카드마다 위상차를 더 넓혀 한 번에 움직이는 느낌을 줄임
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/** md 이상: 캐러셀 없이 한 줄 배치 */
function MomCardsDesktopRow({
  candidates,
  prefersReducedMotion,
  timing,
}: {
  candidates: GachaCardProps[];
  prefersReducedMotion: boolean;
  timing: IntroTiming;
}) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-8 px-4 md:gap-9 lg:gap-11">
      {candidates.map((candidate, idx) => {
        const delaySec = timing.cardsBaseDelaySec + idx * timing.staggerSec;

        return (
          <motion.div
            key={candidate.id}
            className="shrink-0 py-3"
            initial={
              prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 18 }
            }
            animate={
              prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }
            }
            transition={{
              delay: delaySec,
              duration: timing.cardDurSec,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <GachaCard
              {...candidate}
              delay={idx * 0.45} // 카드마다 위상차를 더 넓혀 한 번에 움직이는 느낌을 줄임
            />
          </motion.div>
        );
      })}
    </div>
  );
}

export default function MomOverlay({ candidates, onClose }: MomOverlayProps) {
  const isMdUp = useIsMdUp();
  const prefersReducedMotion = useReducedMotion();

  const timing = useMemo((): IntroTiming => {
    if (prefersReducedMotion) {
      return {
        backdropSec: 0.14,
        titleDelaySec: 0.14,
        titleDurSec: 0.22,
        cardsBaseDelaySec: 0.28,
        staggerSec: 0.1,
        cardDurSec: 0.28,
      };
    }
    return {
      backdropSec: 0.38,
      titleDelaySec: 0.38,
      titleDurSec: 0.36,
      cardsBaseDelaySec: 0.76,
      staggerSec: 0.18,
      cardDurSec: 0.42,
    };
  }, [prefersReducedMotion]);

  const titleEase = [0.22, 1, 0.36, 1] as const;

  return (
    <div className="fixed inset-0 z-100 flex flex-col overflow-hidden">
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-black/60 backdrop-blur-[15px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: timing.backdropSec,
          ease: "easeOut",
        }}
      />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center gap-16">
        <div className="flex w-full max-w-full flex-col items-center gap-16">
          <div
            className={cn(
              "relative z-20 shrink-0 px-4 text-center",

              /* 예전 absolute + top-51 과 동일 오프셋 — gap-16 이 데스크톱·모바일 모두 적용되도록 플로우 배치 */
            )}
          >
            <motion.h1
              className={cn(
                "font-black uppercase tracking-widest text-green-500",
                "max-lg:text-[2rem] max-sm:leading-tight",
                "sm:text-4xl sm:leading-normal xl:text-6xl",
              )}
              initial={
                prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 14 }
              }
              animate={
                prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }
              }
              transition={{
                delay: timing.titleDelaySec,
                duration: timing.titleDurSec,
                ease: titleEase,
              }}
            >
              MAN OF THE MATCH
            </motion.h1>
          </div>

          <div className="relative z-10 flex w-full flex-1 items-center justify-center py-6">
            {isMdUp ? (
              <MomCardsDesktopRow
                candidates={candidates}
                prefersReducedMotion={!!prefersReducedMotion}
                timing={timing}
              />
            ) : (
              <MomCarouselMobile
                candidates={candidates}
                prefersReducedMotion={!!prefersReducedMotion}
                timing={timing}
              />
            )}
          </div>
        </div>
        {onClose && (
          <motion.button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-[calc(env(safe-area-inset-top,0px)+1.25rem)] z-30 text-white opacity-50 transition-opacity hover:opacity-100 sm:right-10 sm:top-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{
              delay: timing.titleDelaySec + 0.06,
              duration: timing.titleDurSec,
              ease: titleEase,
            }}
            whileHover={{ opacity: 1 }}
          >
            ✕ 닫기
          </motion.button>
        )}
      </div>
    </div>
  );
}
