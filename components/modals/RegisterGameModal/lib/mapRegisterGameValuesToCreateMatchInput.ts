import type { RegisterGameValues } from "../schema";
import type { CreateMatchInput } from "./CreateMatchInput";
import { computeVoteDeadlineDateTime } from "./voteDeadline";

/**
 * 폼 값(RegisterGameValues)을 createMatch 뮤테이션 입력(CreateMatchInput)으로 변환하는 순수 함수.
 * 단위 테스트 및 API 스키마 변경 시 한 곳만 수정하면 됨.
 */
export function mapRegisterGameValuesToCreateMatchInput(
  data: RegisterGameValues,
  createdTeamId: number,
): CreateMatchInput {
  return {
    createdTeamId,
    description: data.description?.trim() || null,
    endTime: data.endTime,
    matchDate: data.startDate,
    matchType: data.matchType,
    opponentTeamId: data.opponentTeamId ?? null,
    quarterCount: data.quarterCount,
    quarterDuration: data.quarterDuration,
    startTime: data.startTime,
    teamName: data.opponentName?.trim() || null,
    uniformType: data.uniformType ?? null,
    venue: {
      address: data.venue.address,
      latitude: data.venue.latitude,
      longitude: data.venue.longitude,
    },
    voteDeadline: computeVoteDeadlineDateTime(
      data.startDate,
      data.voteDeadline,
    ),
  };
}
