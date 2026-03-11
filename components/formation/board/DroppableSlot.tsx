import React from "react";
import { useDroppable, useDraggable } from "@dnd-kit/core";
import QuarterButton from "../../ui/QuarterButton";
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
  const id = `quarter-${quarterId}-pos-${index}`;
  const draggableId = `draggable-quarter-${quarterId}-pos-${index}`;

  const { isOver, setNodeRef: setDroppableRef } = useDroppable({
    id,
    data: {
      type: "QuarterSlot",
      quarterId,
      positionIndex: index,
      positionName,
    },
  });

  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    isDragging,
  } = useDraggable({
    id: draggableId,
    data: {
      type: "BoardPlayer",
      player,
      sourceQuarterId: quarterId,
      sourcePositionIndex: index,
    },
    disabled: !player,
  });

  // Provide visual feedback when a draggable item is hovering over this slot
  const isHovered = isOver && !player;
  const isSelected = player?.id === selectedPlayer?.id;

  return (
    <div ref={setDroppableRef} className="relative group z-0">
      {player ? (
        <div
          ref={setDraggableRef}
          {...attributes}
          {...listeners}
          className={cn("touch-none", isDragging ? "opacity-50" : "")}
        >
          <FormationPlayerImageThumbnail
            imgUrl={player.image || "/images/player/img_player_2.webp"}
            playerName={player.name}
            playerSeason={player.season}
            isSelected={isSelected}
            onDelete={onPlayerRemove}
            className="transition-transform hover:scale-110 bg-transparent"
          />
        </div>
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
          aria-label={
            selectedPlayer
              ? `${selectedPlayer.name}을(를) ${positionName} 포지션에 배치`
              : undefined
          }
        >
          <span className="text-sm font-bold">{positionName}</span>
        </QuarterButton>
      )}
    </div>
  );
};

export default DroppableSlot;
