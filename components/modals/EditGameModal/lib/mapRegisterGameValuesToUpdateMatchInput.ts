import type { RegisterGameValues } from "../../RegisterGameModal/schema";
import type { UpdateMatchInput } from "@/__generated__/useUpdateMatchMutation.graphql";
import { computeVoteDeadlineDateTime } from "../../RegisterGameModal/lib/voteDeadline";

export function mapRegisterGameValuesToUpdateMatchInput(
  data: RegisterGameValues,
  matchId: number,
): UpdateMatchInput {
  return {
    id: matchId,
    description: data.description?.trim() || null,
    endTime: data.endTime,
    matchDate: data.startDate,
    matchType: data.matchType,
    quarterCount: data.quarterCount,
    quarterDuration: data.quarterDuration,
    startTime: data.startTime,
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
