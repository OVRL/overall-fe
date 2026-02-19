"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";

import MainProfileCard from "@/components/ui/MainProfileCard";
import PositionChip from "@/components/PositionChip";
import { Position } from "@/types/position";

// ============================================================
// 타입 정의
// ============================================================
interface Player {
  id: number;
  name: string;
  team: string;
  value: string;
  image?: string;
  position: Position;
  backNumber: number;
  ovr: number;
  stats?: PlayerStats;
  cumulativeStats?: PlayerStats;
}

interface PlayerStats {
  출장: number;
  오버롤: number;
  골: number;
  어시: number;
  기점: number;
  클린시트: number;
  주발: "L" | "R" | "B";
  승률: string;
  득점?: number;
  도움?: number;
  공격P?: number;
  MOM3?: number;
  MOM8?: number;
}

// ============================================================
// 발자국 아이콘 컴포넌트
// ============================================================
const FootIcon = ({ foot }: { foot: "L" | "R" | "B" }) => {
  const leftActive = foot === "L" || foot === "B";
  const rightActive = foot === "R" || foot === "B";

  const footLabel =
    foot === "L" ? "왼발잡이" : foot === "R" ? "오른발잡이" : "양발잡이";

  return (
    <div title={footLabel} className="flex items-center gap-0.5">
      {/* 왼발 */}
      <svg
        width="20"
        height="24"
        viewBox="0 0 24 28"
        fill="none"
        className={leftActive ? "text-green-500" : "text-gray-600"}
      >
        <path
          d="M12 2C7 2 4 6 4 10C4 14 6 18 6 22C6 25 8 26 12 26C16 26 18 25 18 22C18 18 20 14 20 10C20 6 17 2 12 2Z"
          fill="currentColor"
        />
        <text
          x="12"
          y="18"
          textAnchor="middle"
          fontSize="10"
          fill="black"
          fontWeight="bold"
        >
          L
        </text>
      </svg>
      {/* 오른발 */}
      <svg
        width="20"
        height="24"
        viewBox="0 0 24 28"
        fill="none"
        className={rightActive ? "text-green-500" : "text-gray-600"}
      >
        <path
          d="M12 2C7 2 4 6 4 10C4 14 6 18 6 22C6 25 8 26 12 26C16 26 18 25 18 22C18 18 20 14 20 10C20 6 17 2 12 2Z"
          fill="currentColor"
        />
        <text
          x="12"
          y="18"
          textAnchor="middle"
          fontSize="10"
          fill="black"
          fontWeight="bold"
        >
          R
        </text>
      </svg>
    </div>
  );
};

// ============================================================
// 선수 기록 더보기 모달 (TOP 10)
// ============================================================
interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  players: Player[];
  onPlayerClick?: (player: Player) => void;
}

function StatsModal({
  isOpen,
  onClose,
  category,
  players,
  onPlayerClick,
}: StatsModalProps) {
  if (!isOpen) return null;

  const top10Players = [...players]
    .sort((a, b) => {
      const numA = parseInt(a.value.replace(/[^0-9]/g, "")) || 0;
      const numB = parseInt(b.value.replace(/[^0-9]/g, "")) || 0;
      if (numB !== numA) return numB - numA;
      return a.name.localeCompare(b.name, "ko");
    })
    .slice(0, 10);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a1a] rounded-2xl w-[calc(100%-2rem)] max-w-[420px] max-h-[85vh] overflow-hidden shadow-2xl animate-slideUp border border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
          <div className="w-6" />
          <h2 className="text-xl font-bold text-white">{category}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors text-xl"
          >
            ✕
          </button>
        </div>

        {/* 선수 목록 */}
        <div className="overflow-y-auto max-h-[70vh] px-6 py-4">
          <div className="flex flex-col gap-4">
            {top10Players.map((player, index) => (
              <div
                key={player.id}
                className="flex items-center gap-4 py-2 hover:bg-gray-800/50 rounded-lg transition-colors cursor-pointer px-2 -mx-2"
                onClick={() => onPlayerClick?.(player)}
              >
                {/* 순위 - 1등은 primary, 나머지는 흰색 */}
                <span
                  className={`font-black text-2xl w-8 text-center italic ${index === 0 ? "text-primary" : "text-white"}`}
                >
                  {index + 1}
                </span>

                {/* 선수 이미지 */}
                <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={player.image || "/images/ovr.png"}
                    alt={player.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* 포지션 칩 + 이름 */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <PositionChip
                    position={player.position}
                    variant="filled"
                    className="text-[10px] px-1.5 py-0.5"
                  />
                  <span
                    className={`font-semibold text-base truncate ${index === 0 ? "text-primary" : "text-white"}`}
                  >
                    {player.name}
                  </span>
                </div>

                {/* 값 */}
                <span className="text-primary font-bold text-lg flex-shrink-0">
                  {player.value.replace(/[^0-9]/g, "")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 선수 상세 모달 (MainProfileCard 사용 + 탭)
// ============================================================
interface PlayerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: Player | null;
}

function PlayerDetailModal({
  isOpen,
  onClose,
  player,
}: PlayerDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"시즌기록" | "통산기록">(
    "시즌기록",
  );

  if (!isOpen || !player) return null;

  const seasonStats = player.stats || {
    출장: 25,
    오버롤: player.ovr,
    골: 40,
    어시: 24,
    기점: 16,
    클린시트: 60,
    주발: "R" as const,
    승률: "50%",
  };

  const cumulativeStats = player.cumulativeStats || {
    출장: 150,
    오버롤: player.ovr,
    골: 200,
    어시: 80,
    기점: 280,
    클린시트: 45,
    주발: seasonStats.주발,
    승률: "55%",
  };

  const currentStats = activeTab === "시즌기록" ? seasonStats : cumulativeStats;

  const statItems = [
    { label: "출장", value: currentStats.출장 },
    { label: "오버롤", value: currentStats.오버롤 },
    { label: "골", value: currentStats.골 },
    { label: "어시", value: currentStats.어시 },
    { label: "기점", value: currentStats.기점 },
    { label: "클린시트", value: currentStats.클린시트 },
    { label: "주발", value: currentStats.주발, isFoot: true },
    { label: "승률", value: currentStats.승률 },
  ];

  return (
    <div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-[#2a2a2a] rounded-3xl w-[calc(100%-2rem)] max-w-[380px] overflow-hidden shadow-2xl animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <div className="flex justify-end p-4">
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        {/* 선수 프로필 카드 */}
        <div className="flex flex-col items-center px-8 pb-4">
          <MainProfileCard
            imgUrl={player.image || "/images/ovr.png"}
            playerName={player.name}
            mainPosition={player.position}
            backNumber={player.backNumber}
            className="w-48 h-64"
            nameClassName="text-3xl"
            numberClassName="text-5xl"
            positionClassName="text-sm px-2.5 py-1"
          />
        </div>

        {/* 탭 메뉴 */}
        <div className="flex justify-center gap-4 px-6 pb-4">
          <button
            onClick={() => setActiveTab("시즌기록")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              activeTab === "시즌기록"
                ? "bg-primary text-black"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            시즌기록
          </button>
          <button
            onClick={() => setActiveTab("통산기록")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              activeTab === "통산기록"
                ? "bg-primary text-black"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            통산기록
          </button>
        </div>

        {/* 스탯 그리드 */}
        <div className="grid grid-cols-2 gap-y-5 gap-x-6 px-8 pb-8">
          {statItems.map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="text-gray-400 text-sm min-w-[3.5rem]">
                {item.label}
              </span>
              {item.isFoot ? (
                <FootIcon foot={item.value as "L" | "R" | "B"} />
              ) : (
                <span className="text-white font-bold text-base">
                  {item.value}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 순위 카드 컴포넌트
// ============================================================
interface RankingCardProps {
  title: string;
  players: Player[];
  onMoreClick?: () => void;
  onPlayerClick?: (player: Player) => void;
}

// ============================================================
// 데이터 정의 (컴포넌트 외부로 이동)
// ============================================================
// 실제 축구 선수 더미 데이터
const allPlayers: Player[] = [
  {
    id: 1,
    name: "호날두",
    team: "포르투갈",
    value: "45골",
    image: "/images/player/img_player-1.png",
    position: "ST",
    backNumber: 7,
    ovr: 92,
    stats: {
      출장: 38,
      오버롤: 92,
      골: 45,
      어시: 12,
      기점: 57,
      클린시트: 0,
      주발: "R",
      승률: "68%",
      득점: 45,
      도움: 12,
      공격P: 57,
      MOM3: 15,
      MOM8: 28,
    },
    cumulativeStats: {
      출장: 250,
      오버롤: 92,
      골: 320,
      어시: 95,
      기점: 415,
      클린시트: 0,
      주발: "R",
      승률: "65%",
    },
  },
  {
    id: 2,
    name: "메시",
    team: "아르헨티나",
    value: "42골",
    image: "/images/player/img_player-2.png",
    position: "RW",
    backNumber: 10,
    ovr: 93,
    stats: {
      출장: 35,
      오버롤: 93,
      골: 42,
      어시: 21,
      기점: 63,
      클린시트: 0,
      주발: "L",
      승률: "72%",
      득점: 42,
      도움: 21,
      공격P: 63,
      MOM3: 18,
      MOM8: 32,
    },
    cumulativeStats: {
      출장: 280,
      오버롤: 93,
      골: 380,
      어시: 180,
      기점: 560,
      클린시트: 0,
      주발: "L",
      승률: "70%",
    },
  },
  {
    id: 3,
    name: "음바페",
    team: "프랑스",
    value: "38골",
    image: "/images/player/img_player-3.png",
    position: "LW",
    backNumber: 7,
    ovr: 91,
    stats: {
      출장: 34,
      오버롤: 91,
      골: 38,
      어시: 15,
      기점: 53,
      클린시트: 0,
      주발: "R",
      승률: "65%",
      득점: 38,
      도움: 15,
      공격P: 53,
      MOM3: 12,
      MOM8: 22,
    },
    cumulativeStats: {
      출장: 180,
      오버롤: 91,
      골: 200,
      어시: 85,
      기점: 285,
      클린시트: 0,
      주발: "R",
      승률: "62%",
    },
  },
  {
    id: 4,
    name: "홀란드",
    team: "노르웨이",
    value: "52골",
    image: "/images/player/img_player-4.png",
    position: "ST",
    backNumber: 9,
    ovr: 91,
    stats: {
      출장: 36,
      오버롤: 91,
      골: 52,
      어시: 8,
      기점: 60,
      클린시트: 0,
      주발: "L",
      승률: "70%",
      득점: 52,
      도움: 8,
      공격P: 60,
      MOM3: 20,
      MOM8: 35,
    },
    cumulativeStats: {
      출장: 150,
      오버롤: 91,
      골: 180,
      어시: 35,
      기점: 215,
      클린시트: 0,
      주발: "L",
      승률: "68%",
    },
  },
  {
    id: 5,
    name: "벨링엄",
    team: "잉글랜드",
    value: "25골",
    image: "/images/player/img_player-5.png",
    position: "CAM",
    backNumber: 5,
    ovr: 89,
    stats: {
      출장: 40,
      오버롤: 89,
      골: 25,
      어시: 18,
      기점: 43,
      클린시트: 0,
      주발: "R",
      승률: "62%",
      득점: 25,
      도움: 18,
      공격P: 43,
      MOM3: 10,
      MOM8: 18,
    },
    cumulativeStats: {
      출장: 120,
      오버롤: 89,
      골: 65,
      어시: 45,
      기점: 110,
      클린시트: 0,
      주발: "R",
      승률: "60%",
    },
  },
  {
    id: 6,
    name: "비니시우스",
    team: "브라질",
    value: "20골",
    image: "/images/player/img_player-6.png",
    position: "LW",
    backNumber: 7,
    ovr: 90,
    stats: {
      출장: 38,
      오버롤: 90,
      골: 20,
      어시: 22,
      기점: 42,
      클린시트: 0,
      주발: "R",
      승률: "67%",
      득점: 20,
      도움: 22,
      공격P: 42,
      MOM3: 8,
      MOM8: 15,
    },
    cumulativeStats: {
      출장: 160,
      오버롤: 90,
      골: 75,
      어시: 85,
      기점: 160,
      클린시트: 0,
      주발: "R",
      승률: "65%",
    },
  },
  {
    id: 7,
    name: "살라",
    team: "이집트",
    value: "28골",
    image: "/images/player/img_player-7.png",
    position: "RW",
    backNumber: 11,
    ovr: 89,
    stats: {
      출장: 36,
      오버롤: 89,
      골: 28,
      어시: 14,
      기점: 42,
      클린시트: 0,
      주발: "L",
      승률: "70%",
      득점: 28,
      도움: 14,
      공격P: 42,
      MOM3: 11,
      MOM8: 20,
    },
    cumulativeStats: {
      출장: 220,
      오버롤: 89,
      골: 180,
      어시: 90,
      기점: 270,
      클린시트: 0,
      주발: "L",
      승률: "68%",
    },
  },
  {
    id: 8,
    name: "데브라이너",
    team: "벨기에",
    value: "15골",
    image: "/images/player/img_player-8.png",
    position: "CM",
    backNumber: 17,
    ovr: 91,
    stats: {
      출장: 32,
      오버롤: 91,
      골: 15,
      어시: 28,
      기점: 43,
      클린시트: 0,
      주발: "R",
      승률: "75%",
      득점: 15,
      도움: 28,
      공격P: 43,
      MOM3: 14,
      MOM8: 25,
    },
    cumulativeStats: {
      출장: 200,
      오버롤: 91,
      골: 80,
      어시: 150,
      기점: 230,
      클린시트: 0,
      주발: "R",
      승률: "72%",
    },
  },
  {
    id: 9,
    name: "반다이크",
    team: "네덜란드",
    value: "5골",
    image: "/images/player/img_player-9.png",
    position: "CB",
    backNumber: 4,
    ovr: 90,
    stats: {
      출장: 38,
      오버롤: 90,
      골: 5,
      어시: 2,
      기점: 7,
      클린시트: 22,
      주발: "R",
      승률: "68%",
      득점: 5,
      도움: 2,
      공격P: 7,
      MOM3: 6,
      MOM8: 10,
    },
    cumulativeStats: {
      출장: 180,
      오버롤: 90,
      골: 18,
      어시: 8,
      기점: 26,
      클린시트: 95,
      주발: "R",
      승률: "65%",
    },
  },
  {
    id: 10,
    name: "쿠르투아",
    team: "벨기에",
    value: "0골",
    image: "/images/player/img_player-10.png",
    position: "GK",
    backNumber: 1,
    ovr: 90,
    stats: {
      출장: 40,
      오버롤: 90,
      골: 0,
      어시: 0,
      기점: 0,
      클린시트: 28,
      주발: "L",
      승률: "72%",
      득점: 0,
      도움: 0,
      공격P: 0,
      MOM3: 8,
      MOM8: 14,
    },
    cumulativeStats: {
      출장: 200,
      오버롤: 90,
      골: 0,
      어시: 1,
      기점: 1,
      클린시트: 120,
      주발: "L",
      승률: "70%",
    },
  },
];

// 카테고리에 맞는 value 표시
const getPlayerValue = (player: Player, category: string) => {
  switch (category) {
    case "OVR":
      return `${player.ovr}`;
    case "출장수":
      return `${player.stats?.출장 || 0}경기`;
    case "득점":
      return `${player.stats?.득점 || 0}골`;
    case "도움":
      return `${player.stats?.도움 || 0}개`;
    case "기점":
      return `${player.stats?.기점 || 0}P`;
    case "공격P":
      return `${player.stats?.공격P || 0}P`;
    case "클린시트":
      return `${player.stats?.클린시트 || 0}회`;
    case "MOM3":
      return `${player.stats?.MOM3 || 0}회`;
    case "승률":
      return `${player.stats?.승률 || "0%"}`;
    default:
      return player.value;
  }
};

// 카테고리별 데이터 (9개 카테고리)
const statsData: Record<string, Player[]> = {
  OVR: [...allPlayers].sort((a, b) => (b.ovr || 0) - (a.ovr || 0)),
  출장수: [...allPlayers].sort(
    (a, b) => (b.stats?.출장 || 0) - (a.stats?.출장 || 0),
  ),
  득점: [...allPlayers].sort(
    (a, b) => (b.stats?.득점 || 0) - (a.stats?.득점 || 0),
  ),
  도움: [...allPlayers].sort(
    (a, b) => (b.stats?.도움 || 0) - (a.stats?.도움 || 0),
  ),
  기점: [...allPlayers].sort(
    (a, b) => (b.stats?.기점 || 0) - (a.stats?.기점 || 0),
  ),
  공격P: [...allPlayers].sort(
    (a, b) => (b.stats?.공격P || 0) - (a.stats?.공격P || 0),
  ),
  클린시트: [...allPlayers].sort(
    (a, b) => (b.stats?.클린시트 || 0) - (a.stats?.클린시트 || 0),
  ),
  MOM3: [...allPlayers].sort(
    (a, b) => (b.stats?.MOM3 || 0) - (a.stats?.MOM3 || 0),
  ),
  승률: [...allPlayers].sort((a, b) => {
    const aRate = parseInt((a.stats?.승률 || "0%").replace("%", "")) || 0;
    const bRate = parseInt((b.stats?.승률 || "0%").replace("%", "")) || 0;
    return bRate - aRate;
  }),
};

function RankingCard({
  title,
  players,
  onMoreClick,
  onPlayerClick,
}: RankingCardProps) {
  const top4Players = players.slice(0, 4);

  return (
    <div className="bg-[#121212] rounded-[24px] p-6 flex flex-col border border-gray-800 min-w-[320px] shrink-0 relative select-none">
      {/* 헤더 */}
      <h3 className="text-xl font-bold text-white text-center mb-8 tracking-wide">
        {title}
      </h3>

      {/* 순위 리스트 */}
      <div className="flex flex-col gap-6 flex-1">
        {top4Players.map((player, index) => (
          <div
            key={player.id}
            className="flex items-center gap-4 cursor-pointer group"
            onClick={() => onPlayerClick?.(player)}
          >
            {/* 순위 */}
            <span
              className={`font-black text-3xl italic w-8 text-center shrink-0 ${index === 0 ? "text-[#D9E021]" : "text-white"}`}
              style={{ fontFamily: "var(--font-oswald, sans-serif)" }}
            >
              {index + 1}
            </span>

            {/* 선수 이미지 */}
            <div className="relative w-12 h-12 shrink-0 rounded-full overflow-hidden">
              <Image
                src={player.image || "/images/ovr.png"}
                alt={player.name}
                fill
                className="object-cover"
              />
            </div>

            {/* 포지션 & 이름 */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <PositionChip
                position={player.position}
                variant="outline"
                className="text-[11px] px-1.5 py-0.5 font-bold border-red-500 text-red-500 bg-transparent shrink-0"
              />
              <span
                className={`font-bold text-base truncate ${index === 0 ? "text-[#D9E021]" : "text-white"}`}
              >
                {player.name}
              </span>
            </div>

            {/* 값 */}
            <span
              className={`font-bold text-xl text-right shrink-0 ${index === 0 ? "text-[#D9E021]" : "text-white"}`}
            >
              {player.value.replace(/[^0-9%]/g, "")}
            </span>
          </div>
        ))}
      </div>

      {/* 더보기 버튼 */}
      <div className="mt-4 pt-0">
        <button
          onClick={onMoreClick}
          className="w-full text-gray-400 text-sm py-4 rounded-xl border border-gray-700/50 hover:bg-gray-800 hover:text-white transition-all bg-[#1a1a1a]"
        >
          더보기
        </button>
      </div>
    </div>
  );
}

// ============================================================
// 선수 테이블 컴포넌트
// ============================================================
interface PlayerTableProps {
  players: Player[];
  onPlayerClick?: (player: Player) => void;
  sortConfig?: { key: string; direction: "asc" | "desc" } | null;
  onSort?: (key: string) => void;
}

function PlayerTable({
  players,
  onPlayerClick,
  sortConfig,
  onSort,
}: PlayerTableProps) {
  const fullColumns = [
    "등수",
    "포지션",
    "등번호",
    "이름",
    "OVR",
    "출장수",
    "득점",
    "도움",
    "기점",
    "공격P",
    "클린시트",
    "MOM3",
    "승률",
  ];
  const sortableColumns = [
    "OVR",
    "출장수",
    "득점",
    "도움",
    "기점",
    "공격P",
    "클린시트",
    "MOM3",
    "승률",
  ];

  const getCellClass = (colName: string) => {
    // 정렬된 컬럼이면 primary 색상 (없으면 OVR 기본)
    if (sortConfig?.key === colName) return "text-primary font-bold";
    if (!sortConfig && colName === "OVR") return "text-primary font-bold";
    return "text-gray-300";
  };

  return (
    <div className="mt-12 overflow-x-auto select-none">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#1a1a1a] border-b border-gray-800">
            {fullColumns.map((col) => (
              <th
                key={col}
                className={`${col === "이름" ? "text-left pl-6" : "text-center"} text-gray-500 font-medium py-3 px-2 whitespace-nowrap text-xs ${sortableColumns.includes(col) ? "cursor-pointer hover:text-white transition-colors" : ""}`}
                onClick={() => sortableColumns.includes(col) && onSort?.(col)}
              >
                {col}
                {sortConfig?.key === col && (
                  <span className="ml-1 text-[10px]">
                    {sortConfig.direction === "asc" ? "▲" : "▼"}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => (
            <tr
              key={player.id}
              className="border-b border-gray-800/50 hover:bg-white/5 transition-colors cursor-pointer group"
              onClick={() => onPlayerClick?.(player)}
            >
              {/* 등수 */}
              <td className="py-4 px-2 text-gray-400 text-center">
                {index + 1}
              </td>
              {/* 포지션 */}
              <td className="py-4 px-2 text-center">
                <PositionChip
                  position={player.position}
                  variant="filled"
                  className="text-[10px] px-1.5 py-0.5"
                />
              </td>
              {/* 등번호 */}
              <td className="py-4 px-2 text-gray-400 text-center">
                {player.backNumber}
              </td>
              {/* 이름 (팀명 제거, 가로 정렬) */}
              <td className="py-4 px-2 pl-6">
                <div className="flex items-center gap-3 justify-start">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                    <Image
                      src={player.image || "/images/ovr.png"}
                      alt={player.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-white font-medium group-hover:text-primary transition-colors text-base whitespace-nowrap">
                    {player.name}
                  </span>
                </div>
              </td>
              {/* 동적 하이라이트 컬럼들 */}
              <td
                className={`py-4 px-2 text-center text-base ${getCellClass("OVR")}`}
              >
                {player.ovr}
              </td>
              <td
                className={`py-4 px-2 text-center text-base ${getCellClass("출장수")}`}
              >
                {player.stats?.출장 || 10}
              </td>
              <td
                className={`py-4 px-2 text-center text-base ${getCellClass("득점")}`}
              >
                {player.stats?.득점 || 7}
              </td>
              <td
                className={`py-4 px-2 text-center text-base ${getCellClass("도움")}`}
              >
                {player.stats?.도움 || 3}
              </td>
              <td
                className={`py-4 px-2 text-center text-base ${getCellClass("기점")}`}
              >
                {player.stats?.기점 || 4}
              </td>
              <td
                className={`py-4 px-2 text-center text-base ${getCellClass("공격P")}`}
              >
                {player.stats?.공격P || 10}
              </td>
              <td
                className={`py-4 px-2 text-center text-base ${getCellClass("클린시트")}`}
              >
                {player.stats?.클린시트 || 2}
              </td>
              <td
                className={`py-4 px-2 text-center text-base ${getCellClass("MOM3")}`}
              >
                {player.stats?.MOM3 || 5}
              </td>
              <td
                className={`py-4 px-2 text-center text-base ${getCellClass("승률")}`}
              >
                {player.stats?.승률 || "40%"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================
// 메인 페이지 컴포넌트
// ============================================================
export default function TeamDataPage() {
  const [activeTab, setActiveTab] = useState("시즌기록");
  const [selectedSeason, setSelectedSeason] = useState("2025 시즌");
  const tabs = ["시즌기록", "통산기록"];

  // 모달 상태
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState("");
  const [modalPlayers, setModalPlayers] = useState<Player[]>([]);

  const [isPlayerDetailOpen, setIsPlayerDetailOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  // 검색
  const [searchTerm, setSearchTerm] = useState("");

  // 정렬
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "desc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "desc"
    ) {
      direction = "asc";
    }
    setSortConfig({ key, direction });
  };

  const sortedPlayers = useMemo(() => {
    let sortablePlayers = [...allPlayers];

    // 검색 필터링
    if (searchTerm.trim()) {
      sortablePlayers = sortablePlayers.filter((p) =>
        p.name.includes(searchTerm.trim()),
      );
    }

    // 정렬
    if (sortConfig !== null) {
      sortablePlayers.sort((a, b) => {
        let aValue: number | string = 0;
        let bValue: number | string = 0;

        // 데이터 매핑
        switch (sortConfig.key) {
          case "OVR":
            aValue = a.ovr;
            bValue = b.ovr;
            break;
          case "출장수":
            aValue = a.stats?.출장 || 0;
            bValue = b.stats?.출장 || 0;
            break;
          case "득점":
            aValue = a.stats?.득점 || 0;
            bValue = b.stats?.득점 || 0;
            break;
          case "도움":
            aValue = a.stats?.도움 || 0;
            bValue = b.stats?.도움 || 0;
            break;
          case "기점":
            aValue = a.stats?.기점 || 0;
            bValue = b.stats?.기점 || 0;
            break;
          case "공격P":
            aValue = a.stats?.공격P || 0;
            bValue = b.stats?.공격P || 0;
            break;
          case "클린시트":
            aValue = a.stats?.클린시트 || 0;
            bValue = b.stats?.클린시트 || 0;
            break;
          case "MOM3":
            aValue = a.stats?.MOM3 || 0;
            bValue = b.stats?.MOM3 || 0;
            break;
          case "승률":
            // "68%" -> 68
            aValue = parseInt(
              (a.stats?.승률 || "0").toString().replace("%", ""),
            );
            bValue = parseInt(
              (b.stats?.승률 || "0").toString().replace("%", ""),
            );
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return sortablePlayers;
  }, [allPlayers, sortConfig, searchTerm]);

  // 스크롤 관련
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
    }
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener("resize", checkScrollButtons);
    return () => window.removeEventListener("resize", checkScrollButtons);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340; // Card width + gap
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      // 스크롤 이벤트가 끝난 후 버튼 상태 업데이트를 위해 setTimeout 사용
      setTimeout(checkScrollButtons, 300);
    }
  };

  // 드래그 앤 드롭 스크롤 핸들러
  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const onMouseLeave = () => {
    setIsDragging(false);
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // 스크롤 속도 조절
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    checkScrollButtons();
  };

  // 더보기 클릭
  const handleMoreClick = (category: string, players: Player[]) => {
    setModalCategory(category);
    setModalPlayers(
      players.map((p) => ({ ...p, value: getPlayerValue(p, category) })),
    );
    setIsStatsModalOpen(true);
  };

  // 선수 클릭
  const handlePlayerClick = (player: Player) => {
    setSelectedPlayer(player);
    setIsPlayerDetailOpen(true);
  };

  // 검색
  const handleSearch = () => {
    if (searchTerm.trim()) {
      const player = allPlayers.find((p) => p.name.includes(searchTerm.trim()));
      if (player) {
        handlePlayerClick(player);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <main className="max-w-[1400px] mx-auto px-4 py-6 md:px-8 md:py-8">
        {/* 페이지 헤더 */}
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            팀 데이터
          </h1>
          <button className="flex items-center gap-2 bg-[#1a1a1a] border border-gray-800 rounded-full px-4 py-1.5 text-white text-sm hover:bg-gray-800 transition-colors">
            {selectedSeason}
            <span className="text-gray-400">▼</span>
          </button>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex gap-6 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-1 text-base md:text-lg font-bold transition-colors ${
                activeTab === tab
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 순위 카드 그리드 - 투명 배경, 스크롤 버튼 */}
        <div className="relative group">
          {/* PC에서만 보이는 왼쪽 스크롤 버튼 */}
          {showLeftArrow && (
            <button
              onClick={() => scroll("left")}
              className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#D9E021] rounded-full items-center justify-center shadow-lg hover:bg-[#c5cc1f] transition-all z-20 opacity-0 group-hover:opacity-100 duration-300"
              aria-label="Previous"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="black"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}

          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide md:mx-0 md:pl-0 md:pr-40 cursor-grab active:cursor-grabbing"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onMouseDown={onMouseDown}
            onMouseLeave={onMouseLeave}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            onScroll={checkScrollButtons}
          >
            {Object.entries(statsData).map(([title, players]) => (
              <RankingCard
                key={title}
                title={title}
                players={players.map((p) => ({
                  ...p,
                  value: getPlayerValue(p, title),
                }))}
                onMoreClick={() => handleMoreClick(title, players)}
                onPlayerClick={handlePlayerClick}
              />
            ))}
          </div>

          {/* PC에서만 보이는 오른쪽 스크롤 버튼 */}
          {showRightArrow && (
            <button
              onClick={() => scroll("right")}
              className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-[#D9E021] rounded-full items-center justify-center shadow-lg hover:bg-[#c5cc1f] transition-all z-20 opacity-0 group-hover:opacity-100 duration-300"
              aria-label="Next"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="black"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          )}
        </div>

        {/* 검색 박스 - 모바일 (버튼 분리) */}
        <div className="md:hidden flex w-full items-center gap-3 mb-6 mt-8">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="선수 검색"
            className="flex-1 bg-[#1a1a1a] border border-gray-800 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors placeholder:text-gray-500"
          />
          <button
            onClick={handleSearch}
            className="bg-[#1a1a1a] border border-gray-800 rounded-lg px-5 py-3 text-gray-400 text-sm hover:bg-gray-800 hover:text-white transition-colors whitespace-nowrap font-medium"
          >
            검색
          </button>
        </div>

        {/* 검색 박스 - PC (기존 디자인: 아이콘 포함, 왼쪽 정렬) */}
        <div className="hidden md:flex justify-start gap-2 mb-4 mt-8">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="선수 검색"
              className="w-64 bg-[#1a1a1a] border border-gray-800 rounded-lg pl-4 pr-10 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-colors"
            />
            <button
              onClick={handleSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>
        </div>

        {/* 선수 테이블 */}
        <PlayerTable
          players={sortedPlayers}
          onPlayerClick={handlePlayerClick}
          sortConfig={sortConfig}
          onSort={handleSort}
        />
      </main>

      {/* 선수 상세 모달 */}
      <PlayerDetailModal
        isOpen={isPlayerDetailOpen}
        onClose={() => setIsPlayerDetailOpen(false)}
        player={selectedPlayer}
      />

      {/* 더보기 통계 모달 */}
      <StatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        category={modalCategory}
        players={modalPlayers}
        onPlayerClick={handlePlayerClick}
      />

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
