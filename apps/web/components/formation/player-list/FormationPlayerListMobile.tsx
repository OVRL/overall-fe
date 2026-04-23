"use client";

import { useMemo } from "react";
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
import type { FormationRosterViewMode } from "@/types/formationRosterViewMode";
import type { InHouseDraftTeamChoice } from "@/hooks/formation/useInHouseDraftTeamAssignments";
import {
  getFormationRosterPlayerKey,
  isSameFormationRosterPlayer,
} from "@/lib/formation/roster/formationRosterPlayerKey";
import { filterPlayersForInHouseLineupTab } from "@/lib/formation/roster/filterPlayersForInHouseLineupTab";
import { sortPlayersForFormationLineupList } from "@/lib/formation/roster/sortPlayersForFormationLineupList";
import { FORMATION_PLAYER_LIST_POSITION_TABS } from "@/constants/formationPlayerListTabs";

function DraftTeamCornerBadge({ team }: { team: InHouseDraftTeamChoice }) {
  return (
    <div
      className={cn(
        "absolute top-0 right-0 flex size-5 items-center justify-center rounded-full border-2 border-surface-card text-[0.625rem] font-bold leading-none",
        team === null &&
          "border-Position-MF-Green bg-Position-MF-Green/30 text-Position-MF-Green",
        team === "A" &&
          "border-Position-FW-Red bg-Position-FW-Red/30 text-Position-FW-Red",
        team === "B" &&
          "border-Position-DF-Blue bg-Position-DF-Blue/30 text-Position-DF-Blue",
      )}
      aria-hidden
    >
      {team === null ? "−" : team}
    </div>
  );
}

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
  matchType?: "MATCH" | "INTERNAL";
  formationRosterViewMode?: FormationRosterViewMode;
  getDraftTeam?: (player: Player) => InHouseDraftTeamChoice;
}

/** 모바일용 컴팩트 선수 카드 — 라인업(드래그) / 팀 드래프트(A/B) 레이아웃 분기 */
function PlayerCardMobile({
  player,
  onSelect,
  assignedQuarterIds,
  isSelected,
  disableDrag,
  draftTeamBadge,
  draftTeam,
}: {
  player: Player;
  onSelect: (player: Player) => void;
  assignedQuarterIds?: number[];
  isSelected?: boolean;
  disableDrag?: boolean;
  /** 팀 드래프트: 아바타 모서리에 A/B/− 표시(모바일) */
  draftTeamBadge?: boolean;
  draftTeam?: InHouseDraftTeamChoice;
}) {
  const hasAssignment = assignedQuarterIds && assignedQuarterIds.length > 0;
  /** A/B 라인업: 쿼터 도트만. 팀 드래프트: 팀 배지만(둘 다 켜지지 않음). */
  const showQuarterDots = hasAssignment && !draftTeamBadge;
  const showDraftBadge = Boolean(draftTeamBadge);
  const selectionVisual =
    Boolean(isSelected) && !draftTeamBadge;
  const rosterKey = getFormationRosterPlayerKey(player);

  const { src: avatarSrc, fallbackSrc: avatarFallbackSrc } =
    getFormationPlayerProfileAvatarUrls(player);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `player-list-mobile-${rosterKey}`,
    data: {
      type: "ListPlayer",
      player,
    },
    disabled: Boolean(disableDrag || draftTeamBadge),
  });

  const cardInner = (
    <>
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
      {showQuarterDots ? (
        <div className="absolute top-0.5 right-0.5">
          <QuarterDotsMobile quarterIds={assignedQuarterIds!} />
        </div>
      ) : null}
      {showDraftBadge ? (
        <div className="absolute top-0 right-0">
          <DraftTeamCornerBadge team={draftTeam ?? null} />
        </div>
      ) : null}
    </>
  );

  return (
    <button
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      type="button"
      onClick={() => {
        if (!draftTeamBadge) onSelect(player);
      }}
      aria-disabled={draftTeamBadge ? true : undefined}
      className={cn(
        "shrink-0 flex flex-col items-center gap-2 transition-colors text-left rounded-lg p-2 min-w-18.75 relative touch-manipulation",
        draftTeamBadge && "cursor-default",
        selectionVisual && "bg-surface-card border border-Fill_AccentPrimary",
        isDragging && "opacity-50",
        disableDrag && "opacity-100",
      )}
      aria-pressed={selectionVisual ? true : false}
      aria-label={
        draftTeamBadge
          ? `${player.name}, 팀 드래프트 명단`
          : hasAssignment
            ? `${player.name} (${assignedQuarterIds!.length}개 쿼터 배치됨)`
            : isSelected
              ? `${player.name} 선택됨, 다시 탭하면 선택 해제`
              : player.name
      }
    >
      {cardInner}
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
  matchType = "MATCH",
  formationRosterViewMode,
  getDraftTeam,
}: FormationPlayerListMobileProps) => {
  const { openModal } = useModal("FORMATION_MATCH_ATTENDANCE_PLAYER");
  const { matchId, teamId } = useFormationMatchIds();

  const playersForList = useMemo(
    () =>
      filterPlayersForInHouseLineupTab(
        players,
        formationRosterViewMode,
        getDraftTeam,
      ),
    [players, formationRosterViewMode, getDraftTeam],
  );

  const { activePosTab, setActivePosTab, filteredPlayers } =
    useFormationPlayerList({
      players: playersForList,
      targetPosition,
      activePosition,
    });

  /** 데스크톱 FormationPlayerGroupList와 동일: 대분류 GK→DF→MF→FW, 동일 분류는 이름순 */
  const sortedPlayersForMobile = useMemo(
    () => sortPlayersForFormationLineupList(filteredPlayers),
    [filteredPlayers],
  );

  const draftListDragDisabled =
    matchType === "INTERNAL" && formationRosterViewMode === "draft";
  const draftTeamBadgeMode =
    matchType === "INTERNAL" &&
    formationRosterViewMode === "draft" &&
    getDraftTeam != null;

  return (
    <section
      aria-label="선수 명단"
      className="w-full flex flex-col rounded-xl bg-surface-card border border-border-card shadow-card overflow-hidden p-4"
    >
      <div className="flex items-center justify-between gap-3 p-4">
        <div className="flex items-center gap-2.5 text-Fill_Tertiary">
          <Icon
            src={calendar}
            alt="선수 명단"
            aria-hidden
            className="shrink-0"
          />
          <h3 className="text-[#f7f7f8] font-semibold leading-6">선수 명단</h3>
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

      <div className="flex items-center gap-3 px-4 pb-3">
        {FORMATION_PLAYER_LIST_POSITION_TABS.map((tab) => (
          <AssistiveChip
            key={tab}
            label={tab}
            variant={activePosTab === tab ? "select2" : "default"}
            onClick={() => setActivePosTab(tab)}
            className="flex-1 min-w-0"
          />
        ))}
      </div>

      <div className="overflow-x-auto max-md:scrollbar-hide">
        <div className="flex gap-3 px-4 pb-2">
          {sortedPlayersForMobile.length === 0 ? (
            <p className="text-Label-Tertiary text-sm py-6 w-full text-center">
              선수가 없습니다.
            </p>
          ) : (
            sortedPlayersForMobile.map((player) => {
              const rosterKey = getFormationRosterPlayerKey(player);
              return (
                <PlayerCardMobile
                  key={rosterKey}
                  player={player}
                  onSelect={onSelectPlayer}
                  assignedQuarterIds={getAssignedQuarterIdsForPlayer?.(
                    player.id,
                  )}
                  isSelected={
                    selectedPlayer != null &&
                    isSameFormationRosterPlayer(selectedPlayer, player)
                  }
                  disableDrag={draftListDragDisabled}
                  draftTeamBadge={draftTeamBadgeMode}
                  draftTeam={getDraftTeam?.(player)}
                />
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default FormationPlayerListMobile;
