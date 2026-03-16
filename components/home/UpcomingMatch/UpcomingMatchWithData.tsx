"use client";

import { useLazyLoadQuery } from "react-relay";
import type { findMatchQuery } from "@/__generated__/findMatchQuery.graphql";
import { FindMatchQuery } from "@/lib/relay/queries/findMatchQuery";
import { useSelectedTeamId } from "@/components/providers/SelectedTeamProvider";
import type { MatchForUpcomingDisplay } from "./upcomingMatchDisplay";
import { buildUpcomingMatchDisplay } from "./upcomingMatchDisplay";
import { pickSoonestMatch } from "@/utils/match/pickSoonestMatch";
import NoUpcomingMatch from "./NoUpcomingMatch";
import UpcomingMatchDesktop from "./UpcomingMatchDesktop";
import UpcomingMatchMobile from "./UpcomingMatchMobile";

/**
 * Relay 스토어에서 findMatch를 읽어 다가오는 경기 1건을 표시합니다.
 * selectedTeamIdNum이 없으면 "다가오는 경기가 없습니다" UI를 렌더합니다.
 */
export default function UpcomingMatchWithData() {
  const { selectedTeamIdNum } = useSelectedTeamId();

  if (selectedTeamIdNum == null) {
    return (
      <div className="bg-surface-card rounded-[1.25rem] p-4 md:p-6 border border-border-card">
        <NoUpcomingMatch />
      </div>
    );
  }

  return (
    <UpcomingMatchWithQuery createdTeamId={selectedTeamIdNum} />
  );
}

function UpcomingMatchWithQuery({
  createdTeamId,
}: {
  createdTeamId: number;
}) {
  const data = useLazyLoadQuery<findMatchQuery>(
    FindMatchQuery,
    { createdTeamId },
    { fetchPolicy: "store-or-network" },
  );

  const matches = (data?.findMatch ?? []) as unknown as MatchForUpcomingDisplay[];
  const soonest = pickSoonestMatch(matches);
  const display = soonest ? buildUpcomingMatchDisplay(soonest) : null;

  if (display == null) {
    return (
      <div className="bg-surface-card rounded-[1.25rem] p-4 md:p-6 border border-border-card">
        <NoUpcomingMatch />
      </div>
    );
  }

  return (
    <div className="bg-surface-card rounded-[1.25rem] p-4 md:p-6 border border-border-card">
      <UpcomingMatchMobile display={display} />
      <UpcomingMatchDesktop display={display} />
    </div>
  );
}
