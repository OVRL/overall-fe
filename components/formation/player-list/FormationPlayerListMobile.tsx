"use client";

import { Player } from "@/types/formation";
import { Position } from "@/types/position";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import AssistiveChip from "@/components/ui/AssistiveChip";
import ProfileAvatar from "@/components/ui/ProfileAvatar";
import PositionChip from "@/components/PositionChip";
import { cn } from "@/lib/utils";
import { getFormationPlayerProfileAvatarUrls } from "@/lib/formation/formationPlayerProfileAvatarUrls";
import calendar from "@/public/icons/calendar.svg";
import useModal from "@/hooks/useModal";
import { useFormationMatchIds } from "@/app/formation/_context/FormationMatchContext";
import { useFormationPlayerList } from "@/hooks/formation/useFormationPlayerList";
import { useDraggable } from "@dnd-kit/core";
import QuarterDotsMobile from "../quarter/QuarterDotsMobile";

export interface FormationPlayerListMobileProps {
  players: Player[];
  selectedPlayer: Player | null;
  onSelectPlayer: (player: Player) => void;
  targetPosition?: string | null;
  activePosition?: {
    quarterId: number;
    index: number;
    role: string;
  } | null;
  /** 선수별 배치된 쿼터 id 목록. 있으면 QuarterDotsMobile로 표시 */
  getAssignedQuarterIdsForPlayer?: (playerId: number) => number[];
}

const TABS = ["전체", "FW", "MF", "DF", "GK"];

/** 모바일용 컴팩트 선수 카드 (가로 스크롤 리스트용) */
function PlayerCardMobile({
  player,
  onSelect,
  assignedQuarterIds,
  isSelected,
}: {
  player: Player;
  onSelect: (player: Player) => void;
  assignedQuarterIds?: number[];
  isSelected?: boolean;
}) {
  const hasAssignment = assignedQuarterIds && assignedQuarterIds.length > 0;

  const { src: avatarSrc, fallbackSrc: avatarFallbackSrc } =
    getFormationPlayerProfileAvatarUrls(player);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `player-list-mobile-${player.id}`,
    data: {
      type: "ListPlayer",
      player,
    },
  });

  return (
    <button
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      type="button"
      onClick={() => onSelect(player)}
      className={cn(
        "shrink-0 flex flex-col items-center gap-2 transition-colors text-left rounded-lg p-2 min-w-18.75 relative touch-none",
        isSelected && "bg-surface-card border border-Fill_AccentPrimary",
        isDragging && "opacity-50",
      )}
      aria-pressed={isSelected}
      aria-label={
        hasAssignment
          ? `${player.name} (${assignedQuarterIds!.length}개 쿼터 배치됨)`
          : isSelected
            ? `${player.name} 선택됨, 다시 탭하면 선택 해제`
            : player.name
      }
    >
      <ProfileAvatar
        src={avatarSrc}
        fallbackSrc={avatarFallbackSrc}
        alt=""
        size={48}
      />
      <PositionChip position={player.position as Position} variant="outline" />
      <span className="text-Label-Primary text-sm text-center line-clamp-1 w-18.75 truncate">
        {player.name}
      </span>
      {hasAssignment && (
        <div className="absolute top-0.5 right-0.5">
          <QuarterDotsMobile quarterIds={assignedQuarterIds!} />
        </div>
      )}
    </button>
  );
}

const FormationPlayerListMobile = ({
  players,
  selectedPlayer,
  onSelectPlayer,
  targetPosition,
  activePosition,
  getAssignedQuarterIdsForPlayer,
}: FormationPlayerListMobileProps) => {
  const { openModal } = useModal("FORMATION_MATCH_ATTENDANCE_PLAYER");
  const { matchId, teamId } = useFormationMatchIds();
  const { activePosTab, setActivePosTab, filteredPlayers } =
    useFormationPlayerList({ players, targetPosition, activePosition });

  return (
    <section
      aria-label="선수 명단"
      className="w-full flex flex-col rounded-xl bg-surface-card border border-border-card shadow-card overflow-hidden p-4"
    >
      {/* 헤더: 아이콘 + 제목 + 선수 추가 버튼 */}
      <div className="flex items-center justify-between gap-3 p-4">
        <div className="flex items-center gap-2.5 text-Fill_Tertiary">
          <Icon
            src={calendar}
            alt="선수 명단"
            aria-hidden
            className="shrink-0"
          />
          <h3 className="text-[#f7f7f8] font-semibold leading-6">
            참석 선수 명단
          </h3>
        </div>
        <div>
          <Button
            variant="ghost"
            size="s"
            onClick={() => {
              openModal({ matchId, teamId });
            }}
            className="shrink-0 flex gap-1 text-Label-Tertiary font-semibold px-3.5"
          >
            선수 추가
          </Button>
        </div>
      </div>

      {/* 포지션 필터 탭 */}
      <div className="flex items-center gap-3 px-4 pb-3">
        {TABS.map((tab) => (
          <AssistiveChip
            key={tab}
            label={tab}
            variant={activePosTab === tab ? "select2" : "default"}
            onClick={() => setActivePosTab(tab)}
            className="flex-1 min-w-0"
          />
        ))}
      </div>

      {/* 가로 스크롤 선수 카드 목록 */}
      <div className="overflow-x-auto max-md:scrollbar-hide">
        <div className="flex gap-3 px-4">
          {filteredPlayers.length === 0 ? (
            <p className="text-Label-Tertiary text-sm py-6 w-full text-center">
              선수가 없습니다.
            </p>
          ) : (
            filteredPlayers.map((player) => (
              <PlayerCardMobile
                key={player.id}
                player={player}
                onSelect={onSelectPlayer}
                assignedQuarterIds={getAssignedQuarterIdsForPlayer?.(player.id)}
                isSelected={selectedPlayer?.id === player.id}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default FormationPlayerListMobile;
