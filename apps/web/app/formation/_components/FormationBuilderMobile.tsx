"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import QuarterSelectorTabs from "@/components/formation/quarter/QuarterSelectorTabs";
import FormationBoardSingle from "@/components/formation/board/FormationBoardSingle";
import FormationPlayerListMobile from "@/components/formation/player-list/FormationPlayerListMobile";
import FormationRosterViewModeTabs from "@/components/formation/player-list/FormationRosterViewModeTabs";
import { FormationMobileDraftTeamColumns } from "./FormationMobileDraftTeamColumns";
import type { InHouseDraftTeamByPlayerKey } from "@/types/inHouseDraftTeam";
import useModal from "@/hooks/useModal";
import { sortPlayersForFormationLineupList } from "@/lib/formation/roster/sortPlayersForFormationLineupList";
import { useFormationMatchPlayers } from "@/app/formation/_context/FormationMatchPlayersContext";
import { QuarterData, Player } from "@/types/formation";
import type { FormationRosterViewMode } from "@/types/formationRosterViewMode";
import type { InHouseDraftTeamChoice } from "@/hooks/formation/useInHouseDraftTeamAssignments";
import {
  getFormationRosterPlayerKey,
  isSameFormationRosterPlayer,
} from "@/lib/formation/roster/formationRosterPlayerKey";
import { validateInHouseListToBoardDnD } from "@/lib/formation/roster/validateInHouseListToBoardDnD";
import { getAssignedQuarterIdsForPlayerFromQuarters } from "@/lib/formation/roster/getAssignedQuarterIdsForPlayerFromQuarters";
import { toast } from "@/lib/toast";
import { useFormationChangeFlow } from "@/hooks/formation/useFormationChangeFlow";
import { useFormationListToBoardDnd } from "@/hooks/formation/useFormationListToBoardDnd";
import type { FormationChangeScope } from "@/lib/formation/formationChangePolicy";
import { FormationMatchInfoAccordion } from "./FormationMatchInfoAccordion";
import { FormationDragOverlayAvatar } from "./FormationDragOverlayAvatar";
import { shareFormation } from "@/lib/kakao-share";

export interface FormationBuilderMobileProps {
  /** SSR에서 구성된 경기 일정 카드 — 모바일에서는 경기 정보 아코디언 안에 표시 */
  scheduleCard: React.ReactNode;
  quarters: QuarterData[];
  setQuarters: React.Dispatch<React.SetStateAction<QuarterData[]>>;
  currentQuarterId: number | null;
  setCurrentQuarterId: (id: number | null) => void;
  /** 데스크톱 라벨용 — 모바일 레이아웃에서는 미사용 */
  quarterDurationMinutes?: number;
  matchType?: "MATCH" | "INTERNAL";
  formationRosterViewMode: FormationRosterViewMode;
  onFormationRosterViewModeChange: (mode: FormationRosterViewMode) => void;
  draftSubTeamLineups?: {
    A: Player[];
    B: Player[];
  };
  getDraftTeam?: (player: Player) => InHouseDraftTeamChoice;
  setDraftTeam?: (player: Player, team: InHouseDraftTeamChoice) => void;
  selectedPlayer: Player | null;
  setSelectedPlayer: (player: Player | null) => void;
  onPositionRemove: (quarterId: number, index: number) => void;
  assignPlayer: (
    quarterId: number,
    positionIndex: number,
    player: Player,
  ) => void;
}

/**
 * 모바일 전용 레이아웃: QuarterSelectorTabs + 단일 보드 + 선수 명단.
 * 데스크톱 전용 컴포넌트를 import하지 않음 (이관 시 분리 용이).
 */
export default function FormationBuilderMobile({
  scheduleCard,
  quarters,
  setQuarters,
  currentQuarterId,
  setCurrentQuarterId,
  matchType = "MATCH",
  formationRosterViewMode,
  onFormationRosterViewModeChange,
  draftSubTeamLineups,
  getDraftTeam,
  setDraftTeam,
  selectedPlayer,
  setSelectedPlayer,
  onPositionRemove,
  assignPlayer,
}: FormationBuilderMobileProps) {
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

  const isInternalDraftUi =
    matchType === "INTERNAL" && formationRosterViewMode === "draft";

  const { openModal: openTeamDraftModal } = useModal("FORMATION_MOBILE_TEAM_DRAFT");

  const sortedRosterAllForDraftModal = useMemo(
    () => sortPlayersForFormationLineupList(rosterPlayers),
    [rosterPlayers],
  );

  const handleApplyDraftModal = useCallback(
    (next: InHouseDraftTeamByPlayerKey) => {
      if (!setDraftTeam) return;
      for (const p of rosterPlayers) {
        const key = getFormationRosterPlayerKey(p);
        const v = next[key];
        setDraftTeam(p, v === "A" || v === "B" ? v : null);
      }
    },
    [rosterPlayers, setDraftTeam],
  );

  const openDraftModal = useCallback(() => {
    const m: InHouseDraftTeamByPlayerKey = {};
    if (getDraftTeam) {
      for (const p of rosterPlayers) {
        const t = getDraftTeam(p);
        if (t === "A" || t === "B") {
          m[getFormationRosterPlayerKey(p)] = t;
        }
      }
    }
    openTeamDraftModal({
      players: sortedRosterAllForDraftModal,
      initialDraftByKey: m,
      onApply: handleApplyDraftModal,
    });
  }, [
    getDraftTeam,
    rosterPlayers,
    sortedRosterAllForDraftModal,
    openTeamDraftModal,
    handleApplyDraftModal,
  ]);

  const {
    dndId,
    sensors,
    collisionDetection,
    activePlayer,
    handleDragStart,
    handleDragEnd,
  } = useFormationListToBoardDnd({
    matchType,
    formationRosterViewMode,
    getDraftTeam,
    assignPlayer,
    setCurrentQuarterId,
    hitRadiusPx: 40,
    enableTouchSensor: true,
  });

  /** 선수 선택 후 빈 포지션 탭 시 해당 슬롯에 배치. 중복은 useFormationManager.assignPlayer에서 처리. */
  const handlePlaceSelectedPlayer = (quarterId: number, index: number) => {
    if (formationRosterViewMode === "draft") return;
    if (selectedPlayer) {
      const check = validateInHouseListToBoardDnD(
        matchType,
        formationRosterViewMode,
        "Player",
        selectedPlayer,
        getDraftTeam,
      );
      if (!check.allowed) {
        toast.error(check.message);
        return;
      }
      assignPlayer(quarterId, index, selectedPlayer);
      setSelectedPlayer(null);
    }
  };

  const getAssignedQuarterIdsForPlayer = useMemo(
    () => getAssignedQuarterIdsForPlayerFromQuarters(quarters),
    [quarters],
  );

  const boardRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const captureBoard = async (): Promise<Blob | null> => {
    if (!boardRef.current) return null;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(boardRef.current, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#1a1a1a",
        scale: 2,
      });
      return new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));
    } catch {
      return null;
    }
  };

  const handleQuarterShare = async () => {
    setIsCapturing(true);
    const blob = await captureBoard();
    const current = quarters.find((q) => q.id === currentQuarterId) ?? quarters[0];
    const label = current ? `${current.id}Q 포메이션` : "포메이션";
    await shareFormation({ matchTitle: label, matchUrl: window.location.href, imageBlob: blob });
    setIsCapturing(false);
  };

  return (
    <DndContext
      id={dndId}
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-1 flex flex-col lg:flex-row gap-6 w-full max-w-screen-xl  lg:items-stretch 2xl:max-w-none">
        <div className="w-full lg:flex-1 2xl:w-225 2xl:flex-none flex flex-col gap-4 shrink-0 transition-all duration-300">
          <section aria-label="쿼터 선택" className="flex flex-col gap-6">
            <FormationMatchInfoAccordion scheduleCard={scheduleCard} />
            {matchType === "INTERNAL" &&
              onFormationRosterViewModeChange != null && (
                <FormationRosterViewModeTabs
                  value={formationRosterViewMode}
                  onChange={onFormationRosterViewModeChange}
                />
              )}
            {!isInternalDraftUi ? (
              <>
                <QuarterSelectorTabs
                  quarters={quarters}
                  currentQuarterId={currentQuarterId}
                  setCurrentQuarterId={setCurrentQuarterId}
                />
                <div className="flex items-center gap-2 px-1">
                  <button
                    type="button"
                    onClick={handleQuarterShare}
                    disabled={isCapturing}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#FEE500]/10 border border-[#FEE500]/30 text-[#FEE500] text-xs font-semibold disabled:opacity-50"
                  >
                    {isCapturing ? (
                      <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" strokeOpacity="0.3"/>
                        <path d="M12 2a10 10 0 0 1 10 10"/>
                      </svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 3C6.477 3 2 6.82 2 11.5c0 2.93 1.77 5.5 4.47 7.1L5.5 21.5l3.44-2.03C10.1 19.82 11.04 20 12 20c5.523 0 10-3.82 10-8.5S17.523 3 12 3z"/>
                      </svg>
                    )}
                    쿼터별 공유하기
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      shareFormation({ matchTitle: "포메이션 전체 공유", matchUrl: window.location.href });
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#FEE500]/10 border border-[#FEE500]/30 text-[#FEE500] text-xs font-semibold"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 3C6.477 3 2 6.82 2 11.5c0 2.93 1.77 5.5 4.47 7.1L5.5 21.5l3.44-2.03C10.1 19.82 11.04 20 12 20c5.523 0 10-3.82 10-8.5S17.523 3 12 3z"/>
                    </svg>
                    전체 공유하기
                  </button>
                </div>
                <div ref={boardRef}>
                  <FormationBoardSingle
                    quarters={quarters}
                    inHouseBoardSubTeam={inHouseBoardSubTeam}
                    onFormationChangeIntent={
                      formationChangeScope != null
                        ? onFormationChangeIntent
                        : undefined
                    }
                    currentQuarterId={currentQuarterId}
                    selectedPlayer={selectedPlayer}
                    setQuarters={setQuarters}
                    onPositionRemove={onPositionRemove}
                    onPlaceSelectedPlayer={handlePlaceSelectedPlayer}
                  />
                </div>
              </>
            ) : draftSubTeamLineups != null ? (
              <>
                <FormationMobileDraftTeamColumns
                  lineupA={draftSubTeamLineups.A}
                  lineupB={draftSubTeamLineups.B}
                  onColumnPress={() => {
                    openDraftModal();
                  }}
                  className="min-h-36"
                />
              </>
            ) : null}
          </section>
        </div>

        <FormationPlayerListMobile
          players={rosterPlayers}
          selectedPlayer={selectedPlayer}
          onSelectPlayer={(player) =>
            setSelectedPlayer(
              selectedPlayer != null &&
                isSameFormationRosterPlayer(selectedPlayer, player)
                ? null
                : player,
            )
          }
          targetPosition={null}
          activePosition={null}
          getAssignedQuarterIdsForPlayer={getAssignedQuarterIdsForPlayer}
          matchType={matchType}
          {...(matchType === "INTERNAL"
            ? {
                formationRosterViewMode,
                getDraftTeam,
              }
            : {})}
        />

        <DragOverlay dropAnimation={null} modifiers={[snapCenterToCursor]}>
          {activePlayer ? (
            <FormationDragOverlayAvatar player={activePlayer} />
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
