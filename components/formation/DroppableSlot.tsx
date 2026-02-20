import React from "react";
import { useDroppable } from "@dnd-kit/core";
import QuarterButton from "../ui/QuarterButton";
import FormationPlayerImageThumbnail from "./FormationPlayerImageThumbnail";
import { Player } from "@/types/formation";
import { cn } from "@/lib/utils";

interface DroppableSlotProps {
  quarterId: number;
  index: number;
  positionName: string;
  player: Player | null;
  selectedPlayer: Player | null;
  isActive: boolean;
  onPositionSelect: () => void;
  onPlayerRemove: () => void;
}

const DroppableSlot: React.FC<DroppableSlotProps> = ({
  quarterId,
  index,
  positionName,
  player,
  selectedPlayer,
  isActive,
  onPositionSelect,
  onPlayerRemove,
}) => {
  // Unique ID for the droppable area, so we know exactly where a player is dropped
  const id = `quarter-${quarterId}-pos-${index}`;

  const { isOver, setNodeRef } = useDroppable({
    id,
    data: {
      type: "QuarterSlot",
      quarterId,
      positionIndex: index,
      positionName,
    },
  });

  // Provide visual feedback when a draggable item is hovering over this slot
  const isHovered = isOver && !player;
  const isSelected = player?.id === selectedPlayer?.id;

  return (
    <div ref={setNodeRef} className="relative group">
      {player ? (
        <FormationPlayerImageThumbnail
          imgUrl={player.image || "/images/player/img_player.png"}
          playerName={player.name}
          playerSeason={player.season}
          isSelected={isSelected}
          onDelete={onPlayerRemove}
          className="transition-transform hover:scale-110 bg-transparent"
        />
      ) : (
        <QuarterButton
          variant={isActive ? "selected" : "assistive"}
          size="sm"
          className={cn(
            "shadow-lg transition-transform hover:scale-110",
            isHovered
              ? "ring-2 ring-Fill-AccentPrimary bg-surface-card/90"
              : "bg-surface-card/80",
          )}
          onClick={onPositionSelect}
        >
          <span className="text-sm font-bold">{positionName}</span>
        </QuarterButton>
      )}
    </div>
  );
};

export default DroppableSlot;
