import React from "react";
import Image from "next/image";
import { Player } from "@/types/formation";
import { cn } from "@/lib/utils";

interface PlayerMarkerProps {
  player: Player | null;
  positionRole: string;
  isSelected?: boolean;
  isSwapTarget?: boolean;
  isPlacementTarget?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onRemove?: (e: React.MouseEvent) => void;
  className?: string;
  style?: React.CSSProperties;
  posId: number;
}

const PlayerMarker: React.FC<PlayerMarkerProps> = ({
  player,
  positionRole,
  isSelected,
  isSwapTarget,
  isPlacementTarget,
  onClick,
  onRemove,
  className,
  style,
  posId,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer select-none",
        isSelected ? "scale-110 z-20" : "hover:scale-105",
        isSwapTarget ? "hover:scale-110 hover:opacity-100" : "",
        isPlacementTarget ? "animate-pulse" : "",
        // Default size logic (Mobile vs Desktop)
        "w-16 h-20 md:w-20 md:h-24",
        className,
      )}
      style={style}
      // Drag events are handled by the parent container usually, but native drag needs draggable attribute
      // The parent FieldBoard will likely wrap this or pass handlers.
      // For now, assume parent wraps or we add handlers here if needed.
    >
      {player ? (
        <div className="relative group w-full h-full flex flex-col items-center">
          {/* Placement Hint (Mobile) */}
          {isPlacementTarget && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-primary/20 rounded-full pointer-events-none border-2 border-primary/50" />
          )}

          {/* Swap Indicator */}
          {isSwapTarget && (
            <div className="absolute inset-0 z-30 flex items-center justify-center text-white font-bold opacity-0 hover:opacity-100 bg-black/40 rounded-lg pointer-events-none backdrop-blur-[0.0625rem]">
              ⚡
            </div>
          )}

          {/* Remove Button */}
          {onRemove && !isSelected && !isPlacementTarget && (
            <button
              onClick={onRemove}
              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:scale-110 shadow-md"
            >
              ✕
            </button>
          )}

          {/* Player Image */}
          <div className="w-14 h-14 md:w-16 md:h-16 relative z-10 transition-transform">
            <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/10 shadow-lg bg-surface-tertiary">
              <Image
                src={player.image || "/images/ovr.png"}
                alt={player.name}
                fill
                className="object-cover"
                draggable={false}
              />
            </div>
            {/* OVR Badge (Optional, added from original design inspiration) */}
            {player.overall && (
              <div className="absolute -bottom-1 -right-1 bg-[#1a1a1a] text-[#b8ff12] text-[10px] font-bold px-1.5 py-0.5 rounded border border-[#333]">
                {player.overall}
              </div>
            )}
          </div>

          {/* Name Badge */}
          <div
            className={cn(
              "mt-1 bg-black/60 backdrop-blur-sm text-white text-[10px] md:text-xs px-2 py-0.5 rounded-full whitespace-nowrap border z-10 max-w-full overflow-hidden text-ellipsis",
              isSelected
                ? "border-yellow-400 text-yellow-400"
                : "border-white/20",
            )}
          >
            {player.name}
          </div>

          {/* Season Badge */}
          {player.season && (
            <div className="absolute top-0 left-0 bg-surface-secondary text-[8px] px-1 rounded border border-gray-600 z-10 shadow-sm text-gray-300">
              {player.season}
            </div>
          )}
        </div>
      ) : (
        // Empty Slot
        <div
          className={cn(
            "w-8 h-8 md:w-10 md:h-10 rounded-full bg-black/30 border-2 border-dashed flex items-center justify-center text-xs font-bold transition-colors",
            isPlacementTarget
              ? "border-primary text-primary bg-primary/10"
              : "border-white/30 text-white/50",
          )}
        >
          {positionRole}
        </div>
      )}
    </div>
  );
};

export default PlayerMarker;
