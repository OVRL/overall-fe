"use client";

import React, { Suspense, useState, useEffect, Children, isValidElement, cloneElement } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useLazyLoadQuery } from "react-relay";
import { FormationMatchAttendanceQuery } from "@/lib/relay/queries/formationMatchAttendanceQuery";
import type { formationMatchAttendanceQuery } from "@/__generated__/formationMatchAttendanceQuery.graphql";
import { FormationMatchPlayersProvider } from "../../_context/FormationMatchPlayersContext";
import { FormationMatchContext } from "../../_context/FormationMatchContext";
import { matchAttendanceRowsToAttendingPlayers } from "@/lib/formation/matchAttendanceToPlayers";
import { FormationMatchPageLoadingShell } from "../../_components/FormationMatchPageLoadingShell";
import type { FormationMatchPageSnapshot } from "@/types/formationMatchPageSnapshot";

/**
 * RSC가 `children`으로 넘긴 props가 Flight 경로에서 누락·지연될 수 있어,
 * 서버에서 이미 확정된 `ssrSnapshot`을 클라이언트 트리 안에서 다시 주입합니다.
 */
function mergeSsrFormationSnapshotIntoChildren(
  children: React.ReactNode,
  ssrSnapshot: FormationMatchPageSnapshot,
): React.ReactNode {
  const ssrQuarters = ssrSnapshot.initialQuarters;
  const useSsrQuarters =
    ssrQuarters != null && ssrQuarters.length > 0 ? ssrQuarters : null;

  return Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    const prev = child.props as Record<string, unknown>;
    const patch: Record<string, unknown> = {
      ...prev,
      ssrDraftFormationId: ssrSnapshot.draftFormationId,
      ssrInitialBoardSource: ssrSnapshot.initialBoardSource,
      ssrConfirmedFormationId: ssrSnapshot.confirmedFormationId,
    };
    if (useSsrQuarters != null) {
      patch.savedInitialQuarters = useSsrQuarters;
    }
    return cloneElement(child, patch as Record<string, unknown>);
  });
}

interface Props {
  matchId: number;
  teamId: number;
  children: React.ReactNode;
  /**
   * 서버에서 프리로드한 스냅샷이 있으면 Relay 재요청·마운트 게이트 없이 즉시 공급합니다.
   * (횡단: 로딩 전략 / 종단: 명단·포메이션 DTO는 서버 모듈에서 조합)
   */
  ssrSnapshot?: FormationMatchPageSnapshot | null;
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
  ssrSnapshot = null,
}: Props) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setIsMounted(true);
  }, []);

  const errorFallback = (
    <div className="p-8 text-center bg-surface-card border border-border-card rounded-xl mx-4 my-8">
      <p className="text-text-primary font-medium mb-2">
        데이터를 불러오지 못했습니다.
      </p>
      <p className="text-text-secondary text-sm">
        잠시 후 다시 시도해 주세요.
      </p>
    </div>
  );

  if (ssrSnapshot != null) {
    return (
      <ErrorBoundary fallback={errorFallback}>
        <FormationMatchContext.Provider value={{ matchId, teamId }}>
          <FormationMatchPlayersProvider players={ssrSnapshot.players}>
            {mergeSsrFormationSnapshotIntoChildren(children, ssrSnapshot)}
          </FormationMatchPlayersProvider>
        </FormationMatchContext.Provider>
      </ErrorBoundary>
    );
  }

  if (!isMounted) {
    return <FormationMatchPageLoadingShell />;
  }

  return (
    <ErrorBoundary fallback={errorFallback}>
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
