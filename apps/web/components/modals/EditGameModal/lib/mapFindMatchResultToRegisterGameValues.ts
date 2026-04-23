import { RegisterGameValues } from "@/components/modals/RegisterGameModal/schema";
import { format } from "date-fns";
import type { EditGameModalQuery$data } from "@/__generated__/EditGameModalQuery.graphql";
import type { findMatchQuery$data } from "@/__generated__/findMatchQuery.graphql";

type MatchNode =
  | findMatchQuery$data["findMatch"][number]
  | EditGameModalQuery$data["findMatch"][number];

export function mapFindMatchResultToRegisterGameValues(
  match: MatchNode,
): RegisterGameValues {
  // voteDeadline is usually returned as a UTC timestamp string. We can infer the enum backwards, or default to 1_DAY_BEFORE if mapping is tricky. But wait, we can try to guess or just set a default for the dropdown!
  // It's mostly visual. Let's do a basic mapping or fallback to "1_DAY_BEFORE"
  return {
    matchType: match.matchType as "MATCH" | "INTERNAL",
    opponentName: match.teamName || match.opponentTeam?.name || "",
    opponentTeamId: match.opponentTeam?.id ? Number(match.opponentTeam.id) : null,
    startDate: match.matchDate, // format: YYYY-MM-DD
    startTime: match.startTime.substring(0, 5), // "HH:mm:ss" -> "HH:mm"
    endDate: match.matchDate,
    endTime: match.endTime.substring(0, 5),
    quarterCount: match.quarterCount,
    quarterDuration: match.quarterDuration,
    description: match.description || "",
    uniformType: (match.uniformType as "HOME" | "AWAY") || null,
    venue: {
      address: match.venue.address,
      latitude: match.venue.latitude,
      longitude: match.venue.longitude,
    },
    // The enum values: "SAME_DAY", "1_DAY_BEFORE", "2_DAYS_BEFORE", "3_DAYS_BEFORE", "1_WEEK_BEFORE"
    voteDeadline: "1_DAY_BEFORE", 
  };
}
