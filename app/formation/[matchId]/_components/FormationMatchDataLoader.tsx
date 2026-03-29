"use client";

import { Suspense, useState, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useLazyLoadQuery } from "react-relay";
import { FormationMatchAttendanceQuery } from "@/lib/relay/queries/formationMatchAttendanceQuery";
import type { formationMatchAttendanceQuery } from "@/__generated__/formationMatchAttendanceQuery.graphql";
import { FormationMatchPlayersProvider } from "../../_context/FormationMatchPlayersContext";
import { FormationMatchContext } from "../../_context/FormationMatchContext";
import {
  getTeamMemberProfileImageFallbackUrl,
  getTeamMemberProfileImageRawUrl,
} from "@/lib/playerPlaceholderImage";
import type { Player } from "@/types/formation";

interface Props {
  matchId: number;
  teamId: number;
  children: React.ReactNode;
}

function matchAttendanceNodesToAttendingPlayers(
  data: formationMatchAttendanceQuery["response"]["findMatchAttendance"],
): Player[] {
  if (!data) return [];

  const attending = data.filter(
    (row): row is NonNullable<typeof row> =>
      row != null &&
      row.attendanceStatus === "ATTEND" &&
      row.teamMember != null,
  );

  return attending.map((row) => {
    const tm = row.teamMember!;
    const user = tm.user;
    const back = tm.backNumber;
    const preferred = user?.preferredNumber;
    const number =
      back != null ? back : preferred != null ? Math.round(preferred) : 0;

    const name = user?.name?.trim() || "이름 없음";
    const position = tm.position ?? "ST";
    const overall = tm.overall?.ovr ?? 0;

    const profileRaw = getTeamMemberProfileImageRawUrl({
      profileImg: tm.profileImg,
      user: tm.user ?? undefined,
    });
    const imageFallbackUrl = getTeamMemberProfileImageFallbackUrl({
      id: tm.id,
      user: tm.user ?? undefined,
    });

    return {
      id: tm.id,
      name,
      position,
      number,
      overall,
      image: profileRaw || undefined,
      imageFallbackUrl,
    } satisfies Player;
  });
}

function DataFetcher({ matchId, teamId, children }: Props) {
  const data = useLazyLoadQuery<formationMatchAttendanceQuery>(
    FormationMatchAttendanceQuery,
    { matchId, teamId },
    { fetchPolicy: "store-and-network" },
  );

  const attendingPlayers = matchAttendanceNodesToAttendingPlayers(
    data.findMatchAttendance,
  );

  return (
    <FormationMatchPlayersProvider players={attendingPlayers}>
      {children}
    </FormationMatchPlayersProvider>
  );
}

export default function FormationMatchDataLoader({
  matchId,
  teamId,
  children,
}: Props) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="p-4 text-center">참석자 명단 로딩 중...</div>;
  }

  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 text-center">
          참석자 명단을 불러오는데 실패했습니다.
        </div>
      }
    >
      <Suspense
        fallback={<div className="p-4 text-center">참석자 명단 로딩 중...</div>}
      >
        <FormationMatchContext.Provider value={{ matchId, teamId }}>
          <DataFetcher matchId={matchId} teamId={teamId}>
            {children}
          </DataFetcher>
        </FormationMatchContext.Provider>
      </Suspense>
    </ErrorBoundary>
  );
}
