"use client";

import React, { useState, useMemo, useId } from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
  rectIntersection,
  CollisionDetection,
} from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import ProfileAvatar from "@/components/ui/ProfileAvatar";
import { getFormationPlayerProfileAvatarUrls } from "@/lib/formation/formationPlayerProfileAvatarUrls";
import QuarterSelectorTabs from "@/components/formation/quarter/QuarterSelectorTabs";
import FormationBoardSingle from "@/components/formation/board/FormationBoardSingle";
import FormationPlayerListMobile from "@/components/formation/player-list/FormationPlayerListMobile";
import { useFormationMatchPlayers } from "@/app/formation/_context/FormationMatchPlayersContext";
import { QuarterData, Player } from "@/types/formation";
import fire from "@/public/icons/fire.svg";
import Icon from "@/components/ui/Icon";

export interface FormationBuilderMobileProps {
  quarters: QuarterData[];
  setQuarters: React.Dispatch<React.SetStateAction<QuarterData[]>>;
  currentQuarterId: number | null;
  setCurrentQuarterId: (id: number | null) => void;
  /** 데스크톱 라벨용 — 모바일 레이아웃에서는 미사용 */
  quarterDurationMinutes?: number;
  selectedPlayer: Player | null;
  setSelectedPlayer: (player: Player | null) => void;
  onPositionRemove: (quarterId: number, index: number) => void;
  assignPlayer: (
    quarterId: number,
    positionIndex: number,
    player: Player,
  ) => void;
}

function MobileDragOverlayAvatar({ player }: { player: Player }) {
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

/**
 * 모바일 전용 레이아웃: QuarterSelectorTabs + 단일 보드 + 선수 명단.
 * 데스크톱 전용 컴포넌트를 import하지 않음 (이관 시 분리 용이).
 */
export default function FormationBuilderMobile({
  quarters,
  setQuarters,
  currentQuarterId,
  setCurrentQuarterId,
  selectedPlayer,
  setSelectedPlayer,
  onPositionRemove,
  assignPlayer,
}: FormationBuilderMobileProps) {
  const rosterPlayers = useFormationMatchPlayers();

  /** 선수 선택 후 빈 포지션 탭 시 해당 슬롯에 배치. 중복은 useFormationManager.assignPlayer에서 처리. */
  const handlePlaceSelectedPlayer = (quarterId: number, index: number) => {
    if (selectedPlayer) {
      assignPlayer(quarterId, index, selectedPlayer);
      setSelectedPlayer(null);
    }
  };

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
        if (distance < 40) {
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
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const player = event.active.data.current?.player as Player;
    if (player) setActivePlayer(player);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActivePlayer(null);
    const { over } = event;
    if (!over) return;

    const player = event.active.data.current?.player as Player;
    const quarterId = over.data.current?.quarterId as number;
    const positionIndex = over.data.current?.positionIndex as number;

    if (player && quarterId != null && positionIndex !== undefined) {
      assignPlayer(quarterId, positionIndex, player);
      setCurrentQuarterId(quarterId);
    }
  };

  /** 선수별 배치된 쿼터 id 목록 (명단에서 QuarterDotsMobile 표시용) */
  const getAssignedQuarterIdsForPlayer = useMemo(() => {
    return (playerId: number): number[] => {
      return quarters
        .filter((q) => {
          const lineup = q.lineup ?? {};
          return Object.values(lineup).some((p) => p?.id === playerId);
        })
        .map((q) => q.id)
        .sort((a, b) => a - b);
    };
  }, [quarters]);

  return (
    <DndContext
      id={dndId}
      sensors={sensors}
      collisionDetection={customCollisionDetection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex-1 flex flex-col lg:flex-row gap-6 w-full max-w-screen-xl  lg:items-stretch 2xl:max-w-none">
        <div className="w-full lg:flex-1 2xl:w-225 2xl:flex-none flex flex-col gap-4 shrink-0 transition-all duration-300">
          {/* 쿼터 탭만 노출 (매치 카드·스쿼드 추천 없음) */}
          <section aria-label="쿼터 선택" className="flex flex-col gap-6">
            <div className="flex items-center gap-2.5">
              <Icon src={fire} nofill width={24} height={24} />
              <h2 className="font-semibold text-[#f7f8f8] leading-6">
                경기 정보
              </h2>
            </div>
            <QuarterSelectorTabs
              quarters={quarters}
              currentQuarterId={currentQuarterId}
              setCurrentQuarterId={setCurrentQuarterId}
            />
          </section>

          {/* 선택된 쿼터 보드 1개만 렌더 */}
          <FormationBoardSingle
            quarters={quarters}
            currentQuarterId={currentQuarterId}
            selectedPlayer={selectedPlayer}
            setQuarters={setQuarters}
            onPositionRemove={onPositionRemove}
            onPlaceSelectedPlayer={handlePlaceSelectedPlayer}
          />
        </div>

        <FormationPlayerListMobile
          players={rosterPlayers}
          selectedPlayer={selectedPlayer}
          onSelectPlayer={(player) =>
            setSelectedPlayer(selectedPlayer?.id === player.id ? null : player)
          }
          targetPosition={null}
          activePosition={null}
          getAssignedQuarterIdsForPlayer={getAssignedQuarterIdsForPlayer}
        />

        <DragOverlay dropAnimation={null} modifiers={[snapCenterToCursor]}>
          {activePlayer ? (
            <MobileDragOverlayAvatar player={activePlayer} />
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
