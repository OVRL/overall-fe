"use client";

import type { Player } from "@/types/formation";
import { DraftPlayerChip } from "@/components/formation/draft/FormationDraftLineupOverview";
import { getFormationRosterPlayerKey } from "@/lib/formation/roster/formationRosterPlayerKey";
import { cn } from "@/lib/utils";
import { UserPlus } from "lucide-react";

export interface FormationMobileDraftTeamColumnsProps {
  lineupA: Player[];
  lineupB: Player[];
  onColumnPress: (side: "A" | "B") => void;
  className?: string;
}

function DraftColumn({
  title,
  borderClassName,
  titleClassName,
  players,
  onPress,
}: {
  title: string;
  borderClassName: string;
  titleClassName: string;
  players: Player[];
  onPress: () => void;
}) {
  const empty = players.length === 0;

  return (
    <button
      type="button"
      onClick={onPress}
      className={cn(
        "flex min-h-44 flex-1 min-w-0 flex-col rounded-xl border-2 bg-surface-card/60 py-3 px-1 text-left touch-manipulation",
        borderClassName,
      )}
      aria-label={`${title} 드래프트 편집`}
    >
      <h3
        className={cn(
          "shrink-0 px-1 py-2 text-center text-sm font-bold tracking-tight",
          titleClassName,
        )}
      >
        {title}
      </h3>
      {empty ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-2 pb-3">
          <UserPlus className="size-8 text-Label-Tertiary" aria-hidden />
          <p className="text-center text-xs leading-relaxed text-Label-Tertiary">
            선수 명단에서 팀을 선택하세요.
          </p>
        </div>
      ) : (
        <ul
          className="flex max-h-64 min-h-0 flex-1 flex-col gap-1 overflow-y-auto overscroll-y-contain scrollbar-hide pr-0.5"
          aria-label={`${title} 배정 선수`}
        >
          {players.map((p) => (
            <li key={getFormationRosterPlayerKey(p)}>
              <DraftPlayerChip player={p} variant="mobile" />
            </li>
          ))}
        </ul>
      )}
    </button>
  );
}

/**
 * 모바일 팀 드래프트 — A/B 열을 탭하면 전체 참석자 드래프트 모달이 열린다.
 */
export function FormationMobileDraftTeamColumns({
  lineupA,
  lineupB,
  onColumnPress,
  className,
}: FormationMobileDraftTeamColumnsProps) {
  return (
    <section
      aria-label="팀 드래프트"
      className={cn("flex w-full gap-2 bg-gray-1100", className)}
    >
      <DraftColumn
        title="Team A"
        borderClassName="border-Position-FW-Red/70"
        titleClassName="text-Position-FW-Red"
        players={lineupA}
        onPress={() => onColumnPress("A")}
      />
      <DraftColumn
        title="Team B"
        borderClassName="border-Position-DF-Blue/80"
        titleClassName="text-Position-DF-Blue"
        players={lineupB}
        onPress={() => onColumnPress("B")}
      />
    </section>
  );
}
