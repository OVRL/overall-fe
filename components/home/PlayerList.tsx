"use client";

import React, { useState } from "react";
import Image from "next/image";
import PositionChip from "@/components/PositionChip";
import SeasonChip from "@/components/ui/SeasonChip";
import type { Position } from "@/components/PositionChip";

interface Player {
    id: number;
    name: string;
    position: string;
    number: number;
    overall: number;
    nationality?: string;
    image?: string;
    season?: string;
    seasonType?: "general" | "worldBest";
}

const DEFAULT_PLAYER_IMAGE = "/images/ovr.png";

/**
 * 탭 메뉴 컴포넌트
 */
const PLAYER_LIST_TABS = ["전체", "선발", "교체", "OVR"] as const;

/**
 * 탭 메뉴 컴포넌트
 */
const PlayerListTabs = ({
    activeTab,
    onTabChange
}: {
    activeTab: string;
    onTabChange: (tab: string) => void;
}) => (
    <div className="flex gap-2 mb-4 bg-surface-primary p-1 rounded-xl">
        {PLAYER_LIST_TABS.map((tab) => (
            <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`flex-1 py-1.5 md:py-2 px-2 md:px-4 rounded-lg text-xs md:text-sm font-semibold transition-colors ${activeTab === tab
                    ? "bg-surface-tertiary text-white"
                    : "text-gray-500 hover:text-gray-300"
                    }`}
            >
                {tab}
            </button>
        ))}
    </div>
);

/**
 * 테이블 헤더 컴포넌트
 */
const PlayerListHeader = () => (
    <div className="grid grid-cols-[45px_30px_1fr_45px] md:grid-cols-[60px_50px_1fr_50px] items-center gap-1 md:gap-4 px-2 md:px-3 py-2 text-gray-500 text-xs md:text-xs border-b border-gray-800 whitespace-nowrap">
        <span>포지션</span>
        <span className="text-center">등번호</span>
        <span>선수명</span>
        <span className="text-right">OVR</span>
    </div>
);

/**
 * 개별 선수 아이템 컴포넌트
 */
const PlayerListItem = ({ player }: { player: Player }) => {
    const [imageError, setImageError] = useState(false);
    const playerImage = imageError || !player.image ? DEFAULT_PLAYER_IMAGE : player.image;

    return (
        <div className="grid grid-cols-[45px_30px_1fr_45px] md:grid-cols-[60px_50px_1fr_50px] items-center gap-1 md:gap-4 py-1.5 md:py-2 px-2 md:px-3 hover:bg-gray-800/30 transition-colors">
            {/* 포지션 배지 */}
            <div className="flex justify-center">
                <PositionChip position={player.position as Position} variant="filled" />
            </div>

            {/* 등번호 */}
            <span className="text-white font-bold text-center text-sm md:text-base">{player.number}</span>

            {/* 선수 정보 */}
            <div className="flex items-center gap-2 md:gap-3">
                {/* 선수 이미지 */}
                <div className="relative w-8 h-12 md:w-12 md:h-16 flex-shrink-0">
                    <Image
                        src={playerImage}
                        alt={player.name}
                        fill
                        className="object-contain"
                        onError={() => setImageError(true)}
                    />
                </div>

                {/* 연도 배지 */}
                <SeasonChip
                    season={player.season || "26"}
                    type={player.seasonType || "general"}
                />

                {/* 선수 이름 */}
                <span className="text-white font-medium truncate text-xs md:text-base">{player.name}</span>
            </div>

            {/* OVR */}
            <div className="flex justify-end min-w-[30px]">
                <span className="text-primary font-bold text-base md:text-lg">{player.overall}</span>
            </div>
        </div>
    );
};

/**
 * 선수 목록 리스트 컴포넌트
 */
const PlayerList = ({ players }: { players: Player[] }) => {
    const [activeTab, setActiveTab] = useState("전체");

    return (
        <div className="bg-surface-secondary rounded-[20px] p-4 md:p-5 mt-4 md:mt-5">
            <PlayerListTabs activeTab={activeTab} onTabChange={setActiveTab} />
            <PlayerListHeader />

            <div className="divide-y divide-gray-800/50">
                {players.map((player) => (
                    <PlayerListItem key={player.id} player={player} />
                ))}
            </div>
        </div>
    );
};

export default PlayerList;
