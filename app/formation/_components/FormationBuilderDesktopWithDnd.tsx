"use client";

import React from "react";
import {
  DndContext,
  DragOverlay,
} from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";

import FormationBuilderDesktop from "./FormationBuilderDesktop";
import { QuarterData, Player } from "@/types/formation";
import type { FormationRosterViewMode } from "@/types/formationRosterViewMode";
import type { InHouseDraftTeamChoice } from "@/hooks/formation/useInHouseDraftTeamAssignments";
import { useFormationListToBoardDnd } from "@/hooks/formation/useFormationListToBoardDnd";
import { FormationDragOverlayAvatar } from "./FormationDragOverlayAvatar";

export interface FormationBuilderDesktopWithDndProps {
  scheduleCard: React.ReactNode;
  quarters: QuarterData[];
  setQuarters: React.Dispatch<React.SetStateAction<QuarterData[]>>;
  currentQuarterId: number | null;
  setCurrentQuarterId: (id: number | null) => void;
  matchType?: "MATCH" | "INTERNAL";
  quarterDurationMinutes?: number;
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
 * 데스크톱 전용: DnD 컨텍스트 + DragOverlay로 감싼 FormationBuilderDesktop.
 * 모바일에서는 이 컴포넌트를 로드하지 않아 @dnd-kit 번들이 내려가지 않음.
 */
export default function FormationBuilderDesktopWithDnd(
  props: FormationBuilderDesktopWithDndProps,
) {
  const {
    dndId,
    sensors,
    collisionDetection,
    activePlayer,
    handleDragStart,
    handleDragEnd,
  } = useFormationListToBoardDnd({
    matchType: props.matchType ?? "MATCH",
    formationRosterViewMode: props.formationRosterViewMode,
    getDraftTeam: props.getDraftTeam,
    assignPlayer: props.assignPlayer,
    setCurrentQuarterId: props.setCurrentQuarterId,
    hitRadiusPx: 30,
    enableTouchSensor: false,
  });

  return (
    <DndContext
      id={dndId}
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <FormationBuilderDesktop
        scheduleCard={props.scheduleCard}
        quarters={props.quarters}
        setQuarters={props.setQuarters}
        currentQuarterId={props.currentQuarterId}
        setCurrentQuarterId={props.setCurrentQuarterId}
        matchType={props.matchType}
        quarterDurationMinutes={props.quarterDurationMinutes}
        formationRosterViewMode={props.formationRosterViewMode}
        onFormationRosterViewModeChange={props.onFormationRosterViewModeChange}
        draftSubTeamLineups={props.draftSubTeamLineups}
        getDraftTeam={props.getDraftTeam}
        setDraftTeam={props.setDraftTeam}
        selectedPlayer={props.selectedPlayer}
        setSelectedPlayer={props.setSelectedPlayer}
        onPositionRemove={props.onPositionRemove}
        assignPlayer={props.assignPlayer}
      />

      <DragOverlay dropAnimation={null} modifiers={[snapCenterToCursor]}>
        {activePlayer ? (
          <FormationDragOverlayAvatar player={activePlayer} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
