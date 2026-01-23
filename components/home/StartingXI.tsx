"use client";

import React, { useState } from "react";
import Image from "next/image";
import PlayerPositionCard from "./PlayerPositionCard";

interface Player {
    id: number;
    name: string;
    position: string;
    number: number;
    overall: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defending: number;
    physical: number;
    pace: number;
}

interface FormationPosition {
    top: string;
    left: string;
}

interface StartingXIProps {
    players: Player[];
    onPlayersChange: (players: Player[]) => void;
}

// 포메이션 위치 (4-2-3-1)
const FORMATION_POSITIONS: Record<number, FormationPosition> = {
    1: { top: "90%", left: "50%" },      // GK
    2: { top: "75%", left: "10%" },      // LB
    3: { top: "75%", left: "35%" },      // CB
    4: { top: "75%", left: "65%" },      // CB
    5: { top: "75%", left: "90%" },      // RB
    6: { top: "55%", left: "25%" },      // CDM
    7: { top: "55%", left: "75%" },      // CDM
    8: { top: "40%", left: "50%" },      // CAM
    9: { top: "20%", left: "15%" },      // LW
    10: { top: "20%", left: "85%" },     // RW
    11: { top: "13%", left: "50%" },     // ST
};

/**
 * 포메이션 탭 버튼 그룹
 */
const FormationTabs = ({
    activeTab,
    onTabChange
}: {
    activeTab: string;
    onTabChange: (tab: string) => void;
}) => (
    <div className="flex gap-1 md:gap-4 flex-nowrap">
        {["대표", "A", "B", "C"].map((tab) => (
            <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`px-2 xs:px-3 md:px-5 py-1.5 md:py-2 rounded-lg text-[10px] xs:text-xs md:text-sm font-bold transition-colors whitespace-nowrap ${activeTab === tab
                    ? "bg-primary text-black"
                    : "bg-transparent border border-gray-700 text-gray-500 hover:border-gray-500"
                    }`}
            >
                {tab}
            </button>
        ))}
    </div>
);

/**
 * 헤더 컴포넌트
 */
const FormationHeader = ({
    activeTab,
    setActiveTab
}: {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}) => (
    <div className="flex items-center justify-between mb-4 md:mb-5">
        <h2 className="text-lg xs:text-xl md:text-[28px] font-black text-white whitespace-nowrap">STARTING XI</h2>
        <FormationTabs activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
);

/**
 * 필드 및 선수 배치 컴포넌트
 */
const FormationField = ({
    players,
    handleDragStart,
    handleDrop,
    handleDragOver
}: {
    players: Player[];
    handleDragStart: (e: React.DragEvent, player: Player) => void;
    handleDrop: (e: React.DragEvent, player: Player) => void;
    handleDragOver: (e: React.DragEvent) => void;
}) => (
    <div className="relative w-full aspect-[3/4] md:aspect-[16/9] rounded-2xl overflow-hidden">
        {/* 필드 이미지 배경 */}
        <Image
            src="/images/object_field.png"
            alt="Soccer Field"
            fill
            className="object-cover"
            priority
        />

        {/* 선수 배치 */}
        {players.slice(0, 11).map((player, index) => {
            const position = FORMATION_POSITIONS[index + 1];
            return (
                <div
                    key={player.id}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                    style={{ top: position.top, left: position.left }}
                >
                    <PlayerPositionCard
                        player={player}
                        onDragStart={(e) => handleDragStart(e, player)}
                        onDrop={(e) => handleDrop(e, player)}
                        onDragOver={handleDragOver}
                    />
                </div>
            );
        })}
    </div>
);

/**
 * 감독 스탯 정보
 */
const ManagerStatItem = ({ label, value }: { label: string; value: string }) => (
    <div>
        <p className="text-gray-500 text-xs md:text-sm">{label}</p>
        <p className="text-white font-bold text-sm md:text-base">{value}</p>
    </div>
);

/**
 * 감독 스탯 정보
 */
const ManagerStats = () => (
    <div className="flex gap-2 xs:gap-4 md:gap-8 text-center flex-nowrap">
        <ManagerStatItem label="경기수" value="30" />
        <ManagerStatItem label="승/무/패" value="20/5/5" />
        <ManagerStatItem label="팀 승률" value="60%" />
    </div>
);

/**
 * 감독 정보 섹션
 */
const ManagerInfo = () => (
    <div className="flex items-center justify-center gap-2 md:gap-6 mt-4 md:mt-5 flex-nowrap overflow-x-visible">
        {/* 감독 사진 */}
        <div className="relative flex-shrink-0">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-surface-tertiary rounded-full border-2 border-gray-700 overflow-hidden relative">
                <Image
                    src="/images/ovr.png"
                    alt="Manager"
                    fill
                    className="object-cover"
                />
            </div>
            <div className="absolute -top-1 -right-1 bg-gray-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold">
                30
            </div>
        </div>

        {/* 감독 정보 */}
        <div className="text-left">
            <p className="text-gray-500 text-xs md:text-sm">감독</p>
            <p className="text-white font-bold text-base md:text-lg">정태우</p>
        </div>

        {/* 스탯 */}
        <ManagerStats />
    </div>
);

/**
 * 포메이션 컴포넌트
 */
const StartingXI = ({ players, onPlayersChange }: StartingXIProps) => {
    const [draggedPlayer, setDraggedPlayer] = useState<Player | null>(null);
    const [activeTab, setActiveTab] = useState("대표");

    const handleDragStart = (e: React.DragEvent, player: Player) => {
        setDraggedPlayer(player);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDrop = (e: React.DragEvent, targetPlayer: Player) => {
        e.preventDefault();
        if (!draggedPlayer || draggedPlayer.id === targetPlayer.id) return;

        const newPlayers = players.map(p => {
            if (p.id === draggedPlayer.id) return { ...targetPlayer, id: draggedPlayer.id };
            if (p.id === targetPlayer.id) return { ...draggedPlayer, id: targetPlayer.id };
            return p;
        });

        onPlayersChange(newPlayers);
        setDraggedPlayer(null);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    return (
        <div className="bg-surface-secondary rounded-[20px] p-4 md:p-6">
            <FormationHeader activeTab={activeTab} setActiveTab={setActiveTab} />

            <FormationField
                players={players}
                handleDragStart={handleDragStart}
                handleDrop={handleDrop}
                handleDragOver={handleDragOver}
            />

            <ManagerInfo />
        </div>
    );
};

export default StartingXI;
