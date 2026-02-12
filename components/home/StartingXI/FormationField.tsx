"use client";

import React from "react";
import Image from "next/image";
import PlayerPositionCard from "./PlayerPositionCard";
import { Player } from "@/types/player";

interface FormationPosition {
    top: string;
    left: string;
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
    11: { top: "18%", left: "50%" },     // ST
};

interface FormationFieldProps {
    players: Player[];
    handleDragStart: (e: React.DragEvent, player: Player) => void;
    handleDrop: (e: React.DragEvent, player: Player) => void;
    handleDragOver: (e: React.DragEvent) => void;
    onPlayerSelect?: (player: Player) => void;
}

const FormationField = ({
    players,
    handleDragStart,
    handleDrop,
    handleDragOver,
    onPlayerSelect,
    className
}: FormationFieldProps & { className?: string }) => (
    <div className={`relative w-full rounded-2xl overflow-hidden ${className}`}>
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
                        onClick={() => onPlayerSelect && onPlayerSelect(player)}
                    />
                </div>
            );
        })}
    </div>
);

export default FormationField;
