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
} from "@dnd-kit/core";

// Hooks
import { useFormationManager } from "@/hooks/formation/useFormationManager";

// Components
import FormationControls from "@/components/formation/FormationControls";
import FormationPlayerList from "@/components/formation/FormationPlayerList";
import MatchScheduleCard from "@/components/formation/MatchScheduleCard";
import FormationBoardList from "@/components/formation/FormationBoardList";
import ProfileAvatar from "@/components/ui/ProfileAvatar";
import { Player } from "@/types/formation";

// Mock Data
import { MOCK_PLAYERS } from "@/constants/mock-players";

export default function FormationPage() {
  const dndId = useId();

  // 1. Data Hooks - Using the new robust DND manager
  const { quarters, setQuarters, addQuarter, assignPlayer, removePlayer } =
    useFormationManager();
  const [currentQuarterId, setCurrentQuarterId] = useState<number>(1);
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
    }
  };

  return (
    <main className="flex-1 bg-surface-primary flex flex-col px-3 md:px-6 py-4 w-full items-center">
      <DndContext
        id={dndId}
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row gap-4 w-full max-w-screen-xl justify-center lg:items-stretch 2xl:max-w-none">
          {/* Left Section (Controls + Formation Board) */}
          <div className="w-full lg:flex-1 2xl:w-225 2xl:flex-none flex flex-col gap-4 shrink-0 transition-all duration-300">
            <MatchScheduleCard
              // 목 데이터 - 실제 앱에서는 props로 전달
              matchDate="2026-02-03(목)"
              matchTime="18:00~20:00"
              stadium="수원 월드컵 보조 구장 A"
              opponent="FC 빠름셀로나"
              opponentRecord="전적 2승 1무 1패"
              homeUniform="빨강"
            />

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
            />
          </div>

          {/* Right Section (Sidebar / Player List) */}
          <FormationPlayerList
            players={MOCK_PLAYERS}
            currentQuarterLineups={quarters.map((q) => q.lineup || {})}
            selectedPlayer={selectedListPlayer}
            onSelectPlayer={setSelectedListPlayer}
            isLineupFull={false}
            onAddPlayer={() => {}}
            onRemovePlayer={() => {}}
            activePosition={null}
          />
        </div>

        {/* --- Drag Overlay for smooth DND --- */}
        <DragOverlay dropAnimation={null}>
          {activePlayer ? (
            <div className="flex items-center gap-x-3 w-[280px] px-3 py-2 bg-surface-card border border-Fill-AccentPrimary shadow-xl rounded-xl opacity-95">
              <ProfileAvatar
                src={activePlayer.image || "/images/player/img_player.png"}
                alt={activePlayer.name}
                size={48}
              />
              <div className="flex flex-col flex-1 overflow-hidden">
                <span className="text-sm font-semibold text-Label-Strong truncate">
                  {activePlayer.name}
                </span>
                <span className="text-xs text-Label-Assistive truncate">
                  {activePlayer.position}
                </span>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </main>
  );
}
