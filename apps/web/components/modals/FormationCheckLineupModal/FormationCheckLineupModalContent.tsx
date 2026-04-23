"use client";

import { useLazyLoadQuery } from "react-relay";
import { useMemo, useState } from "react";
import type {
  findMatchQuery,
  findMatchQuery$data,
} from "@/__generated__/findMatchQuery.graphql";
import type { formationMatchPagePreloadQuery } from "@/__generated__/formationMatchPagePreloadQuery.graphql";
import { FindMatchQuery } from "@/lib/relay/queries/findMatchQuery";
import { FormationMatchPagePreloadQuery } from "@/lib/relay/queries/formationMatchPagePreloadQuery";
import { parseNumericIdFromRelayGlobalId } from "@/lib/relay/parseRelayGlobalId";
import { buildFormationMatchPageSnapshotFromPreloadQueryData } from "@/lib/formation/buildFormationMatchPageSnapshotFromPreloadQueryData";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import QuarterButton from "@/components/ui/QuarterButton";
import { cn } from "@/lib/utils";
import matchLineup from "@/public/icons/title_matchlineup.svg";
import FormationCheckLineupReadOnlyQuarterBoard, {
  resolveQuarterForInHouseTab,
} from "./FormationCheckLineupReadOnlyQuarterBoard";
import FormationCheckLineupPlayerPanel from "./FormationCheckLineupPlayerPanel";
import type { FormationMatchQuarterSpec } from "@/types/formationMatchPageSnapshot";

type FindMatchRow = findMatchQuery$data["findMatch"][number];

function toQuarterSpecMatchType(
  matchType: FindMatchRow["matchType"],
): FormationMatchQuarterSpec["matchType"] {
  return matchType === "INTERNAL" ? "INTERNAL" : "MATCH";
}

type FormationCheckLineupModalContentProps = {
  matchId: number;
  teamId: number;
};

export default function FormationCheckLineupModalContent({
  matchId,
  teamId,
}: FormationCheckLineupModalContentProps) {
  const matchListData = useLazyLoadQuery<findMatchQuery>(
    FindMatchQuery,
    { createdTeamId: teamId },
    { fetchPolicy: "store-or-network" },
  );

  const matches: readonly FindMatchRow[] = matchListData?.findMatch ?? [];
  const meta = matches.find(
    (m) => parseNumericIdFromRelayGlobalId(m.id) === matchId,
  );

  const preload = useLazyLoadQuery<formationMatchPagePreloadQuery>(
    FormationMatchPagePreloadQuery,
    { matchId, teamId },
    { fetchPolicy: "store-or-network" },
  );

  const snapshot = useMemo(() => {
    if (meta == null) return null;
    return buildFormationMatchPageSnapshotFromPreloadQueryData(
      preload,
      {
        quarterCount: meta.quarterCount,
        matchType: toQuarterSpecMatchType(meta.matchType),
      },
      teamId,
    );
  }, [preload, meta, teamId]);

  const quarters = snapshot?.initialQuarters ?? null;
  const roster = snapshot?.players ?? [];

  const defaultQuarterId = quarters?.[0]?.id ?? null;
  const [pickedQuarterId, setPickedQuarterId] = useState<number | null>(null);
  const activeQuarterId = pickedQuarterId ?? defaultQuarterId;

  const [inHouseTeam, setInHouseTeam] = useState<"A" | "B">("A");

  const rawQuarter =
    quarters?.find((q) => q.id === activeQuarterId) ?? quarters?.[0] ?? null;

  const displayQuarter = useMemo(() => {
    if (rawQuarter == null || meta == null) return null;
    const sub =
      toQuarterSpecMatchType(meta.matchType) === "INTERNAL"
        ? inHouseTeam
        : null;
    return resolveQuarterForInHouseTab(rawQuarter, sub);
  }, [rawQuarter, meta, inHouseTeam]);

  if (meta == null) {
    return (
      <div className="rounded-2xl border border-border-card bg-surface-card p-8 text-center text-Label-Tertiary text-sm">
        해당 경기를 찾을 수 없습니다.
      </div>
    );
  }

  if (quarters == null || quarters.length === 0 || displayQuarter == null) {
    return (
      <div className="rounded-2xl border border-border-card bg-surface-card p-8 text-center text-Label-Tertiary text-sm">
        저장된 포메이션이 없습니다.
        <p className="mt-2 text-xs opacity-80">
          포메이션 페이지에서 확정 후 다시 시도해 주세요.
        </p>
      </div>
    );
  }

  const isInternalMatch = toQuarterSpecMatchType(meta.matchType) === "INTERNAL";

  return (
    <div className="rounded-2xl border border-border-card bg-surface-card overflow-hidden flex flex-col max-h-[min(85vh,860px)] min-h-0 shadow-xl">
      <header className="p-4 md:p-5  shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-3 gap-y-3">
          <div className="flex min-w-0 flex-wrap items-center gap-3 md:gap-4">
            <div className="flex shrink-0 items-center">
              <Icon
                src={matchLineup}
                alt="로고"
                nofill
                width={192}
                height={34}
              />
            </div>
            {isInternalMatch ? (
              <div
                className="flex shrink-0 items-center gap-2"
                role="group"
                aria-label="내전 팀 선택"
              >
                {(["A", "B"] as const).map((t) => {
                  const active = inHouseTeam === t;
                  return (
                    <Button
                      key={t}
                      type="button"
                      variant={active ? "primary" : "ghost"}
                      size="m"
                      className={cn(
                        "w-20 shrink-0 p-3 text-sm font-semibold shadow-none",
                        !active &&
                          "border-0 bg-Fill_Quatiary! text-white hover:bg-white/15 hover:text-white",
                      )}
                      onClick={() => setInHouseTeam(t)}
                    >
                      {t}팀
                    </Button>
                  );
                })}
              </div>
            ) : (
              <span className="text-xs text-Label-Tertiary md:text-sm">
                경기 포메이션
              </span>
            )}
          </div>
          <div className="flex shrink-0 flex-wrap justify-end gap-2">
            {quarters.map((q) => (
              <QuarterButton
                key={q.id}
                type="button"
                size="sm"
                variant={activeQuarterId === q.id ? "selected" : "default"}
                onClick={() => setPickedQuarterId(q.id)}
                aria-pressed={activeQuarterId === q.id}
              >
                {q.id}Q
              </QuarterButton>
            ))}
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-5 min-h-0 flex-1 overflow-y-auto">
        <div className="flex-1 min-w-0 min-h-48">
          <FormationCheckLineupReadOnlyQuarterBoard quarter={displayQuarter} />
        </div>
        <FormationCheckLineupPlayerPanel
          quarter={displayQuarter}
          roster={roster}
        />
      </div>
    </div>
  );
}
