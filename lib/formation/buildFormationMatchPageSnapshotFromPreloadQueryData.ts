import type { formationMatchPagePreloadQuery$data } from "@/__generated__/formationMatchPagePreloadQuery.graphql";
import { buildQuarterDataFromTacticsDocument } from "@/lib/formation/buildQuarterDataFromTacticsDocument";
import { extractInHouseDraftTeamByKeyFromTactics } from "@/lib/formation/extractInHouseDraftTeamByKeyFromTactics";
import {
  pickLatestConfirmedMatchFormationRow,
  pickLatestDraftMatchFormationRow,
  pickPrimaryMatchFormationRow,
} from "@/lib/formation/pickPrimaryMatchFormationRow";
import { matchAttendanceRowsToAttendingPlayers } from "@/lib/formation/matchAttendanceToPlayers";
import { matchMercenaryRowsToPlayers } from "@/lib/formation/roster/matchMercenaryRowsToPlayers";
import { mergeAttendingMembersAndMercenaries } from "@/lib/formation/roster/mergeAttendingMembersAndMercenaries";
import { createFormationLineupResolver } from "@/lib/formation/roster/createFormationLineupResolver";
import type {
  FormationMatchPageSnapshot,
  FormationMatchQuarterSpec,
} from "@/types/formationMatchPageSnapshot";

/**
 * `formationMatchPagePreloadQuery` 응답으로부터 포메이션 경기 페이지와 동일한 스냅샷을 만듭니다.
 * (SSR `loadFormationMatchPageSnapshotSSR`와 동일 로직 — 클라이언트 모달 등에서 재사용)
 */
export function buildFormationMatchPageSnapshotFromPreloadQueryData(
  data: formationMatchPagePreloadQuery$data,
  quarterSpec: FormationMatchQuarterSpec,
  teamId: number,
): FormationMatchPageSnapshot {
  const attendingMembers = matchAttendanceRowsToAttendingPlayers(
    data.findMatchAttendance ?? [],
  );
  const mercenaryPlayers = matchMercenaryRowsToPlayers(
    data.matchMercenaries ?? [],
    teamId,
  );
  const players = mergeAttendingMembersAndMercenaries(
    attendingMembers,
    mercenaryPlayers,
  );
  const resolve = createFormationLineupResolver(players);

  const formationRows = data.findMatchFormation ?? [];
  const savedDraftMatchFormationId =
    pickLatestDraftMatchFormationRow(formationRows)?.id ?? null;
  const savedLatestConfirmedMatchFormationId =
    pickLatestConfirmedMatchFormationRow(formationRows)?.id ?? null;

  const primary = pickPrimaryMatchFormationRow(formationRows);
  const savedInitialFormationPrimarySource =
    primary == null
      ? null
      : primary.isDraft === false
        ? ("confirmed" as const)
        : ("draft" as const);

  const savedInitialFormationSourceRevision =
    primary == null
      ? null
      : `${primary.id}:${primary.isDraft ? "1" : "0"}:${String(primary.updatedAt ?? "")}:${
          primary.tactics ? JSON.stringify(primary.tactics) : "null"
        }`;

  if (primary == null || primary.tactics == null) {
    return {
      players,
      initialQuarters: null,
      initialInHouseDraftTeamByKey: {},
      savedDraftMatchFormationId,
      savedLatestConfirmedMatchFormationId,
      savedInitialFormationPrimarySource,
      savedInitialFormationSourceRevision,
    };
  }

  const initialQuarters = buildQuarterDataFromTacticsDocument(
    primary.tactics,
    quarterSpec,
    resolve,
  );
  const initialInHouseDraftTeamByKey = extractInHouseDraftTeamByKeyFromTactics(
    primary.tactics,
  );
  return {
    players,
    initialQuarters,
    initialInHouseDraftTeamByKey,
    savedDraftMatchFormationId,
    savedLatestConfirmedMatchFormationId,
    savedInitialFormationPrimarySource,
    savedInitialFormationSourceRevision,
  };
}
