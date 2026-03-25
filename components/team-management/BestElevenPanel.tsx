"use client";

import React, { useState, useId, useCallback } from "react";
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
  useDraggable,
} from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import Image from "next/image";

import ProfileAvatar from "@/components/ui/ProfileAvatar";
import FormationBoardList from "@/components/formation/board/FormationBoardList";
import PositionChip from "@/components/PositionChip";
import Dropdown from "@/components/ui/Dropdown";
import { QuarterData, Player } from "@/types/formation";
import { Position } from "@/types/position";
import { FORMATION_OPTIONS } from "@/constants/formations";
import { useIsMobile } from "@/hooks/useIsMobile";
import { cn } from "@/lib/utils";
import { Edit2, X, Check } from "lucide-react";
import useModal from "@/hooks/useModal";

/**
 * 선수 스탯 목업 (이미지 기준)
 */
const MOCK_SELECTED_PLAYER_STATS = {
  ovr: 99,
  name: "다리알벤랜디",
  positions: ["CDM", "RB"],
  joinDate: "2023. 09. 03",
  age: "30세",
  matches: 25,
  goals: 16,
  assists: 4,
  contributions: 5,
  cleanSheets: 24,
  winRate: "56%",
};

/**
 * 우측 선수 리스트 목업 (이미지 기준)
 */
const MOCK_LINEUP_LIST = [
  { id: 101, position: "LB", number: 4, name: "메시", ovr: 90, image: "/images/player/img_player_1.webp" },
  { id: 102, position: "CB", number: 24, name: "수원알베스", ovr: 90, image: "/images/player/img_player_2.webp" },
  { id: 103, position: "SW", number: 3, name: "메시", ovr: 90, image: "/images/player/img_player_3.webp" },
  { id: 104, position: "CB", number: 46, name: "메시", ovr: 90, image: "/images/player/img_player_4.webp" },
  { id: 105, position: "CB", number: 34, name: "메시", ovr: 90, image: "/images/player/img_player_1.webp" },
  { id: 106, position: "CB", number: 6, name: "메시", ovr: 90, image: "/images/player/img_player_2.webp" },
  { id: 107, position: "CB", number: 99, name: "메시", ovr: 90, image: "/images/player/img_player_3.webp" },
  { id: 108, position: "CB", number: 99, name: "메시", ovr: 90, image: "/images/player/img_player_4.webp" },
  { id: 109, position: "CB", number: 99, name: "메시", ovr: 90, image: "/images/player/img_player_1.webp" },
  { id: 110, position: "CB", number: 99, name: "메시", ovr: 90, image: "/images/player/img_player_2.webp" },
  { id: 111, position: "CB", number: 99, name: "메시", ovr: 90, image: "/images/player/img_player_3.webp" },
];

/**
 * 스탯 아이템 (상세 카드용)
 */
const StatCardItem = ({ icon, label, value }: { icon: string; label: string; value: string | number }) => (
  <div className="flex-1 min-w-[30%] bg-[#222]/30 rounded-xl p-2 md:p-3 border border-white/5">
    <div className="flex items-center gap-1.5 text-[9px] md:text-[10px] text-gray-400 font-bold mb-1">
      <span className="opacity-80">{icon}</span>
      <span className="uppercase">{label}</span>
    </div>
    <div className="text-sm md:text-base font-black text-white text-right">{value}</div>
  </div>
);

/**
 * 드래그 가능한 선수 리스트 로우 (이미지 기준 테이블 스타일)
 */
const DraggablePlayerRow = ({ item }: { item: any }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `row-${item.id}`,
    data: { type: "Player", player: { id: item.id, name: item.name, image: item.image, position: item.position, overall: item.ovr } },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "group grid grid-cols-[50px_60px_1fr_60px] items-center px-4 py-2 hover:bg-white/5 transition-all cursor-grab active:cursor-grabbing border-b border-white/5",
        isDragging && "opacity-30 bg-white/5"
      )}
    >
      <div className="flex justify-center">
        <div className="w-8 h-6 border border-white/20 rounded flex items-center justify-center text-[10px] font-black text-gray-400 group-hover:border-primary/50 transition-colors uppercase">
          {item.position}
        </div>
      </div>
      <span className="text-xs font-black text-gray-400 text-center">{item.number}</span>
      <div className="flex items-center gap-3 pl-2">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-900 border border-white/10">
          <Image src={item.image} alt={item.name} width={32} height={32} className="w-full h-full object-cover" />
        </div>
        <span className="text-xs font-bold text-white group-hover:text-primary transition-colors">{item.name}</span>
      </div>
      <span className="text-sm font-black text-primary text-right">{item.ovr}</span>
    </div>
  );
};

export default function BestElevenPanel() {
  const isMobile = useIsMobile(1023);
  const dndId = useId();
  const { openModal } = useModal("PLAYER_SEARCH");
  
  // 상태
  const [quarters, setQuarters] = useState<QuarterData[]>([
    { id: 1, type: "MATCHING", formation: "4-2-3-1", lineup: {}, matchup: { home: "A", away: "B" } },
  ]);
  const [currentQuarterId, setCurrentQuarterId] = useState<number | null>(1);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [activePlayer, setActivePlayer] = useState<Player | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [manager, setManager] = useState({ name: "정태우", image: "/images/player/img_player_1.webp" });

  // DnD 설정
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));
  
  const customCollisionDetection: CollisionDetection = (args) => {
    const { pointerCoordinates, droppableContainers, droppableRects } = args;
    if (!pointerCoordinates) return rectIntersection(args);
    const collisions = [];
    for (const container of droppableContainers) {
      const rect = droppableRects.get(container.id);
      if (rect) {
        const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        const dx = pointerCoordinates.x - center.x;
        const dy = pointerCoordinates.y - center.y;
        if (Math.sqrt(dx * dx + dy * dy) < 35) {
          collisions.push({ id: container.id, data: { droppableContainer: container, value: Math.sqrt(dx * dx + dy * dy) } });
        }
      }
    }
    return collisions.sort((a, b) => (a.data?.value || 0) - (b.data?.value || 0));
  };

  const assignPlayer = useCallback((quarterId: number, positionIndex: number, player: Player) => {
    setHasChanges(true);
    setQuarters((prev) => prev.map((q) => {
      if (q.id === quarterId) {
        const newLineup = { ...q.lineup };
        Object.keys(newLineup).forEach((key) => { if (newLineup[Number(key)]?.id === player.id) delete newLineup[Number(key)]; });
        newLineup[positionIndex] = player;
        return { ...q, lineup: newLineup };
      }
      return q;
    }));
  }, []);

  const onPositionRemove = useCallback((quarterId: number, positionIndex: number) => {
    setHasChanges(true);
    setQuarters((prev) => prev.map((q) => {
      if (q.id === quarterId) {
        const newLineup = { ...q.lineup };
        delete newLineup[positionIndex];
        return { ...q, lineup: newLineup };
      }
      return q;
    }));
  }, []);

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
    if (player && quarterId != null && positionIndex !== undefined) assignPlayer(quarterId, positionIndex, player);
  };

  const stats = MOCK_SELECTED_PLAYER_STATS;

  return (
    <div className="flex flex-col h-full min-h-screen bg-black text-white relative">
      {/* 헤더 */}
      <div className="px-6 md:px-10 pt-8 pb-6">
        <h2 className="text-2xl font-black tracking-tight">베스트11 관리</h2>
      </div>

      <div className="flex-1 px-4 md:px-10 pb-32">
        <div className="bg-[#0e0e0e] rounded-[32px] border border-white/5 overflow-hidden flex flex-col xl:flex-row h-full">
          
          <DndContext id={dndId} sensors={sensors} collisionDetection={customCollisionDetection} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            {/* 좌측: 보드 */}
            <div className="flex-1 p-6 md:p-8 flex flex-col gap-6">
              <div className="relative flex-1 bg-[#121212] rounded-3xl border border-white/5 p-4 md:p-6 lg:p-8 flex flex-col">
                <div className="absolute top-6 left-8 right-8 z-20 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 italic">
                    <span className="text-2xl font-black tracking-tighter">BEST</span>
                    <span className="text-2xl font-black tracking-tighter text-primary">XI</span>
                  </div>
                  <Dropdown
                    options={FORMATION_OPTIONS}
                    value={quarters[0].formation}
                    onChange={(val: string) => {
                      setQuarters((prev) => prev.map((q) => (q.id === 1 ? { ...q, formation: val as any } : q)));
                      setHasChanges(true);
                    }}
                    placeholder="포메이션"
                    className="bg-black/60 shadow-xl border-white/10 text-white min-w-[140px] rounded-xl"
                  />
                </div>

                <div className="flex-1 relative mt-16">
                  <FormationBoardList
                    quarters={quarters}
                    selectedPlayer={selectedPlayer}
                    setQuarters={setQuarters}
                    onPositionRemove={onPositionRemove}
                    currentQuarterId={currentQuarterId}
                    setCurrentQuarterId={setCurrentQuarterId}
                    showBoardHeader={false}
                    boardClassName="p-0 border-0 bg-transparent h-full min-h-[500px]"
                    onPlaceSelectedPlayer={(qId, idx) => { if (selectedPlayer) assignPlayer(qId, idx, selectedPlayer); }}
                  />
                </div>

                {/* 감독 & 팀 스탯 */}
                <div className="mt-8 flex items-center gap-10 px-8 py-4 bg-white/2 rounded-3xl border border-white/5 relative group">
                  <button 
                    onClick={() => openModal({ 
                      onComplete: (player) => {
                        setManager({ name: player.name, image: player.image || "/images/player/img_player_1.webp" });
                        setHasChanges(true);
                      },
                      excludeMercenaries: true
                    })}
                    className="flex items-center gap-4 pr-10 border-r border-white/10 hover:opacity-80 transition-all text-left"
                  >
                    <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-900 border border-white/10 group-hover:border-primary/30 transition-colors shadow-lg">
                      <Image src={manager.image} alt="감독" width={56} height={56} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit2 size={16} className="text-white" />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] text-gray-500 font-black flex items-center gap-1.5 uppercase">
                        감독 <Edit2 size={8} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      </span>
                      <span className="text-base font-black text-white group-hover:text-primary transition-colors">{manager.name}</span>
                    </div>
                  </button>
                  <div className="flex flex-1 items-center justify-around">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-gray-500 font-bold">경기수</span>
                      <span className="text-sm font-black">30</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-gray-500 font-bold">승/무/패</span>
                      <span className="text-sm font-black">20 / 5 / 5</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] text-gray-500 font-bold">팀 승률</span>
                      <span className="text-base font-black text-primary italic">60%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 우측 패널 (이미지 스타일) */}
            <div className="w-full xl:w-[420px] bg-[#0a0a0a] border-l border-white/5 flex flex-col h-full">
              {/* 상세 카드 */}
              <div className="relative p-6 pt-10 overflow-hidden min-h-[300px]">
                {/* 배경 패턴 (이미지 그물망 패턴 시각화) */}
                <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                  <svg viewBox="0 0 100 100" className="w-full h-full stroke-primary fill-none">
                    <path d="M0 0 L100 100 M0 100 L100 0 M50 0 L50 100 M0 50 L100 50" strokeWidth="0.1" />
                    <circle cx="50" cy="50" r="1" fill="currentColor" />
                    <circle cx="20" cy="20" r="0.5" fill="currentColor" />
                    <circle cx="80" cy="80" r="0.5" fill="currentColor" />
                    <path d="M20 20 L50 50 L80 80" strokeWidth="0.05" />
                  </svg>
                </div>
                
                <div className="relative flex justify-between">
                  <div className="flex-1">
                    <div className="text-7xl font-black text-white leading-none tracking-tighter mb-4">{stats.ovr}</div>
                    <h3 className="text-xl font-black text-white mb-2">{stats.name}</h3>
                    <div className="flex gap-2 mb-6">
                      {stats.positions.map(p => <span key={p} className="px-1.5 py-0.5 rounded bg-primary text-[10px] font-black text-black">{p}</span>)}
                    </div>
                    <div className="text-[10px] text-gray-500 leading-relaxed font-bold">
                      <p>입단 {stats.joinDate}</p>
                      <p>나이 만 {stats.age}</p>
                    </div>
                  </div>
                  <div className="relative w-36 h-44 rounded-2xl overflow-hidden border border-white/10 bg-linear-to-b from-white/10 to-transparent">
                    <Image src="/images/player/img_player_1.webp" alt="선수" fill className="object-cover object-top" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-8">
                  <StatCardItem icon="🏃" label="출장" value={stats.matches} />
                  <StatCardItem icon="⚽" label="골" value={stats.goals} />
                  <StatCardItem icon="👟" label="도움" value={stats.assists} />
                  <StatCardItem icon="🎯" label="기점" value={stats.contributions} />
                  <StatCardItem icon="🛡️" label="클린시트" value={stats.cleanSheets} />
                  <StatCardItem icon="📈" label="승률" value={stats.winRate} />
                </div>
              </div>

              {/* 선수 리스트 테이블 */}
              <div className="flex-1 flex flex-col p-4 pt-0">
                <div className="grid grid-cols-[50px_60px_1fr_60px] px-4 py-3 text-[9px] font-black text-gray-600 uppercase tracking-widest border-b border-white/5">
                  <span className="text-center">포지션</span>
                  <span className="text-center">등번호</span>
                  <span className="pl-2">선수명</span>
                  <span className="text-right pr-1">OVR</span>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {MOCK_LINEUP_LIST.map(item => <DraggablePlayerRow key={item.id} item={item} />)}
                </div>
              </div>
            </div>

            {/* 드래그 오버레이 */}
            <DragOverlay dropAnimation={null} modifiers={[snapCenterToCursor]}>
              {activePlayer ? (
                <div className="rounded-full flex w-16 h-16 items-center justify-center bg-black/60 border-2 border-primary overflow-hidden shadow-2xl backdrop-blur-md">
                  <ProfileAvatar src={activePlayer.image || "/images/player/img_player_2.webp"} alt={activePlayer.name} size={72} />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>


      {/* 하단 저장 바 (이미지 스타일) */}
      {hasChanges && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0e0e0e]/95 backdrop-blur-3xl border-t border-white/5 h-20 px-8 flex items-center justify-between">
          <div className="text-sm font-bold text-white tracking-tight">
             변경사항이 있습니다. 저장하지 않으면 사라집니다.
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setQuarters([{ id: 1, type: "MATCHING", formation: "4-2-3-1", lineup: {}, matchup: { home: "A", away: "B" } }]); setHasChanges(false); }}
              className="px-8 py-2.5 rounded-xl border border-white/10 text-white text-xs font-black hover:bg-white/5 transition-all"
            >
              초기화
            </button>
            <button 
              onClick={() => setHasChanges(false)}
              className="px-8 py-2.5 rounded-xl bg-primary text-black text-xs font-black hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20"
            >
              저장하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
