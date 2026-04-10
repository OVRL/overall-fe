"use client";

import React, { useState, useId, useCallback, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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
  useDraggable,
} from "@dnd-kit/core";
import { snapCenterToCursor } from "@dnd-kit/modifiers";
import Image from "next/image";

import ProfileAvatar from "@/components/ui/ProfileAvatar";
import FormationBoardList from "@/components/formation/board/FormationBoardList";
import PositionChip from "@/components/PositionChip";
import Dropdown from "@/components/ui/Dropdown";
import { QuarterData, Player } from "@/types/formation";
import type { Position } from "@/types/position";
import { FORMATION_OPTIONS } from "@/constants/formations";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Edit2, Loader2 } from "lucide-react";
import useModal from "@/hooks/useModal";
import { useSelectedTeamId } from "@/components/providers/SelectedTeamProvider";
import { parseNumericIdFromRelayGlobalId } from "@/lib/relay/parseRelayGlobalId";
import { useBestElevenQuery } from "./hooks/useBestElevenQuery";
import { useCreateBestElevenMutation } from "./hooks/useCreateBestElevenMutation";
import { useDeleteBestElevenMutation } from "./hooks/useDeleteBestElevenMutation";
import { Suspense } from "react";
import { FORMATIONS, type FormationType } from "@/constants/formation";
import { getValidImageSrc, cn } from "@/lib/utils";

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
  isMom: true,
};

/**
 * 우측 선수 리스트 목업 (이미지 기준)
 */
const MOCK_LINEUP_LIST = [
  { id: 101, position: "LB", number: 4, name: "메시", ovr: 90, image: "/images/player/img_player_1.webp", isMom: true },
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
const DraggablePlayerRow = ({ 
  item, 
  onClick, 
  isSelected 
}: { 
  item: any; 
  onClick?: () => void; 
  isSelected?: boolean;
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `row-${item.id}`,
    data: { type: "Player", player: { id: item.id, name: item.name, image: item.image, position: item.position, overall: item.ovr } },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={cn(
        "group grid grid-cols-[50px_60px_1fr_60px] items-center px-4 py-2 hover:bg-white/5 transition-all cursor-grab active:cursor-grabbing border-b border-white/5",
        isDragging && "opacity-30 bg-white/5",
        isSelected && "bg-primary/10 border-l-2 border-l-primary"
      )}
    >
      <div className="flex justify-center">
        <div className="w-8 h-6 border border-white/20 rounded flex items-center justify-center text-[10px] font-black text-gray-400 group-hover:border-primary/50 transition-colors uppercase">
          {item.position}
        </div>
      </div>
      <span className="text-xs font-black text-gray-400 text-center">{item.number}</span>
      <div className="flex items-center gap-3 pl-2">
        <div className="w-8 h-8 relative flex items-end justify-center">
          <Image src={getValidImageSrc(item.image)} alt={item.name} width={32} height={32} className="w-full h-full object-contain object-bottom drop-shadow-md" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white group-hover:text-primary transition-colors">{item.name}</span>
          {item.isMom && (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-primary/20 text-primary border border-primary/30 uppercase tracking-tighter whitespace-nowrap">
              MOM
            </span>
          )}
        </div>
      </div>
      <span className="text-sm font-black text-primary text-right">{item.ovr}</span>
    </div>
  );
};

interface SelectedPlayerDetail {
  id: number;
  name: string;
  image: string;
  ovr: number;
  positions: string[];
  isMom?: boolean;
}

export default function BestElevenPanel() {
  const { selectedTeamIdNum } = useSelectedTeamId();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!selectedTeamIdNum) {
    return (
      <div className="flex-1 flex items-center justify-center p-10 text-gray-500">
        선택된 팀이 없습니다.
      </div>
    );
  }

  // SSR 시에는 쿼리를 실행하지 않고 로딩 상태만 반환하여 Unauthorized 에러 방지
  if (!isMounted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-black h-full min-h-[720px]">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">
          Preparing Best XI Board...
        </p>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-black h-full min-h-[720px]">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">
            Loading Best XI Data...
          </p>
        </div>
      }
    >
      <BestElevenPanelInner teamId={selectedTeamIdNum} />
    </Suspense>
  );
}

function BestElevenPanelInner({ teamId }: { teamId: number }) {
  const isMobile = useIsMobile(1023);
  const dndId = useId();
  const { openModal } = useModal("PLAYER_SEARCH");
  const searchParams = useSearchParams();
  const managerSectionRef = useRef<HTMLDivElement>(null);

  // API Data
  const data = useBestElevenQuery(teamId);
  const { executeMutation: createBestEleven, isInFlight: isSaving } =
    useCreateBestElevenMutation();
  const { executeMutation: deleteBestEleven } = useDeleteBestElevenMutation();

  // 선수 목록 변환 (TeamMemberModel -> Player) - 참조 무결성 유지를 위해 useMemo 사용
  const allPlayers: Player[] = React.useMemo(() => (data.findManyTeamMember?.members || []).map((m: any) => ({
    id: m.id,
    name: m.user?.name || "알 수 없음",
    image: m.user?.profileImage || "/images/player/img_player_1.webp",
    position: m.position || "-",
    number: m.backNumber || 0,
    overall: m.overall?.ovr || 0,
    isMom: (m.overall?.mom3 || 0) > 0 || (m.overall?.mom8 || 0) > 0,
    joinDate: m.joinedAt ? new Date(m.joinedAt).toLocaleDateString() : "-",
    age: m.user?.birthDate ? String(new Date().getFullYear() - new Date(m.user.birthDate).getFullYear()) : "0",
    stats: {
      matches: m.overall?.appearances || 0,
      goals: m.overall?.goals || 0,
      assists: m.overall?.assists || 0,
      contributions: m.overall?.keyPasses || 0,
      cleanSheets: m.overall?.cleanSheets || 0,
      winRate: `${m.overall?.winRate || 0}%`,
    }
  })), [data.findManyTeamMember]);

  // 포메이션 데이터 복원 (findBestEleven -> QuarterData)
  // BestElevenModel: { id, position, teamId, userId }
  // userId 기준으로 allPlayers에서 선수를 찾아 포메이션 슬롯에 배치
  const bestElevenData = data.findBestEleven ?? [];

  const getInitialQuarters = useCallback((): QuarterData[] => {
    const defaultFormation = "4-2-3-1" as any;

    if (bestElevenData.length === 0) {
      return [
        {
          id: 1,
          type: "MATCHING",
          formation: defaultFormation,
          lineup: {},
          matchup: { home: "A", away: "B" },
        },
      ];
    }

    // userId -> Player 매핑 (teamMember.user.id와 BestElevenModel.userId 비교)
    const playerByUserId = new Map<number, Player>();
    const members = data.findManyTeamMember?.members ?? [];
    for (const p of allPlayers) {
      const member = members.find((m: any) => String(m.id) === String(p.id));
      const uid = parseNumericIdFromRelayGlobalId(member?.user?.id);
      if (uid != null) {
        playerByUserId.set(uid, p);
      }
    }

    // 포지션별로 bestEleven 항목 그룹화 (같은 포지션 여러 개 대응)
    type MutableEntry = { id: number; position: string; teamId: number; userId: number };
    const positionQueue = new Map<string, MutableEntry[]>();
    for (const entry of bestElevenData) {
      const pos = entry.position as string;
      if (!positionQueue.has(pos)) positionQueue.set(pos, []);
      positionQueue.get(pos)!.push({ id: Number(entry.id), position: pos, teamId: Number(entry.teamId), userId: Number(entry.userId) });
    }

    // 포메이션 슬롯에 선수 배치
    const formationType = defaultFormation;
    const board = FORMATIONS[formationType as FormationType] ?? {};
    const mappedLineup: Record<number, Player | null> = {};

    for (const [slotStr, cell] of Object.entries(board)) {
      const slot = Number(slotStr);
      const role = (cell as any).role as string;
      const queue = positionQueue.get(role);
      if (queue && queue.length > 0) {
        const entry = queue.shift()!;
        const player = playerByUserId.get(Number(entry.userId));
        if (player) mappedLineup[slot] = player;
      }
    }

    return [
      {
        id: 1,
        type: "MATCHING",
        formation: formationType,
        lineup: mappedLineup,
        matchup: { home: "A", away: "B" },
      },
    ];
  }, [bestElevenData, allPlayers, data.findManyTeamMember]);

  // 상태 초기화
  const [quarters, setQuarters] = useState<QuarterData[]>(getInitialQuarters);
  
  // 데이터 로딩 후 초기화 (릴레이 데이터 변경 시)
  useEffect(() => {
    setQuarters(getInitialQuarters());
    setHasChanges(false);
  }, [getInitialQuarters]);

  // 감독 정보 찾기
  const initialManagerMember = data.findManyTeamMember?.members?.find((m: any) => m.role === "MANAGER");
  const [manager, setManager] = useState({ 
    name: initialManagerMember?.user?.name || "설정되지 않음", 
    image: getValidImageSrc(initialManagerMember?.user?.profileImage) 
  });

  // DnD 설정: PC는 PointerSensor, 모바일은 TouchSensor(장압으로 드래그, 탭은 클릭으로 통과)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } }),
  );
  
  const [currentQuarterId, setCurrentQuarterId] = useState<number | null>(1);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedPlayerDetail, setSelectedPlayerDetail] = useState<Player | null>(null);
  const [activePlayer, setActivePlayer] = useState<Player | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  // 모바일: 탭으로 선택된 포지션 슬롯
  const [mobilePositionSlot, setMobilePositionSlot] = useState<{ quarterId: number; positionIndex: number; label: string } | null>(null);

  // 자동 스크롤 로직
  useEffect(() => {
    if (searchParams.get("edit") === "manager") {
      const timer = setTimeout(() => {
        managerSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  // DnD 핸들러
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

  // 저장 로직 — 기존 베스트11 전체 삭제 후 새 lineup 저장
  const handleSave = async () => {
    const formation = quarters[0].formation as FormationType;
    const board = FORMATIONS[formation];
    const lineup = quarters[0].lineup ?? {};
    const members = data.findManyTeamMember?.members ?? [];

    // teamMemberId -> member 매핑 (Relay GlobalId 포함 처리)
    // Relay는 __typename이 있을 때 id를 "TeamMemberModel:123" 형태로 반환함
    // → String(m.id) 그대로 키로 사용하여 player.id와 일치시킴
    const memberByTeamMemberId = new Map<string, (typeof members)[number]>();
    for (const m of members) {
      memberByTeamMemberId.set(String(m.id), m);
    }

    // 새로 저장할 항목 수집
    const newEntries: Array<{ position: Position; teamId: number; userId: number }> = [];
    for (let slot = 1; slot <= 11; slot += 1) {
      const player = lineup[slot];
      if (player == null) continue;
      const cell = board[slot as keyof typeof board];
      if (cell == null) continue;
      const position = cell.role as Position;
      const member = memberByTeamMemberId.get(String(player.id));
      if (!member) continue;

      const uid = parseNumericIdFromRelayGlobalId(member.user?.id);
      if (uid == null) {
        continue;
      }
      newEntries.push({ position, teamId, userId: uid });
    }

    if (newEntries.length === 0) {
      alert("저장할 배치된 선수가 없거나 유저 정보를 찾을 수 없습니다.");
      return;
    }

    try {
      const currentBestEleven = data.findBestEleven ?? [];
      // 1단계: 기존 항목 삭제 (안정성을 위해 순차 처리 고려 가능하나 우선 병렬 유지하되 ID 파싱 강화)
      if (currentBestEleven.length > 0) {
        await Promise.all(
          currentBestEleven.map(async (entry: any) => {
            const numericId = parseNumericIdFromRelayGlobalId(entry.id);
            if (numericId != null) {
              await deleteBestEleven(numericId);
            }
          })
        );
      }

      // 2단계: 신규 항목 생성
      await Promise.all(
        newEntries.map(async (entry) => {
          await createBestEleven(entry);
        })
      );

      setHasChanges(false);
      alert("베스트 11이 저장되었습니다.");
    } catch (error) {
      console.error("[BestEleven] Failed to save best eleven:", error);
      alert("저장 중 오류가 발생했습니다. 콘솔을 확인해주세요.");
    }
  };

  const stats = MOCK_SELECTED_PLAYER_STATS;

  return (
    <div className="flex flex-col h-full min-h-screen bg-black text-white relative">
      {/* 헤더 */}
      <div className="px-4 md:px-6 pt-6 pb-4">
        <h1 className="text-xl font-bold text-white">베스트11 관리</h1>
      </div>

      <div className="flex-1 px-4 md:px-6 pb-32">
        <div className="bg-[#0e0e0e] rounded-[32px] border border-white/5 overflow-hidden flex flex-col xl:flex-row min-h-[720px]">
          
          <DndContext id={dndId} sensors={sensors} collisionDetection={customCollisionDetection} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            {/* 좌측: 보드 */}
            <div className="flex-1 p-6 md:p-8 flex flex-col gap-4">
              <div className="relative flex-1 bg-[#121212] rounded-3xl border border-white/5 p-4 md:p-6 lg:p-8 flex flex-col">
                <div className="absolute top-4 left-4 right-4 md:top-6 md:left-8 md:right-8 z-20 flex items-center justify-between">
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

                <div className="flex-1 relative mt-20 md:mt-12 mb-4 overflow-hidden">
                  <FormationBoardList
                    quarters={quarters}
                    selectedPlayer={selectedPlayer}
                    setQuarters={setQuarters}
                    onPositionRemove={onPositionRemove}
                    currentQuarterId={currentQuarterId}
                    setCurrentQuarterId={setCurrentQuarterId}
                    showBoardHeader={false}
                    boardClassName="p-0 border-0 bg-transparent h-full min-h-[400px]"
                    onPlaceSelectedPlayer={(qId, idx, label) => {
                      if (isMobile) {
                        // 모바일: 포지션 탭 시 통합 선수 검색 모달 오픈
                        openModal({
                          onComplete: (player: Player) => {
                            assignPlayer(qId, idx, player);
                          },
                          teamPlayers: allPlayers,
                          excludeMercenaries: true,
                          targetPosition: label,
                          title: `${label} 선수 검색`
                        });
                      } else {
                        // PC: 선택된 선수가 있으면 배치
                        if (selectedPlayer) assignPlayer(qId, idx, selectedPlayer);
                      }
                    }}
                  />
                </div>

                {/* 감독 & 팀 스탯 - 겹침 방지를 위해 보드 외부에 배치되도록 조정 가능하지만, 
                    일단 내부에서 배경을 확실히 분리하고 z-index 조정 */}
                <div 
                  ref={managerSectionRef}
                  className="mt-4 flex flex-wrap lg:flex-nowrap items-center gap-6 md:gap-10 px-6 md:px-8 py-4 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 relative z-30 group shrink-0"
                >
                  <button 
                    onClick={() => openModal({ 
                      onComplete: (player) => {
                        setManager({ name: player.name, image: getValidImageSrc(player.image) });
                        setHasChanges(true);
                      },
                      excludeMercenaries: true,
                      isTeamSearch: true,
                      teamPlayers: allPlayers
                    })}
                    onTouchEnd={(e) => {
                      // 모바일: DnD TouchSensor delay 없이 즉시 모달 오픈
                      e.preventDefault();
                      e.stopPropagation();
                      openModal({
                        onComplete: (player: Player) => {
                          setManager({ name: player.name, image: getValidImageSrc(player.image) });
                          setHasChanges(true);
                        },
                        excludeMercenaries: true,
                        isTeamSearch: true,
                        teamPlayers: allPlayers,
                        title: "감독 수정"
                      });
                    }}
                    className="flex items-center gap-4 pr-10 border-r border-white/10 hover:opacity-80 transition-all text-left"
                  >
                    <div className="relative w-14 h-14 rounded-full overflow-hidden bg-gray-900 border border-white/10 group-hover:border-primary/30 transition-colors shadow-lg">
                      <Image src={getValidImageSrc(manager.image)} alt="감독" width={56} height={56} className="w-full h-full object-cover" />
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

            {/* 우측 패널 (사이드바) */}
            <div className="w-full xl:w-[420px] bg-black border-l border-white/5 flex flex-col h-full">
              {/* 상세 카드 */}
              <div className="relative p-6 pt-10 overflow-hidden min-h-[340px] flex flex-col justify-between">
                {/* 배경 이미지 (사용자 요청: normal-green.webp) */}
                <div className="absolute inset-0 z-0">
                  <Image 
                    src={getValidImageSrc("/images/card-bgs/normal-green.webp")} 
                    alt="Player Card Background" 
                    fill 
                    className="object-cover" 
                  />
                  {/* 조명 효과와 그라데이션 추가하여 가독성 확보 */}
                  <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/20" />
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black to-transparent" />
                </div>
                
                {/* 상단: 선수 기본 정보 */}
                <div className="relative z-20 flex">
                  <div className="flex-1">
                    <div className="text-7xl font-black text-white leading-none tracking-tighter mb-2 italic">
                      {selectedPlayerDetail?.overall || 0}
                    </div>
                    {/* 최근경기 MOM 뱃지 추가 (조건부) */}
                    {(selectedPlayerDetail?.isMom ?? stats.isMom) && (
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="px-2 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-[10px] font-black text-primary uppercase animate-pulse">
                          최근경기 MOM
                        </span>
                      </div>
                    )}
                    <h3 className="text-2xl font-black text-white mb-3">
                      {selectedPlayerDetail?.name || "선수를 선택하세요"}
                    </h3>
                    <div className="flex gap-1.5 mb-6">
                      {(selectedPlayerDetail?.position ? [selectedPlayerDetail.position] : ["-"]).map((p: string, idx: number) => (
                        <span 
                          key={`${p}-${idx}`} 
                          className={cn(
                            "px-2 py-0.5 rounded text-[11px] font-black uppercase tracking-tight shadow-sm",
                            idx === 0 ? "bg-[#4ade80] text-black" : "bg-[#60a5fa] text-black"
                          )}
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                    <div className="text-[11px] text-white/50 leading-relaxed font-bold">
                      <p>입단 {selectedPlayerDetail?.joinDate || "-"}</p>
                      <p>나이 만 {selectedPlayerDetail?.age || "0"}세</p>
                    </div>
                  </div>
                </div>

                {/* 중앙: 선수 이미지 (누끼 느낌으로 배경 위에 배치) */}
                <div className="absolute top-0 right-0 w-[240px] h-[280px] z-10 pointer-events-none">
                  <Image 
                    key={selectedPlayerDetail?.id || 'default'}
                    src={getValidImageSrc(selectedPlayerDetail?.image)} 
                    alt="선수" 
                    fill 
                    className="object-contain object-bottom" 
                  />
                </div>

                {/* 하단: 스탯 그리드 */}
                <div className="relative z-20 grid grid-cols-3 gap-2 mt-auto">
                  <StatCardItem icon="🏃" label="출장" value={selectedPlayerDetail?.stats?.matches || 0} />
                  <StatCardItem icon="⚽" label="골" value={selectedPlayerDetail?.stats?.goals || 0} />
                  <StatCardItem icon="👟" label="도움" value={selectedPlayerDetail?.stats?.assists || 0} />
                  <StatCardItem icon="🎯" label="기점" value={selectedPlayerDetail?.stats?.contributions || 0} />
                  <StatCardItem icon="🛡️" label="클린시트" value={selectedPlayerDetail?.stats?.cleanSheets || 0} />
                  <StatCardItem icon="📈" label="승률" value={selectedPlayerDetail?.stats?.winRate || "0%"} />
                </div>
              </div>

              {/* 선수 리스트 테이블 */}
              <div className="flex-1 flex flex-col p-4 pt-0 relative z-10 bg-black">
                <div className="grid grid-cols-[50px_60px_1fr_60px] px-4 py-3 text-[9px] font-black text-gray-700 uppercase tracking-widest border-b border-white/5">
                  <span className="text-center">포지션</span>
                  <span className="text-center">등번호</span>
                  <span className="pl-2">선수명</span>
                  <span className="text-right pr-1">OVR</span>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {allPlayers.map(item => (
                    <DraggablePlayerRow 
                      key={item.id} 
                      item={{
                        ...item,
                        number: item.number,
                        ovr: item.overall
                      }} 
                      onClick={() => setSelectedPlayerDetail(item)}
                      isSelected={selectedPlayerDetail?.id === item.id}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* 드래그 오버레이 */}
            <DragOverlay dropAnimation={null} modifiers={[snapCenterToCursor]}>
              {activePlayer ? (
                <div className="rounded-full flex w-16 h-16 items-center justify-center bg-black/60 border-2 border-primary overflow-hidden shadow-2xl backdrop-blur-md">
                  <ProfileAvatar src={getValidImageSrc(activePlayer.image)} alt={activePlayer.name} size={72} />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>


      {/* 하단 저장 바 */}
      {hasChanges && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0e0e0e]/95 backdrop-blur-3xl border-t border-white/5 h-20 px-8 flex items-center justify-between">
          <div className="text-sm font-bold text-white tracking-tight">
             변경사항이 있습니다. 저장하지 않으면 사라집니다.
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.location.reload()} // 초기화 시 페이지 새로고침으로 데이터 복구
              className="px-8 py-2.5 rounded-xl border border-white/10 text-white text-xs font-black hover:bg-white/5 transition-all disabled:opacity-50"
              disabled={isSaving}
            >
              초기화
            </button>
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="px-8 py-2.5 rounded-xl bg-primary text-black text-xs font-black hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center gap-2 disabled:bg-gray-600 disabled:shadow-none"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "저장하기"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
