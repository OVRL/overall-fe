"use client";

import React, { useMemo } from "react";
import FormationControls from "@/components/formation/FormationControls";
import FormationBoardList from "@/components/formation/board/FormationBoardList";
import FormationPlayerList from "@/components/formation/player-list/FormationPlayerList";
import FormationDraftLineupOverview from "@/components/formation/draft/FormationDraftLineupOverview";
import { useFormationMatchPlayers } from "@/app/formation/_context/FormationMatchPlayersContext";
import { QuarterData, Player } from "@/types/formation";
import type { FormationRosterViewMode } from "@/types/formationRosterViewMode";
import type { InHouseDraftTeamChoice } from "@/hooks/formation/useInHouseDraftTeamAssignments";
import { useFormationChangeFlow } from "@/hooks/formation/useFormationChangeFlow";
import type { FormationChangeScope } from "@/lib/formation/formationChangePolicy";

export interface FormationBuilderDesktopProps {
  scheduleCard: React.ReactNode;
  quarters: QuarterData[];
  setQuarters: React.Dispatch<React.SetStateAction<QuarterData[]>>;
  currentQuarterId: number | null;
  setCurrentQuarterId: (id: number | null) => void;
  matchType?: "MATCH" | "INTERNAL";
  quarterDurationMinutes?: number;
  formationRosterViewMode: FormationRosterViewMode;
  onFormationRosterViewModeChange: (mode: FormationRosterViewMode) => void;
  /** 내전 — 팀 드래프트 좌측 요약·명단 A/B 배정 (FormationBuilder에서만 주입) */
  draftSubTeamLineups?: {
    A: Player[];
    B: Player[];
  };
  getDraftTeam?: (player: Player) => InHouseDraftTeamChoice;
  setDraftTeam?: (player: Player, team: InHouseDraftTeamChoice) => void;
  selectedPlayer: Player | null;
  setSelectedPlayer: (player: Player | null) => void;
  onPositionRemove: (quarterId: number, index: number) => void;
  assignPlayer?: (
    quarterId: number,
    positionIndex: number,
    player: Player,
  ) => void;
}

/**
 * 데스크톱 전용 레이아웃: 매치 카드 + FormationControls + FormationBoardList + FormationPlayerList.
 * 모바일 전용 컴포넌트를 import하지 않음.
 */
export default function FormationBuilderDesktop({
  scheduleCard,
  quarters,
  setQuarters,
  currentQuarterId,
  setCurrentQuarterId,
  matchType,
  quarterDurationMinutes = 25,
  formationRosterViewMode,
  onFormationRosterViewModeChange,
  draftSubTeamLineups,
  getDraftTeam,
  setDraftTeam,
  selectedPlayer,
  setSelectedPlayer,
  onPositionRemove,
}: FormationBuilderDesktopProps) {
  const rosterPlayers = useFormationMatchPlayers();

  const inHouseBoardSubTeam =
    matchType === "INTERNAL" &&
    (formationRosterViewMode === "A" || formationRosterViewMode === "B")
      ? formationRosterViewMode
      : undefined;

  const formationChangeScope: FormationChangeScope | null = useMemo(() => {
    if (matchType === "MATCH") return { kind: "MATCHING" };
    if (
      matchType === "INTERNAL" &&
      formationRosterViewMode !== "draft" &&
      (formationRosterViewMode === "A" || formationRosterViewMode === "B")
    ) {
      return { kind: "IN_HOUSE", team: formationRosterViewMode };
    }
    return null;
  }, [matchType, formationRosterViewMode]);

  const { onFormationChangeIntent } = useFormationChangeFlow(
    quarters,
    setQuarters,
    formationChangeScope,
  );

  const showDraftOverview =
    matchType === "INTERNAL" &&
    formationRosterViewMode === "draft" &&
    draftSubTeamLineups != null;

  return (
    <div className="flex-1 flex flex-col min-h-0 lg:flex-row gap-4 w-full max-w-screen-xl justify-center lg:items-stretch 2xl:max-w-none">
      <div className="w-full lg:flex-1 2xl:w-225 2xl:flex-none flex flex-col gap-4 min-h-0 shrink-0 transition-all duration-300">
        {scheduleCard}

        <FormationControls
          currentQuarterId={currentQuarterId}
          setCurrentQuarterId={setCurrentQuarterId}
          quarters={quarters}
          quarterDurationMinutes={quarterDurationMinutes}
        />

        {showDraftOverview ? (
          <FormationDraftLineupOverview
            lineupA={draftSubTeamLineups.A}
            lineupB={draftSubTeamLineups.B}
            className="min-h-48"
          />
        ) : (
          <FormationBoardList
            quarters={quarters}
            inHouseBoardSubTeam={inHouseBoardSubTeam}
            onFormationChangeIntent={
              formationChangeScope != null ? onFormationChangeIntent : undefined
            }
            selectedPlayer={selectedPlayer}
            setQuarters={setQuarters}
            onPositionRemove={onPositionRemove}
            currentQuarterId={currentQuarterId}
            setCurrentQuarterId={setCurrentQuarterId}
          />
        )}
      </div>

      <FormationPlayerList
        players={rosterPlayers}
        currentQuarterLineups={quarters.map((q) => q.lineup || {})}
        selectedPlayer={selectedPlayer}
        onSelectPlayer={setSelectedPlayer}
        activePosition={null}
        matchType={matchType}
        {...(matchType === "INTERNAL"
          ? {
              formationRosterViewMode,
              onFormationRosterViewModeChange,
              getDraftTeam,
              onDraftTeamSelect: (player: Player, team: InHouseDraftTeamChoice) =>
                setDraftTeam?.(player, team),
            }
          : {})}
      />
    </div>
  );
}
