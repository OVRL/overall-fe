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

import ProfileAvatar from "@/components/ui/ProfileAvatar";
import Button from "@/components/ui/Button";
import FormationBoardList from "@/components/formation/board/FormationBoardList";
import FormationPlayerList from "@/components/formation/player-list/FormationPlayerList";
import { QuarterData, Player } from "@/types/formation";
import { MOCK_PLAYERS } from "@/constants/mock-players";

export default function BestElevenPanel() {
  const [quarters, setQuarters] = useState<QuarterData[]>([
    {
      id: 1,
      type: "MATCHING" as const,
      formation: "4-2-3-1",
      matchup: { home: "A", away: "B" },
      lineup: {},
    },
  ]);
  const [currentQuarterId, setCurrentQuarterId] = useState<number | null>(1);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

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
    return collisions.sort((a, b) => (a.data?.value || 0) - (b.data?.value || 0));
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const player = event.active.data.current?.player as Player;
    if (player) setActivePlayer(player);
  };

  const assignPlayer = (quarterId: number, positionIndex: number, player: Player) => {
    setQuarters((prev) =>
      prev.map((q) => {
        if (q.id === quarterId) {
          const newLineup = { ...q.lineup };
          
          Object.keys(newLineup).forEach((key) => {
            if (newLineup[Number(key)]?.id === player.id) {
              delete newLineup[Number(key)];
            }
          });
          
          newLineup[positionIndex] = player;
          return { ...q, lineup: newLineup };
        }
        return q;
      })
    );
  };

  const onPositionRemove = (quarterId: number, positionIndex: number) => {
    setQuarters((prev) =>
      prev.map((q) => {
        if (q.id === quarterId) {
          const newLineup = { ...q.lineup };
          delete newLineup[positionIndex];
          return { ...q, lineup: newLineup };
        }
        return q;
      })
    );
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

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-5 shrink-0 px-2 lg:px-6">
        <h3 className="text-xl font-bold text-white">베스트 11 관리</h3>
        <Button variant="primary" className="text-xs px-3 py-1.5 font-bold bg-[#B8FF12] text-black">
          저장하기
        </Button>
      </div>

      <DndContext
        id={dndId}
        sensors={sensors}
        collisionDetection={customCollisionDetection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 flex flex-col lg:flex-row gap-4 w-full max-w-screen-xl mx-auto lg:items-stretch lg:px-6 pb-20 overflow-visible">
          <div className="w-full lg:flex-1 shrink-0 flex flex-col gap-4">
            <FormationBoardList
              quarters={quarters}
              selectedPlayer={selectedPlayer}
              setQuarters={setQuarters}
              onPositionRemove={onPositionRemove}
              currentQuarterId={currentQuarterId}
              setCurrentQuarterId={setCurrentQuarterId}
            />
          </div>

          <FormationPlayerList
            players={MOCK_PLAYERS}
            currentQuarterLineups={quarters.map((q) => q.lineup || {})}
            selectedPlayer={selectedPlayer}
            onSelectPlayer={setSelectedPlayer}
            onAddPlayer={() => {}}
            onRemovePlayer={() => {}}
            activePosition={null}
          />
        </div>

        <DragOverlay dropAnimation={null} modifiers={[snapCenterToCursor]}>
          {activePlayer ? (
            <div className="rounded-full flex w-12 h-12 items-center justify-center bg-black/30 border-2 border-[#B8FF12]/30 overflow-hidden cursor-grabbing">
              <ProfileAvatar
                src={activePlayer.image || "/images/player/img_player_2.webp"}
                alt={activePlayer.name}
                size={48}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
