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
import Image from "next/image";

import ProfileAvatar from "@/components/ui/ProfileAvatar";
import FormationBoardList from "@/components/formation/board/FormationBoardList";
import FormationPlayerList from "@/components/formation/player-list/FormationPlayerList";
import PositionChip from "@/components/PositionChip";
import { QuarterData, Player } from "@/types/formation";
import { MOCK_PLAYERS } from "@/constants/mock-players";
import { Position } from "@/types/position";
import { cn } from "@/lib/utils";

// 선수 스탯 목업 (실제로는 API에서 가져옴)
const MOCK_SELECTED_PLAYER_STATS = {
  ovr: 99,
  name: "다리알벤디",
  positions: ["CDM", "RB"],
  joinDate: "2023. 09. 03",
  age: "30세",
  matches: 25,
  goals: 16,
  assists: 4,
  contributions: 5,
  shots: 24,
  winRate: "56%",
};

// 라인업 목업 데이터
const MOCK_LINEUP_LIST = [
  { position: "LB", number: 4, name: "메시", ovr: 90, image: "/images/player/img_player_1.webp" },
  { position: "CB", number: 24, name: "수원알베스", ovr: 90, image: "/images/player/img_player_2.webp" },
  { position: "SW", number: 3, name: "메시", ovr: 90, image: "/images/player/img_player_3.webp" },
  { position: "CB", number: 46, name: "메시", ovr: 90, image: "/images/player/img_player_4.webp" },
  { position: "CB", number: 34, name: "메시", ovr: 90, image: "/images/player/img_player_1.webp" },
  { position: "CB", number: 6, name: "메시", ovr: 90, image: "/images/player/img_player_2.webp" },
  { position: "CB", number: 99, name: "메시", ovr: 90, image: "/images/player/img_player_3.webp" },
  { position: "CB", number: 99, name: "메시", ovr: 90, image: "/images/player/img_player_4.webp" },
  { position: "CB", number: 99, name: "메시", ovr: 90, image: "/images/player/img_player_1.webp" },
  { position: "CB", number: 99, name: "메시", ovr: 90, image: "/images/player/img_player_2.webp" },
  { position: "CB", number: 99, name: "메시", ovr: 90, image: "/images/player/img_player_3.webp" },
];

// 스탯 아이템 컴포넌트
const StatItem = ({ icon, label, value }: { icon: string; label: string; value: string | number }) => (
  <div className="flex flex-col items-center gap-0.5">
    <div className="flex items-center gap-0.5 text-xs text-gray-400">
      <span className="text-[10px]">{icon}</span>
      <span>{label}</span>
    </div>
    <span className="text-sm font-bold text-white">{value}</span>
  </div>
);

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
  const [hasChanges, setHasChanges] = useState(true);

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
    setHasChanges(true);
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
    setHasChanges(true);
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

  const handleReset = () => {
    setQuarters((prev) => prev.map((q) => ({ ...q, lineup: {} })));
    setHasChanges(false);
  };

  const stats = MOCK_SELECTED_PLAYER_STATS;

  return (
    <div className="flex flex-col h-full min-h-screen bg-black">
      {/* 헤더 */}
      <div className="px-4 md:px-8 pt-6 pb-4 shrink-0">
        <h2 className="text-xl font-bold text-white">베스트 11 관리</h2>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 px-4 md:px-6 pb-28 overflow-auto">
        <DndContext
          id={dndId}
          sensors={sensors}
          collisionDetection={customCollisionDetection}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {/* 좌측: 포메이션 보드 */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            {/* BEST XI 헤더 배너 */}
            <div className="rounded-2xl overflow-hidden border border-white/5 bg-[#111]">
              <div className="flex items-center justify-between px-5 py-3.5 bg-linear-to-r from-[#0a0a0a] to-[#1a1a1a]">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black text-white tracking-tight">BEST</span>
                  <span className="text-2xl font-black text-[#B8FF12] tracking-tight">XI</span>
                </div>
              </div>
              <div className="p-3">
                <FormationBoardList
                  quarters={quarters}
                  selectedPlayer={selectedPlayer}
                  setQuarters={setQuarters}
                  onPositionRemove={onPositionRemove}
                  currentQuarterId={currentQuarterId}
                  setCurrentQuarterId={setCurrentQuarterId}
                />
              </div>
            </div>
          </div>

          {/* 우측: 선수 상세 + 라인업 리스트 */}
          <div className="w-full lg:w-80 xl:w-92 flex flex-col gap-4 shrink-0">
            {/* 선수 카드 */}
            <div className="rounded-2xl bg-[#111] border border-white/5 overflow-hidden">
              <div className="relative p-5">
                {/* OVR + 이름 + 포지션 */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-5xl font-black text-white leading-none mb-1">{stats.ovr}</div>
                    <div className="text-lg font-bold text-white mb-2">{stats.name}</div>
                    <div className="flex gap-1.5 mb-3">
                      {stats.positions.map((pos) => (
                        <PositionChip key={pos} position={pos as Position} variant="outline" />
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 space-y-0.5">
                      <p>입단 {stats.joinDate}</p>
                      <p>나이(만) {stats.age}</p>
                    </div>
                  </div>
                  {/* 선수 이미지 (우측 상단) */}
                  <div className="w-24 h-28 rounded-xl overflow-hidden shrink-0 bg-linear-to-b from-[#2a2a2a] to-[#1a1a1a]">
                    <Image
                      src="/images/player/img_player_1.webp"
                      alt="선수 이미지"
                      width={96}
                      height={112}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>

                {/* 구분선 */}
                <div className="h-px bg-white/5 my-4" />

                {/* 스탯 그리드 */}
                <div className="grid grid-cols-3 gap-y-4 gap-x-2">
                  <StatItem icon="⚽" label="출장" value={stats.matches} />
                  <StatItem icon="🥅" label="골" value={stats.goals} />
                  <StatItem icon="🤝" label="도움" value={stats.assists} />
                  <StatItem icon="🎯" label="기여" value={stats.contributions} />
                  <StatItem icon="🚀" label="골시도" value={stats.shots} />
                  <StatItem icon="🏆" label="승률" value={stats.winRate} />
                </div>
              </div>

              {/* 구분선 */}
              <div className="h-px bg-white/5" />

              {/* 라인업 리스트 헤더 */}
              <div className="px-5 py-2.5 flex items-center justify-between">
                <div className="grid grid-cols-[40px_32px_32px_1fr_40px] gap-2 w-full text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                  <span>포지션</span>
                  <span>번호</span>
                  <span></span>
                  <span>선수명</span>
                  <span className="text-right">OVR</span>
                </div>
              </div>

              {/* 라인업 리스트 */}
              <div className="overflow-y-auto max-h-72 px-3 pb-3 space-y-0.5">
                {MOCK_LINEUP_LIST.map((item, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "grid grid-cols-[40px_32px_32px_1fr_40px] gap-2 items-center px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer",
                    )}
                  >
                    <PositionChip position={item.position as Position} variant="outline" />
                    <span className="text-xs font-bold text-gray-300 text-center">{item.number}</span>
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-[#2a2a2a] shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-xs font-medium text-white truncate">{item.name}</span>
                    <span className="text-xs font-bold text-[#B8FF12] text-right">{item.ovr}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 선수 목록 패널 */}
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

          {/* 드래그 오버레이 */}
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

      {/* 하단 저장 바 */}
      {hasChanges && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-t border-white/5 p-4 flex items-center justify-between px-6 md:px-12 gap-3">
          <p className="text-xs md:text-sm text-gray-400 font-medium">
            변경사항이 있습니다. 저장하지 않으면 사라집니다.
          </p>
          <div className="flex gap-3 shrink-0">
            <button
              onClick={handleReset}
              className="px-5 py-2.5 rounded-xl border border-white/10 text-white text-xs md:text-sm font-bold hover:bg-white/5 transition-colors"
            >
              초기화
            </button>
            <button className="px-5 py-2.5 rounded-xl bg-[#B8FF12] text-black text-xs md:text-sm font-bold hover:opacity-90 transition-opacity">
              저장하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
