"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

/** 기본 브랜드 컬러 (팀 생성·온보딩 완료 등 공통) */
const DEFAULT_COLORS = ["#B8FF12", "#76AD00", "#F1F1F1"];

const DEFAULT_DURATION_MS = 3000;

/** 한 번에 발사할 컨페티 옵션 (origin + angle). 커스텀 bursts 시 사용 */
export type ConfettiBurst = {
  origin: { x: number; y: number };
  angle: number;
  spread?: number;
  particleCount?: number;
};

/** dualSide: 좌/우에서 동시 발사 (팀 생성·온보딩 완료) */
const PRESET_DUAL_SIDE: ConfettiBurst[] = [
  { origin: { x: 0, y: 0.45 }, angle: 60, spread: 55, particleCount: 2 },
  { origin: { x: 1, y: 0.45 }, angle: 120, spread: 55, particleCount: 2 },
];

/** center: 중앙에서 한 번 발사 */
const PRESET_CENTER: ConfettiBurst[] = [
  { origin: { x: 0.5, y: 0.5 }, angle: 90, spread: 360, particleCount: 50 },
];

export type UseCelebrationConfettiOptions = {
  /** 재생 시간(ms). 기본 3000 */
  durationMs?: number;
  /** 컨페티 색상. 미지정 시 브랜드 기본색 */
  colors?: string[];
  /** 미리 정의된 패턴. 기본 'dualSide' */
  preset?: "dualSide" | "center";
  /** preset 대신 직접 버스트 목록 지정 (고급) */
  bursts?: ConfettiBurst[];
};

/**
 * 마운트 시 1회 축하 컨페티를 재생합니다.
 * 팀 생성 완료, 온보딩 완료 등에서 공통 사용 가능합니다.
 *
 * @example
 * useCelebrationConfetti(); // 기본: dualSide, 3초, 브랜드 색
 * useCelebrationConfetti({ durationMs: 5000, colors: ['#fff'] });
 * useCelebrationConfetti({ preset: 'center' });
 */
export function useCelebrationConfetti(
  options: UseCelebrationConfettiOptions = {},
) {
  const {
    durationMs = DEFAULT_DURATION_MS,
    colors = DEFAULT_COLORS,
    preset = "dualSide",
    bursts: customBursts,
  } = options;

  const bursts =
    customBursts ??
    (preset === "center" ? PRESET_CENTER : PRESET_DUAL_SIDE);

  useEffect(() => {
    const end = Date.now() + durationMs;

    const frame = () => {
      for (const b of bursts) {
        confetti({
          particleCount: b.particleCount ?? 2,
          angle: b.angle,
          spread: b.spread ?? 55,
          origin: b.origin,
          colors,
        });
      }

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
    // 마운트 시 1회만 재생. bursts/colors는 초기값만 사용하므로 deps에서 제외
    // eslint-disable-next-line react-hooks/exhaustive-deps -- celebration runs once with initial options
  }, [durationMs]);
}
