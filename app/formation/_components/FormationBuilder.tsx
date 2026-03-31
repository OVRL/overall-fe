"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";

import { useFormationManager } from "@/hooks/formation/useFormationManager";
import { useIsMobile } from "@/hooks/useIsMobile";
import FormationBuilderMobile from "./FormationBuilderMobile";
import { FormationBuilderContentSkeleton } from "./FormationBuilderContentSkeleton";
import { buildQuartersFromMatch } from "@/lib/formation/buildQuartersFromMatch";
import { Player } from "@/types/formation";
import FormationHeader from "./FormationHeader";

/** 데스크톱 전용 DnD 번들을 모바일에서 로드하지 않도록 dynamic import */
const FormationBuilderDesktopWithDnd = dynamic(
  () => import("./FormationBuilderDesktopWithDnd").then((m) => m.default),
  {
    ssr: false,
    loading: () => <FormationBuilderContentSkeleton />,
  },
);

/** 경기(findMatch) 기준 쿼터 수·시간 — 전달 시 탭·보드가 API와 동기화됩니다. */
export type MatchQuarterSpec = {
  quarterCount: number;
  quarterDurationMinutes: number;
  matchType: "MATCH" | "INTERNAL";
};

interface FormationBuilderProps {
  scheduleCard: React.ReactNode;
  matchQuarterSpec?: MatchQuarterSpec | null;
}

/**
 * 포메이션 빌더 오케스트레이터: 비즈니스 상태만 유지, 1024px 기준 데스크/모바일 분기.
 * 선수 풀은 `FormationMatchPlayersProvider`(SSR 데이터)에서 읽습니다.
 */
export default function FormationBuilder({
  scheduleCard,
  matchQuarterSpec = null,
}: FormationBuilderProps) {
  const initialQuarters = useMemo(() => 
    matchQuarterSpec == null
      ? undefined
      : buildQuartersFromMatch(
          matchQuarterSpec.quarterCount,
          matchQuarterSpec.matchType,
        ),
    [matchQuarterSpec]
  );

  const { quarters, setQuarters, assignPlayer, removePlayer, resetQuarters } =
    useFormationManager(initialQuarters);
  const isLgOrBelow = useIsMobile(1023);
  const [currentQuarterId, setCurrentQuarterId] = useState<number | null>(null);
  const [selectedListPlayer, setSelectedListPlayer] = useState<Player | null>(
    null,
  );
  const matchType = matchQuarterSpec?.matchType ?? "INTERNAL";
  const quarterDurationMinutes =
    matchQuarterSpec?.quarterDurationMinutes ?? 25;
  const [selectedSubTeam, setSelectedSubTeam] = useState<"A" | "B">("A");

  const commonProps = {
    quarters,
    setQuarters,
    currentQuarterId,
    setCurrentQuarterId,
    matchType,
    quarterDurationMinutes,
    selectedSubTeam,
    onSubTeamChange: setSelectedSubTeam,
    selectedPlayer: selectedListPlayer,
    setSelectedPlayer: setSelectedListPlayer,
    onPositionRemove: removePlayer,
    assignPlayer,
  };

  const handleReset = () => {
    resetQuarters();
    setCurrentQuarterId(null);
    setSelectedListPlayer(null);
  };

  const content = isLgOrBelow ? (
    <FormationBuilderMobile {...commonProps} />
  ) : (
    <FormationBuilderDesktopWithDnd
      scheduleCard={scheduleCard}
      {...commonProps}
    />
  );

  return (
    <div className="min-h-dvh pt-safe bg-surface-primary flex flex-col">
      <FormationHeader onReset={handleReset} />
      <main className="flex-1 flex flex-col px-3 md:px-6 py-4 w-full items-center bg-surface-primary">
        {content}
      </main>
    </div>
  );
}
