import { buildQuarterDataFromTacticsDocument } from "@/lib/formation/buildQuarterDataFromTacticsDocument";
import {
  pickLatestConfirmedMatchFormationRow,
  pickLatestDraftMatchFormationRow,
} from "@/lib/formation/pickLatestMatchFormationRows";
import { pickPrimaryMatchFormationRow } from "@/lib/formation/pickPrimaryMatchFormationRow";
import type {
  FormationMatchInitialBoardSource,
  FormationMatchPageSnapshot,
  FormationMatchQuarterSpec,
} from "@/types/formationMatchPageSnapshot";
import type { Player } from "@/types/formation";

/** Relay formationMatchPagePreloadQuery의 findMatchFormation 원소와 호환되는 최소 형태 */
export type MatchFormationPreloadRow = {
  readonly id: number;
  readonly isDraft: boolean;
  readonly updatedAt: unknown;
  readonly tactics: unknown | null;
};

export type BuildFormationMatchPageSnapshotInput = {
  /** 이미 `matchAttendanceRowsToAttendingPlayers` 등으로 변환된 출전 명단 */
  players: Player[];
  formationRows: readonly MatchFormationPreloadRow[] | null | undefined;
  quarterSpec: FormationMatchQuarterSpec;
};

/**
 * 출전 명단 + findMatchFormation 행으로 직렬화 가능한 포메이션 경기 스냅샷을 만듭니다.
 * — 확정 행이 있으면 보드는 확정 기준, 클라이언트용 draft id는 null(서버 파기 가정).
 * — 확정이 없으면 최신 드래프트 id를 내려 임시저장 갱신 경로에 씁니다.
 */
export function buildFormationMatchPageSnapshot(
  input: BuildFormationMatchPageSnapshotInput,
): FormationMatchPageSnapshot {
  const { players, formationRows: rows, quarterSpec } = input;
  const byId = new Map(players.map((p) => [p.id, p] as const));
  const resolve = (teamMemberId: number) => byId.get(teamMemberId) ?? null;

  const boardRow = pickPrimaryMatchFormationRow(rows ?? []);
  const latestConfirmed = pickLatestConfirmedMatchFormationRow(rows);
  const latestDraft = pickLatestDraftMatchFormationRow(rows);

  const confirmedFormationId = latestConfirmed?.id ?? null;
  const draftFormationId =
    latestConfirmed != null ? null : (latestDraft?.id ?? null);

  let initialBoardSource: FormationMatchInitialBoardSource = "empty";
  if (boardRow != null) {
    initialBoardSource = boardRow.isDraft ? "draft" : "confirmed";
  }

  const boardRowId = boardRow?.id ?? null;

  if (boardRow == null || boardRow.tactics == null) {
    return {
      players,
      initialQuarters: null,
      initialBoardSource,
      boardRowId,
      confirmedFormationId,
      draftFormationId,
    };
  }

  const initialQuarters = buildQuarterDataFromTacticsDocument(
    boardRow.tactics,
    quarterSpec,
    resolve,
  );

  return {
    players,
    initialQuarters,
    initialBoardSource,
    boardRowId,
    confirmedFormationId,
    draftFormationId,
  };
}
