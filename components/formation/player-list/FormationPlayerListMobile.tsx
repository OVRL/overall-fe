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
import FormationRosterViewModeTabs from "./FormationRosterViewModeTabs";
import FormationDraftSubTeamToggle from "./FormationDraftSubTeamToggle";
import type { FormationRosterViewMode } from "@/types/formationRosterViewMode";
import type { InHouseDraftTeamChoice } from "@/hooks/formation/useInHouseDraftTeamAssignments";
import {
  getFormationRosterPlayerKey,
  isSameFormationRosterPlayer,
} from "@/lib/formation/roster/formationRosterPlayerKey";
import { filterPlayersForInHouseLineupTab } from "@/lib/formation/roster/filterPlayersForInHouseLineupTab";

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
  onFormationRosterViewModeChange?: (mode: FormationRosterViewMode) => void;
  getDraftTeam?: (player: Player) => InHouseDraftTeamChoice;
  onDraftTeamSelect?: (player: Player, team: InHouseDraftTeamChoice) => void;
}

const TABS = ["전체", "FW", "MF", "DF", "GK"];

/** 모바일용 컴팩트 선수 카드 — 라인업(드래그) / 팀 드래프트(A/B) 레이아웃 분기 */
function PlayerCardMobile({
  player,
  onSelect,
  assignedQuarterIds,
  isSelected,
  disableDrag,
  draftMode,
  draftTeam,
  onDraftTeamChange,
}: {
  player: Player;
  onSelect: (player: Player) => void;
  assignedQuarterIds?: number[];
  isSelected?: boolean;
  disableDrag?: boolean;
  draftMode?: boolean;
  draftTeam?: InHouseDraftTeamChoice;
  onDraftTeamChange?: (team: InHouseDraftTeamChoice) => void;
}) {
  const hasAssignment = assignedQuarterIds && assignedQuarterIds.length > 0;
  const rosterKey = getFormationRosterPlayerKey(player);

  const { src: avatarSrc, fallbackSrc: avatarFallbackSrc } =
    getFormationPlayerProfileAvatarUrls(player);

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `player-list-mobile-${rosterKey}`,
    data: {
      type: "ListPlayer",
      player,
    },
    disabled: Boolean(disableDrag || draftMode),
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
      {hasAssignment && !draftMode && (
        <div className="absolute top-0.5 right-0.5">
          <QuarterDotsMobile quarterIds={assignedQuarterIds!} />
        </div>
      )}
    </>
  );

  if (draftMode && onDraftTeamChange) {
    return (
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        className={cn(
          "shrink-0 flex flex-col items-center gap-2 rounded-lg p-2 min-w-22 relative",
          isSelected && "bg-surface-secondary border border-Fill_AccentPrimary",
        )}
      >
        <button
          type="button"
          onClick={() => onSelect(player)}
          className="flex flex-col items-center gap-2 w-full touch-manipulation relative"
          aria-pressed={isSelected}
          aria-label={player.name}
        >
          {cardInner}
        </button>
        <FormationDraftSubTeamToggle
          value={draftTeam ?? null}
          onChange={onDraftTeamChange}
          playerName={player.name}
        />
      </div>
    );
  }

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
        disableDrag && "opacity-100",
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
  onFormationRosterViewModeChange,
  getDraftTeam,
  onDraftTeamSelect,
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

  const draftListDragDisabled =
    matchType === "INTERNAL" && formationRosterViewMode === "draft";
  const draftRowMode =
    matchType === "INTERNAL" &&
    formationRosterViewMode === "draft" &&
    getDraftTeam != null &&
    onDraftTeamSelect != null;

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

      {matchType === "INTERNAL" &&
        formationRosterViewMode != null &&
        onFormationRosterViewModeChange != null && (
          <div className="px-4 pb-3">
            <FormationRosterViewModeTabs
              value={formationRosterViewMode}
              onChange={onFormationRosterViewModeChange}
            />
          </div>
        )}

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

      <div className="overflow-x-auto max-md:scrollbar-hide">
        <div className="flex gap-3 px-4 pb-2">
          {filteredPlayers.length === 0 ? (
            <p className="text-Label-Tertiary text-sm py-6 w-full text-center">
              선수가 없습니다.
            </p>
          ) : (
            filteredPlayers.map((player) => {
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
                  draftMode={draftRowMode}
                  draftTeam={getDraftTeam?.(player)}
                  onDraftTeamChange={
                    draftRowMode
                      ? (team) => onDraftTeamSelect!(player, team)
                      : undefined
                  }
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
