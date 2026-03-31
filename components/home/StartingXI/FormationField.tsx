"use client";

import React, { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import ObjectField from "@/components/ui/ObjectField";
import PlayerPositionCard from "./PlayerPositionCard";
import Skeleton from "@/components/ui/Skeleton";
import { Player } from "@/types/player";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";
import OnboardingBestXl from "./OnboardingBestXl";
import {
  formationPlayerSlotVariants,
  formationPlayersContainerVariants,
} from "./motion-variants";

// 홈 화면 Starting XI 전용 크롭 설정
const HOME_DESKTOP_CROP = { x: 0, y: 0, width: 1.0, height: 1.0 };
const HOME_MOBILE_CROP = { x: 0.24, y: 0.05, width: 0.52, height: 0.9 };

interface FormationPosition {
  top: string;
  left: string;
}

// 포메이션 위치 (4-2-3-1) - 절대 좌표 (전체 필드 기준)
const FORMATION_POSITIONS: Record<number, FormationPosition> = {
  1: { top: "90%", left: "50%" }, // GK (Bottom)
  2: { top: "75%", left: "15%" }, // LB
  3: { top: "75%", left: "40%" }, // CB
  4: { top: "75%", left: "60%" }, // CB
  5: { top: "75%", left: "85%" }, // RB
  6: { top: "54%", left: "30%" }, // CDM
  7: { top: "54%", left: "70%" }, // CDM
  8: { top: "38%", left: "50%" }, // CAM
  9: { top: "18%", left: "12%" }, // LW
  10: { top: "18%", left: "88%" }, // RW
  11: { top: "16%", left: "50%" }, // ST (Top)
};

interface FormationFieldProps {
  players: Player[];
  /** 팀원 1명이면 true. API 없음 동안 온보딩 노출 (추후 베스트 XI 쿼리 값 없을 때로 교체 예정) */
  isSoloTeam: boolean;
  className?: string;
}

const FormationField = ({
  players,
  isSoloTeam,
  className,
}: FormationFieldProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const prefersReducedMotion = useReducedMotion();

  // 훅은 항상 동일한 순서로 호출되어야 하므로 early return 이전에 선언
  const currentCrop = useMemo(
    () =>
      isDesktop === true
        ? HOME_DESKTOP_CROP
        : isDesktop === false
        ? HOME_MOBILE_CROP
        : HOME_DESKTOP_CROP, // null일 때는 스켈레톤만 쓰이므로 값 미사용
    [isDesktop],
  );

  // 뷰포트 미결정 시 스켈레톤 표시 (레이아웃 시프트 방지)
  if (isDesktop === null) {
    return (
      <div
        className={cn(
          "relative w-full overflow-hidden min-h-96 rounded-xl",
          className,
        )}
        role="img"
        aria-label="포메이션 로딩 중"
      >
        <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
      </div>
    );
  }

  // 절대 좌표를 크롭된 영역 내의 상대 좌표로 변환
  const getTransformedPosition = (pos: FormationPosition) => {
    const topVal = parseFloat(pos.top) / 100;
    const leftVal = parseFloat(pos.left) / 100;

    let relativeLeft = (leftVal - currentCrop.x) / currentCrop.width;
    const relativeTop = (topVal - currentCrop.y) / currentCrop.height;

    // 모바일 환경에서 크롭 영역 밖으로 나가는 선수들을 안쪽으로 모음 (Clamping)
    if (!isDesktop) {
      // 좌우 여백 8% 확보하여 경계선에 걸치지 않도록 함
      relativeLeft = Math.max(0.08, Math.min(0.92, relativeLeft));
    }

    return {
      top: `${relativeTop * 100}%`,
      left: `${relativeLeft * 100}%`,
    };
  };

  return (
    <ObjectField crop={currentCrop} className={className}>
      {/* 선수 배치: 팀원 2명 이상이고 베스트 XI 데이터 있을 때만 표시 (현재는 isSoloTeam으로만 분기) */}
      {!isSoloTeam && (
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none"
          variants={formationPlayersContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {players.slice(0, 11).map((player, index) => {
            const absPosition = FORMATION_POSITIONS[index + 1];
            const transformedPos = getTransformedPosition(absPosition);

            return (
              <motion.div
                key={player.id}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-auto"
                style={{
                  top: transformedPos.top,
                  left: transformedPos.left,
                }}
                variants={formationPlayerSlotVariants}
                whileTap={
                  prefersReducedMotion ? undefined : { scale: 0.97 }
                }
                transition={{ type: "spring", stiffness: 500, damping: 28 }}
              >
                <PlayerPositionCard player={player} />
              </motion.div>
            );
          })}
        </motion.div>
      )}
      {isSoloTeam && <OnboardingBestXl />}
    </ObjectField>
  );
};

export default FormationField;
