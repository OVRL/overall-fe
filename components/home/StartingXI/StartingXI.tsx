"use client";

import React, { useState } from "react";
import { Player } from "@/types/player";
import FormationHeader from "./FormationHeader";
import FormationField from "./FormationField";
import ManagerInfo from "./ManagerInfo";

interface StartingXIProps {
    players: Player[];
    onPlayersChange: (players: Player[]) => void;
    onPlayerSelect?: (player: Player) => void;
}

/**
 * 포메이션 컴포넌트
 */
const StartingXI = ({ players, onPlayersChange, onPlayerSelect }: StartingXIProps) => {
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
        <div className="bg-[#1A1A1A] rounded-[1.25rem] p-4 md:p-6">
            <FormationHeader activeTab={activeTab} setActiveTab={setActiveTab} />

            <FormationField
                players={players}
                handleDragStart={handleDragStart}
                handleDrop={handleDrop}
                handleDragOver={handleDragOver}
                onPlayerSelect={onPlayerSelect}
            />

            <ManagerInfo />
        </div>
    );
};

export default StartingXI;
