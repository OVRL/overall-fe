import React from "react";
import { Player } from "@/types/formation";
import ProfileAvatar from "@/components/ui/ProfileAvatar";
import PositionChip from "@/components/PositionChip";
import QuarterChip from "@/components/ui/QuarterChip";
import { Position } from "@/types/position";

interface FormationPlayerRowProps {
  player: Player;
  currentTeam: string | null;
  isSelected: boolean;
  activeQuarters?: number[]; // Added prop
  onSelect: (player: Player) => void;
  onDragStart: (e: React.DragEvent, player: Player) => void;
  onRemove: (e: React.MouseEvent, player: Player) => void;
}

const FormationPlayerRow: React.FC<FormationPlayerRowProps> = ({
  player,
  currentTeam,
  isSelected,
  activeQuarters = [], // Default to empty
  onSelect,
  onDragStart,
  onRemove,
}) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, player)}
      onClick={() => onSelect(player)}
      className={`max-h-12 group relative flex items-center w-full px-4  gap-x-4 bg-gray-1100 rounded-xl border transition-all cursor-pointer select-none overflow-hidden ${
        isSelected
          ? "border-primary shadow-[0_0_15px_rgba(59,130,246,0.5)] border-2 z-10"
          : "border-transparent hover:bg-surface-secondary"
      }`}
    >
      {/* Team Indicator (Left Border) */}
      {currentTeam && (
        <div
          className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-[10px] ${
            currentTeam === "A"
              ? "bg-blue-500"
              : currentTeam === "B"
                ? "bg-red-500"
                : currentTeam === "C"
                  ? "bg-green-500"
                  : "bg-purple-500"
          }`}
        />
      )}

      {/* Profile Avatar */}
      <div className="flex items-center gap-2">
        <ProfileAvatar
          src="/images/player/img_player.png"
          alt={player.name}
          size={48}
          className="bg-gray-1100"
        />
        <div className="flex gap-x-1 items-center">
          <div className="w-10.5 flex justify-center items-center">
            <PositionChip
              position={player.position as Position}
              variant="outline"
            />
          </div>
          <span className="text-Label-Primary text-sm w-18.75 truncate">
            {player.name}
          </span>
        </div>
      </div>

      <span className="w-13.25 text-center text-sm font-bold text-Label-AccentPrimary whitespace-nowrap">
        OVR {player.overall}
      </span>

      <QuarterChip quarters={activeQuarters} />
    </div>
  );
};

export default FormationPlayerRow;
