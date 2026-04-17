"use client";

import React, { useMemo } from "react";
import { Player } from "@/types/formation";
import PlayerListFilter from "./PlayerListFilter";
import Button from "../../ui/Button";
import Icon from "../../ui/Icon";
import plus from "@/public/icons/plus.svg";
import FormationPlayerGroupList from "./FormationPlayerGroupList";
import FormationRosterViewModeTabs from "./FormationRosterViewModeTabs";
import useModal from "@/hooks/useModal";
import { useFormationPlayerList } from "@/hooks/formation/useFormationPlayerList";
import { useFormationMatchIdsOptional } from "@/app/formation/_context/FormationMatchContext";
import type { FormationRosterViewMode } from "@/types/formationRosterViewMode";
import type { InHouseDraftTeamChoice } from "@/hooks/formation/useInHouseDraftTeamAssignments";
import { filterPlayersForInHouseLineupTab } from "@/lib/formation/roster/filterPlayersForInHouseLineupTab";

export interface FormationPlayerListProps {
  players: Player[];
  currentQuarterLineups: Record<number, Player | null>[];
  selectedPlayer: Player | null;
  onSelectPlayer: (player: Player) => void;
  onRemovePlayer?: (id: number) => void;
  targetPosition?: string | null;
  activePosition?: {
    quarterId: number;
    index: number;
    role: string;
  } | null;
  /**
   * 포메이션 매치 컨텍스트가 없을 때(예: 인하우스 목업) '선수 추가'가 열 모달 대신
   * 이 콜백을 호출합니다.
   */
  onAddPlayer?: () => void;
  /** 내전(IN_HOUSE)일 때만 우측 명단 상단에 팀 드래프트 / A팀 / B팀 탭 표시 */
  matchType?: "MATCH" | "INTERNAL";
  formationRosterViewMode?: FormationRosterViewMode;
  onFormationRosterViewModeChange?: (mode: FormationRosterViewMode) => void;
  /** 내전 팀 드래프트 — 상위 `useInHouseDraftTeamAssignments`와 연결 */
  getDraftTeam?: (player: Player) => InHouseDraftTeamChoice;
  onDraftTeamSelect?: (player: Player, team: InHouseDraftTeamChoice) => void;
}

export default function FormationPlayerList({
  players,
  currentQuarterLineups,
  selectedPlayer,
  onSelectPlayer,
  onRemovePlayer,
  targetPosition,
  activePosition,
  onAddPlayer,
  matchType = "MATCH",
  formationRosterViewMode,
  onFormationRosterViewModeChange,
  getDraftTeam,
  onDraftTeamSelect,
}: FormationPlayerListProps) {
  const { openModal } = useModal("FORMATION_MATCH_ATTENDANCE_PLAYER");
  const matchCtx = useFormationMatchIdsOptional();

  const playersForList = useMemo(
    () =>
      filterPlayersForInHouseLineupTab(
        players,
        formationRosterViewMode,
        getDraftTeam,
      ),
    [players, formationRosterViewMode, getDraftTeam],
  );

  const {
    searchTerm,
    setSearchTerm,
    activePosTab,
    setActivePosTab,
    filteredPlayers,
  } = useFormationPlayerList({
    players: playersForList,
    targetPosition,
    activePosition,
  });

  return (
    <section
      aria-label="선수 목록"
      className="flex w-full min-h-0 shrink-0 flex-col transition-all duration-300 lg:min-h-0 lg:w-90 lg:self-stretch 2xl:w-90"
    >
      <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-xl border border-border-card bg-surface-card shadow-card lg:h-full lg:min-h-0">
        <aside className="flex min-h-0 w-full flex-1 flex-col gap-3 p-4 md:w-92 lg:w-full lg:min-h-0">
          <div className="shrink-0 flex flex-col gap-3">
            {matchType === "INTERNAL" &&
              formationRosterViewMode != null &&
              onFormationRosterViewModeChange != null && (
                <FormationRosterViewModeTabs
                  value={formationRosterViewMode}
                  onChange={onFormationRosterViewModeChange}
                />
              )}
            <PlayerListFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              activePosTab={activePosTab}
              onPosTabChange={setActivePosTab}
            />
            <Button
              variant="line"
              size="m"
              onClick={() => {
                if (onAddPlayer) {
                  onAddPlayer();
                  return;
                }
                if (!matchCtx) {
                  console.warn(
                    "FormationPlayerList: FormationMatchProvider가 없고 onAddPlayer도 없어 선수 추가를 할 수 없습니다.",
                  );
                  return;
                }
                openModal({
                  matchId: matchCtx.matchId,
                  teamId: matchCtx.teamId,
                });
              }}
              className="flex gap-1 text-Label-Primary font-semibold"
            >
              <Icon src={plus} alt="plus icon" aria-hidden={true} />
              선수 추가
            </Button>
          </div>

          <FormationPlayerGroupList
            filteredPlayers={filteredPlayers}
            currentQuarterLineups={currentQuarterLineups}
            selectedPlayer={selectedPlayer}
            onSelectPlayer={onSelectPlayer}
            onRemovePlayer={onRemovePlayer}
            disableRowDrag={
              matchType === "INTERNAL" && formationRosterViewMode === "draft"
            }
            listRowMode={
              matchType === "INTERNAL" && formationRosterViewMode === "draft"
                ? "draft"
                : "lineup"
            }
            getDraftTeam={getDraftTeam}
            onDraftTeamSelect={onDraftTeamSelect}
          />
        </aside>
      </div>
    </section>
  );
}
