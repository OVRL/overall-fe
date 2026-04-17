"use client";

import React from "react";
import type { Player } from "@/types/formation";
import ProfileAvatar from "@/components/ui/ProfileAvatar";
import PositionChip from "@/components/PositionChip";
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

function DraftPlayerChip({ player }: { player: Player }) {
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
        <div className="min-w-0 flex-1 flex gap-1">
          <div className="flex items-center">
            <PositionChip
              position={player.position as Position}
              variant="outline"
            />
          </div>
          <div className="h-8 w-18.75 flex items-center">
            <span className="text-Label-Primary text-sm truncate ">
              {player.name}
            </span>
          </div>
        </div>
      </div>
      <div className="h-8 w-12.25 flex items-center">
        <span className="text-Label-Secondary font-bold text-sm w-13.25">
          OVR {player.overall}
        </span>
      </div>
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
          "shrink-0 font-bold tracking-tight h-12 text-center",
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
        ) : null}
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
