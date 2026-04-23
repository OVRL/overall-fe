import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { Player } from "@/types/formation";
import ProfileAvatar from "@/components/ui/ProfileAvatar";
import PositionChip from "@/components/PositionChip";
import QuarterChip from "@/components/ui/QuarterChip";
import { Position } from "@/types/position";
import { cn } from "@/lib/utils";
import { getFormationPlayerProfileAvatarUrls } from "@/lib/formation/formationPlayerProfileAvatarUrls";
import { useIsMobile } from "@/hooks/useIsMobile";
import { getFormationRosterPlayerKey } from "@/lib/formation/roster/formationRosterPlayerKey";
import type { InHouseDraftTeamChoice } from "@/hooks/formation/useInHouseDraftTeamAssignments";
import FormationDraftSubTeamToggle from "./FormationDraftSubTeamToggle";

export type FormationPlayerListRowMode = "lineup" | "draft";

interface FormationPlayerRowProps {
  player: Player;
  isSelected: boolean;
  activeQuarters?: number[];
  onSelect: (player: Player) => void;
  /** 명단에서 제거 등 — 현재 행에서는 미사용일 수 있음 */
  onRemove?: (e: React.MouseEvent, player: Player) => void;
  /** true면 보드로의 드래그만 막음(클릭 선택은 유지) */
  disableDrag?: boolean;
  /** 라인업 편집 vs 팀 드래프트(A/B 토글) */
  listRowMode?: FormationPlayerListRowMode;
  /** listRowMode가 draft일 때만 사용 */
  draftTeam?: InHouseDraftTeamChoice;
  onDraftTeamChange?: (team: InHouseDraftTeamChoice) => void;
}

const FormationPlayerRow: React.FC<FormationPlayerRowProps> = ({
  player,
  isSelected,
  activeQuarters = [],
  onSelect,
  onRemove,
  disableDrag = false,
  listRowMode = "lineup",
  draftTeam = null,
  onDraftTeamChange,
}) => {
  void onRemove;
  const isMobile = useIsMobile();
  const rosterKey = getFormationRosterPlayerKey(player);

  const { src: avatarSrc, fallbackSrc: avatarFallbackSrc } =
    getFormationPlayerProfileAvatarUrls(player);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `player-${rosterKey}`,
    data: {
      type: "Player",
      player,
    },
    disabled: isMobile || disableDrag,
  });

  const isDraftRow = listRowMode === "draft";

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={() => onSelect(player)}
      className={`max-h-12 group relative flex items-center w-full px-4 gap-x-3 rounded-xl border transition-all select-none overflow-hidden ${
        isDragging
          ? "opacity-30 border-Fill-AccentPrimary cursor-grabbing"
          : disableDrag || isMobile
            ? "cursor-default"
            : "cursor-grab active:cursor-grabbing"
      } ${
        isSelected
          ? "border-[#32400A] border-2 z-10 bg-[#262F0D]"
          : "border-transparent hover:bg-surface-secondary bg-gray-1100"
      }`}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <ProfileAvatar
          src={avatarSrc}
          fallbackSrc={avatarFallbackSrc}
          alt={player.name}
          size={48}
          className={cn(isSelected ? "bg-[#262F0D]" : "bg-gray-1100")}
        />
        <div className="flex gap-x-1 items-center min-w-0 flex-1">
          <div className="w-10.5 flex justify-center items-center shrink-0">
            <PositionChip
              position={player.position as Position}
              variant="outline"
            />
          </div>
          <span className="text-Label-Primary text-sm min-w-0 flex-1 truncate">
            {player.name}
          </span>
        </div>
      </div>

      {isDraftRow && onDraftTeamChange ? (
        <FormationDraftSubTeamToggle
          value={draftTeam}
          onChange={onDraftTeamChange}
          playerName={player.name}
        />
      ) : (
        <>
          <span
            className={cn(
              "w-13.25 shrink-0 text-center text-sm font-bold whitespace-nowrap",
              isSelected ? "text-Label-AccentPrimary" : "text-Label-Secondary",
            )}
          >
            OVR {player.overall}
          </span>

          <QuarterChip quarters={activeQuarters} />
        </>
      )}
    </div>
  );
};

export default FormationPlayerRow;
