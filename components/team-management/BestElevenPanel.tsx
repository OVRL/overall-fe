"use client";

import { useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { Position } from "@/types/position";
import PositionChip from "@/components/PositionChip";

// 포메이션 타입
type Formation = "4-4-2" | "4-3-3" | "4-2-3-1" | "3-5-2" | "5-3-2";

const formations: { id: Formation; label: string }[] = [
    { id: "4-4-2", label: "4-4-2" },
    { id: "4-3-3", label: "4-3-3" },
    { id: "4-2-3-1", label: "4-2-3-1" },
    { id: "3-5-2", label: "3-5-2" },
    { id: "5-3-2", label: "5-3-2" },
];

// 포메이션 위치 (4-2-3-1 기준)
interface FormationPosition {
    top: string;
    left: string;
    position: Position;
}

const FORMATION_POSITIONS: FormationPosition[] = [
    { top: "90%", left: "50%", position: "GK" },
    { top: "75%", left: "10%", position: "LB" },
    { top: "75%", left: "35%", position: "CB" },
    { top: "75%", left: "65%", position: "CB" },
    { top: "75%", left: "90%", position: "RB" },
    { top: "55%", left: "25%", position: "CDM" },
    { top: "55%", left: "75%", position: "CDM" },
    { top: "40%", left: "50%", position: "CAM" },
    { top: "20%", left: "15%", position: "LW" },
    { top: "20%", left: "85%", position: "RW" },
    { top: "18%", left: "50%", position: "ST" },
];

interface PlayerSlot {
    position: Position;
    playerId: string | null;
    playerName: string | null;
    playerImage: string | null;
}

// Mock 선수 목록
const availablePlayers = [
    { id: "1", name: "박무트", image: "/images/player/img_player-1.png", position: "GK" as Position, ovr: 90, goals: 0, assists: 2 },
    { id: "2", name: "호남두", image: "/images/player/img_player-2.png", position: "LB" as Position, ovr: 88, goals: 3, assists: 8 },
    { id: "3", name: "가깝밤베스", image: "/images/player/img_player-3.png", position: "CB" as Position, ovr: 89, goals: 2, assists: 1 },
    { id: "4", name: "다라에밤베스", image: "/images/player/img_player-4.png", position: "CB" as Position, ovr: 87, goals: 1, assists: 0 },
    { id: "5", name: "박무트", image: "/images/player/img_player-5.png", position: "RB" as Position, ovr: 85, goals: 1, assists: 5 },
    { id: "6", name: "렌디", image: "/images/player/img_player-6.png", position: "CDM" as Position, ovr: 86, goals: 2, assists: 3 },
    { id: "7", name: "제스퍼", image: "/images/player/img_player-7.png", position: "CDM" as Position, ovr: 84, goals: 1, assists: 2 },
    { id: "8", name: "알베스", image: "/images/player/img_player-8.png", position: "CAM" as Position, ovr: 99, goals: 15, assists: 20 },
    { id: "9", name: "수원알베스", image: "/images/player/img_player-9.png", position: "ST" as Position, ovr: 95, goals: 25, assists: 10 },
    { id: "10", name: "박무트", image: "/images/player/img_player-10.png", position: "ST" as Position, ovr: 82, goals: 8, assists: 3 },
    { id: "11", name: "박무트", image: "/images/player/img_player-11.png", position: "LW" as Position, ovr: 80, goals: 5, assists: 4 },
];

// 초기 슬롯
const initialSlots: PlayerSlot[] = FORMATION_POSITIONS.map((fp) => ({
    position: fp.position,
    playerId: null,
    playerName: null,
    playerImage: null,
}));

// 정렬 타입
type SortType = "ovr" | "goals" | "assists";

export default function BestElevenPanel() {
    const [formation, setFormation] = useState<Formation>("4-2-3-1");
    const [slots, setSlots] = useState<PlayerSlot[]>(initialSlots);
    const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(null);
    const [sortType, setSortType] = useState<SortType>("ovr");

    const handleSlotClick = (index: number) => {
        setSelectedSlotIndex(index === selectedSlotIndex ? null : index);
    };

    const handlePlayerSelect = (player: typeof availablePlayers[0]) => {
        if (selectedSlotIndex === null) return;

        setSlots(prev =>
            prev.map((slot, i) =>
                i === selectedSlotIndex
                    ? { ...slot, playerId: player.id, playerName: player.name, playerImage: player.image }
                    : slot
            )
        );
        setSelectedSlotIndex(null);
    };

    const sortedPlayers = [...availablePlayers].sort((a, b) => {
        if (sortType === "ovr") return b.ovr - a.ovr;
        if (sortType === "goals") return b.goals - a.goals;
        return b.assists - a.assists;
    });

    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-white">베스트 11</h3>
                <Button variant="primary" className="text-xs px-3 py-1.5">저장</Button>
            </div>

            {/* 포메이션 선택 */}
            <div className="flex gap-1.5 mb-3">
                {formations.map((f) => (
                    <button
                        key={f.id}
                        onClick={() => setFormation(f.id)}
                        className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${formation === f.id
                                ? "bg-primary text-black"
                                : "bg-surface-tertiary text-gray-400 hover:text-white"
                            }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* 필드 뷰 - /home StartingXI와 동일 */}
                <div className="lg:col-span-2 relative aspect-3/4 md:aspect-video rounded-xl overflow-hidden">
                    <Image
                        src="/images/object_field.png"
                        alt="Soccer Field"
                        fill
                        className="object-cover"
                        priority
                    />

                    {/* 선수 배치 */}
                    {slots.map((slot, index) => {
                        const fp = FORMATION_POSITIONS[index];
                        return (
                            <button
                                key={index}
                                onClick={() => handleSlotClick(index)}
                                className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center transition-transform hover:scale-105 ${selectedSlotIndex === index ? "ring-2 ring-primary rounded-lg" : ""
                                    }`}
                                style={{ top: fp.top, left: fp.left }}
                            >
                                <div className="relative w-10 h-14 md:w-14 md:h-20 rounded overflow-hidden bg-black/50">
                                    {slot.playerImage ? (
                                        <Image src={slot.playerImage} alt={slot.playerName || ""} fill className="object-contain object-bottom" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-500 text-lg">?</div>
                                    )}
                                </div>
                                <span className="text-[10px] md:text-xs text-white bg-black/70 px-1 rounded mt-0.5">
                                    {slot.playerName || fp.position}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* 선수 선택 패널 */}
                <div className="bg-surface-tertiary rounded-lg p-3">
                    <h4 className="text-sm font-bold text-white mb-2">선수 선택</h4>

                    {/* 정렬 옵션 */}
                    <div className="flex gap-1 mb-3">
                        {(["ovr", "goals", "assists"] as const).map((type) => (
                            <button
                                key={type}
                                onClick={() => setSortType(type)}
                                className={`px-2 py-0.5 rounded text-xs ${sortType === type ? "bg-primary text-black" : "bg-surface-secondary text-gray-400"
                                    }`}
                            >
                                {type === "ovr" ? "OVR순" : type === "goals" ? "골순" : "어시순"}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-1 max-h-[280px] overflow-y-auto">
                        {sortedPlayers.map((player) => (
                            <button
                                key={player.id}
                                onClick={() => handlePlayerSelect(player)}
                                disabled={selectedSlotIndex === null}
                                className={`w-full flex items-center gap-2 p-1.5 rounded transition-colors ${selectedSlotIndex !== null ? "hover:bg-white/10" : "opacity-50"
                                    }`}
                            >
                                <div className="relative w-7 h-7 rounded-full overflow-hidden bg-gray-700">
                                    <Image src={player.image} alt={player.name} fill className="object-cover" />
                                </div>
                                <span className="text-white text-xs flex-1 text-left">{player.name}</span>
                                <PositionChip position={player.position} variant="filled" className="text-[9px] px-1 py-0" />
                                <span className="text-primary text-xs font-bold w-6 text-right">{player.ovr}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
