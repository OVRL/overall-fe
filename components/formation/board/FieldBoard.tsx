"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Player, FormationType } from "@/types/formation";
import { FORMATIONS } from "@/constants/formation";
import PlayerMarker from "./PlayerMarker";
import { cn } from "@/lib/utils";

interface FieldBoardProps {
  quarterId: number;
  label?: string;
  lineup: Record<number, Player | null>;
  formation?: FormationType;
  onUpdate: (pos: number, player: Player | null) => void;
  onSwap: (pos1: number, pos2: number) => void;
  onPositionClick?: (pos: number) => void;
  selectedListPlayer: Player | null;
  onPlaceListPlayer: (pos: number) => void;
  onRemoveTeam?: () => void;
  onExpand?: () => void;
  teamColor?: "blue" | "red" | "green" | "purple";
  className?: string; // For custom styling/sizing
}

const FieldBoard: React.FC<FieldBoardProps> = ({
  quarterId,
  label,
  lineup,
  formation = "4-2-3-1",
  onUpdate,
  onSwap,
  onPositionClick,
  selectedListPlayer,
  onPlaceListPlayer,
  onRemoveTeam,
  onExpand,
  teamColor,
  className,
}) => {
  const [selectedPos, setSelectedPos] = useState<number | null>(null);

  // @ts-ignore - FORMATIONS may allow string indexing or we cast formation
  const positions = FORMATIONS[formation] || FORMATIONS["4-2-3-1"];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: React.DragEvent, posId: number) => {
    e.preventDefault();
    const playerData = e.dataTransfer.getData("player");
    if (playerData) {
      try {
        const player = JSON.parse(playerData) as Player;
        onUpdate(posId, player);
      } catch (err) {
        console.error("Failed to parse player data", err);
      }
    }
  };

  const handleRemove = (e: React.MouseEvent, posId: number) => {
    e.stopPropagation();
    onUpdate(posId, null);
  };

  const handleClick = (e: React.MouseEvent, posId: number) => {
    e.stopPropagation();

    // 1. If a list player is selected (Mobile Tap-to-Place mode)
    if (selectedListPlayer) {
      onPlaceListPlayer(posId);
      return;
    }

    // 2. Normal Board Interaction (Swap / Search)
    if (selectedPos === null) {
      // First click
      const player = lineup[posId];
      if (player) {
        // Select for swap
        setSelectedPos(posId);
      } else {
        // Empty slot -> Open Search Modal
        onPositionClick?.(posId);
      }
    } else {
      // Second click (Swap target)
      if (selectedPos === posId) {
        // Clicked same player -> Deselect
        setSelectedPos(null);
      } else {
        // Perform Swap
        onSwap(selectedPos, posId);
        setSelectedPos(null);
      }
    }
  };

  // Color theme logic
  const getBorderColor = () => {
    if (teamColor === "blue") return "border-blue-500";
    if (teamColor === "red") return "border-red-500";
    if (teamColor === "green") return "border-green-500";
    if (teamColor === "purple") return "border-purple-500";
    return "border-[#333]"; // Default dark border
  };

  return (
    <div
      className={cn(
        "rounded-2xl overflow-hidden bg-[#1a1a1a] shadow-lg relative flex flex-col",
        "border",
        getBorderColor(),
        className,
      )}
      onClick={() => setSelectedPos(null)} // Deselect on background click
    >
      {/* Header (Optional) */}
      {label && (
        <div className="bg-[#252525] px-4 py-3 flex justify-between items-center z-10 relative">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-white text-sm md:text-base">
              {label}
            </h3>
            {onExpand && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onExpand();
                }}
                className="bg-[#3e3e3e] hover:bg-white hover:text-black text-gray-300 rounded px-2 py-0.5 text-xs font-medium transition-colors ml-2"
              >
                관리
              </button>
            )}
            {onRemoveTeam && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveTeam();
                }}
                className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-full w-6 h-6 flex items-center justify-center text-xs transition-colors ml-1"
                title="팀 삭제"
              >
                ✕
              </button>
            )}
          </div>
          <div className="bg-[#1a1a1a] px-3 py-1 rounded-lg border border-[#333] flex items-center gap-2">
            <span className="text-xs text-[#a6a5a5]">{formation}</span>
            {/* Icon could go here */}
          </div>
        </div>
      )}

      {/* Field Area */}
      <div className="relative w-full aspect-3/4 md:aspect-video flex-1">
        {/* Field Background */}
        <Image
          src="/images/object_field.png"
          alt="Field"
          fill
          className="object-cover opacity-80" // Slightly darkened
          draggable={false}
        />

        {/* Player Markers */}
        {Object.entries(positions).map(([key, pos]) => {
          const posId = parseInt(key);
          const player = lineup[posId] || null;
          // @ts-ignore - pos type
          const { top, left, role } = pos;

          return (
            <div
              key={posId}
              className="absolute"
              style={{ top, left }}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, posId)}
            >
              <PlayerMarker
                posId={posId}
                player={player}
                positionRole={role}
                isSelected={selectedPos === posId}
                isSwapTarget={selectedPos !== null && selectedPos !== posId}
                isPlacementTarget={selectedListPlayer !== null}
                onClick={(e) => handleClick(e, posId)}
                onRemove={(e) => handleRemove(e, posId)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FieldBoard;
