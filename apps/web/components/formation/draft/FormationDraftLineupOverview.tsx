"use client";

import type { Player } from "@/types/formation";
import ProfileAvatar from "@/components/ui/ProfileAvatar";
import PositionChip from "@/components/PositionChip";
import Icon from "@/components/ui/Icon";
import userAdd from "@/public/icons/user_add.svg";
import { cn } from "@/lib/utils";
import { getFormationPlayerProfileAvatarUrls } from "@/lib/formation/formationPlayerProfileAvatarUrls";
import { getFormationRosterPlayerKey } from "@/lib/formation/roster/formationRosterPlayerKey";
import type { Position } from "@/types/position";

export interface FormationDraftLineupOverviewProps {
  /** A팀 — FW→MF→DF→GK 순으로 정렬된 배정 선수 */
  lineupA: Player[];
  /** B팀 — 동일 */
  lineupB: Player[];
  className?: string;
}

export type DraftPlayerChipVariant = "desktop" | "mobile";

export function DraftPlayerChip({
  player,
  variant = "desktop",
}: {
  player: Player;
  variant?: DraftPlayerChipVariant;
}) {
  if (variant === "mobile") {
    return (
      <div
        className={cn(
          "flex items-center justify-between gap-2 rounded-xl",
          "min-w-0 max-w-full",
        )}
      >
        <div className="flex items-center">
          <div className="flex min-w-0 flex-1 gap-1">
            <div className="flex items-center px-1.25">
              <PositionChip
                position={player.position as Position}
                variant="outline"
              />
            </div>
            <div className="flex h-8 items-center">
              <span className="w-18.75 truncate text-sm text-Label-Primary">
                {player.name}
              </span>
            </div>
          </div>
        </div>
        <div className="flex h-8 w-8 items-center">
          <span className="w-13.25 text-center text-sm font-bold text-Label-Secondary">
            {player.overall}
          </span>
        </div>
      </div>
    );
  }

  const { src, fallbackSrc } = getFormationPlayerProfileAvatarUrls(player);

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 rounded-xl px-4 bg-gray-1100",
        "min-w-0 max-w-full",
      )}
    >
      <div className="flex items-center">
        <ProfileAvatar src={src} fallbackSrc={fallbackSrc} alt="" size={48} />
        <div className="flex min-w-0 flex-1 gap-1">
          <div className="flex items-center mx-2">
            <PositionChip
              position={player.position as Position}
              variant="outline"
            />
          </div>
          <div className="flex h-8 w-18.75 items-center">
            <span className="truncate text-sm text-Label-Primary">
              {player.name}
            </span>
          </div>
        </div>
      </div>
      <div className="flex h-8 w-12.25 items-center">
        <span className="w-13.25 text-sm font-bold text-Label-Secondary">
          OVR {player.overall}
        </span>
      </div>
    </div>
  );
}

function DraftLineupColumnEmpty() {
  return (
    <div
      className={cn(
        "flex h-103 w-full shrink-0 flex-col items-center justify-center gap-2 text-gray-500",
        "px-4 text-center",
      )}
      role="status"
      aria-live="polite"
      aria-label="선수 명단에서 팀을 선택하세요."
    >
      <Icon
        src={userAdd}
        alt=""
        width={20}
        height={20}
        className="shrink-0"
        aria-hidden
      />
      <p className="text-sm leading-snug text-gray-500">
        <span className="block">선수 명단에서</span>
        <span className="block">팀을 선택하세요.</span>
      </p>
    </div>
  );
}

function TeamColumn({
  title,
  accentClassName,
  players,
}: {
  title: string;
  accentClassName: string;
  players: Player[];
}) {
  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col gap-3 rounded-xl border border-border-card bg-surface-card/50 p-3">
      <h3
        className={cn(
          "h-12 shrink-0 text-center font-bold tracking-tight",
          accentClassName,
        )}
      >
        {title}
      </h3>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain scrollbar-hide pr-1">
        {players.length > 0 ? (
          <ul className="flex min-w-0 flex-col gap-1" aria-label="배정된 선수">
            {players.map((p) => (
              <li key={getFormationRosterPlayerKey(p)}>
                <DraftPlayerChip player={p} />
              </li>
            ))}
          </ul>
        ) : (
          <DraftLineupColumnEmpty />
        )}
      </div>
    </div>
  );
}

/**
 * 팀 드래프트 모드 좌측 요약 — A/B 서브팀별로, FW→MF→DF→GK 순으로 배정된 선수를 나열한다(그룹 제목 라벨 없음).
 * 레이아웃만 담당하며, 정렬은 `buildSubTeamDraftLineupOrderedPlayers` + 상위에서 수행한다.
 */
export default function FormationDraftLineupOverview({
  lineupA,
  lineupB,
  className,
}: FormationDraftLineupOverviewProps) {
  return (
    <section
      aria-label="팀 드래프트 라인업 요약"
      className={cn(
        "flex w-full min-h-0 flex-1 flex-col gap-3 overflow-hidden",
        className,
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col gap-3 md:flex-row md:gap-3">
        <div className="flex min-h-0 flex-1 md:min-w-0 md:w-0">
          <TeamColumn
            title="Team A"
            accentClassName="text-white"
            players={lineupA}
          />
        </div>
        <div className="flex min-h-0 flex-1 md:min-w-0 md:w-0">
          <TeamColumn
            title="Team B"
            accentClassName="text-white"
            players={lineupB}
          />
        </div>
      </div>
    </section>
  );
}
