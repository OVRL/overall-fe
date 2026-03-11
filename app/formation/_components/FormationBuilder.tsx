"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

import { useFormationManager } from "@/hooks/formation/useFormationManager";
import { useIsMobile } from "@/hooks/useIsMobile";
import FormationBuilderMobile from "./FormationBuilderMobile";
import Skeleton from "@/components/ui/Skeleton";
import { Player } from "@/types/formation";

/** 데스크톱 레이아웃과 비슷한 스켈레톤 (매치 카드 + 쿼터/컨트롤 + 보드 + 선수 명단) */
function FormationBuilderDesktopSkeleton() {
  return (
    <div className="flex flex-1 flex-col lg:flex-row gap-4 w-full max-w-screen-xl justify-center lg:items-stretch 2xl:max-w-none">
      <div className="w-full lg:flex-1 2xl:w-225 2xl:flex-none flex flex-col gap-4 shrink-0">
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-6 w-32 rounded" />
          <div className="flex gap-2">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-12 w-9 rounded-full" />
          </div>
          <Skeleton className="h-12 w-36 rounded-[0.625rem] ml-auto" />
        </div>
        <Skeleton className="flex-1 min-h-80 w-full rounded-xl" />
      </div>
      <Skeleton className="w-full lg:w-80 min-h-100 rounded-xl shrink-0" />
    </div>
  );
}

/** 데스크톱 전용 DnD 번들을 모바일에서 로드하지 않도록 dynamic import */
const FormationBuilderDesktopWithDnd = dynamic(
  () => import("./FormationBuilderDesktopWithDnd").then((m) => m.default),
  {
    ssr: false,
    loading: () => <FormationBuilderDesktopSkeleton />,
  },
);

interface FormationBuilderProps {
  scheduleCard: React.ReactNode;
  initialPlayers: Player[];
}

/**
 * 포메이션 빌더 오케스트레이터: 비즈니스 상태만 유지, 1024px 기준 데스크/모바일 분기.
 * 모바일: FormationBuilderMobile (탭 배치, DnD 없음). 데스크톱: FormationBuilderDesktopWithDnd (DnD 번들 별도 청크).
 */
export default function FormationBuilder({
  scheduleCard,
  initialPlayers,
}: FormationBuilderProps) {
  const { quarters, setQuarters, assignPlayer, removePlayer } =
    useFormationManager();
  const isLgOrBelow = useIsMobile(1023);
  const [currentQuarterId, setCurrentQuarterId] = useState<number | null>(null);
  const [selectedListPlayer, setSelectedListPlayer] = useState<Player | null>(
    null,
  );
  // 임시 테스트용 상태
  const [matchType] = useState<"MATCH" | "INTERNAL">("INTERNAL");
  const [selectedSubTeam, setSelectedSubTeam] = useState<"A" | "B">("A");

  const commonProps = {
    quarters,
    setQuarters,
    currentQuarterId,
    setCurrentQuarterId,
    matchType,
    selectedSubTeam,
    onSubTeamChange: setSelectedSubTeam,
    selectedPlayer: selectedListPlayer,
    setSelectedPlayer: setSelectedListPlayer,
    onPositionRemove: removePlayer,
    assignPlayer,
    initialPlayers,
  };

  if (isLgOrBelow) {
    return <FormationBuilderMobile {...commonProps} />;
  }

  return (
    <FormationBuilderDesktopWithDnd
      scheduleCard={scheduleCard}
      {...commonProps}
    />
  );
}
