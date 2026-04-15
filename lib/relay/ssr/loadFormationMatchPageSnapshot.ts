import { fetchQuery } from "relay-runtime";
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
import { getServerEnvironment } from "@/lib/relay/getServerEnvironment";
import { FormationMatchPagePreloadQuery } from "@/lib/relay/queries/formationMatchPagePreloadQuery";
import { observableToPromise } from "@/lib/relay/observableToPromise";

export type {
  FormationMatchPageSnapshot,
  FormationMatchQuarterSpec,
} from "@/types/formationMatchPageSnapshot";

/** 개발용: 터미널에서 구조가 한눈에 보이도록 pretty JSON으로 출력 */
function devPrettyFormationPreloadLog(label: string, value: unknown) {
  if (process.env.NODE_ENV !== "development") return;
  try {
    const pretty = JSON.stringify(
      value,
      (_key, v) => (typeof v === "bigint" ? v.toString() : v),
      2,
    );
    console.log(`[SSR formationMatchPagePreload] ${label}\n${pretty}`);
  } catch {
    console.log(
      `[SSR formationMatchPagePreload] ${label} (JSON.stringify 실패, 객체 그대로 출력)`,
      value,
    );
  }
}

/** Relay 응답 등을 plain JSON 값으로 복제한 뒤 pretty 출력 */
function devPrettyFormationPreloadFromRelayClone(label: string, raw: unknown) {
  if (process.env.NODE_ENV !== "development") return;
  try {
    const plain = JSON.parse(JSON.stringify(raw ?? null));
    devPrettyFormationPreloadLog(label, plain);
  } catch (e) {
    console.error(
      `[SSR formationMatchPagePreload] ${label} (직렬화 복제 실패)`,
      e,
    );
  }
}

function deriveSnapshot(
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

export async function loadFormationMatchPageSnapshotSSR(options: {
  accessToken: string;
  refreshToken: string | null;
  matchId: number;
  teamId: number;
  quarterSpec: FormationMatchQuarterSpec;
}): Promise<FormationMatchPageSnapshot | null> {
  const { accessToken, refreshToken, matchId, teamId, quarterSpec } = options;
  try {
    const environment = getServerEnvironment(accessToken, refreshToken);
    const data = (await observableToPromise(
      fetchQuery(
        environment,
        FormationMatchPagePreloadQuery,
        { matchId, teamId },
        { fetchPolicy: "network-only" },
      ),
    )) as formationMatchPagePreloadQuery$data;

    const snapshot = deriveSnapshot(data, quarterSpec, teamId);

    try {
      devPrettyFormationPreloadLog("variables", {
        matchId,
        teamId,
        quarterSpec,
      });
      devPrettyFormationPreloadFromRelayClone(
        "findMatchAttendance (raw)",
        data.findMatchAttendance ?? [],
      );
      devPrettyFormationPreloadFromRelayClone(
        "findMatchFormation (raw)",
        data.findMatchFormation ?? [],
      );
      const formationRowsForLog = data.findMatchFormation ?? [];
      const primaryFormationRow =
        pickPrimaryMatchFormationRow(formationRowsForLog);
      devPrettyFormationPreloadLog("findMatchFormation (ids · 스냅샷에 쓰인 행)", {
        allRowIds: formationRowsForLog.map((r) => ({
          id: r.id,
          isDraft: r.isDraft,
          updatedAt: r.updatedAt,
        })),
        primaryFormationRowIdUsedForInitialQuarters:
          primaryFormationRow?.id ?? null,
        primaryIsDraft: primaryFormationRow?.isDraft ?? null,
        savedDraftMatchFormationId: snapshot.savedDraftMatchFormationId,
        savedLatestConfirmedMatchFormationId:
          snapshot.savedLatestConfirmedMatchFormationId,
        savedInitialFormationPrimarySource:
          snapshot.savedInitialFormationPrimarySource,
        savedInitialFormationSourceRevision:
          snapshot.savedInitialFormationSourceRevision,
      });
      devPrettyFormationPreloadLog("derived snapshot (full)", {
        matchFormation: {
          primaryRowId: primaryFormationRow?.id ?? null,
          allIds: formationRowsForLog.map((r) => r.id),
        },
        attendingPlayerCount: snapshot.players.length,
        players: snapshot.players,
        initialQuarters: snapshot.initialQuarters,
        initialInHouseDraftTeamByKey: snapshot.initialInHouseDraftTeamByKey,
      });
    } catch (logErr) {
      console.error(
        "[SSR formationMatchPagePreload] 로그 출력 중 오류 (데이터는 정상 반환)",
        logErr,
      );
    }

    return snapshot;
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.error("[SSR] loadFormationMatchPageSnapshotSSR", e);
    }
    return null;
  }
}
