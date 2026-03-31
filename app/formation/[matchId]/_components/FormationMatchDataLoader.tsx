"use client";

import { Suspense, useState, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useLazyLoadQuery } from "react-relay";
import { FormationMatchAttendanceQuery } from "@/lib/relay/queries/formationMatchAttendanceQuery";
import type { formationMatchAttendanceQuery } from "@/__generated__/formationMatchAttendanceQuery.graphql";
import { FormationMatchPlayersProvider } from "../../_context/FormationMatchPlayersContext";
import { FormationMatchContext } from "../../_context/FormationMatchContext";
import { matchAttendanceRowsToAttendingPlayers } from "@/lib/formation/matchAttendanceToPlayers";
import { FormationMatchPageLoadingShell } from "../../_components/FormationMatchPageLoadingShell";

interface Props {
  matchId: number;
  teamId: number;
  children: React.ReactNode;
}

/**
 * 실제 데이터를 가져오고 Context에 공급하는 컴포넌트
 * - fetchPolicy: 'store-or-network'로 설정하여 SSR 하이드레이션 데이터를 우선 활용하고 중복 호출을 방지합니다.
 */
function DataFetcher({ matchId, teamId, children }: Props) {
  const data = useLazyLoadQuery<formationMatchAttendanceQuery>(
    FormationMatchAttendanceQuery,
    { matchId, teamId },
    { fetchPolicy: "store-or-network" },
  );

  const attendingPlayers = matchAttendanceRowsToAttendingPlayers(
    data.findMatchAttendance ?? [],
  );

  return (
    <FormationMatchPlayersProvider players={attendingPlayers}>
      {children}
    </FormationMatchPlayersProvider>
  );
}

/**
 * 포메이션 경기 데이터 로더 (관심사 분리)
 * - ErrorBoundary & Suspense: 로딩 및 에러 상태 관리 (종단 관심사)
 * - FormationMatchContext: 경기 ID 및 팀 ID 공급
 * - DataFetcher: 실제 데이터 페칭 (Relay)
 */
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
    return <FormationMatchPageLoadingShell />;
  }

  return (
    <ErrorBoundary
      fallback={
        <div className="p-8 text-center bg-surface-card border border-border-card rounded-xl mx-4 my-8">
          <p className="text-text-primary font-medium mb-2">
            데이터를 불러오지 못했습니다.
          </p>
          <p className="text-text-secondary text-sm">
            잠시 후 다시 시도해 주세요.
          </p>
        </div>
      }
    >
      <Suspense fallback={<FormationMatchPageLoadingShell />}>
        <FormationMatchContext.Provider value={{ matchId, teamId }}>
          <DataFetcher matchId={matchId} teamId={teamId}>
            {children}
          </DataFetcher>
        </FormationMatchContext.Provider>
      </Suspense>
    </ErrorBoundary>
  );
}
