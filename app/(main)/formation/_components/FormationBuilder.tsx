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

// Hooks
import { useFormationManager } from "@/hooks/formation/useFormationManager";

// Components
import FormationControls from "@/components/formation/FormationControls";
import FormationPlayerList from "@/components/formation/FormationPlayerList";
import FormationBoardList from "@/components/formation/FormationBoardList";
import ProfileAvatar from "@/components/ui/ProfileAvatar";
import { Player } from "@/types/formation";

interface FormationBuilderProps {
  scheduleCard: React.ReactNode;
  initialPlayers: Player[];
}

export default function FormationBuilder({
  scheduleCard,
  initialPlayers,
}: FormationBuilderProps) {
  const dndId = useId();

  // Custom Collision Detection: Calculate distance from pointer to droppable center
  const customCollisionDetection: CollisionDetection = (args) => {
    const { pointerCoordinates, droppableContainers, droppableRects } = args;

    if (!pointerCoordinates) {
      return rectIntersection(args);
    }

    const collisions = [];

    for (const container of droppableContainers) {
      const rect = droppableRects.get(container.id);
      if (rect) {
        // 드랍존의 중앙 좌표 계산
        const center = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };

        // 포인터와 드랍존 중앙 사이의 거리 계산 (유클리드 거리)
        const dx = pointerCoordinates.x - center.x;
        const dy = pointerCoordinates.y - center.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 버튼(드랍퍼블 사이즈)의 대략적인 반지름보다 작을 때 충돌로 판정 (예: 25px)
        if (distance < 30) {
          collisions.push({
            id: container.id,
            data: { droppableContainer: container, value: distance },
          });
        }
      }
    }

    // 거리가 가까운 순(오름차순이므로 가장 거리가 짧은 값이 제일 먼저 옴)으로 정렬
    // dnd-kit 내부 sort 함수는 value 값을 기반으로 결정합니다.
    return collisions.sort((a, b) => a.data?.value - b.data?.value);
  };

  // 1. Data Hooks
  const { quarters, setQuarters, addQuarter, assignPlayer, removePlayer } =
    useFormationManager();
  const [currentQuarterId, setCurrentQuarterId] = useState<number | null>(null);
  const [selectedListPlayer, setSelectedListPlayer] = useState<Player | null>(
    null,
  );

  // Active player tracking for DragOverlay
  const [activePlayer, setActivePlayer] = useState<Player | null>(null);

  // Sensor configuration to differentiate clicks from drags
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  // 2. Drag & Drop Event Handler
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const player = active.data.current?.player as Player;
    if (player) {
      setActivePlayer(player);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActivePlayer(null); // Reset active player
    const { active, over } = event;

    // Didn't drop on a valid slot
    if (!over) return;

    const player = active.data.current?.player as Player;
    const quarterId = over.data.current?.quarterId as number;
    const positionIndex = over.data.current?.positionIndex as number;

    if (player && quarterId && positionIndex !== undefined) {
      assignPlayer(quarterId, positionIndex, player);
      // 선수 드롭 완료 시, 해당 쿼터 보드로 포커스 자동 전환
      setCurrentQuarterId(quarterId);
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
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 w-full max-w-screen-xl justify-center lg:items-stretch 2xl:max-w-none">
        {/* Left Section (Controls + Formation Board) */}
        <div className="w-full lg:flex-1 2xl:w-225 2xl:flex-none flex flex-col gap-4 shrink-0 transition-all duration-300">
          {scheduleCard}

          {/* 1. 컨트롤 (Controls) */}
          <FormationControls
            currentQuarterId={currentQuarterId}
            setCurrentQuarterId={setCurrentQuarterId}
            quarters={quarters}
            addQuarter={addQuarter}
          />

          {/* 2. 포메이션 보드 그리드 (Formation Boards) */}
          <FormationBoardList
            quarters={quarters}
            selectedPlayer={selectedListPlayer} // Passed down to highlight across boards
            setQuarters={setQuarters}
            onPositionRemove={removePlayer}
            currentQuarterId={currentQuarterId}
            setCurrentQuarterId={setCurrentQuarterId}
          />
        </div>

        {/* Right Section (Sidebar / Player List) */}
        <FormationPlayerList
          players={initialPlayers}
          currentQuarterLineups={quarters.map((q) => q.lineup || {})}
          selectedPlayer={selectedListPlayer}
          onSelectPlayer={setSelectedListPlayer}
          onAddPlayer={() => {}}
          onRemovePlayer={() => {}}
          activePosition={null}
        />
      </div>

      {/* --- Drag Overlay for smooth DND --- */}
      <DragOverlay dropAnimation={null} modifiers={[snapCenterToCursor]}>
        {activePlayer ? (
          <div className="rounded-full flex w-12 h-12 items-center justify-center bg-black/30 border-2 border-[#B8FF12]/30 overflow-hidden cursor-grabbing">
            <ProfileAvatar
              src={activePlayer.image || "/images/player/img_player.png"}
              alt={activePlayer.name}
              size={48}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
