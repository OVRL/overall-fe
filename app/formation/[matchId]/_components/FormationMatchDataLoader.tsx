"use client";

import React, { Suspense, useState, useEffect, Children, isValidElement, cloneElement } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useLazyLoadQuery } from "react-relay";
import { FormationMatchAttendanceQuery } from "@/lib/relay/queries/formationMatchAttendanceQuery";
import type { formationMatchAttendanceQuery } from "@/__generated__/formationMatchAttendanceQuery.graphql";
import { FormationMatchPlayersProvider } from "../../_context/FormationMatchPlayersContext";
import { FormationMatchContext } from "../../_context/FormationMatchContext";
import { matchAttendanceRowsToAttendingPlayers } from "@/lib/formation/matchAttendanceToPlayers";
import { matchMercenaryRowsToPlayers } from "@/lib/formation/roster/matchMercenaryRowsToPlayers";
import { mergeAttendingMembersAndMercenaries } from "@/lib/formation/roster/mergeAttendingMembersAndMercenaries";
import { FormationMatchPageLoadingShell } from "../../_components/FormationMatchPageLoadingShell";
import type { FormationMatchPageSnapshot } from "@/types/formationMatchPageSnapshot";

/**
 * RSC가 `children` 클라이언트 컴포넌트에 넘기는 `savedInitialQuarters`가
 * 페이로드 경로상 누락·지연되는 경우가 있어, 이미 부모 props로 안정 전달된
 * `ssrSnapshot.initialQuarters`를 동일 트리에서 주입합니다.
 */
function mergeSsrInitialQuartersIntoChildren(
  children: React.ReactNode,
  ssrSnapshot: FormationMatchPageSnapshot,
): React.ReactNode {
  const ssrQuarters = ssrSnapshot.initialQuarters;
  const useSsrQuarters =
    ssrQuarters != null && ssrQuarters.length > 0 ? ssrQuarters : null;

  return Children.map(children, (child) => {
    if (!isValidElement(child)) return child;
    if (useSsrQuarters == null) return child;
    const prev = child.props as Record<string, unknown>;
    return cloneElement(child, {
      ...prev,
      savedInitialQuarters: useSsrQuarters,
      savedInitialInHouseDraftTeamByKey:
        ssrSnapshot.initialInHouseDraftTeamByKey,
      savedDraftMatchFormationId: ssrSnapshot.savedDraftMatchFormationId,
      savedLatestConfirmedMatchFormationId:
        ssrSnapshot.savedLatestConfirmedMatchFormationId,
      savedInitialFormationPrimarySource:
        ssrSnapshot.savedInitialFormationPrimarySource,
      savedInitialFormationSourceRevision:
        ssrSnapshot.savedInitialFormationSourceRevision,
    } as Record<string, unknown>);
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

  const attendingMembers = matchAttendanceRowsToAttendingPlayers(
    data.findMatchAttendance ?? [],
  );
  const mercenaryPlayers = matchMercenaryRowsToPlayers(
    data.matchMercenaries ?? [],
    teamId,
  );
  const attendingPlayers = mergeAttendingMembersAndMercenaries(
    attendingMembers,
    mercenaryPlayers,
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

  /**
   * SSR 스냅샷이 있어도 명단은 Relay `useLazyLoadQuery`로 구독해야 합니다.
   * (모달에서 `fetchQuery`로 갱신 시 스토어만 바뀌고, 정적 `ssrSnapshot.players` Provider면 좌측 명단이 안 바뀜)
   * Suspense fallback 동안에는 SSR 선수 풀로 동일 UI를 유지합니다.
   */
  if (ssrSnapshot != null) {
    return (
      <ErrorBoundary fallback={errorFallback}>
        <FormationMatchContext.Provider value={{ matchId, teamId }}>
          <Suspense
            fallback={
              <FormationMatchPlayersProvider players={ssrSnapshot.players}>
                {mergeSsrInitialQuartersIntoChildren(children, ssrSnapshot)}
              </FormationMatchPlayersProvider>
            }
          >
            <DataFetcher matchId={matchId} teamId={teamId}>
              {mergeSsrInitialQuartersIntoChildren(children, ssrSnapshot)}
            </DataFetcher>
          </Suspense>
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
