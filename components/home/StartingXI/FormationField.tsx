"use client";

import React, { useMemo } from "react";
import ObjectField from "@/components/ui/ObjectField";
import PlayerPositionCard from "./PlayerPositionCard";
import { Player } from "@/types/player";
import { useMediaQuery } from "@/hooks/useMediaQuery";

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
  className?: string;
}

const FormationField = ({ players, className }: FormationFieldProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // 크롭 정보 선택
  const currentCrop = useMemo(
    () => (isDesktop ? HOME_DESKTOP_CROP : HOME_MOBILE_CROP),
    [isDesktop],
  );

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
      {/* 선수 배치 */}
      {players.slice(0, 11).map((player, index) => {
        const absPosition = FORMATION_POSITIONS[index + 1];
        const transformedPos = getTransformedPosition(absPosition);

        return (
          <div
            key={player.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
            style={{
              top: transformedPos.top,
              left: transformedPos.left,
            }}
          >
            <PlayerPositionCard player={player} />
          </div>
        );
      })}
    </ObjectField>
  );
};

export default FormationField;
