"use client";

import React, { useState, useId } from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  rectIntersection,
  CollisionDetection,
} from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";

import FormationBuilderDesktop from "./FormationBuilderDesktop";
import ProfileAvatar from "@/components/ui/ProfileAvatar";
import { getFormationPlayerProfileAvatarUrls } from "@/lib/formation/formationPlayerProfileAvatarUrls";
import { QuarterData, Player } from "@/types/formation";
import type { FormationRosterViewMode } from "@/types/formationRosterViewMode";
import type { InHouseDraftTeamChoice } from "@/hooks/formation/useInHouseDraftTeamAssignments";
import { validateInHouseListToBoardDnD } from "@/lib/formation/roster/validateInHouseListToBoardDnD";
import { toast } from "@/lib/toast";

/** 드래그 오버레이: 명단 행과 동일 `getFormationPlayerProfileAvatarUrls` */
function DragOverlayPlayerAvatar({ player }: { player: Player }) {
  const { src, fallbackSrc } = getFormationPlayerProfileAvatarUrls(player);

  return (
    <div className="rounded-full flex w-12 h-12 items-center justify-center bg-black/30 border-2 border-[#B8FF12]/30 overflow-hidden cursor-grabbing">
      <ProfileAvatar
        src={src}
        fallbackSrc={fallbackSrc}
        alt={player.name}
        size={48}
      />
    </div>
  );
}

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
  const dndId = useId();
  const [activePlayer, setActivePlayer] = useState<Player | null>(null);

  const customCollisionDetection: CollisionDetection = (args) => {
    const { pointerCoordinates, droppableContainers, droppableRects } = args;
    if (!pointerCoordinates) return rectIntersection(args);

    const collisions = [];
    for (const container of droppableContainers) {
      const rect = droppableRects.get(container.id);
      if (rect) {
        const center = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
        const dx = pointerCoordinates.x - center.x;
        const dy = pointerCoordinates.y - center.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 30) {
          collisions.push({
            id: container.id,
            data: { droppableContainer: container, value: distance },
          });
        }
      }
    }
    return collisions.sort((a, b) => a.data?.value - b.data?.value);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const player = event.active.data.current?.player as Player;
    if (player) setActivePlayer(player);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActivePlayer(null);
    const { over } = event;
    if (!over) return;
    if (props.formationRosterViewMode === "draft") return;

    const player = event.active.data.current?.player as Player;
    if (!player) return;

    const dragSourceType = event.active.data.current?.type as string | undefined;
    const check = validateInHouseListToBoardDnD(
      props.matchType,
      props.formationRosterViewMode,
      dragSourceType,
      player,
      props.getDraftTeam,
    );
    if (!check.allowed) {
      toast.error(check.message);
      return;
    }

    const quarterId = over.data.current?.quarterId as number;
    const positionIndex = over.data.current?.positionIndex as number;

    if (quarterId != null && positionIndex !== undefined) {
      props.assignPlayer(quarterId, positionIndex, player);
      props.setCurrentQuarterId(quarterId);
    }
  };

  return (
    <DndContext
      id={dndId}
      sensors={sensors}
      collisionDetection={customCollisionDetection}
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
          <DragOverlayPlayerAvatar player={activePlayer} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
